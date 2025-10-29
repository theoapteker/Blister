'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, ChevronRight, Crown, Users, User } from 'lucide-react'
import { Role } from '@prisma/client'

export default function OrgSelectPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || null
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If user has only one org, auto-select and redirect
    if (session?.memberships && session.memberships.length === 1) {
      handleOrgSelect(session.memberships[0].organizationId)
    }
  }, [session])

  const handleOrgSelect = async (orgId: string) => {
    setIsLoading(true)

    try {
      // Update session with active org
      await update({ activeOrgId: orgId })

      // Find the role in selected org
      const membership = session?.memberships?.find(
        (m) => m.organizationId === orgId
      )

      // Redirect to callback URL if provided, otherwise use role-based routing
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (membership?.role === Role.ORG_ADMIN || membership?.role === Role.MANAGER) {
        router.push('/admin')
      } else {
        router.push('/launchpad')
      }
    } catch (error) {
      console.error('Error selecting organization:', error)
      setIsLoading(false)
    }
  }

  if (!session || session.memberships?.length === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.ORG_ADMIN:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case Role.MANAGER:
        return <Users className="w-5 h-5 text-blue-500" />
      default:
        return <User className="w-5 h-5 text-gray-500" />
    }
  }

  const getRoleBadge = (role: Role) => {
    const badges = {
      [Role.ORG_ADMIN]: 'Admin',
      [Role.MANAGER]: 'Manager',
      [Role.EMPLOYEE]: 'Employee',
      [Role.CONTENT_EDITOR]: 'Editor',
      [Role.BILLING_ADMIN]: 'Billing',
    }
    return badges[role] || role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Organization
          </h1>
          <p className="text-gray-600">
            You belong to multiple organizations. Choose one to continue.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-3">
          {session.memberships?.map((membership, index) => (
            <motion.button
              key={membership.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleOrgSelect(membership.organizationId)}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">
                    {membership.organizationName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleIcon(membership.role)}
                    <span className="text-sm text-gray-600">
                      {getRoleBadge(membership.role)}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          You can switch organizations anytime from your profile
        </p>
      </motion.div>
    </div>
  )
}
