import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ChatList = ({ chats, onSelectChat, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="chat-list-panel glass-card full-screen"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    >
      <div className="chat-list-header">
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8 }}>
          <ArrowLeftIcon className="chat-close-icon" onClick={onClose} style={{ flexShrink: 0 }} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats"
            className="chat-search-input"
            style={{ flex: 1 }}
          />
        </div>
      </div>
      <div className="chat-items">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => onSelectChat(chat)}
          >
            <img src={chat.avatar} alt={chat.username} className="chat-avatar" />
            <div className="chat-info">
              <span className="chat-username">{chat.username}</span>
              <span className="chat-last-message">{chat.lastMessage}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatList;
