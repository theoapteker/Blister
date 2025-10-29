'use client'

import { useSession } from 'next-auth/react'
import { Users, TrendingUp, CheckCircle, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      name: 'Total Employees',
      value: '24',
      icon: Users,
      change: '+4 this month',
      changeType: 'positive',
    },
    {
      name: 'Active Journeys',
      value: '18',
      icon: TrendingUp,
      change: '75% completion rate',
      changeType: 'positive',
    },
    {
      name: 'Completed Tasks',
      value: '342',
      icon: CheckCircle,
      change: '+12% from last week',
      changeType: 'positive',
    },
    {
      name: 'Avg. Onboarding Time',
      value: '12 days',
      icon: Clock,
      change: '-2 days',
      changeType: 'positive',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {session?.user?.name || 'Admin'}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mb-2">{stat.name}</div>
            <div className="text-xs text-green-600 font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Sarah Johnson completed Day 7 tasks
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New employee Mike Rodriguez joined
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
