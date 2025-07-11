import React, { useState, useEffect, useRef } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, testFirebaseConnection } from '../firebase';

// Country data with dial codes
const countryData = {
  IN: { code: 'IN', dialCode: '+91', name: 'India' },
  ID: { code: 'ID', dialCode: '+62', name: 'Indonesia' },
  JP: { code: 'JP', dialCode: '+81', name: 'Japan' },
  GB: { code: 'GB', dialCode: '+44', name: 'UK' },
  US: { code: 'US', dialCode: '+1', name: 'USA' },
  CA: { code: 'CA', dialCode: '+1', name: 'Canada' },
  RU: { code: 'RU', dialCode: '+7', name: 'Russia' },
  NG: { code: 'NG', dialCode: '+234', name: 'Nigeria' },
};

const DevAuthFlow = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);
  const [country, setCountry] = useState('IN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifier = useRef(null);

  const selectedCountry = countryData[country];

  // Initialize reCAPTCHA and test Firebase connection
  useEffect(() => {
    console.log('Initializing reCAPTCHA...');
    
    // Test Firebase connection first
    testFirebaseConnection()
      .then(result => console.log('Firebase test:', result))
      .catch(error => console.error('Firebase test failed:', error));
    
    try {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
      console.log('reCAPTCHA initialized successfully');
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      setError('Failed to initialize security check. Please refresh the page.');
    }

    return () => {
      if (recaptchaVerifier.current) {
        console.log('Cleaning up reCAPTCHA');
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const phoneNumber = `${selectedCountry.dialCode}${phone}`;
      console.log('Attempting to send OTP to:', phoneNumber);
      
      try {
        console.log('Calling signInWithPhoneNumber...');
        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier.current
        );
        
        console.log('OTP sent successfully');
        setConfirmationResult(confirmation);
        setStep('otp');
      } catch (signInError) {
        console.error('Detailed error during signInWithPhoneNumber:', {
          code: signInError.code,
          message: signInError.message,
          fullError: signInError
        });
        
        if (signInError.code === 'auth/invalid-phone-number') {
          setError('Invalid phone number format. Please check and try again.');
        } else if (signInError.code === 'auth/too-many-requests') {
          setError('Too many attempts. Please try again later.');
        } else {
          setError(`Failed to send OTP: ${signInError.message}`);
        }
      }
    } catch (err) {
      console.error('Unexpected error in handlePhoneSubmit:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);
    
    // Auto-focus to next input if a digit was entered
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const userCredential = await confirmationResult.confirm(otpString);
      // Sign in successful - call onSuccess to trigger onboarding
      console.log('Phone authentication successful', userCredential);
      if (onSuccess) {
        onSuccess(userCredential.user);
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneForm = () => (
    <form onSubmit={handlePhoneSubmit}>
      <div className="form-group">
        <div className="phone-input-container">
          <select 
            className="country-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {Object.entries(countryData).map(([code, data]) => (
              <option key={code} value={code}>
                {data.name} ({data.dialCode})
              </option>
            ))}
          </select>
          <div className="phone-input">
            <span className="dial-code">{selectedCountry.dialCode}</span>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
        </div>
      </div>
      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send OTP'}
      </button>
      {error && <div className="error-message">{error}</div>}
      <div id="recaptcha-container"></div>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit}>
      <div className="form-group">
        <label>Enter 6-digit OTP</label>
        <div className="otp-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpInputs.current[index] = el)}
              type="number"
              inputMode="numeric"
              className="otp-input"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              autoFocus={index === 0}
              required
            />
          ))}
        </div>
      </div>
      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
      <p className="resend-otp" onClick={() => setStep('phone')}>
        Change phone number
      </p>
      {error && <div className="error-message">{error}</div>}
    </form>
  );

  return (
    <div className="auth-container">
      <h2>{step === 'phone' ? 'Login with Phone' : 'Verify OTP'}</h2>
      {step === 'phone' ? renderPhoneForm() : renderOtpForm()}
    </div>
  );
};

export default DevAuthFlow;
