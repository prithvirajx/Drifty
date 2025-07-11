import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

const CreatePostCard = ({ onCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [posting, setPosting] = useState(false);
  const [postBtnAnim, setPostBtnAnim] = useState(false);
  const fileInputRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    setPostBtnAnim(true);
    setPosting(true);
    // Animate out post button, then close modal
    setTimeout(() => {
      setIsModalOpen(false);
      setPostBtnAnim(false);
      // Simulate posting delay
      setTimeout(() => {
        const newPost = {
          id: Date.now(),
          username: 'you',
          url: previewUrl,
          type: file.type.startsWith('video') ? 'video' : 'image',
          caption,
        };
        onCreate(newPost);
        setCaption('');
        setFile(null);
        setPreviewUrl('');
        setPosting(false);
      }, 1500);
    }, 400);
  };

  return (
    <>
      <motion.div 
        className="create-post-card glass-card" 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="create-post-top">
          <button 
            className="upload-btn" 
            onClick={handleOpenModal}
            disabled={posting}
            style={{ position: 'relative', minWidth: 120 }}
          >
            {posting ? (
              <motion.span
                key="posting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span className="posting-dot" /> Posting...
              </motion.span>
            ) : (
              <motion.span
                key="create"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                Create Post
              </motion.span>
            )}
          </button>
        </div>
      </motion.div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.button
              type="button"
              className="modal-close-btn"
              aria-label="Close"
              onClick={() => setIsModalOpen(false)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="10" fill="rgba(255,0,51,0.12)"/>
                <path d="M7 7L15 15M15 7L7 15" stroke="#ff0033" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </motion.button>
            <form onSubmit={handleSubmit} className="modal-form">
              <textarea
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="modal-caption-input"
              />
              <div className="media-preview-outer">
                <div className="media-preview-3by4">
                  {previewUrl ? (
                    file.type.startsWith('video') ? (
                      <video src={previewUrl} controls className="media-preview-media" />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="media-preview-media" />
                    )
                  ) : (
                    <div className="media-upload-placeholder">
                      <label htmlFor="modalFileInput" className="media-upload-btn">
                        Add Photo/Video
                      </label>
                      <input
                        type="file"
                        id="modalFileInput"
                        ref={fileInputRef}
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <motion.button
                  type="submit"
                  className="post-btn"
                  disabled={posting}
                  initial={false}
                  animate={postBtnAnim ? { opacity: 0, scale: 0.7, y: 20 } : { opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  Post
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CreatePostCard;
