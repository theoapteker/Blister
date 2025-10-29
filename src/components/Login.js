import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple authentication logic
    const validUsers = {
      'admin@blister.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'alex@blister.com': { password: 'user123', role: 'user', name: 'Alex Chen' }
    };

    const user = validUsers[formData.email];
    
    if (user && user.password === formData.password) {
      onLogin({
        email: formData.email,
        name: user.name,
        role: user.role,
        avatar: user.role === 'admin' ? '👑' : '👨‍💻'
      });
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <div className="login-header">
          <div className="logo">
            <span className="logo-text">🚀</span>
            <h1>Blister Launchpad</h1>
          </div>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <User size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn size={16} />
            Sign In
          </motion.button>
        </form>

        <div className="login-footer">
          <div className="demo-accounts">
            <h4>Demo Accounts:</h4>
            <div className="account-list">
              <div className="account-item">
                <strong>Admin:</strong> admin@blister.com / admin123
              </div>
              <div className="account-item">
                <strong>User:</strong> alex@blister.com / user123
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
