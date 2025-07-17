import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lightbox } from "react-modal-image";
import { 
  FiHeart, 
  FiMessageSquare, 
  FiUser, 
  FiArrowLeft, 
  FiMoreHorizontal,
  FiClock,
  FiCalendar,
  FiVolume2,
  FiVolumeX
} from "react-icons/fi";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // Check if speech synthesis is supported
  useEffect(() => {
    if (!window.speechSynthesis) {
      setSpeechSupported(false);
    }
  }, []);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const { data: postData } = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(postData);

      const { data: commentsData } = await axios.get(
        `http://localhost:5000/api/comments/post/${id}`
      );
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  // Text-to-speech functionality
  const speakContent = () => {
    if (!speechSupported) {
      alert("Text-to-speech is not supported in your browser");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    
    // Find a natural-sounding voice if available
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Natural') || voice.name.includes('Female') || voice.name.includes('Male'))
    );
    
    if (preferredVoice) {
      speech.voice = preferredVoice;
    }
    
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    
    // Prepare the content to be read
    let contentToRead = `Post titled: ${post.title}. `;
    contentToRead += `Posted by ${post.user?.username || "Anonymous"} in ${post.category}. `;
    contentToRead += `Content: ${post.description}. `;
    
    if (comments.length > 0) {
      contentToRead += `There are ${comments.length} comments. `;
      comments.forEach((comment, index) => {
        contentToRead += `Comment ${index + 1} by ${comment.user?.username || "Anonymous"}: ${comment.text}. `;
      });
    } else {
      contentToRead += "There are no comments yet.";
    }
    
    speech.text = contentToRead;
    
    speech.onend = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  const handleLike = async () => {
    if (!token) {
      alert("You must be logged in to like posts");
      return;
    }
    
    setIsLiking(true);
    try {
      await axios.put(
        `http://localhost:5000/api/posts/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPostAndComments();
    } catch (err) {
      console.error("Failed to like:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to like the post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!token) {
      alert("You must be logged in to comment");
      return;
    }
    if (!commentText.trim()) {
      alert("Please write a comment first");
      return;
    }

    setIsCommenting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/comments",
        { text: commentText, post: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      setComments((prev) => [res.data.comment, ...prev]);
    } catch (err) {
      console.error("Failed to comment:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to send comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/posts");
    } catch (err) {
      console.error("Failed to delete post:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const toggleLightbox = () => {
    setLightboxOpen(!lightboxOpen);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading post details...</p>
    </div>
  );
  
  if (!post) return (
    <div className="not-found-container">
      <h1>Post Not Found</h1>
      <p>The requested post could not be loaded.</p>
      <div className="action-buttons">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back
        </button>
        <button onClick={() => navigate("/posts")} className="home-button">
          View All Posts
        </button>
      </div>
    </div>
  );

  return (
    <div className="post-details-container">
      {/* Lightbox for image */}
      {lightboxOpen && post.image?.url && (
        <Lightbox
          large={post.image.url}
          alt={post.title}
          onClose={toggleLightbox}
          hideDownload={true}
          hideZoom={true}
        />
      )}

      {/* Navigation */}
      <div className="post-navigation">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back
        </button>
        <div className="accessibility-controls">
          {speechSupported && (
            <button 
              onClick={speakContent} 
              className="speak-button"
              aria-label={isSpeaking ? "Stop reading" : "Read post content"}
            >
              {isSpeaking ? <FiVolumeX /> : <FiVolume2 />}
              <span>{isSpeaking ? "Stop" : "Listen"}</span>
            </button>
          )}
          {role === "admin" && (
            <button onClick={handleDeletePost} className="delete-button">
              <RiDeleteBinLine /> Delete Post
            </button>
          )}
        </div>
      </div>

      {/* Main Post Content */}
      <motion.article 
        className="post-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        aria-live="polite"
      >
        {/* Post Header with Creator Info */}
        <header className="post-header">
          <div 
            className="creator-info" 
            onClick={() => post.user?._id && navigate(`/profile/${post.user._id}`)}
            style={{ cursor: post.user?._id ? 'pointer' : 'default' }}
            tabIndex={0}
            role="button"
            aria-label={`View profile of ${post.user?.username || 'Anonymous'}`}
            onKeyPress={(e) => e.key === 'Enter' && post.user?._id && navigate(`/profile/${post.user._id}`)}
          >
            {post.user?.profilePicture ? (
              <img 
                src={post.user.profilePicture} 
                alt={post.user.username} 
                className="creator-avatar"
              />
            ) : (
              <div className="avatar-fallback">
                {post.user?.username ? post.user.username.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <div className="creator-details">
              <h4>{post.user?.username || "Anonymous"}</h4>
              <span className="post-time">
                <FiClock /> {formatTimeAgo(post.createdAt)}
              </span>
            </div>
          </div>
          <div className="post-category" aria-label={`Category: ${post.category}`}>
            {post.category}
          </div>
        </header>

        {/* Post Content */}
        <div className="post-content">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-description">{post.description}</p>
          
          {post.image?.url && (
            <div className="post-image-container">
              <img 
                src={post.image.url} 
                alt={post.title} 
                className="post-image"
                onClick={toggleLightbox}
                tabIndex={0}
                role="button"
                aria-label="Click to view full size image"
                onKeyPress={(e) => e.key === 'Enter' && toggleLightbox()}
              />
              <div className="image-hint">Click to view full size</div>
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="post-actions">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className={`like-button ${post.likes.includes(userId) ? 'liked' : ''}`}
            aria-label={post.likes.includes(userId) ? "Unlike this post" : "Like this post"}
          >
            {post.likes.includes(userId) ? (
              <FaHeart className="like-icon" />
            ) : (
              <FiHeart className="like-icon" />
            )}
            <span>{post.likes.length}</span>
          </button>
          
          <button 
            onClick={() => document.getElementById("comment-input")?.focus()} 
            className="comment-button"
            aria-label={`Comment on this post. ${comments.length} comments so far`}
          >
            <FaRegComment className="comment-icon" />
            <span>{comments.length}</span>
          </button>
        </div>

        {/* Post Details Section */}
        <div className="post-meta">
          <div className="meta-item">
            <FiCalendar className="meta-icon" />
            <span>Posted on {formatDate(post.createdAt)}</span>
          </div>
          {post.user?._id && (
            <button 
              onClick={() => navigate(`/profile/${post.user._id}`)} 
              className="view-profile-button"
              aria-label={`View profile of ${post.user.username}`}
            >
              <FiUser /> View Creator Profile
            </button>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3 className="comments-title">Comments ({comments.length})</h3>
          
          {/* Comment Form */}
          <div className="comment-form">
            <input
              id="comment-input"
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
              aria-label="Write a comment"
            />
            <button 
              onClick={handleComment} 
              disabled={isCommenting || !commentText.trim()}
              className="submit-comment"
              aria-label="Submit comment"
            >
              {isCommenting ? (
                <span className="comment-spinner"></span>
              ) : (
                <IoMdSend className="send-icon" />
              )}
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <div 
                      className="comment-author"
                      onClick={() => comment.user?._id && navigate(`/profile/${comment.user._id}`)}
                      style={{ cursor: comment.user?._id ? 'pointer' : 'default' }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View profile of ${comment.user?.username || 'Anonymous'}`}
                      onKeyPress={(e) => e.key === 'Enter' && comment.user?._id && navigate(`/profile/${comment.user._id}`)}
                    >
                      {comment.user?.profilePicture ? (
                        <img 
                          src={comment.user.profilePicture} 
                          alt={comment.user.username} 
                          className="comment-avatar"
                        />
                      ) : (
                        <div className="avatar-fallback small">
                          {comment.user?.username ? comment.user.username.charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}
                      <span>{comment.user?.username || "Anonymous"}</span>
                    </div>
                    <span className="comment-time">
                      <FiClock /> {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  {(role === "admin" || comment.user?._id === userId) && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)} 
                      className="delete-comment"
                      aria-label="Delete comment"
                    >
                      <RiDeleteBinLine />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-comments">
                <FiMessageSquare className="no-comments-icon" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </motion.article>

      {/* CSS Styles */}
      <style jsx>{`
        :root {
          --primary: #4361ee;
          --primary-dark: #3a0ca3;
          --secondary: #3f37c9;
          --accent: #4895ef;
          --danger: #f72585;
          --success: #4cc9f0;
          --light: #f8f9fa;
          --dark: #212529;
          --gray: #6c757d;
          --light-gray: #e9ecef;
          --white: #ffffff;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          --radius-sm: 4px;
          --radius-md: 8px;
          --radius-lg: 16px;
          --transition: all 0.3s ease;
        }

        /* Base Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: var(--dark);
          background-color: #f5f7ff;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          gap: 1.5rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(67, 97, 238, 0.2);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Not Found State */
        .not-found-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          text-align: center;
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .not-found-container h1 {
          color: var(--danger);
          margin-bottom: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        /* Main Container */
        .post-details-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        /* Navigation */
        .post-navigation {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          align-items: center;
        }

        .accessibility-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        /* Buttons */
        button {
          cursor: pointer;
          transition: var(--transition);
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .back-button {
          padding: 0.75rem 1.25rem;
          background: var(--primary);
          color: var(--white);
          border-radius: var(--radius-md);
          font-size: 1rem;
        }

        .back-button:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .delete-button {
          padding: 0.75rem 1.25rem;
          background: var(--danger);
          color: var(--white);
          border-radius: var(--radius-md);
          font-size: 1rem;
        }

        .delete-button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .speak-button {
          padding: 0.75rem 1.25rem;
          background: var(--accent);
          color: var(--white);
          border-radius: var(--radius-md);
          font-size: 1rem;
        }

        .speak-button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .home-button {
          padding: 0.75rem 1.25rem;
          background: var(--accent);
          color: var(--white);
          border-radius: var(--radius-md);
          font-size: 1rem;
        }

        .home-button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        /* Post Card */
        .post-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          transition: var(--transition);
        }

        .post-card:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        /* Post Header */
        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--light-gray);
        }

        .creator-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .creator-avatar, .avatar-fallback {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-fallback {
          background-color: var(--primary);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .avatar-fallback.small {
          width: 32px;
          height: 32px;
          font-size: 1rem;
        }

        .creator-details h4 {
          font-size: 1rem;
          color: var(--dark);
          margin-bottom: 0.25rem;
        }

        .post-time {
          font-size: 0.875rem;
          color: var(--gray);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .post-category {
          padding: 0.5rem 1rem;
          background: var(--light-gray);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--dark);
        }

        /* Post Content */
        .post-content {
          padding: 1.5rem;
        }

        .post-title {
          font-size: 1.75rem;
          margin-bottom: 1rem;
          color: var(--dark);
          line-height: 1.3;
        }

        .post-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--dark);
          margin-bottom: 1.5rem;
        }

        .post-image-container {
          margin: 1.5rem 0;
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          max-height: 500px;
          object-fit: contain;
          border-radius: var(--radius-md);
          cursor: zoom-in;
          transition: var(--transition);
          background: var(--light-gray);
        }

        .post-image:hover {
          transform: scale(1.01);
        }

        .image-hint {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: var(--white);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          opacity: 0;
          transition: var(--transition);
        }

        .post-image-container:hover .image-hint {
          opacity: 1;
        }

        /* Post Actions */
        .post-actions {
          display: flex;
          gap: 1rem;
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid var(--light-gray);
        }

        .like-button, .comment-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--light);
          border-radius: var(--radius-md);
          font-size: 1rem;
          color: var(--dark);
        }

        .like-button:hover, .comment-button:hover {
          background: var(--light-gray);
        }

        .like-button.liked {
          color: var(--danger);
        }

        .like-icon, .comment-icon {
          font-size: 1.25rem;
        }

        /* Post Meta */
        .post-meta {
          padding: 1.5rem;
          border-bottom: 1px solid var(--light-gray);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gray);
          font-size: 0.875rem;
        }

        .meta-icon {
          font-size: 1rem;
        }

        .view-profile-button {
          padding: 0.75rem 1.25rem;
          background: var(--light);
          border-radius: var(--radius-md);
          color: var(--dark);
          width: 100%;
          justify-content: center;
        }

        .view-profile-button:hover {
          background: var(--light-gray);
        }

        /* Comments Section */
        .comments-section {
          padding: 1.5rem;
        }

        .comments-title {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: var(--dark);
        }

        /* Comment Form */
        .comment-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .comment-input {
          flex: 1;
          padding: 1rem;
          border: 1px solid var(--light-gray);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: var(--transition);
        }

        .comment-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
        }

        .submit-comment {
          padding: 0 1.5rem;
          background: var(--primary);
          color: var(--white);
          border-radius: var(--radius-md);
          font-size: 1rem;
          min-width: 100px;
        }

        .submit-comment:hover:not(:disabled) {
          background: var(--primary-dark);
        }

        .submit-comment:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .send-icon {
          font-size: 1.25rem;
        }

        .comment-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: var(--white);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Comments List */
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .comment-item {
          position: relative;
          padding: 1rem;
          background: var(--light);
          border-radius: var(--radius-md);
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .comment-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .comment-time {
          font-size: 0.875rem;
          color: var(--gray);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .comment-text {
          color: var(--dark);
          line-height: 1.6;
        }

        .delete-comment {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          color: var(--gray);
          font-size: 1rem;
          padding: 0.25rem;
        }

        .delete-comment:hover {
          color: var(--danger);
        }

        /* No Comments */
        .no-comments {
          text-align: center;
          padding: 2rem;
          color: var(--gray);
        }

        .no-comments-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--light-gray);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .post-details-container {
            padding: 1rem;
          }

          .post-title {
            font-size: 1.5rem;
          }

          .post-header, .post-content, .post-actions, .post-meta, .comments-section {
            padding: 1rem;
          }

          .comment-form {
            flex-direction: column;
          }

          .submit-comment {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .post-navigation {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .accessibility-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}

export default PostDetails;