import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, BellIcon, MagnifyingGlassIcon, HomeIcon, UsersIcon, CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import NotificationPopup from '../components/NotificationPopup';
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';

// Mock data for the profile - replace with actual data from props or state
const userProfile = {
  username: 'Alex',
  profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  lookingFor: 'Friends & Fun',
  bio: 'Just a friendly neighborhood human navigating the cosmos. Lover of spicy food, 80s synth-pop, and rainy days. Let\'s connect!',
  work: 'Software Engineer @ TechCorp',
  age: 28,
  height: "5'11\"",
  gender: 'Male',
  interests: ['Photography', 'Hiking', 'Gaming', 'Sci-Fi Movies', 'Cooking'],
  location: 'San Francisco, CA',
  gallery: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
  ],
};

const ProfilePage = ({ onNavigate }) => {
  // --- Copied from HomePage for identical nav, notification, and chat logic ---
  const dummyChats = [
    {
      id: 1,
      username: 'alex',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Hey there!',
      messages: [{ id: 101, from: 'alex', text: 'Hey there!' }],
    },
    {
      id: 2,
      username: 'jane',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'Hello!',
      messages: [{ id: 102, from: 'jane', text: 'Hello!' }],
    },
  ];
  const [showChatList, setShowChatList] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const toggleChatList = () => {
    setShowChatList((prev) => !prev);
    setActiveChat(null);
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleCloseChatList = () => setShowChatList(false);
  const handleBackToList = () => setActiveChat(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        // Check if the click was on the bell icon
        const bellIcon = document.querySelector('.nav-icon[data-component-name="BellIcon"]');
        if (bellIcon && !bellIcon.contains(event.target)) {
          setShowNotifications(false);
        }
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="home-container">
        <nav className="home-nav">
          <div className="nav-logo">Drifty</div>
          <div className="nav-icons">
            <MagnifyingGlassIcon className="nav-icon" />
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <BellIcon 
                className="nav-icon" 
                onClick={toggleNotifications}
                data-component-name="BellIcon"
              />
              <NotificationPopup 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>
            <EnvelopeIcon className="nav-icon" onClick={toggleChatList} />
          </div>
        </nav>

        <motion.div
          className="profile-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="profile-header">
            <img src={userProfile.profilePicture} alt={userProfile.username} className="profile-picture" />
            <div className="profile-header-info">
              <h2>{userProfile.username}</h2>
              <p>{userProfile.lookingFor}</p>
            </div>
          </div>

          <div className="profile-body">
            {/* About Me Section */}
            <div className="profile-section">
              <h3>About Me</h3>
              <p>{userProfile.bio}</p>
            </div>

            {/* Details Section */}
            <div className="profile-section">
              <h3>Details</h3>
              <div className="details-grid">
                <div className="detail-item"><span>Work</span><p>{userProfile.work}</p></div>
                <div className="detail-item"><span>Age</span><p>{userProfile.age}</p></div>
                <div className="detail-item"><span>Height</span><p>{userProfile.height}</p></div>
                <div className="detail-item"><span>Gender</span><p>{userProfile.gender}</p></div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="profile-section">
              <h3>Interests</h3>
              <div className="interests-container">
                {userProfile.interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    className="interest-tag"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {interest}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="profile-section">
              <h3>Location</h3>
              <p>{userProfile.location}</p>
            </div>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <div className="profile-gallery">
          <h3>Gallery</h3>
          <motion.div className="gallery-grid">
            {userProfile.gallery.map((photo, index) => (
              <motion.div
                key={index}
                className="gallery-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 1 }}
              >
                <img src={photo} alt={`Gallery item ${index + 1}`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation (hide when chat room is open) */}
      {!activeChat && (
        <nav className="bottom-nav glass-card">
          <div className="bottom-item" onClick={() => onNavigate('home')}>
            <HomeIcon className="bottom-icon" />
            <span>Feed</span>
          </div>
          <div className="bottom-item disabled">
            <UsersIcon className="bottom-icon" />
            <span>Hangout</span>
          </div>
          <div className="bottom-item disabled">
            <CalendarDaysIcon className="bottom-icon" />
            <span>Event</span>
          </div>
          <div className="bottom-item active">
            <UserCircleIcon className="bottom-icon" />
            <span>Profile</span>
          </div>
        </nav>
      )}
      <AnimatePresence>
        {showChatList && !activeChat && (
          <ChatList
            key="chatlist"
            chats={dummyChats}
            onSelectChat={handleSelectChat}
            onClose={handleCloseChatList}
          />
        )}
        {activeChat && (
          <ChatRoom
            key="chatroom"
            chat={activeChat}
            onBack={handleBackToList}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;
