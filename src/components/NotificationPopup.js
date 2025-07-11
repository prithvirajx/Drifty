import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPopup = ({ isOpen, onClose }) => {
  // Mock notification data with profile photos
  const notifications = [
    {
      id: 1,
      type: 'friend_request',
      user: 'Shrishti Raj',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'hangout_request',
      user: 'Drishti Raj',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      time: '10 min ago',
      read: false
    },
    {
      id: 3,
      type: 'event_invite',
      user: 'Raj Paswan',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      event: 'House Party',
      time: '1 hour ago',
      read: false
    },
    {
      id: 4,
      type: 'comment',
      user: 'Rohit',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      time: '3 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'like',
      user: 'Aarav Mishra',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      time: '5 hours ago',
      read: true
    }
  ];

  const renderNotificationContent = (notification) => {
    const getActionText = () => {
      switch(notification.type) {
        case 'friend_request': return 'sent you a friend request';
        case 'hangout_request': return 'sent you a hangout request';
        case 'event_invite': return `invited you to ${notification.event}`;
        case 'comment': return 'commented on your post';
        case 'like': return 'liked your post';
        default: return '';
      }
    };

    return (
      <div className="notification-content">
        <div className="notification-header-content">
          <img 
            src={notification.avatar} 
            alt={notification.user} 
            className="notification-avatar"
          />
          <div className="notification-text">
            <p className="notification-message">
              <strong>{notification.user}</strong> {getActionText()}
            </p>
            <span className="notification-time">{notification.time}</span>
          </div>
        </div>
        {(notification.type === 'friend_request' || 
          notification.type === 'hangout_request' || 
          notification.type === 'event_invite') && (
          <div className="notification-actions">
            <button className="btn-accept">
              {notification.type === 'event_invite' ? 'Join' : 'Accept'}
            </button>
            <button className="btn-reject">Reject</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="notification-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1000,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
          />
          <motion.div 
            className="notification-popup"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              mass: 0.8,
              delay: 0.05
            }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              <button onClick={onClose} className="close-btn">×</button>
            </div>
            <div className="notification-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  {renderNotificationContent(notification)}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
