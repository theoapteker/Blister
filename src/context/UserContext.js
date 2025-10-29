import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Alex Chen',
    role: 'Software Engineer',
    department: 'Engineering',
    startDate: new Date(),
    avatar: '👨‍💻',
    timezone: 'PST',
    interests: ['Gaming', 'Photography', 'Coffee', 'Hiking'],
    currentPhase: 'confidence', // confidence, connection, productivity
    progress: {
      confidence: 0,
      connection: 0,
      productivity: 0
    },
    completedTasks: [],
    badges: [],
    buddy: null,
    dailyStreak: 0
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Watch CEO Welcome Video',
      description: 'Get inspired by our company vision',
      type: 'video',
      duration: '2 min',
      phase: 'confidence',
      day: 1,
      completed: false,
      points: 10
    },
    {
      id: 2,
      title: 'Complete Account Setup',
      description: 'Set up your email, Slack, and other tools',
      type: 'checklist',
      duration: '5 min',
      phase: 'confidence',
      day: 1,
      completed: false,
      points: 15
    },
    {
      id: 3,
      title: 'Meet Your Buddy',
      description: 'Connect with your assigned peer mentor',
      type: 'social',
      duration: '15 min',
      phase: 'connection',
      day: 4,
      completed: false,
      points: 20
    },
    {
      id: 4,
      title: 'Learn Project Tools',
      description: 'Master Jira, Notion, and our workflow',
      type: 'tutorial',
      duration: '10 min',
      phase: 'productivity',
      day: 9,
      completed: false,
      points: 25
    }
  ]);

  const [buddies, setBuddies] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Software Engineer',
      department: 'Engineering',
      avatar: '👩‍💻',
      interests: ['Gaming', 'Coffee', 'Travel'],
      timezone: 'PST',
      bio: 'Love helping new team members find their groove!',
      available: true
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      role: 'Product Manager',
      department: 'Product',
      avatar: '👨‍💼',
      interests: ['Photography', 'Hiking', 'Coffee'],
      timezone: 'PST',
      bio: 'Passionate about building great products and teams',
      available: true
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'UX Designer',
      department: 'Design',
      avatar: '👩‍🎨',
      interests: ['Art', 'Coffee', 'Gaming'],
      timezone: 'EST',
      bio: 'Design enthusiast who loves mentoring new designers',
      available: false
    }
  ]);

  const updateProgress = (phase, value) => {
    setUser(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [phase]: Math.min(100, prev.progress[phase] + value)
      }
    }));
  };

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      ));
      
      setUser(prev => ({
        ...prev,
        completedTasks: [...prev.completedTasks, taskId],
        dailyStreak: prev.dailyStreak + 1
      }));

      // Update progress based on task phase
      updateProgress(task.phase, task.points);
    }
  };

  const assignBuddy = (buddyId) => {
    const buddy = buddies.find(b => b.id === buddyId);
    if (buddy) {
      setUser(prev => ({
        ...prev,
        buddy: buddy
      }));
    }
  };

  const addBadge = (badge) => {
    setUser(prev => ({
      ...prev,
      badges: [...prev.badges, badge]
    }));
  };

  const value = {
    user,
    setUser,
    tasks,
    setTasks,
    buddies,
    setBuddies,
    completeTask,
    assignBuddy,
    addBadge,
    updateProgress
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};