import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, BellIcon, MagnifyingGlassIcon, HomeIcon, UsersIcon, CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import NotificationPopup from '../components/NotificationPopup';
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';

const HangoutPage = ({ onNavigate }) => {
  /* --- Reuse chat/notification logic for consistency (copied from HomePage) --- */
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

  /* --- Notification click outside handler --- */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  function handleClickOutside(event) {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      const bellIcon = document.querySelector('.nav-icon[data-component-name="BellIcon"]');
      if (bellIcon && !bellIcon.contains(event.target)) {
        setShowNotifications(false);
      }
    }
  }

  /* --- Handlers --- */
  const toggleChatList = () => {
    setShowChatList((prev) => !prev);
    setActiveChat(null);
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleBackToList = () => setActiveChat(null);
  const handleCloseChatList = () => setShowChatList(false);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  /* --- State --- */
  const [isAvailable, setIsAvailable] = useState(false);
  
  // Mock user data for profiles
  const mockProfiles = [
    { id: 1, name: 'Alex Johnson', age: 28, distance: 2.5, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Sarah Williams', age: 25, distance: 1.2, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Michael Chen', age: 31, distance: 3.7, avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: 4, name: 'Emma Davis', age: 26, distance: 0.8, avatar: 'https://randomuser.me/api/portraits/women/63.jpg' },
    { id: 5, name: 'James Wilson', age: 29, distance: 2.1, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { id: 6, name: 'Olivia Brown', age: 27, distance: 1.9, avatar: 'https://randomuser.me/api/portraits/women/28.jpg' }
  ];

  return (
    <div className="hangout-page">
      <div className="home-container">
        {/* Top Navigation */}
        <nav className="home-nav">
          <div className="nav-logo" onClick={() => onNavigate('home')}>Drifty</div>
          <div className="nav-icons">
            <MagnifyingGlassIcon className="nav-icon" />
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <BellIcon
                className="nav-icon"
                onClick={toggleNotifications}
                data-component-name="BellIcon"
              />
              <NotificationPopup isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
            </div>
            <EnvelopeIcon className="nav-icon" onClick={toggleChatList} />
          </div>
        </nav>

        {/* Main Content */}
        <motion.div
          className="hangout-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Availability Toggle Card */}
          <motion.div 
            className={`availability-card glass-card ${isAvailable ? 'available' : 'unavailable'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="availability-header">
              <h3>Hangout Available</h3>
              <div 
                className={`availability-toggle ${isAvailable ? 'on' : 'off'}`}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                <div className="toggle-handle">
                  {isAvailable ? (
                    <CheckIcon className="toggle-icon" />
                  ) : (
                    <XMarkIcon className="toggle-icon" />
                  )}
                </div>
                <span className="toggle-text">
                  {isAvailable ? 'I\'m Available' : 'Not Available'}
                </span>
              </div>
            </div>
            <p className="availability-hint">
              {isAvailable 
                ? 'You\'re visible to others nearby' 
                : 'You won\'t appear in search results'}
            </p>
          </motion.div>

          {/* Profiles Grid */}
          <div className="profiles-grid">
            {mockProfiles.map((profile) => (
              <motion.div 
                key={profile.id}
                className="profile-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (profile.id % 3) }}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
              >
                <div className="profile-avatar">
                  <img src={profile.avatar} alt={profile.name} />
                  <div className="profile-status"></div>
                  <div className="profile-info-tape">
                    <h3>{profile.name}</h3>
                    <div className="profile-meta">
                      <span>{profile.age} years</span>
                      <span className="divider">•</span>
                      <span>{profile.distance} km away</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation - identical layout */}
      {!activeChat && (
        <nav className="bottom-nav glass-card">
          <div className="bottom-item" onClick={() => onNavigate('home')}>
            <HomeIcon className="bottom-icon" />
            <span>Feed</span>
          </div>
          <div className="bottom-item active">
            <UsersIcon className="bottom-icon" />
            <span>Hangout</span>
          </div>
          <div className="bottom-item disabled">
            <CalendarDaysIcon className="bottom-icon" />
            <span>Events</span>
          </div>
          <div className="bottom-item" onClick={() => onNavigate('profile')}>
            <UserCircleIcon className="bottom-icon" />
            <span>Profile</span>
          </div>
        </nav>
      )}

      {/* Chat components */}
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
    </div>
  );
};

export default HangoutPage;
