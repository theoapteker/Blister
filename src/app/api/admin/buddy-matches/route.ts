import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeOrgId = session.activeOrgId;
    if (!activeOrgId) {
      return NextResponse.json({ error: 'No active organization' }, { status: 400 });
    }

    // Check if user is an admin
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        organizationId: activeOrgId,
      },
    });

    if (!membership || membership.role !== 'ORG_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all buddy matches for users in this organization
    const buddyMatches = await prisma.buddyMatch.findMany({
      where: {
        employee: {
          memberships: {
            some: {
              organizationId: activeOrgId,
            },
          },
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            title: true,
            department: true,
            startDate: true,
          },
        },
        buddy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            title: true,
            department: true,
            startDate: true,
          },
        },
      },
      orderBy: {
        matchedAt: 'desc',
      },
    });

    // Get statistics
    const stats = {
      total: buddyMatches.length,
      active: buddyMatches.filter((m: { status: string }) => m.status === 'active').length,
      pending: buddyMatches.filter((m: { status: string }) => m.status === 'pending').length,
      completed: buddyMatches.filter((m: { status: string }) => m.status === 'completed').length,
    };

    return NextResponse.json({
      matches: buddyMatches,
      stats,
    });
  } catch (error) {
    console.error('Error fetching buddy matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buddy matches' },
      { status: 500 }
    );
  }
}
