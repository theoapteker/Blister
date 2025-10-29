import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Play, CheckCircle, Clock, Star, Users, Target, Zap, TrendingUp, Award, ArrowRight, Info, Map, FileText } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ currentDay, setCurrentDay }) => {
  const { user, tasks, completeTask } = useUser();
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('confidence');
  const navigate = useNavigate();

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
        description: 'Build foundation and understand your role',
        days: 'Days 1-3',
        color: '#667eea',
        icon: Target,
        focusArea: 'Understanding your responsibilities and initial setup'
      },
      connection: {
        title: 'Connection Phase',
        subtitle: 'Who are my people?',
        description: 'Build relationships and find your support network',
        days: 'Days 4-8',
        color: '#f093fb',
        icon: Users,
        focusArea: 'Meeting your team and building connections'
      },
      productivity: {
        title: 'Productivity Phase',
        subtitle: 'How do I contribute?',
        description: 'Start contributing and making an impact',
        days: 'Days 9-14',
        color: '#4facfe',
        icon: Zap,
        focusArea: 'Taking ownership and delivering value'
      }
    };
    return phases[phase] || phases.confidence;
  };

  const phaseInfo = getPhaseInfo(currentPhase);
  const PhaseIcon = phaseInfo.icon;

  // Calculate completion stats
  const completedToday = todaysTasks.filter(task => task.completed).length;
  const totalToday = todaysTasks.length;
  const nextTask = todaysTasks.find(task => !task.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard"
    >
      {/* Hero Section - Current Focus */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <h1>Welcome back, {user.name}</h1>
            <div className="day-badge">
              Day {currentDay} of 14
            </div>
          </div>

          <div className="current-phase">
            <div className="phase-badge" style={{ backgroundColor: `${phaseInfo.color}20`, color: phaseInfo.color }}>
              <PhaseIcon size={20} />
              <span>{phaseInfo.title}</span>
              <span className="phase-days">{phaseInfo.days}</span>
            </div>
            <h2 className="phase-question">{phaseInfo.subtitle}</h2>
            <p className="phase-description">{phaseInfo.description}</p>
          </div>

          {nextTask && (
            <div className="next-action-card">
              <div className="next-action-header">
                <Info size={18} />
                <span>Your Next Step</span>
              </div>
              <div className="next-action-content">
                <h3>{nextTask.title}</h3>
                <p>{nextTask.description}</p>
                <div className="next-action-meta">
                  <span className="duration">
                    <Clock size={14} />
                    {nextTask.duration}
                  </span>
                  <span className="points">+{nextTask.points} points</span>
                </div>
                <button
                  className="next-action-button"
                  onClick={() => completeTask(nextTask.id)}
                >
                  Start Now
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hero-stats">
          <div className="daily-progress-card">
            <h3>Today's Progress</h3>
            <div className="circular-progress">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={phaseInfo.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 314' }}
                  animate={{ strokeDasharray: `${(completedToday / totalToday) * 314} 314` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </svg>
              <div className="progress-text">
                <span className="progress-number">{completedToday}/{totalToday}</span>
                <span className="progress-label">Tasks</span>
              </div>
            </div>
          </div>

          <div className="milestone-card">
            <Award size={24} color={phaseInfo.color} />
            <div>
              <h4>Current Milestone</h4>
              <p>{phaseInfo.focusArea}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Section - Today's Tasks */}
      <section className="section priority-section">
        <div className="section-header">
          <div>
            <h2>Today's Microbursts</h2>
            <p className="section-description">Complete these focused tasks to progress in your journey</p>
          </div>
          <div className="section-badge">
            {completedToday} of {totalToday} completed
          </div>
        </div>

        <div className="tasks-grid">
          {todaysTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`task-card ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-header">
                <div className="task-icon" style={{ color: phaseInfo.color }}>
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
                style={{
                  backgroundColor: task.completed ? '#10b981' : phaseInfo.color
                }}
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Progress Section */}
      <section className="section progress-section">
        <div className="section-header">
          <div>
            <h2>Your Journey Progress</h2>
            <p className="section-description">Track your advancement through each phase</p>
          </div>
        </div>

        <div className="progress-cards-grid">
          <div className="phase-progress-card">
            <div className="phase-progress-header">
              <Target size={20} color="#667eea" />
              <span>Confidence Phase</span>
            </div>
            <div className="phase-progress-bar">
              <motion.div
                className="phase-progress-fill"
                style={{ backgroundColor: '#667eea' }}
                initial={{ width: 0 }}
                animate={{ width: `${user.progress.confidence}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <div className="phase-progress-stats">
              <span className="percentage">{user.progress.confidence}%</span>
              <span className="status">{user.progress.confidence === 100 ? 'Complete' : 'In Progress'}</span>
            </div>
          </div>

          <div className="phase-progress-card">
            <div className="phase-progress-header">
              <Users size={20} color="#f093fb" />
              <span>Connection Phase</span>
            </div>
            <div className="phase-progress-bar">
              <motion.div
                className="phase-progress-fill"
                style={{ backgroundColor: '#f093fb' }}
                initial={{ width: 0 }}
                animate={{ width: `${user.progress.connection}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
            <div className="phase-progress-stats">
              <span className="percentage">{user.progress.connection}%</span>
              <span className="status">{user.progress.connection === 100 ? 'Complete' : currentDay >= 4 ? 'In Progress' : 'Upcoming'}</span>
            </div>
          </div>

          <div className="phase-progress-card">
            <div className="phase-progress-header">
              <Zap size={20} color="#4facfe" />
              <span>Productivity Phase</span>
            </div>
            <div className="phase-progress-bar">
              <motion.div
                className="phase-progress-fill"
                style={{ backgroundColor: '#4facfe' }}
                initial={{ width: 0 }}
                animate={{ width: `${user.progress.productivity}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <div className="phase-progress-stats">
              <span className="percentage">{user.progress.productivity}%</span>
              <span className="status">{user.progress.productivity === 100 ? 'Complete' : currentDay >= 9 ? 'In Progress' : 'Upcoming'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section achievements-section">
        <div className="section-header">
          <div>
            <h2>Your Achievements</h2>
            <p className="section-description">Celebrate your progress and milestones</p>
          </div>
        </div>

        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon" style={{ backgroundColor: '#fef3c7' }}>
              <Star size={28} color="#f59e0b" />
            </div>
            <div className="achievement-content">
              <h3>{user.badges.length}</h3>
              <p>Badges Earned</p>
              <span className="achievement-subtitle">Keep completing tasks to earn more!</span>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon" style={{ backgroundColor: '#dbeafe' }}>
              <Clock size={28} color="#3b82f6" />
            </div>
            <div className="achievement-content">
              <h3>{user.dailyStreak}</h3>
              <p>Day Streak</p>
              <span className="achievement-subtitle">Consecutive days active</span>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon" style={{ backgroundColor: '#d1fae5' }}>
              <CheckCircle size={28} color="#10b981" />
            </div>
            <div className="achievement-content">
              <h3>{user.completedTasks.length}</h3>
              <p>Tasks Completed</p>
              <span className="achievement-subtitle">Total across all phases</span>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon" style={{ backgroundColor: '#e0e7ff' }}>
              <TrendingUp size={28} color="#6366f1" />
            </div>
            <div className="achievement-content">
              <h3>{Math.round((currentDay / 14) * 100)}%</h3>
              <p>Journey Progress</p>
              <span className="achievement-subtitle">{14 - currentDay} days remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Resources Section */}
      <section className="section tools-section">
        <div className="section-header">
          <div>
            <h2>Tools & Resources</h2>
            <p className="section-description">Access your onboarding tools and support</p>
          </div>
        </div>

        <div className="tools-grid">
          <button className="tool-card" onClick={() => navigate('/buddy-portal')}>
            <div className="tool-icon" style={{ backgroundColor: `${phaseInfo.color}20`, color: phaseInfo.color }}>
              <Users size={24} />
            </div>
            <div className="tool-content">
              <h3>Buddy Portal</h3>
              <p>Connect with your mentor and ask questions</p>
            </div>
            <ArrowRight size={18} className="tool-arrow" />
          </button>

          <button className="tool-card" onClick={() => navigate('/orbit-map')}>
            <div className="tool-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <Map size={24} />
            </div>
            <div className="tool-content">
              <h3>Orbit Map</h3>
              <p>Visualize your team connections</p>
            </div>
            <ArrowRight size={18} className="tool-arrow" />
          </button>

          <button className="tool-card" onClick={() => navigate('/launch-report')}>
            <div className="tool-icon" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
              <FileText size={24} />
            </div>
            <div className="tool-content">
              <h3>Launch Report</h3>
              <p>View your detailed progress report</p>
            </div>
            <ArrowRight size={18} className="tool-arrow" />
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;