import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { MessageCircle, Video, Phone, Coffee, Star, Users, Clock, Heart } from 'lucide-react';
import './BuddyPortal.css';

const BuddyPortal = ({ currentDay }) => {
  const { user, buddies, assignBuddy } = useUser();
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMatching, setShowMatching] = useState(!user.buddy);

  const conversationStarters = [
    "What's your favorite part about working here?",
    "Any tips for a new team member?",
    "What's the team culture like?",
    "What projects are you currently working on?",
    "Any recommendations for lunch spots nearby?",
    "What's the best way to get up to speed quickly?"
  ];

  const suggestedActivities = [
    {
      id: 1,
      title: 'Virtual Coffee Chat',
      description: '15-minute casual conversation',
      duration: '15 min',
      icon: Coffee,
      points: 20
    },
    {
      id: 2,
      title: 'Team Introduction',
      description: 'Meet 3 new team members',
      duration: '30 min',
      icon: Users,
      points: 30
    },
    {
      id: 3,
      title: 'Project Walkthrough',
      description: 'Learn about current projects',
      duration: '20 min',
      icon: Star,
      points: 25
    }
  ];

  useEffect(() => {
    if (user.buddy) {
      setSelectedBuddy(user.buddy);
      // Load sample chat messages
      setChatMessages([
        {
          id: 1,
          sender: 'buddy',
          message: 'Hey! Welcome to the team! 👋',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: 2,
          sender: 'user',
          message: 'Thanks! Excited to be here!',
          timestamp: new Date(Date.now() - 3500000)
        },
        {
          id: 3,
          sender: 'buddy',
          message: 'How are you settling in? Any questions so far?',
          timestamp: new Date(Date.now() - 3000000)
        }
      ]);
    }
  }, [user.buddy]);

  const handleBuddySelect = (buddy) => {
    assignBuddy(buddy.id);
    setSelectedBuddy(buddy);
    setShowMatching(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'user',
        message: newMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const getCompatibilityScore = (buddy) => {
    const commonInterests = buddy.interests.filter(interest => 
      user.interests.includes(interest)
    ).length;
    const timezoneMatch = buddy.timezone === user.timezone ? 20 : 0;
    const departmentMatch = buddy.department === user.department ? 30 : 0;
    
    return Math.min(100, commonInterests * 10 + timezoneMatch + departmentMatch);
  };

  if (showMatching) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="buddy-portal"
      >
        <div className="matching-section">
          <div className="matching-header">
            <h1>Find Your Launch Buddy 🚀</h1>
            <p>We'll match you with a peer mentor who shares your interests and can guide you through your first weeks</p>
          </div>

          <div className="matching-criteria">
            <h3>Your Matching Criteria</h3>
            <div className="criteria-grid">
              <div className="criteria-item">
                <span className="criteria-label">Department</span>
                <span className="criteria-value">{user.department}</span>
              </div>
              <div className="criteria-item">
                <span className="criteria-label">Timezone</span>
                <span className="criteria-value">{user.timezone}</span>
              </div>
              <div className="criteria-item">
                <span className="criteria-label">Interests</span>
                <span className="criteria-value">{user.interests.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="buddy-suggestions">
            <h3>Suggested Buddies</h3>
            <div className="suggestions-grid">
              {buddies.map((buddy, index) => {
                const compatibility = getCompatibilityScore(buddy);
                const BuddyIcon = buddy.available ? Users : Clock;
                
                return (
                  <motion.div
                    key={buddy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`buddy-card ${!buddy.available ? 'unavailable' : ''}`}
                  >
                    <div className="buddy-avatar">
                      <span className="avatar-emoji">{buddy.avatar}</span>
                      <div className="availability-indicator">
                        <BuddyIcon size={16} />
                      </div>
                    </div>
                    
                    <div className="buddy-info">
                      <h4>{buddy.name}</h4>
                      <p>{buddy.role}</p>
                      <p className="buddy-bio">{buddy.bio}</p>
                      
                      <div className="compatibility">
                        <span>Compatibility: {compatibility}%</span>
                        <div className="compatibility-bar">
                          <motion.div
                            className="compatibility-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${compatibility}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                      
                      <div className="common-interests">
                        <span>Common interests:</span>
                        <div className="interests-tags">
                          {buddy.interests.filter(interest => 
                            user.interests.includes(interest)
                          ).map(interest => (
                            <span key={interest} className="interest-tag">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className={`select-buddy-button ${!buddy.available ? 'disabled' : ''}`}
                      onClick={() => handleBuddySelect(buddy)}
                      disabled={!buddy.available}
                    >
                      {buddy.available ? 'Select Buddy' : 'Unavailable'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="buddy-portal"
    >
      {/* Header */}
      <div className="buddy-header">
        <div className="buddy-info-section">
          <div className="buddy-avatar-large">
            <span className="avatar-emoji-large">{selectedBuddy?.avatar}</span>
          </div>
          <div>
            <h1>Your Launch Buddy</h1>
            <h2>{selectedBuddy?.name}</h2>
            <p>{selectedBuddy?.role} • {selectedBuddy?.department}</p>
          </div>
        </div>
        
        <div className="buddy-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-button"
          >
            <Video size={20} />
            Video Call
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-button"
          >
            <Phone size={20} />
            Call
          </motion.button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <div className="chat-header">
          <h3>Chat with {selectedBuddy?.name}</h3>
          <div className="chat-status">
            <div className="status-dot" />
            <span>Online</span>
          </div>
        </div>
        
        <div className="chat-messages">
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                <p>{message.message}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            <MessageCircle size={20} />
          </button>
        </form>
      </div>

      {/* Conversation Starters */}
      <div className="conversation-starters">
        <h3>Conversation Starters</h3>
        <div className="starters-grid">
          {conversationStarters.map((starter, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="starter-button"
              onClick={() => setNewMessage(starter)}
            >
              {starter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Suggested Activities */}
      <div className="suggested-activities">
        <h3>Suggested Activities</h3>
        <div className="activities-grid">
          {suggestedActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.02 }}
                className="activity-card"
              >
                <div className="activity-icon">
                  <Icon size={24} />
                </div>
                <div className="activity-info">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <div className="activity-meta">
                    <span className="duration">{activity.duration}</span>
                    <span className="points">+{activity.points} pts</span>
                  </div>
                </div>
                <button className="start-activity-button">
                  Start
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BuddyPortal;