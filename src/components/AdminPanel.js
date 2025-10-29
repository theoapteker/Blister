import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
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
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react';
import './AdminPanel.css';

const TASK_TYPES = [
  { value: 'video', label: 'Video', icon: Play },
  { value: 'checklist', label: 'Checklist', icon: CheckCircle },
  { value: 'social', label: 'Social', icon: Users },
  { value: 'tutorial', label: 'Tutorial', icon: Target },
];

const PHASES = [
  { value: 'confidence', label: 'Confidence Phase (Days 1-3)', color: '#667eea' },
  { value: 'connection', label: 'Connection Phase (Days 4-8)', color: '#f093fb' },
  { value: 'productivity', label: 'Productivity Phase (Days 9-14)', color: '#4facfe' },
];

const AdminPanel = () => {
  const { user, tasks, setTasks } = useUser();
  const [activeTab, setActiveTab] = useState('content');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '',
    phase: 'confidence',
    day: 1,
    points: 10,
  });

  const handleCreateTask = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newTask = {
      id: tasks.length + 1,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      duration: formData.duration || '5 min',
      phase: formData.phase,
      day: formData.day,
      completed: false,
      points: formData.points,
    };

    setTasks([...tasks, newTask]);
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: '',
      phase: 'confidence',
      day: 1,
      points: 10,
    });
    setIsCreating(false);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title,
              description: formData.description,
              type: formData.type,
              duration: formData.duration || task.duration,
              phase: formData.phase,
              day: formData.day,
              points: formData.points,
            }
          : task
      )
    );
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: '',
      phase: 'confidence',
      day: 1,
      points: 10,
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      type: task.type,
      duration: task.duration,
      phase: task.phase,
      day: task.day,
      points: task.points,
    });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: '',
      phase: 'confidence',
      day: 1,
      points: 10,
    });
  };

  const getTaskIcon = (type) => {
    const taskType = TASK_TYPES.find((t) => t.value === type);
    return taskType ? taskType.icon : Play;
  };

  const getPhaseColor = (phase) => {
    const phaseInfo = PHASES.find((p) => p.value === phase);
    return phaseInfo ? phaseInfo.color : '#667eea';
  };

  const tasksByPhase = PHASES.map((phase) => ({
    ...phase,
    tasks: tasks.filter((task) => task.phase === phase.value).sort((a, b) => a.day - b.day),
  }));

  const stats = [
    {
      name: 'Total Employees',
      value: '24',
      icon: Users,
      change: '+4 this month',
    },
    {
      name: 'Active Journeys',
      value: '18',
      icon: BarChart3,
      change: '75% completion rate',
    },
    {
      name: 'Total Tasks',
      value: tasks.length.toString(),
      icon: FileText,
      change: `${tasks.filter(t => t.completed).length} completed`,
    },
    {
      name: 'Avg. Progress',
      value: '68%',
      icon: Settings,
      change: '+12% from last week',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="admin-panel"
    >
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p className="admin-subtitle">Manage your onboarding platform</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={20} />
          Dashboard
        </button>
        <button
          className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <FileText size={20} />
          Content Management
        </button>
        <button
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          Settings
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="admin-content">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.name} className="stat-card">
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-name">{stat.name}</div>
                  <div className="stat-change">{stat.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="admin-content">
          <div className="content-header">
            <div>
              <h2>Content Management</h2>
              <p>Create and manage onboarding tasks</p>
            </div>
            <button
              className="create-button"
              onClick={() => {
                setIsCreating(true);
                setEditingTask(null);
              }}
            >
              <Plus size={20} />
              Create Task
            </button>
          </div>

          {/* Task Form */}
          <AnimatePresence>
            {(isCreating || editingTask) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="task-form"
              >
                <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Task Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Watch CEO Welcome Video"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., Get inspired by our company vision"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Task Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      {TASK_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 5 min"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phase</label>
                    <select
                      value={formData.phase}
                      onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                    >
                      {PHASES.map((phase) => (
                        <option key={phase.value} value={phase.value}>
                          {phase.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Day</label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Points</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="save-button"
                    onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  >
                    <Save size={16} />
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button className="cancel-button" onClick={handleCancel}>
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tasks by Phase */}
          <div className="tasks-by-phase">
            {tasksByPhase.map((phase) => (
              <div key={phase.value} className="phase-section">
                <div className="phase-header">
                  <div className="phase-indicator" style={{ backgroundColor: phase.color }} />
                  <h3>{phase.label}</h3>
                  <span className="task-count">({phase.tasks.length} tasks)</span>
                </div>

                {phase.tasks.length === 0 ? (
                  <p className="empty-state">No tasks in this phase yet. Create one to get started!</p>
                ) : (
                  <div className="task-list">
                    {phase.tasks.map((task) => {
                      const TaskIcon = getTaskIcon(task.type);
                      return (
                        <motion.div key={task.id} layout className="task-item">
                          <div className="task-item-content">
                            <div
                              className="task-icon"
                              style={{ backgroundColor: `${phase.color}20`, color: phase.color }}
                            >
                              <TaskIcon size={20} />
                            </div>
                            <div className="task-details">
                              <h4>{task.title}</h4>
                              <p>{task.description}</p>
                              <div className="task-meta">
                                <span className="meta-badge">
                                  <Clock size={12} />
                                  {task.duration}
                                </span>
                                <span className="meta-badge">Day {task.day}</span>
                                <span className="meta-badge">
                                  <Award size={12} />
                                  {task.points} pts
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="task-actions">
                            <button className="edit-button" onClick={() => handleEdit(task)}>
                              <Edit2 size={16} />
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="admin-content">
          <div className="settings-section">
            <h2>Platform Settings</h2>
            <p>Configure your onboarding platform settings</p>
            <div className="settings-placeholder">
              <Settings size={48} />
              <p>Settings coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
