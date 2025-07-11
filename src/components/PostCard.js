import React from 'react';
import { HeartIcon, ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
  return (
    <motion.div 
      className="post-card glass-card" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="post-header">
        <div className="post-user-info">
          <div className="avatar-placeholder" />
          <span className="username">{post.username || 'username'}</span>
        </div>
        <span className="more-dots">•••</span>
      </div>

      {/* Media */}
      <div className="post-media">
        {post.type === 'video' ? (
          <video src={post.url} controls muted loop playsInline />
        ) : (
          <img src={post.url} alt={post.caption} />
        )}
      </div>

      {/* Actions */}
      <div className="post-actions">
        <HeartIcon className="action-icon" />
        <ChatBubbleLeftIcon className="action-icon" />
        <PaperAirplaneIcon className="action-icon rotate-45" />
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="post-caption">
          <span className="username">{post.username || 'username'}</span>
          <span> {post.caption}</span>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;
