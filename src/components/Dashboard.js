import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Play, CheckCircle, Clock, Star, Users, Target, Zap } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ currentDay, setCurrentDay }) => {
  const { user, tasks, completeTask } = useUser();
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('confidence');

  useEffect(() => {
    // Determine current phase based on day
    if (currentDay <= 3) {
      setCurrentPhase('confidence');
    } else if (currentDay <= 8) {
      setCurrentPhase('connection');
    } else {
      setCurrentPhase('productivity');
    }

    // Filter today's tasks
    const todayTasks = tasks.filter(task => task.day === currentDay);
    setTodaysTasks(todayTasks);
  }, [currentDay, tasks]);

  const getPhaseInfo = (phase) => {
    const phases = {
      confidence: {
        title: 'Confidence Phase',
        subtitle: 'What am I supposed to do?',
        color: '#667eea',
        icon: Target
      },
      connection: {
        title: 'Connection Phase',
        subtitle: 'Who are my people?',
        color: '#f093fb',
        icon: Users
      },
      productivity: {
        title: 'Productivity Phase',
        subtitle: 'How do I contribute?',
        color: '#4facfe',
        icon: Zap
      }
    };
    return phases[phase] || phases.confidence;
  };

  const phaseInfo = getPhaseInfo(currentPhase);
  const PhaseIcon = phaseInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard"
    >
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.name}</h1>
          <p className="welcome-subtitle">
            Day {currentDay} of your 14-day launch sequence
          </p>
        </div>
        
        <div className="phase-indicator">
          <div className="phase-card" style={{ borderColor: phaseInfo.color }}>
            <PhaseIcon size={24} color={phaseInfo.color} />
            <div>
              <h3>{phaseInfo.title}</h3>
              <p>{phaseInfo.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-card">
          <h3>Your Launch Progress</h3>
          <div className="progress-bars">
            <div className="progress-item">
              <span>Confidence</span>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  style={{ backgroundColor: '#667eea' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${user.progress.confidence}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span>{user.progress.confidence}%</span>
            </div>
            <div className="progress-item">
              <span>Connection</span>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  style={{ backgroundColor: '#f093fb' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${user.progress.connection}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
              <span>{user.progress.connection}%</span>
            </div>
            <div className="progress-item">
              <span>Productivity</span>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  style={{ backgroundColor: '#4facfe' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${user.progress.productivity}%` }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
              </div>
              <span>{user.progress.productivity}%</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Star size={24} color="#ffd700" />
            <div>
              <h3>{user.badges.length}</h3>
              <p>Badges Earned</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={24} color="#4facfe" />
            <div>
              <h3>{user.dailyStreak}</h3>
              <p>Day Streak</p>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle size={24} color="#00d4aa" />
            <div>
              <h3>{user.completedTasks.length}</h3>
              <p>Tasks Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="todays-tasks">
        <h2>Today's Microbursts</h2>
        <div className="tasks-grid">
          {todaysTasks.map((task, index) => (
            <div
              key={task.id}
              className={`task-card ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-header">
                <div className="task-icon">
                  {task.type === 'video' && <Play size={20} />}
                  {task.type === 'checklist' && <CheckCircle size={20} />}
                  {task.type === 'social' && <Users size={20} />}
                  {task.type === 'tutorial' && <Target size={20} />}
                </div>
                <div className="task-meta">
                  <span className="task-duration">{task.duration}</span>
                  <span className="task-points">+{task.points} pts</span>
                </div>
              </div>
              
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              
              <button
                className={`task-button ${task.completed ? 'completed' : ''}`}
                onClick={() => completeTask(task.id)}
                disabled={task.completed}
              >
                {task.completed ? (
                  <>
                    <CheckCircle size={16} />
                    Completed
                  </>
                ) : (
                  'Start Task'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-button primary">
            <Users size={20} />
            Meet Your Buddy
          </button>
          <button className="action-button secondary">
            <Target size={20} />
            View Orbit Map
          </button>
          <button className="action-button secondary">
            <Star size={20} />
            Earn Badges
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;