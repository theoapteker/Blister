'use client'

import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Users, Zap, Star, Clock, CheckCircle, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import BuddyMatchingWizard from '@/components/BuddyMatchingWizard'

export default function LaunchpadPage() {
  const { data: session } = useSession()
  const [showBuddyWizard, setShowBuddyWizard] = useState(false)
  const [hasBuddy, setHasBuddy] = useState(false)
  const [buddyMatches, setBuddyMatches] = useState<any[]>([])

  // Check if user has a buddy
  useEffect(() => {
    if (session) {
      checkBuddyStatus()
    }
  }, [session])

  const checkBuddyStatus = async () => {
    try {
      const response = await fetch('/api/buddies/request')
      if (response.ok) {
        const data = await response.json()
        setBuddyMatches(data.matches || [])
        setHasBuddy(data.matches && data.matches.length > 0)
      }
    } catch (error) {
      console.error('Error checking buddy status:', error)
    }
  }

  const handleBuddyWizardComplete = () => {
    setShowBuddyWizard(false)
    checkBuddyStatus()
  }

  // Mock data - in production, this would come from the database based on membership
  const currentDay = 3
  const progress = {
    confidence: 45,
    connection: 20,
    productivity: 0,
  }

  const stats = [
    { icon: Star, value: '2', label: 'Badges Earned', color: '#ffd700' },
    { icon: Clock, value: '3', label: 'Day Streak', color: '#4facfe' },
    { icon: CheckCircle, value: '8', label: 'Tasks Done', color: '#00d4aa' },
  ]

  const todaysTasks = [
    {
      id: 1,
      title: 'Watch: Company Culture Video',
      description: 'Learn about our values and mission',
      type: 'video',
      duration: '5 min',
      points: 50,
      completed: false,
    },
    {
      id: 2,
      title: 'Complete: Team Directory Check',
      description: 'Meet your immediate team members',
      type: 'checklist',
      duration: '10 min',
      points: 75,
      completed: false,
    },
  ]

  const getPhaseInfo = (day: number) => {
    if (day <= 3) {
      return {
        title: 'Confidence Phase',
        subtitle: 'What am I supposed to do?',
        color: '#667eea',
        icon: Target,
      }
    } else if (day <= 8) {
      return {
        title: 'Connection Phase',
        subtitle: 'Who are my people?',
        color: '#f093fb',
        icon: Users,
      }
    } else {
      return {
        title: 'Productivity Phase',
        subtitle: 'How do I contribute?',
        color: '#4facfe',
        icon: Zap,
      }
    }
  }

  const phaseInfo = getPhaseInfo(currentDay)
  const PhaseIcon = phaseInfo.icon

  // Show wizard in fullscreen
  if (showBuddyWizard) {
    return <BuddyMatchingWizard onComplete={handleBuddyWizardComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {session?.user?.name}!
            </h1>
            <p className="text-gray-600">
              Day {currentDay} of your 14-day launch sequence
            </p>
          </div>

          <div
            className="border-2 rounded-xl p-4 flex items-center gap-3"
            style={{ borderColor: phaseInfo.color }}
          >
            <PhaseIcon size={24} color={phaseInfo.color} />
            <div>
              <h3 className="font-semibold text-gray-900">{phaseInfo.title}</h3>
              <p className="text-sm text-gray-600">{phaseInfo.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Your Launch Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Confidence</span>
                  <span className="text-sm text-gray-600">{progress.confidence}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#667eea' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Connection</span>
                  <span className="text-sm text-gray-600">{progress.connection}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#f093fb' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.connection}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Productivity</span>
                  <span className="text-sm text-gray-600">{progress.productivity}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#4facfe' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.productivity}%` }}
                    transition={{ duration: 1, delay: 0.9 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon size={24} color={stat.color} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Today's Microbursts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    {task.type === 'video' && <Play size={20} className="text-indigo-600" />}
                    {task.type === 'checklist' && (
                      <CheckCircle size={20} className="text-indigo-600" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {task.duration}
                    </span>
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                      +{task.points} pts
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all">
                  Start Task
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowBuddyWizard(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Users size={20} />
              {hasBuddy ? 'View Your Buddy' : 'Find Your Buddy'}
            </button>
            <button className="bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-xl font-semibold hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              <Target size={20} />
              View Orbit Map
            </button>
            <button className="bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-xl font-semibold hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              <Star size={20} />
              Earn Badges
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
