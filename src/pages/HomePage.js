import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, BellIcon, MagnifyingGlassIcon, HomeIcon, UsersIcon, CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import CreatePostCard from '../components/CreatePostCard';
import PostCard from '../components/PostCard';
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';

const dummyPosts = [
  {
    id: 1,
    username: 'alex',
    url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80',
    type: 'image',
    caption: 'Beautiful day!',
  },
  {
    id: 2,
    username: 'jane',
    url: 'https://images.unsplash.com/photo-1518671788390-0d521fd5a9c8?auto=format&fit=crop&w=600&q=80',
    type: 'image',
    caption: 'Enjoying the sunset',
  },
];

const HomePage = () => {
  const [posts, setPosts] = useState(dummyPosts);

  /* --- Chat state --- */
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

  const toggleChatList = () => {
    setShowChatList((prev) => !prev);
    setActiveChat(null);
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleCloseChatList = () => setShowChatList(false);
  const handleBackToList = () => setActiveChat(null);

  const handleCreatePost = (newPost) => {
    // Add the new post at the top of the feed
    setPosts([newPost, ...posts]);
  };
  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="home-container">
        {/* Top Navigation */}
        <nav className="home-nav">
          <div className="nav-logo">Drifty</div>
          <div className="nav-icons">
            <MagnifyingGlassIcon className="nav-icon" />
            <BellIcon className="nav-icon" />
            <EnvelopeIcon className="nav-icon" onClick={toggleChatList} />
          </div>
        </nav>

        {/* Create Post Card */}
        <CreatePostCard onCreate={handleCreatePost} />

        {/* Feed List */}
        <div className="feed-list">
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav glass-card">
        <div className="bottom-item active">
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
        <div className="bottom-item disabled">
          <UserCircleIcon className="bottom-icon" />
          <span>Profile</span>
        </div>
      </nav>
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

export default HomePage;
