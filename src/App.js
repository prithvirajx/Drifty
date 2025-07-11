import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import AuthFlow from './components/DevAuthFlow';
import UserOnboarding from './components/UserOnboarding';
import CreateUsername from './components/CreateUsername';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { getUserProfile, saveUserProfile, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Persist authentication state across refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAuthUser(firebaseUser);
        getUserProfile(firebaseUser.uid)
          .then((profile) => {
            if (profile) {
              setUserData(profile);
              if (profile.username) {
                setHasCompletedOnboarding(true);
              }
            }
            setIsAuthenticated(true);
          })
          .catch((err) => {
            console.error('Error fetching profile on refresh:', err);
            setIsAuthenticated(true);
          });
      } else {
        // No user signed in
        setIsAuthenticated(false);
        setUserData(null);
        setHasCompletedOnboarding(false);
        setAuthUser(null);
      }
    });
    return unsubscribe;
  }, []);
  
  // Placeholder images - replace with your actual images
  const images = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (isAuthenticated && hasCompletedOnboarding) {
      if (currentPage === 'profile') {
        return <ProfilePage userData={userData} onNavigate={handleNavigate} />;
      }
      return <HomePage userData={userData} onNavigate={handleNavigate} />;
    }
    
    if (isAuthenticated) {
      if (!userData) {
        return (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UserOnboarding 
              onComplete={(data) => {
                console.log('Profile data:', data);
                setUserData(data);
                if (authUser) {
                  saveUserProfile(authUser.uid, data);
                }
              }} 
            />
          </motion.div>
        );
      } else if (!userData.username) {
        return (
          <motion.div
            key="username"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CreateUsername 
              userData={userData}
              onComplete={(data) => {
                console.log('Username creation complete:', data);
                // Update user data and mark onboarding as complete
                setUserData(prevData => ({
                  ...prevData,
                  username: data.username
                }));
                if (authUser) {
                  saveUserProfile(authUser.uid, { username: data.username });
                }
                // Add a small delay to ensure state updates before redirect
                setTimeout(() => {
                  setHasCompletedOnboarding(true);
                }, 100);
              }}
              onBack={() => {
                // Clear the username but keep other user data
                setUserData(prevData => {
                  const { username, ...rest } = prevData || {};
                  return rest;
                });
              }}
            />
          </motion.div>
        );
      } else {
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="onboarding-container">
              <div className="onboarding-card">
                <h2>Welcome to Drifty, @{userData.username}!</h2>
                <p>Your profile is all set up and ready to go.</p>
                <button 
                  className="next-button" 
                  style={{ marginTop: '20px' }}
                  onClick={() => setHasCompletedOnboarding(true)}
                >
                  Continue to App
                </button>
              </div>
            </div>
          </motion.div>
        );
      }
    }
    
    // Show auth or landing page
    if (!showAuth) {
      return (
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="content"
        >
            <div className="title-container">
              <h1 className="app-title">Drifty</h1>
              <div className="title-underline"></div>
            </div>
            <div className="swiper-container">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination',
                  type: 'bullets',
                }}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="mySwiper"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="slide-content">
                      <img 
                        src={image} 
                        alt={`Slide ${index + 1}`} 
                        className="slide-image"
                      />
                    </div>
                  </SwiperSlide>
                ))}
                <div className="swiper-pagination"></div>
              </Swiper>
            </div>
            
            <motion.button 
              className={`join-button ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setShowAuth(true)}
              whileTap={{ scale: 0.95 }}
            >
              <span>Join Now</span>
              <ArrowRightIcon className={`icon ${isHovered ? 'animate' : ''}`} />
            </motion.button>
        </motion.div>
      );
    }
    
    // Show auth flow
    return (
      <motion.div
        key="auth"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="auth-wrapper"
      >
        <AuthFlow 
          onBack={() => setShowAuth(false)}
          onSuccess={(firebaseUser) => {
            setShowAuth(false);
            setAuthUser(firebaseUser);
            // Fetch profile from Firestore
            getUserProfile(firebaseUser.uid)
              .then((profile) => {
                if (profile) {
                  setUserData(profile);
                  if (profile.username) {
                    setHasCompletedOnboarding(true);
                  }
                }
                setIsAuthenticated(true);
              })
              .catch((err) => {
                console.error('Error fetching profile:', err);
                setIsAuthenticated(true);
              });
          }} 
        />
      </motion.div>
    );
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}

export default App;
