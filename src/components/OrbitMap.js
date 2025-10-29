import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Star, CheckCircle, Lock, Rocket, Target, Users, Zap } from 'lucide-react';
import './OrbitMap.css';

const OrbitMap = ({ currentDay }) => {
  const { user } = useUser();
  const [selectedPhase, setSelectedPhase] = useState('confidence');

  const phases = [
    {
      id: 'confidence',
      title: 'Confidence Phase',
      subtitle: 'Days 1-3',
      color: '#667eea',
      icon: Target,
      description: 'Build confidence in your role and responsibilities',
      milestones: [
        { id: 1, title: 'Welcome Video', completed: true, day: 1 },
        { id: 2, title: 'Account Setup', completed: true, day: 1 },
        { id: 3, title: 'Team Introduction', completed: false, day: 2 },
        { id: 4, title: 'Role Clarity', completed: false, day: 3 }
      ]
    },
    {
      id: 'connection',
      title: 'Connection Phase',
      subtitle: 'Days 4-8',
      color: '#f093fb',
      icon: Users,
      description: 'Connect with your team and build relationships',
      milestones: [
        { id: 5, title: 'Meet Your Buddy', completed: false, day: 4 },
        { id: 6, title: 'Coffee Chat', completed: false, day: 5 },
        { id: 7, title: 'Team Lunch', completed: false, day: 6 },
        { id: 8, title: 'Department Tour', completed: false, day: 7 },
        { id: 9, title: 'Culture Quiz', completed: false, day: 8 }
      ]
    },
    {
      id: 'productivity',
      title: 'Productivity Phase',
      subtitle: 'Days 9-14',
      color: '#4facfe',
      icon: Zap,
      description: 'Master tools and contribute meaningfully',
      milestones: [
        { id: 10, title: 'Tool Training', completed: false, day: 9 },
        { id: 11, title: 'First Project', completed: false, day: 10 },
        { id: 12, title: 'Meeting Mastery', completed: false, day: 11 },
        { id: 13, title: 'KPI Understanding', completed: false, day: 12 },
        { id: 14, title: 'Launch Report', completed: false, day: 14 }
      ]
    }
  ];

  const currentPhaseIndex = phases.findIndex(phase => phase.id === selectedPhase);
  const currentPhase = phases[currentPhaseIndex];

  const getPhaseStatus = (phaseId) => {
    if (phaseId === 'confidence') return currentDay <= 3 ? 'active' : 'completed';
    if (phaseId === 'connection') return currentDay > 3 && currentDay <= 8 ? 'active' : currentDay > 8 ? 'completed' : 'locked';
    if (phaseId === 'productivity') return currentDay > 8 ? 'active' : 'locked';
    return 'locked';
  };

  const getMilestoneStatus = (milestone) => {
    if (milestone.completed) return 'completed';
    if (milestone.day <= currentDay) return 'available';
    return 'locked';
  };

  const totalMilestones = phases.reduce((acc, phase) => acc + phase.milestones.length, 0);
  const completedMilestones = phases.reduce((acc, phase) => 
    acc + phase.milestones.filter(m => m.completed).length, 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="orbit-map"
    >
      {/* Header */}
      <div className="orbit-header">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Your Launch Orbit 🚀</h1>
          <p>Navigate your 14-day journey through three key phases</p>
        </motion.div>
        
        <div className="orbit-stats">
          <div className="stat-item">
            <span className="stat-number">{completedMilestones}</span>
            <span className="stat-label">Milestones</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{Math.round((completedMilestones / totalMilestones) * 100)}%</span>
            <span className="stat-label">Complete</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.badges.length}</span>
            <span className="stat-label">Badges</span>
          </div>
        </div>
      </div>

      {/* Phase Selector */}
      <div className="phase-selector">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const status = getPhaseStatus(phase.id);
          
          return (
            <motion.button
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`phase-button ${status} ${selectedPhase === phase.id ? 'selected' : ''}`}
              onClick={() => setSelectedPhase(phase.id)}
              style={{ '--phase-color': phase.color }}
            >
              <div className="phase-icon">
                <Icon size={24} />
              </div>
              <div className="phase-info">
                <h3>{phase.title}</h3>
                <p>{phase.subtitle}</p>
              </div>
              <div className="phase-status">
                {status === 'completed' && <CheckCircle size={20} />}
                {status === 'locked' && <Lock size={20} />}
                {status === 'active' && <Rocket size={20} />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Phase Details */}
      <motion.div
        key={selectedPhase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="phase-details"
      >
        <div className="phase-header">
          <div className="phase-title-section">
            <div 
              className="phase-color-bar"
              style={{ backgroundColor: currentPhase.color }}
            />
            <div>
              <h2>{currentPhase.title}</h2>
              <p>{currentPhase.description}</p>
            </div>
          </div>
          <div className="phase-progress">
            <div className="progress-circle">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke={currentPhase.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(currentPhase.milestones.filter(m => m.completed).length / currentPhase.milestones.length) * 157} 157`}
                  initial={{ strokeDasharray: "0 157" }}
                  animate={{ strokeDasharray: `${(currentPhase.milestones.filter(m => m.completed).length / currentPhase.milestones.length) * 157} 157` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </svg>
              <span className="progress-text">
                {Math.round((currentPhase.milestones.filter(m => m.completed).length / currentPhase.milestones.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="milestones-grid">
          {currentPhase.milestones.map((milestone, index) => {
            const status = getMilestoneStatus(milestone);
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`milestone-card ${status}`}
              >
                <div className="milestone-header">
                  <div className="milestone-icon">
                    {status === 'completed' && <CheckCircle size={20} />}
                    {status === 'locked' && <Lock size={20} />}
                    {status === 'available' && <Star size={20} />}
                  </div>
                  <div className="milestone-meta">
                    <span className="milestone-day">Day {milestone.day}</span>
                    <span className="milestone-status">{status}</span>
                  </div>
                </div>
                
                <h3>{milestone.title}</h3>
                
                <div className="milestone-actions">
                  {status === 'available' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="milestone-button"
                      style={{ backgroundColor: currentPhase.color }}
                    >
                      Start Milestone
                    </motion.button>
                  )}
                  {status === 'completed' && (
                    <div className="completed-badge">
                      <CheckCircle size={16} />
                      Completed
                    </div>
                  )}
                  {status === 'locked' && (
                    <div className="locked-badge">
                      <Lock size={16} />
                      Locked
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrbitMap;