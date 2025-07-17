import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  AiOutlineHome, AiOutlineLike, AiFillLike, AiOutlineSound, 
  AiOutlineFilter, AiOutlineFontSize, AiOutlineEye
} from "react-icons/ai";
import { FaHandsHelping, FaWheelchair, FaBuilding, FaCommentAlt, FaRegLightbulb } from "react-icons/fa";
import { RiDeleteBinLine, RiUserVoiceFill } from "react-icons/ri";
import { MdHighQuality, MdAccessibility } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";

// Styled Components
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 111, 165, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(74, 111, 165, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 111, 165, 0); }
`;

const Container = styled.div`
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.text};
  min-height: 100vh;
  font-size: ${props => props.theme.fontSize};
  transition: ${props => props.theme.transition};
  padding-bottom: 60px;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  color: white;
  padding: 15px 20px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccessibilityPanel = styled.div`
  background-color: ${props => props.isHighContrast ? props.theme.cardBg : 'rgba(255,255,255,0.9)'};
  padding: 12px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.border};
  backdrop-filter: blur(5px);
`;

const PostCard = styled(motion.article)`
  background-color: ${props => props.theme.cardBg};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 24px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.border};
  transition: ${props => props.theme.transition};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const SpeechIndicator = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background-color: ${props => props.theme.error};
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
`;

const FloatingActionButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadow};
  z-index: 100;
  font-size: 1.5em;
`;

const CategoryChip = styled(motion.button)`
  padding: 10px 15px;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: ${props => props.theme.transition};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.border};
  }
`;

const CommentInput = styled(motion.input)`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 24px;
  background: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontSize};
  outline: none;
  transition: ${props => props.theme.transition};
  
  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }
`;

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [filterCategory, setFilterCategory] = useState("");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [announceMessage, setAnnounceMessage] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechPost, setCurrentSpeechPost] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const navigate = useNavigate();
  const postsContainerRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // Theme configuration
  const theme = {
    bg: isHighContrast ? '#121212' : '#f5f7fa',
    text: isHighContrast ? '#ffffff' : '#2d3748',
    primary: isHighContrast ? '#bb86fc' : '#4a6fa5',
    secondary: isHighContrast ? '#03dac6' : '#4a8c7a',
    danger: isHighContrast ? '#cf6679' : '#c44545',
    cardBg: isHighContrast ? '#1e1e1e' : '#ffffff',
    border: isHighContrast ? '#bb86fc' : '#e2e8f0',
    fontSize: `${fontSize}px`,
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    borderRadius: '12px',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    success: isHighContrast ? '#4caf50' : '#38a169',
    warning: isHighContrast ? '#ff9800' : '#ed8936',
    info: isHighContrast ? '#2196f3' : '#4299e1',
    error: isHighContrast ? '#f44336' : '#e53e3e'
  };

  // Speech synthesis functions
  const speakText = (text, postId = null) => {
    if (!speechSynthesisRef.current) {
      showNotification("Text-to-speech not supported in your browser", "warning");
      return;
    }

    speechSynthesisRef.current.cancel();
    
    if (postId === currentSpeechPost && isSpeaking) {
      setIsSpeaking(false);
      setCurrentSpeechPost(null);
      announce("Speech stopped");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeechPost(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeechPost(null);
      showNotification("Error with text-to-speech", "error");
    };

    speechSynthesisRef.current.speak(utterance);
    setIsSpeaking(true);
    setCurrentSpeechPost(postId);
    announce("Reading post content");
  };

  const stopSpeech = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setCurrentSpeechPost(null);
      announce("Speech stopped");
    }
  };

  // Data fetching
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      announce(`${res.data.length} posts loaded`);

      const commentsData = await Promise.all(
        res.data.map(async (post) => {
          try {
            const resComments = await axios.get(
              `http://localhost:5000/api/comments/post/${post._id}`
            );
            return { postId: post._id, comments: resComments.data };
          } catch (err) {
            return { postId: post._id, comments: [] };
          }
        })
      );

      const commentsMap = {};
      commentsData.forEach(({ postId, comments }) => {
        commentsMap[postId] = comments;
      });
      setComments(commentsMap);
    } catch (error) {
      announce("Error loading posts");
      showNotification("Failed to load posts", "error");
    }
  };

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    fetchPosts();
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Post interaction handlers
  const handleLike = async (postId) => {
    if (!token) {
      showNotification("Please login to like posts", "warning");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/posts/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
      announce("Post liked");
      showNotification("Post liked!", "success");
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to like the post", "error");
    }
  };

  const handleComment = async (postId) => {
    if (!token) {
      showNotification("Please login to comment", "warning");
      return;
    }
    const comment = commentText[postId];
    if (!comment?.trim()) {
      showNotification("Please write a comment first", "warning");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/comments",
        { text: comment, post: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentText(prev => ({ ...prev, [postId]: "" }));
      setComments(prev => ({
        ...prev,
        [postId]: [res.data.comment, ...(prev[postId] || [])]
      }));

      announce("Comment added");
      showNotification("Comment posted!", "success");
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to send comment", "error");
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      announce("Post deleted");
      showNotification("Post deleted successfully", "success");
      fetchPosts();
      setShowDeleteConfirm(null);
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to delete post", "error");
      setShowDeleteConfirm(null);
    }
  };

  // UI helpers
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    announce("Scrolled to top");
  };

  const toggleComments = (postId) => {
    setActivePost(activePost === postId ? null : postId);
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const announce = (message) => {
    setAnnounceMessage(message);
    setTimeout(() => setAnnounceMessage(""), 1000);
  };

  const filterOptions = [
    { value: "", label: "All", icon: <AiOutlineHome /> },
    { value: "volunteer", label: "Volunteer", icon: <FaHandsHelping /> },
    { value: "disabled", label: "Disabled", icon: <FaWheelchair /> },
    { value: "organization", label: "Organization", icon: <FaBuilding /> },
  ];

  const filteredPosts = filterCategory
    ? posts.filter(post => post.category === filterCategory)
    : posts;

  return (
    <Container theme={theme}>
      {/* Screen Reader Announcements */}
      <div aria-live="polite" className="sr-only">
        {announceMessage}
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          className="notification"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          style={{
            background: theme[notification.type],
            color: 'white'
          }}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <motion.div 
          className="confirmation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <motion.div
            className="confirmation-dialog"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{
              backgroundColor: theme.cardBg,
              padding: '25px',
              borderRadius: theme.borderRadius,
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginTop: 0, color: theme.text }}>Delete Post</h3>
            <p style={{ color: theme.text }}>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: theme.borderRadius,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: theme.transition,
                  backgroundColor: theme.border,
                  color: theme.text
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(showDeleteConfirm)}
                style={{
                  padding: '8px 20px',
                  borderRadius: theme.borderRadius,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: theme.transition,
                  backgroundColor: theme.danger,
                  color: 'white'
                }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <Header theme={theme}>
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          style={{ margin: 0, fontSize: '1.5em', fontWeight: '600' }}
        >
          Community Hub
        </motion.h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              padding: '5px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Return to home"
          >
            <AiOutlineHome size={22} />
          </motion.button>
        </div>
      </Header>

      {/* Accessibility Controls */}
      <AccessibilityPanel theme={theme} isHighContrast={isHighContrast}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MdAccessibility size={20} style={{ color: theme.primary }} />
          <span style={{ fontWeight: '500', color: theme.text }}>Accessibility</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHighContrast(!isHighContrast)}
          style={{
            padding: '8px 15px',
            background: isHighContrast ? theme.secondary : theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: theme.borderRadius,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.9em'
          }}
          aria-label={`Toggle ${isHighContrast ? 'light' : 'dark'} mode`}
        >
          {isHighContrast ? <MdHighQuality /> : <AiOutlineEye />}
          {isHighContrast ? 'High Contrast' : 'Normal Mode'}
        </motion.button>

        <div style={{ display: 'flex', gap: '5px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            style={{
              padding: '8px 12px',
              background: theme.cardBg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '20px 0 0 20px',
              cursor: 'pointer',
              fontSize: '0.9em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            aria-label="Decrease font size"
          >
            <AiOutlineFontSize />
            A-
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            style={{
              padding: '8px 12px',
              background: theme.cardBg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '0 20px 20px 0',
              cursor: 'pointer',
              fontSize: '0.9em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            aria-label="Increase font size"
          >
            <AiOutlineFontSize />
            A+
          </motion.button>
        </div>

        {isSpeaking && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopSpeech}
            style={{
              padding: '8px 15px',
              background: theme.danger,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.9em',
              marginLeft: 'auto'
            }}
            aria-label="Stop speech"
          >
            <RiUserVoiceFill />
            Stop Speech
          </motion.button>
        )}
      </AccessibilityPanel>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Category Filters */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '30px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <AiOutlineFilter size={20} color={theme.primary} />
            <h2 style={{ 
              margin: 0,
              color: theme.primary,
              fontSize: '1.3em'
            }}>
              Filter Posts
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filterOptions.map((option) => (
              <CategoryChip
                key={option.value}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFilterCategory(option.value);
                  announce(`Showing ${option.label} posts`);
                }}
                active={filterCategory === option.value}
                theme={theme}
                aria-label={`Filter by ${option.label}`}
                aria-pressed={filterCategory === option.value}
              >
                {option.icon}
                {option.label}
              </CategoryChip>
            ))}
          </div>
        </motion.section>

        {/* Posts List */}
        <section ref={postsContainerRef}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaRegLightbulb color={theme.primary} />
            <h2 style={{ 
              margin: 0,
              color: theme.primary,
              fontSize: '1.3em'
            }}>
              {filterCategory ? `${filterOptions.find(o => o.value === filterCategory)?.label} Posts` : 'Community Feed'}
              <span style={{ 
                fontSize: '0.8em', 
                marginLeft: '10px', 
                color: theme.text,
                fontWeight: 'normal'
              }}>
                ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'})
              </span>
            </h2>
          </div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '30px',
                textAlign: 'center',
                color: theme.text,
                border: `1px dashed ${theme.border}`,
                borderRadius: theme.borderRadius,
                backgroundColor: isHighContrast ? '#1e1e1e' : '#f9f9f9'
              }}
            >
              No posts found. Be the first to share something with the community!
            </motion.div>
          )}

          <AnimatePresence>
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                theme={theme}
                layout
              >
                {/* Post Header */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: `1px solid ${theme.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ 
                      margin: 0,
                      color: theme.primary,
                      fontSize: '1.25em',
                      fontWeight: '600'
                    }}>
                      {post.title}
                    </h3>
                    {post.user?._id && (
                      <p style={{ 
                        margin: '5px 0 0',
                        fontSize: '0.9em',
                        color: theme.text
                      }}>
                        Posted by{' '}
                        <Link 
                          to={`/profile/${post.user._id}`}
                          style={{
                            color: theme.primary,
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                        >
                          {post.user.username || 'Anonymous'}
                        </Link>
                        <span style={{ 
                          marginLeft: '10px',
                          fontSize: '0.8em',
                          color: theme.text,
                          opacity: 0.7
                        }}>
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  {post.category && (
                    <div style={{
                      backgroundColor: theme.secondary,
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: '500'
                    }}>
                      {filterOptions.find(o => o.value === post.category)?.icon}
                      <span>{post.category}</span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div style={{ padding: '20px' }}>
                  <p style={{ 
                    margin: '0 0 15px',
                    lineHeight: '1.6',
                    color: theme.text
                  }}>
                    {post.description}
                  </p>

                  {post.image?.url && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.img
                        src={post.image.url}
                        alt={`Post by ${post.user?.username || 'user'}`}
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '15px',
                          border: `1px solid ${theme.border}`,
                          cursor: 'pointer'
                        }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setExpandedImage(post.image.url)}
                      />
                    </motion.div>
                  )}

                  {/* Post Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '15px'
                  }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: post.likes.includes(userId) ? theme.primary : theme.text,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: theme.transition
                        }}
                        aria-label={`Like this post`}
                      >
                        {post.likes.includes(userId) ? (
                          <AiFillLike size={20} />
                        ) : (
                          <AiOutlineLike size={20} />
                        )}
                        <span>{post.likes.length}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleComments(post._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: activePost === post._id ? theme.primary : theme.text,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: theme.transition
                        }}
                        aria-label={`${activePost === post._id ? 'Hide' : 'Show'} comments`}
                      >
                        <FaCommentAlt size={18} />
                        <span>{comments[post._id]?.length || 0}</span>
                      </motion.button>

                      {/* Text-to-Speech Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => speakText(
                          `Post titled ${post.title}. ${post.description}. Posted by ${post.user?.username || 'Anonymous'} in ${post.category} category.`,
                          post._id
                        )}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: currentSpeechPost === post._id ? theme.primary : theme.text,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: theme.transition,
                          position: 'relative'
                        }}
                        aria-label={`Read post aloud`}
                      >
                        <AiOutlineSound size={20} />
                        {currentSpeechPost === post._id && <SpeechIndicator theme={theme} />}
                      </motion.button>
                    </div>

                    {(role === "admin" || post.user?._id === userId) && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowDeleteConfirm(post._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: theme.danger,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: theme.transition
                        }}
                        aria-label="Delete post"
                      >
                        <RiDeleteBinLine size={20} />
                      </motion.button>
                    )}
                  </div>

                  {/* Comment Section */}
                  <AnimatePresence>
                    {activePost === post._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', marginTop: '15px' }}
                      >
                        {/* Comment Input */}
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          marginBottom: '15px'
                        }}>
                          <CommentInput
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText[post._id] || ""}
                            onChange={(e) => setCommentText({ 
                              ...commentText, 
                              [post._id]: e.target.value 
                            })}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                            theme={theme}
                            aria-label="Comment input"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleComment(post._id)}
                            style={{
                              padding: '0 20px',
                              background: theme.primary,
                              color: 'white',
                              border: 'none',
                              borderRadius: '24px',
                              cursor: 'pointer',
                              fontWeight: '500',
                              transition: theme.transition
                            }}
                            aria-label="Submit comment"
                          >
                            Post
                          </motion.button>
                        </div>

                        {/* Comments List */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {comments[post._id]?.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {comments[post._id].map((comment) => (
                                <motion.li
                                  key={comment._id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  style={{
                                    padding: '12px 16px',
                                    marginBottom: '10px',
                                    background: isHighContrast ? '#2d2d2d' : '#f8f8f8',
                                    borderRadius: '8px',
                                    borderLeft: `3px solid ${theme.primary}`
                                  }}
                                >
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    marginBottom: '5px'
                                  }}>
                                    <strong style={{ 
                                      color: theme.primary,
                                      fontSize: '0.95em'
                                    }}>
                                      {comment.user?.username || 'Anonymous'}
                                    </strong>
                                    <span style={{ 
                                      fontSize: '0.8em', 
                                      color: theme.text,
                                      opacity: 0.7
                                    }}>
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p style={{ 
                                    margin: 0, 
                                    color: theme.text,
                                    fontSize: '0.9em'
                                  }}>
                                    {comment.text}
                                  </p>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <div style={{
                              padding: '20px',
                              textAlign: 'center',
                              color: theme.text,
                              border: `1px dashed ${theme.border}`,
                              borderRadius: theme.borderRadius,
                              backgroundColor: isHighContrast ? '#1e1e1e' : '#f9f9f9'
                            }}>
                              No comments yet. Be the first to comment!
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </PostCard>
            ))}
          </AnimatePresence>
        </section>
      </main>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            cursor: 'pointer'
          }}
          onClick={() => setExpandedImage(null)}
        >
          <motion.img
            src={expandedImage}
            alt="Expanded view"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          />
        </motion.div>
      )}

      {/* Scroll to Top Button */}
      <FloatingActionButton
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        theme={theme}
        aria-label="Scroll to top"
      >
        ↑
      </FloatingActionButton>
    </Container>
  );
}

export default PostsPage;