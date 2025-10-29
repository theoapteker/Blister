import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Download, Share, Star, CheckCircle, Target, Users, Zap, Trophy, Calendar, Clock } from 'lucide-react';
import './LaunchReport.css';

const LaunchReport = ({ currentDay }) => {
  const { user, tasks } = useUser();
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (currentDay >= 14) {
      generateReport();
    }
  }, [currentDay]);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const completedTasks = tasks.filter(task => task.completed);
    const totalPoints = completedTasks.reduce((acc, task) => acc + task.points, 0);
    
    const report = {
      user: user,
      currentDay: currentDay,
      completedTasks: completedTasks.length,
      totalTasks: tasks.length,
      totalPoints: totalPoints,
      completionRate: Math.round((completedTasks.length / tasks.length) * 100),
      phaseProgress: user.progress,
      badges: user.badges,
      dailyStreak: user.dailyStreak,
      buddy: user.buddy,
      achievements: [
        {
          id: 1,
          title: 'First Week Complete',
          description: 'Successfully completed your first week of onboarding',
          icon: Calendar,
          earned: currentDay >= 7
        },
        {
          id: 2,
          title: 'Buddy Connection',
          description: 'Connected with your assigned peer mentor',
          icon: Users,
          earned: !!user.buddy
        },
        {
          id: 3,
          title: 'Tool Master',
          description: 'Completed all tool training modules',
          icon: Target,
          earned: user.progress.productivity >= 80
        },
        {
          id: 4,
          title: 'Team Player',
          description: 'Met 3+ team members during onboarding',
          icon: Users,
          earned: user.progress.connection >= 60
        },
        {
          id: 5,
          title: 'Confidence Builder',
          description: 'Achieved high confidence in your role',
          icon: Star,
          earned: user.progress.confidence >= 80
        }
      ],
      recommendations: [
        'Continue building relationships with your team members',
        'Take on a small project to apply your learning',
        'Schedule regular check-ins with your manager',
        'Explore additional training opportunities in your field',
        'Consider becoming a buddy for future new hires'
      ],
      nextSteps: [
        'Set up your first 1:1 with your manager',
        'Join relevant Slack channels and communities',
        'Identify your first project or area of focus',
        'Schedule follow-up meetings with key stakeholders',
        'Plan your 30-day goals and objectives'
      ]
    };
    
    setReportData(report);
    setIsGenerating(false);
  };

  const getPhaseStatus = () => {
    if (currentDay < 14) {
      return {
        status: 'in-progress',
        message: `You're on day ${currentDay} of your 14-day launch sequence. Keep going!`,
        color: '#667eea'
      };
    }
    return {
      status: 'completed',
      message: 'Congratulations! You\'ve completed your 14-day launch sequence!',
      color: '#00d4aa'
    };
  };

  const phaseStatus = getPhaseStatus();

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="launch-report"
      >
        <div className="generating-section">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="generating-spinner"
          >
            <Trophy size={48} />
          </motion.div>
          <h2>Generating Your Launch Report</h2>
          <p>Analyzing your progress and achievements...</p>
        </div>
      </motion.div>
    );
  }

  if (currentDay < 14) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="launch-report"
      >
        <div className="pre-launch-section">
          <div className="pre-launch-header">
            <h1>Launch Report Coming Soon</h1>
            <p>Your comprehensive launch report will be available on day 14</p>
          </div>
          
          <div className="progress-preview">
            <div className="progress-card">
              <h3>Current Progress</h3>
              <div className="progress-stats">
                <div className="stat-item">
                  <span className="stat-number">{currentDay}</span>
                  <span className="stat-label">Days Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{14 - currentDay}</span>
                  <span className="stat-label">Days Remaining</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.completedTasks.length}</span>
                  <span className="stat-label">Tasks Done</span>
                </div>
              </div>
            </div>
            
            <div className="phase-preview">
              <h3>Phase Progress</h3>
              <div className="phase-bars">
                <div className="phase-bar">
                  <span>Confidence</span>
                  <div className="bar">
                    <motion.div
                      className="bar-fill"
                      style={{ backgroundColor: '#667eea' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${user.progress.confidence}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <span>{user.progress.confidence}%</span>
                </div>
                <div className="phase-bar">
                  <span>Connection</span>
                  <div className="bar">
                    <motion.div
                      className="bar-fill"
                      style={{ backgroundColor: '#f093fb' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${user.progress.connection}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                  <span>{user.progress.connection}%</span>
                </div>
                <div className="phase-bar">
                  <span>Productivity</span>
                  <div className="bar">
                    <motion.div
                      className="bar-fill"
                      style={{ backgroundColor: '#4facfe' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${user.progress.productivity}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                  <span>{user.progress.productivity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!reportData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="launch-report"
      >
        <div className="error-section">
          <h2>Report Not Available</h2>
          <p>Unable to generate your launch report at this time.</p>
          <button onClick={generateReport} className="retry-button">
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="launch-report"
    >
      {/* Header */}
      <div className="report-header">
        <div className="header-content">
          <h1>Launch Report</h1>
          <p>Your 14-day onboarding journey summary</p>
          <div className="header-actions">
            <button className="action-button primary">
              <Download size={20} />
              Download PDF
            </button>
            <button className="action-button secondary">
              <Share size={20} />
              Share Report
            </button>
          </div>
        </div>
        
        <div className="status-badge" style={{ backgroundColor: phaseStatus.color }}>
          <Trophy size={24} />
          <span>{phaseStatus.message}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="executive-summary">
        <h2>Executive Summary</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">
              <CheckCircle size={32} />
            </div>
            <div className="summary-content">
              <h3>{reportData.completionRate}% Complete</h3>
              <p>{reportData.completedTasks} of {reportData.totalTasks} tasks completed</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <Star size={32} />
            </div>
            <div className="summary-content">
              <h3>{reportData.totalPoints} Points</h3>
              <p>Total points earned during onboarding</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">
              <Clock size={32} />
            </div>
            <div className="summary-content">
              <h3>{reportData.dailyStreak} Days</h3>
              <p>Consecutive days of engagement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="phase-progress-section">
        <h2>Phase Progress</h2>
        <div className="phases-grid">
          <div className="phase-card">
            <div className="phase-header">
              <Target size={24} />
              <h3>Confidence Phase</h3>
            </div>
            <div className="phase-progress-bar">
              <motion.div
                className="progress-fill"
                style={{ backgroundColor: '#667eea' }}
                initial={{ width: 0 }}
                animate={{ width: `${reportData.phaseProgress.confidence}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <span className="progress-text">{reportData.phaseProgress.confidence}%</span>
          </div>
          
          <div className="phase-card">
            <div className="phase-header">
              <Users size={24} />
              <h3>Connection Phase</h3>
            </div>
            <div className="phase-progress-bar">
              <motion.div
                className="progress-fill"
                style={{ backgroundColor: '#f093fb' }}
                initial={{ width: 0 }}
                animate={{ width: `${reportData.phaseProgress.connection}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
            <span className="progress-text">{reportData.phaseProgress.connection}%</span>
          </div>
          
          <div className="phase-card">
            <div className="phase-header">
              <Zap size={24} />
              <h3>Productivity Phase</h3>
            </div>
            <div className="phase-progress-bar">
              <motion.div
                className="progress-fill"
                style={{ backgroundColor: '#4facfe' }}
                initial={{ width: 0 }}
                animate={{ width: `${reportData.phaseProgress.productivity}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <span className="progress-text">{reportData.phaseProgress.productivity}%</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Achievements & Badges</h2>
        <div className="achievements-grid">
          {reportData.achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <div className="achievement-icon">
                  <Icon size={24} />
                </div>
                <div className="achievement-content">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
                <div className="achievement-status">
                  {achievement.earned ? (
                    <CheckCircle size={20} color="#00d4aa" />
                  ) : (
                    <div className="locked-icon">🔒</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Buddy Connection */}
      {reportData.buddy && (
        <div className="buddy-section">
          <h2>Buddy Connection</h2>
          <div className="buddy-card">
            <div className="buddy-avatar">
              <span className="avatar-emoji">{reportData.buddy.avatar}</span>
            </div>
            <div className="buddy-info">
              <h3>{reportData.buddy.name}</h3>
              <p>{reportData.buddy.role} • {reportData.buddy.department}</p>
              <p className="buddy-bio">{reportData.buddy.bio}</p>
            </div>
            <div className="buddy-status">
              <div className="status-indicator">
                <div className="status-dot" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations & Next Steps */}
      <div className="recommendations-section">
        <div className="recommendations">
          <h2>Recommendations</h2>
          <ul>
            {reportData.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>
        
        <div className="next-steps">
          <h2>Next Steps</h2>
          <ul>
            {reportData.nextSteps.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {step}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default LaunchReport;