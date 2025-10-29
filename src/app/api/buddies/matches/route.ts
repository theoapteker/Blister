import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Calculate compatibility score between two users
function calculateCompatibility(
  currentUser: {
    department: string | null;
    timezone: string | null;
    interests: string[];
    startDate: Date | null;
  },
  potentialBuddy: {
    department: string | null;
    timezone: string | null;
    interests: string[];
    startDate: Date | null;
  }
): {
  score: number;
  breakdown: {
    departmentMatch: number;
    timezoneMatch: number;
    interestMatch: number;
    experienceMatch: number;
  };
} {
  let score = 0;
  const breakdown = {
    departmentMatch: 0,
    timezoneMatch: 0,
    interestMatch: 0,
    experienceMatch: 0,
  };

  // Department match: 30 points
  if (currentUser.department && potentialBuddy.department) {
    if (currentUser.department === potentialBuddy.department) {
      breakdown.departmentMatch = 30;
      score += 30;
    } else {
      // Different departments can still be valuable for cross-functional learning
      breakdown.departmentMatch = 10;
      score += 10;
    }
  }

  // Timezone match: 20 points
  if (currentUser.timezone && potentialBuddy.timezone) {
    if (currentUser.timezone === potentialBuddy.timezone) {
      breakdown.timezoneMatch = 20;
      score += 20;
    } else {
      // Close timezones still get partial points
      breakdown.timezoneMatch = 5;
      score += 5;
    }
  }

  // Common interests: 10 points per common interest (max 30)
  const commonInterests = currentUser.interests.filter((interest) =>
    potentialBuddy.interests.includes(interest)
  );
  breakdown.interestMatch = Math.min(commonInterests.length * 10, 30);
  score += breakdown.interestMatch;

  // Experience match: 20 points
  // Prefer buddies who have been at the company longer (more experienced)
  if (currentUser.startDate && potentialBuddy.startDate) {
    const currentUserMonths = Math.floor(
      (Date.now() - currentUser.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const buddyMonths = Math.floor(
      (Date.now() - potentialBuddy.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Ideal buddy has 3-12 months more experience
    const experienceDiff = buddyMonths - currentUserMonths;
    if (experienceDiff >= 3 && experienceDiff <= 12) {
      breakdown.experienceMatch = 20;
      score += 20;
    } else if (experienceDiff > 12) {
      // Still good if more experienced
      breakdown.experienceMatch = 15;
      score += 15;
    } else if (experienceDiff >= 1) {
      // Slightly more experienced
      breakdown.experienceMatch = 10;
      score += 10;
    }
  }

  return { score, breakdown };
}

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

    // Get current user with their membership
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          where: { organizationId: activeOrgId },
        },
        buddyRequests: {
          where: { status: { in: ['pending', 'active'] } },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a buddy
    const existingBuddyIds = currentUser.buddyRequests.map((match: { buddyId: string }) => match.buddyId);

    // Get all potential buddies in the same organization
    // Exclude: current user, users with existing matches, and users who are not employees
    const potentialBuddies = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.user.id } },
          { id: { notIn: existingBuddyIds } },
        ],
        memberships: {
          some: {
            organizationId: activeOrgId,
            // Can be matched with anyone in the org
          },
        },
      },
      include: {
        memberships: {
          where: { organizationId: activeOrgId },
        },
        assignedBuddies: {
          where: { status: { in: ['active'] } },
        },
      },
    });

    // Calculate compatibility for each potential buddy
    const matchesWithScores = potentialBuddies
      .map((buddy: any) => {
        const { score, breakdown } = calculateCompatibility(
          {
            department: currentUser.department,
            timezone: currentUser.timezone,
            interests: currentUser.interests,
            startDate: currentUser.startDate,
          },
          {
            department: buddy.department,
            timezone: buddy.timezone,
            interests: buddy.interests,
            startDate: buddy.startDate,
          }
        );

        return {
          id: buddy.id,
          name: buddy.name,
          email: buddy.email,
          avatar: buddy.avatar,
          title: buddy.title,
          department: buddy.department,
          timezone: buddy.timezone,
          interests: buddy.interests,
          startDate: buddy.startDate,
          compatibilityScore: score,
          compatibilityBreakdown: breakdown,
          activeBuddies: buddy.assignedBuddies.length,
        };
      })
      // Sort by compatibility score (highest first)
      .sort((a: { compatibilityScore: number }, b: { compatibilityScore: number }) =>
        b.compatibilityScore - a.compatibilityScore
      )
      // Take top 10 matches
      .slice(0, 10);

    return NextResponse.json({
      matches: matchesWithScores,
      criteria: {
        department: {
          name: 'Department Match',
          weight: 30,
          description: 'Same department = 30pts, Different department = 10pts',
          userValue: currentUser.department || 'Not set',
        },
        timezone: {
          name: 'Timezone Compatibility',
          weight: 20,
          description: 'Same timezone = 20pts, Different timezone = 5pts',
          userValue: currentUser.timezone || 'Not set',
        },
        interests: {
          name: 'Common Interests',
          weight: 30,
          description: '10 points per shared interest (max 30pts)',
          userValue: currentUser.interests.join(', ') || 'None set',
        },
        experience: {
          name: 'Experience Level',
          weight: 20,
          description: 'Buddies with 3-12 months more experience = 20pts',
          userValue: currentUser.startDate
            ? `${Math.floor((Date.now() - currentUser.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
            : 'Not set',
        },
      },
    });
  } catch (error) {
    console.error('Error fetching buddy matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buddy matches' },
      { status: 500 }
    );
  }
}
