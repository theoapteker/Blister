import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Map, Globe, FileText, Rocket, LogOut, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Navigation.css';

const Navigation = ({ currentDay, onLogout }) => {
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/buddy-portal', label: 'Buddy Portal', icon: Users },
    { path: '/orbit-map', label: 'Orbit Map', icon: Map },
    { path: '/orbit-globe', label: 'Orbit Globe', icon: Globe },
    { path: '/launch-report', label: 'Launch Report', icon: FileText }
  ];

  const getPhaseColor = () => {
    if (currentDay <= 3) return '#667eea';
    if (currentDay <= 8) return '#f093fb';
    return '#4facfe';
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">
            <Rocket size={24} />
          </div>
          <div className="brand-text">
            <h2>Blister Launchpad</h2>
            <span className="day-counter">Day {currentDay}/14</span>
          </div>
        </div>

        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="active-indicator" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              <span>{user.avatar}</span>
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role === 'admin' ? 'Admin' : user.jobTitle}</span>
            </div>
          </div>
          
          <div className="nav-actions">
            <div className="progress-ring">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(currentDay / 14) * 100} 100`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </svg>
              <span className="progress-text">{Math.round((currentDay / 14) * 100)}%</span>
            </div>
            
            <motion.button
              onClick={onLogout}
              className="logout-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;