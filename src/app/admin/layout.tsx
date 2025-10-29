'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  Building2,
  ChevronDown,
  UserPlus,
  Mail
} from 'lucide-react'
import Link from 'next/link'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Team Members', href: '/admin/team', icon: Users },
  { name: 'Buddy Matches', href: '/admin/buddies', icon: UserPlus },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Employee Emails', href: '/admin/employee-emails', icon: Mail },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return null
  }

  const activeOrg = session.memberships?.find(
    (m) => m.organizationId === session.activeOrgId
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Blister Admin</h1>
          </div>

          {/* Org Selector */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => router.push('/auth/org-select')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {activeOrg?.organizationName}
                  </div>
                  <div className="text-xs text-gray-500">{activeOrg?.role}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                  {session.user?.name?.[0] || session.user?.email?.[0] || '?'}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {session.user?.name}
                  </div>
                  <div className="text-xs text-gray-500">{session.user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
