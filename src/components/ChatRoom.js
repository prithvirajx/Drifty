import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { VideoCameraIcon, PhoneIcon, EllipsisHorizontalIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatRoom = ({ chat, onBack }) => {
  const [messages, setMessages] = useState(chat.messages || []);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), from: 'me', text: input.trim() };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <motion.div
      className="chat-room-panel glass-card h-screen w-screen"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    >
      <div className="chat-room-header flex justify-between items-center">
        <div className="chat-header-left flex items-center">
          <ArrowLeftIcon className="chat-back-icon" onClick={onBack} />
          <div className="chat-room-user flex items-center">
            <img alt={chat.username} className="chat-avatar" src={chat.avatar} />
            <span className="chat-username">{chat.username}</span>
          </div>
        </div>
        <div className="chat-room-actions flex">
          <VideoCameraIcon className="chat-action-icon" />
          <PhoneIcon className="chat-action-icon" />
          <EllipsisHorizontalIcon className="chat-action-icon" />
        </div>
      </div>

      <div className="chat-room-messages flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.from === 'me' ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <PaperAirplaneIcon className="send-icon" onClick={handleSend} />
      </div>
    </motion.div>
  );
};

export default ChatRoom;
