import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const BuddyRequestSchema = z.object({
  buddyId: z.string().min(1, 'Buddy ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeOrgId = session.activeOrgId;
    if (!activeOrgId) {
      return NextResponse.json({ error: 'No active organization' }, { status: 400 });
    }

    const body = await request.json();
    const validation = BuddyRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { buddyId } = validation.data;

    // Validate that both users are in the same organization
    const [employee, buddy] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          memberships: {
            where: { organizationId: activeOrgId },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: buddyId },
        include: {
          memberships: {
            where: { organizationId: activeOrgId },
          },
        },
      }),
    ]);

    if (!employee || employee.memberships.length === 0) {
      return NextResponse.json(
        { error: 'You are not a member of this organization' },
        { status: 403 }
      );
    }

    if (!buddy || buddy.memberships.length === 0) {
      return NextResponse.json(
        { error: 'Buddy is not a member of this organization' },
        { status: 404 }
      );
    }

    // Check if a buddy match already exists
    const existingMatch = await prisma.buddyMatch.findFirst({
      where: {
        employeeId: session.user.id,
        buddyId: buddyId,
      },
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: 'Buddy match already exists', match: existingMatch },
        { status: 400 }
      );
    }

    // Create the buddy match
    const buddyMatch = await prisma.buddyMatch.create({
      data: {
        employeeId: session.user.id,
        buddyId: buddyId,
        status: 'active', // Auto-approve for now
        matchedAt: new Date(),
      },
      include: {
        buddy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            title: true,
            department: true,
            timezone: true,
            interests: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      match: buddyMatch,
    });
  } catch (error) {
    console.error('Error creating buddy match:', error);
    return NextResponse.json(
      { error: 'Failed to create buddy match' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch current user's buddy matches
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buddyMatches = await prisma.buddyMatch.findMany({
      where: {
        employeeId: session.user.id,
      },
      include: {
        buddy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            title: true,
            department: true,
            timezone: true,
            interests: true,
          },
        },
      },
      orderBy: {
        matchedAt: 'desc',
      },
    });

    return NextResponse.json({ matches: buddyMatches });
  } catch (error) {
    console.error('Error fetching buddy matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buddy matches' },
      { status: 500 }
    );
  }
}
