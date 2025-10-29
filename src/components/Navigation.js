import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Map, Globe, FileText, Rocket } from 'lucide-react';
import './Navigation.css';

const Navigation = ({ currentDay }) => {
  const location = useLocation();

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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="brand-icon"
          >
            <Rocket size={24} />
          </motion.div>
          <div className="brand-text">
            <h2>Blister Launchpad</h2>
            <span className="day-counter">Day {currentDay}/14</span>
          </div>
        </div>

        <div className="nav-links">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    '--active-color': getPhaseColor()
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="nav-progress">
          <div className="progress-ring">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="3"
              />
              <motion.circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke={getPhaseColor()}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(currentDay / 14) * 100} 100`}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${(currentDay / 14) * 100} 100` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <span className="progress-text">{Math.round((currentDay / 14) * 100)}%</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;