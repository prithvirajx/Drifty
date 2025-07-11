import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CreateUsername = ({ userData, onComplete, onBack }) => {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  // Check username availability (mock implementation)
  const checkUsername = async (value) => {
    if (!value) {
      setIsAvailable(false);
      return;
    }
    
    // Basic validation
    if (value.length < 3) {
      setError('Username must be at least 3 characters');
      setIsAvailable(false);
      return;
    }
    
    if (!/^[a-zA-Z0-9_.]+$/.test(value)) {
      setError('Only letters, numbers, periods and underscores allowed');
      setIsAvailable(false);
      return;
    }
    
    setError('');
    setIsChecking(true);
    
    // Simulate API call to check username availability
    setTimeout(() => {
      // In a real app, this would be an API call to your backend
      const isTaken = Math.random() > 0.5; // Simulate 50% chance of being taken
      
      if (isTaken) {
        setError('Username is already taken');
        setIsAvailable(false);
      } else {
        setError('');
        setIsAvailable(true);
      }
      
      setIsChecking(false);
    }, 800);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);
    
    if (value.length > 0) {
      checkUsername(value);
    } else {
      setError('');
      setIsAvailable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable) return;
    
    try {
      // Create updated user data with the new username
      const updatedUserData = {
        ...userData,
        username: username.toLowerCase()
      };
      
      // Call the onComplete callback with the updated data
      if (typeof onComplete === 'function') {
        onComplete(updatedUserData);
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="onboarding-card"
    >

      <div className="step-content">
        <div className="form-group">
          <h2>Create your username</h2>
          <p className="subtitle">
            Choose a unique username. You can always change it later.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-prefix">@</span>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="username"
                className="glass-input username-input"
                autoComplete="off"
                autoFocus
              />
            </div>
            
            {isChecking && (
              <div className="status-message checking">
                <div className="spinner"></div>
                <span>Checking availability...</span>
              </div>
            )}
            
            {error && !isChecking && (
              <div className="error-message">{error}</div>
            )}
            
            {isAvailable && !isChecking && (
              <div className="success-message">
                ✓ Username is available!
              </div>
            )}
            
            <div className="button-group">
              <button 
                type="submit"
                className={`next-button ${!isAvailable ? 'disabled' : ''}`}
                disabled={!isAvailable}
                style={{ width: '100%' }}
              >
                Complete Setup
              </button>
            </div>
          </form>
          
          <div className="username-hints">
            <p>Your username must be:</p>
            <ul>
              <li>At least 3 characters long</li>
              <li>Can contain letters, numbers, periods and underscores</li>
              <li>No spaces or special characters</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateUsername;
