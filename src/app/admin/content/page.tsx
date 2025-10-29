'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Play,
  CheckCircle,
  Users,
  Target,
  Clock,
  Award,
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  type: 'video' | 'checklist' | 'social' | 'tutorial'
  duration: string
  phase: 'confidence' | 'connection' | 'productivity'
  day: number
  points: number
  completed?: boolean
}

const TASK_TYPES = [
  { value: 'video', label: 'Video', icon: Play },
  { value: 'checklist', label: 'Checklist', icon: CheckCircle },
  { value: 'social', label: 'Social', icon: Users },
  { value: 'tutorial', label: 'Tutorial', icon: Target },
]

const PHASES = [
  { value: 'confidence', label: 'Confidence Phase (Days 1-3)', color: '#667eea' },
  { value: 'connection', label: 'Connection Phase (Days 4-8)', color: '#f093fb' },
  { value: 'productivity', label: 'Productivity Phase (Days 9-14)', color: '#4facfe' },
]

export default function ContentManagementPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Watch CEO Welcome Video',
      description: 'Get inspired by our company vision',
      type: 'video',
      duration: '2 min',
      phase: 'confidence',
      day: 1,
      points: 10,
    },
    {
      id: '2',
      title: 'Complete Account Setup',
      description: 'Set up your email, Slack, and other tools',
      type: 'checklist',
      duration: '5 min',
      phase: 'confidence',
      day: 1,
      points: 15,
    },
    {
      id: '3',
      title: 'Meet Your Buddy',
      description: 'Connect with your assigned peer mentor',
      type: 'social',
      duration: '15 min',
      phase: 'connection',
      day: 4,
      points: 20,
    },
    {
      id: '4',
      title: 'Learn Project Tools',
      description: 'Master Jira, Notion, and our workflow',
      type: 'tutorial',
      duration: '10 min',
      phase: 'productivity',
      day: 9,
      points: 25,
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    type: 'video',
    duration: '',
    phase: 'confidence',
    day: 1,
    points: 10,
  })

  const handleCreateTask = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title!,
      description: formData.description!,
      type: formData.type as any,
      duration: formData.duration || '5 min',
      phase: formData.phase as any,
      day: formData.day || 1,
      points: formData.points || 10,
    }

    setTasks([...tasks, newTask])
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: '',
      phase: 'confidence',
      day: 1,
      points: 10,
    })
    setIsCreating(false)
  }

  const handleUpdateTask = () => {
    if (!editingTask || !formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title!,
              description: formData.description!,
              type: formData.type as any,
              duration: formData.duration || task.duration,
              phase: formData.phase as any,
              day: formData.day || task.day,
              points: formData.points || task.points,
            }
          : task
      )
    )
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: '',
      phase: 'confidence',
      day: 1,
      points: 10,
    })
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      type: task.type,
      duration: task.duration,
      phase: task.phase,
      day: task.day,
      points: task.points,
    })
    setIsCreating(false)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: '',
      phase: 'confidence',
      day: 1,
      points: 10,
    })
  }

  const getTaskIcon = (type: string) => {
    const taskType = TASK_TYPES.find((t) => t.value === type)
    return taskType ? taskType.icon : Play
  }

  const getPhaseColor = (phase: string) => {
    const phaseInfo = PHASES.find((p) => p.value === phase)
    return phaseInfo ? phaseInfo.color : '#667eea'
  }

  const tasksByPhase = PHASES.map((phase) => ({
    ...phase,
    tasks: tasks.filter((task) => task.phase === phase.value).sort((a, b) => a.day - b.day),
  }))

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Create and manage onboarding tasks</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingTask(null)
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          <Plus size={20} />
          Create Task
        </button>
      </div>

      {/* Task Form */}
      <AnimatePresence>
        {(isCreating || editingTask) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Watch CEO Welcome Video"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Get inspired by our company vision"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Type
                </label>
                <select
                  value={formData.type || 'video'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 5 min"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
                <select
                  value={formData.phase || 'confidence'}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {PHASES.map((phase) => (
                    <option key={phase.value} value={phase.value}>
                      {phase.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={formData.day || 1}
                  onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.points || 10}
                  onChange={(e) =>
                    setFormData({ ...formData, points: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingTask ? handleUpdateTask : handleCreateTask}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                <Save size={16} />
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks by Phase */}
      <div className="space-y-6">
        {tasksByPhase.map((phase) => (
          <div key={phase.value} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: phase.color }}
              />
              <h2 className="text-xl font-semibold text-gray-900">{phase.label}</h2>
              <span className="text-sm text-gray-500">({phase.tasks.length} tasks)</span>
            </div>

            {phase.tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tasks in this phase yet. Create one to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {phase.tasks.map((task) => {
                  const TaskIcon = getTaskIcon(task.type)
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${phase.color}20` }}
                        >
                          <TaskIcon size={20} style={{ color: phase.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                              <Clock className="inline w-3 h-3 mr-1" />
                              {task.duration}
                            </span>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                              Day {task.day}
                            </span>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                              <Award className="inline w-3 h-3 mr-1" />
                              {task.points} pts
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        {PHASES.map((phase) => (
          <div key={phase.value} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">
              {tasks.filter((t) => t.phase === phase.value).length}
            </div>
            <div className="text-sm text-gray-600">{phase.label.split(' ')[0]} Tasks</div>
          </div>
        ))}
      </div>
    </div>
  )
}
