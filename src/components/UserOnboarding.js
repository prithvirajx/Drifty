import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UserOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    dob: null
  });
  const [dateError, setDateError] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    // Validate date when all fields are filled
    if (formData.day && formData.month && formData.year) {
      validateDate();
    } else {
      setDateError('');
    }
  }, [formData.day, formData.month, formData.year]);

  const validateDate = () => {
    const day = parseInt(formData.day, 10);
    const month = months.indexOf(formData.month) + 1;
    const year = parseInt(formData.year, 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      setDateError('Please enter a valid date');
      return false;
    }

    // Check if the date is valid
    const date = new Date(year, month - 1, day);
    const isValidDate = (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );

    if (!isValidDate) {
      setDateError('Please enter a valid date');
      return false;
    }

    // Check if the date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date > today) {
      setDateError('Date of birth cannot be in the future');
      return false;
    }

    setDateError('');
    setFormData(prev => ({
      ...prev,
      dob: date
    }));
    return true;
  };

  const genders = [
    { value: 'male', label: 'Male', icon: '♂' },
    { value: 'female', label: 'Female', icon: '♀' },
    { value: 'other', label: 'Other', icon: '⚧' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '?' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
    // Auto-advance to next step after selection
    setTimeout(() => setStep(3), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dob) {
      setDateError('Please enter a valid date of birth');
      return;
    }
    console.log('Form submitted:', formData);
    onComplete(formData);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="progress-steps">
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className={`step ${step === num ? 'active' : step > num ? 'completed' : ''}`}
            >
              <div className="step-number">{step > num ? '✓' : num}</div>
            </div>
          ))}
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="step-content"
          >
            {step === 1 && (
              <div className="form-group">
                <h2>What's your name?</h2>
                <p className="subtitle">We'll use this to personalize your experience</p>
                <div className="name-inputs">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="glass-input"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="glass-input"
                    required
                  />
                </div>
                <button 
                  onClick={nextStep} 
                  className="next-button"
                  disabled={!formData.firstName || !formData.lastName}
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="gender-selection">
                <h2>How do you identify?</h2>
                <p className="subtitle">Select your gender</p>
                <div className="gender-cards">
                  {genders.map((gender) => (
                    <motion.div
                      key={gender.value}
                      className={`gender-card ${formData.gender === gender.value ? 'selected' : ''}`}
                      onClick={() => handleGenderSelect(gender.value)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="gender-icon">{gender.icon}</div>
                      <div className="gender-label">{gender.label}</div>
                    </motion.div>
                  ))}
                </div>
                <button 
                  onClick={prevStep} 
                  className="back-button"
                >
                  Back
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="dob-selection">
                <h2>When's your birthday?</h2>
                <p className="subtitle">Your age helps us show you relevant content</p>
                <div className="date-picker-container">
                  <div className="date-inputs">
                    <div className="date-input-group">
                      <select
                        name="day"
                        value={formData.day}
                        onChange={handleInputChange}
                        className="glass-input date-input"
                        required
                      >
                        <option value="">Day</option>
                        {days.map(day => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <select
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                        className="glass-input date-input"
                        required
                      >
                        <option value="">Month</option>
                        {months.map(month => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="date-input-group">
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="glass-input date-input"
                        required
                      >
                        <option value="">Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {dateError && <div className="error-message">{dateError}</div>}
                </div>
                <div className="button-group">
                  <button 
                    onClick={prevStep} 
                    className="back-button"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    className="submit-button"
                    disabled={!formData.dob}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserOnboarding;
