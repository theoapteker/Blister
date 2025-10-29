import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  organizationName: z.string().optional(),
  inviteToken: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, organizationName, inviteToken } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if signing up via invite
    if (inviteToken) {
      const invite = await prisma.invite.findUnique({
        where: { token: inviteToken },
        include: { organization: true },
      })

      if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'Invalid or expired invite' },
          { status: 400 }
        )
      }

      if (invite.email !== email) {
        return NextResponse.json(
          { error: 'Email does not match invite' },
          { status: 400 }
        )
      }

      // Create user and membership
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          memberships: {
            create: {
              organizationId: invite.organizationId,
              role: invite.role,
            },
          },
        },
      })

      // Mark invite as accepted
      await prisma.invite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      })

      return NextResponse.json(
        {
          success: true,
          user: { id: user.id, email: user.email, name: user.name },
        },
        { status: 201 }
      )
    }

    // Self-signup: Create new organization
    if (!organizationName) {
      return NextResponse.json(
        { error: 'Organization name required for new signup' },
        { status: 400 }
      )
    }

    // Extract domain from email for domain hinting
    const emailDomain = email.split('@')[1]

    // Create user with new organization
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        memberships: {
          create: {
            role: 'ORG_ADMIN', // First user is admin
            organization: {
              create: {
                name: organizationName,
                domain: emailDomain,
                billingEmail: email,
              },
            },
          },
        },
      },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          organization: user.memberships[0]?.organization,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
