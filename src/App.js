import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import BuddyPortal from './components/BuddyPortal';
import OrbitMap from './components/OrbitMap';
import LaunchReport from './components/LaunchReport';
import OrbitGlobe from './components/OrbitGlobe';
import Navigation from './components/Navigation';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { UserProvider, useUser } from './context/UserContext';
import './App.css';

function AppContent() {
  const { isAuthenticated, user, login, logout } = useUser();
  const [currentDay, setCurrentDay] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="loading-content"
        >
          <div className="logo">
            <span className="logo-text">🚀</span>
            <h1>Blister Launchpad</h1>
          </div>
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Preparing your launch sequence...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <Router>
      <div className="app">
        <Navigation currentDay={currentDay} onLogout={logout} />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  user.role === 'admin'
                    ? <Navigate to="/admin" replace />
                    : <Dashboard currentDay={currentDay} setCurrentDay={setCurrentDay} />
                }
              />
              <Route
                path="/admin"
                element={
                  user.role === 'admin'
                    ? <AdminPanel />
                    : <Navigate to="/" replace />
                }
              />
              <Route
                path="/buddy-portal"
                element={<BuddyPortal currentDay={currentDay} />}
              />
              <Route
                path="/orbit-map"
                element={<OrbitMap currentDay={currentDay} />}
              />
              <Route
                path="/orbit-globe"
                element={<OrbitGlobe currentDay={currentDay} />}
              />
              <Route
                path="/launch-report"
                element={<LaunchReport currentDay={currentDay} />}
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;