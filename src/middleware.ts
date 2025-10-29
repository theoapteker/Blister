import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes
    if (path.startsWith('/auth/')) {
      return NextResponse.next()
    }

    // Require authentication for all other routes
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Admin routes - require ORG_ADMIN or MANAGER
    if (path.startsWith('/admin')) {
      const role = token.role as Role | undefined
      if (role !== Role.ORG_ADMIN && role !== Role.MANAGER) {
        return NextResponse.redirect(new URL('/launchpad', req.url))
      }
    }

    // Launchpad routes - all authenticated users can access
    if (path.startsWith('/launchpad')) {
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
