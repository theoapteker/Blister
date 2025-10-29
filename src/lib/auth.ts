import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            memberships: {
              where: { isActive: true },
              include: {
                organization: true,
              },
            },
          },
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id

        // Fetch user's memberships
        const memberships = await prisma.membership.findMany({
          where: {
            userId: user.id,
            isActive: true,
          },
          include: {
            organization: true,
          },
          orderBy: {
            joinedAt: 'desc',
          },
        })

        // Set active organization (most recent by default)
        if (memberships.length > 0) {
          token.activeOrgId = memberships[0].organizationId
          token.role = memberships[0].role
          token.memberships = memberships.map(m => ({
            id: m.id,
            organizationId: m.organizationId,
            organizationName: m.organization.name,
            role: m.role,
          }))
        }
      }

      // Update session on client
      if (trigger === 'update' && session) {
        if (session.activeOrgId) {
          token.activeOrgId = session.activeOrgId

          // Update role based on new active org
          const memberships = token.memberships as any[]
          const activeMembership = memberships?.find(
            m => m.organizationId === session.activeOrgId
          )
          if (activeMembership) {
            token.role = activeMembership.role
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.activeOrgId = token.activeOrgId as string
        session.role = token.role as Role
        session.memberships = token.memberships as any[]
      }
      return session
    },
  },
}

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      avatar?: string | null
    }
    activeOrgId?: string
    role?: Role
    memberships?: Array<{
      id: string
      organizationId: string
      organizationName: string
      role: Role
    }>
  }

  interface User {
    id: string
    email: string
    name?: string | null
    avatar?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    activeOrgId?: string
    role?: Role
    memberships?: Array<{
      id: string
      organizationId: string
      organizationName: string
      role: Role
    }>
  }
}
