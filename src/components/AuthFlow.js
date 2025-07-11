import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OtpInput from 'react-otp-input';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { auth, RecaptchaVerifier } from '../firebase';
import { signInWithPhoneNumber } from 'firebase/auth';

// Country data with validation rules
const countryData = {
  IN: { code: 'IN', dialCode: '+91', name: 'India', pattern: /^\d{10}$/ },
  NG: { code: 'NG', dialCode: '+234', name: 'Nigeria', pattern: /^\d{10}$/ },
  ID: { code: 'ID', dialCode: '+62', name: 'Indonesia', pattern: /^\d{9,12}$/ },
  RU: { code: 'RU', dialCode: '+7', name: 'Russia', pattern: /^\d{10}$/ },
  GB: { code: 'GB', dialCode: '+44', name: 'UK', pattern: /^\d{10}$/ },
  US: { code: 'US', dialCode: '+1', name: 'US', pattern: /^\d{10}$/ },
  CA: { code: 'CA', dialCode: '+1', name: 'Canada', pattern: /^\d{10}$/ },
};

const countryOptions = Object.entries(countryData).map(([code, data]) => ({
  value: code,
  label: `${data.name} (${data.dialCode})`,
  ...data
}));

const AuthFlow = ({ onBack }) => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [country, setCountry] = useState('IN');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const recaptchaVerifier = useRef(null);
  const recaptchaWidgetId = useRef(null);
  
  const selectedCountry = useMemo(() => countryData[country], [country]);
  
  // Initialize reCAPTCHA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
      
      return () => {
        if (recaptchaVerifier.current) {
          recaptchaVerifier.current.clear();
        }
      };
    }
  }, []);
  
  // Resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);
  
  const handlePhoneChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
  };
  
  const getMaxLength = useMemo(() => {
    // Extract the exact length from pattern (e.g., 10 from /^\d{10}$/)
    const match = selectedCountry?.pattern.toString().match(/\d+/);
    return match ? parseInt(match[0], 10) : 10;
  }, [selectedCountry]);
  
  const isPhoneValid = useMemo(() => {
    return selectedCountry?.pattern.test(phone);
  }, [phone, selectedCountry]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    
    setIsLoading(true);
    
    try {
      const phoneNumber = `${selectedCountry.dialCode}${phone}`;
      
      // This will trigger the reCAPTCHA flow
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current
      );
      
      setConfirmationResult(confirmation);
      setStep('otp');
      setResendTimer(30); // 30 seconds cooldown for resend
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
      // User is signed in
      alert('Phone authentication successful!');
      // Here you would typically redirect to the app or update auth state
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    
    try {
      const phoneNumber = `${selectedCountry.dialCode}${phone}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current
      );
      
      setConfirmationResult(confirmation);
      setResendTimer(30);
      alert('New OTP sent successfully!');
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="auth-form"
          >
            <button onClick={onBack} className="back-button">
              <ArrowLeftIcon className="back-icon" />
            </button>
            <h2>Enter Your Phone Number</h2>
            <p className="subtitle">We'll send you a verification code</p>
            
            <form onSubmit={handlePhoneSubmit}>
              <div className="form-group">
                <label>Country</label>
                <select 
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPhone(''); // Reset phone when country changes
                  }}
                  className="country-select"
                  disabled={isLoading}
                >
                  {countryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <div className="phone-input-container">
                  <div className="country-code">
                    {selectedCountry.dialCode}
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder={`Enter ${selectedCountry.name} phone number`}
                    className="phone-input"
                    inputMode="numeric"
                    maxLength={getMaxLength}
                  />
                </div>
                <div className="phone-hint">
                  {!phone ? 'Enter your phone number' : 
                   !isPhoneValid ? `Please enter a valid ${selectedCountry.name} phone number` : 
                   'Looks good!'}
                </div>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={!isPhoneValid || isLoading}
              >
                {isLoading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="auth-form"
          >
            <button onClick={() => setStep('phone')} className="back-button">
              <ArrowLeftIcon className="back-icon" />
            </button>
            <h2>Enter Verification Code</h2>
            <p className="subtitle">We've sent a 6-digit code to {phone}</p>
            
            <form onSubmit={handleOtpSubmit}>
              <div className="otp-container">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  isInputNum
                  shouldAutoFocus
                  containerStyle="otp-input-container"
                  inputStyle="otp-input"
                  focusStyle="otp-input-focus"
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={otp.length !== 6 || isLoading}
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                    Verifying...
                  </>
                ) : 'Verify'}
              </button>
              
              <p className="resend-text">
                {resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  <>
                    Didn't receive a code?{' '}
                    <button 
                      type="button" 
                      className="resend-button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                    >
                      Resend
                    </button>
                  </>
                )}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthFlow;
