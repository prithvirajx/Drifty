import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

const CreatePostCard = ({ onCreate }) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    const newPost = {
      id: Date.now(),
      username: 'you', // Placeholder; replace with actual username
      url: previewUrl,
      type: file.type.startsWith('video') ? 'video' : 'image',
      caption,
    };

    onCreate(newPost);
    // Reset
    setCaption('');
    setFile(null);
    setPreviewUrl('');
  };

  return (
    <motion.div 
      className="create-post-card glass-card" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="create-post-top">
          <input 
            type="file" 
            accept="image/*,video/*" 
            id="fileInput" 
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="upload-btn">
            {file ? 'Change Media' : 'Add Photo/Video'}
          </label>
          <input 
            type="text" 
            placeholder="Write a caption..." 
            value={caption}
            className="caption-input" 
            onChange={(e) => setCaption(e.target.value)}
          />
          <button type="submit" className="post-btn" disabled={!file}>
            Post
          </button>
        </div>
        {previewUrl && (
          <div className="preview-wrapper">
            {file.type.startsWith('video') ? (
              <video src={previewUrl} controls muted loop playsInline />
            ) : (
              <img src={previewUrl} alt="preview" />
            )}
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default CreatePostCard;
