// import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AiOutlineHome, AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaHandsHelping, FaWheelchair, FaBuilding, FaCommentAlt } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";






function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [filterCategory, setFilterCategory] = useState("");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [announceMessage, setAnnounceMessage] = useState("");
  const [activePost, setActivePost] = useState(null);
  const navigate = useNavigate();
  const postsContainerRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // Announcement function for screen readers
  const announce = (message) => {
    setAnnounceMessage(message);
    setTimeout(() => setAnnounceMessage(""), 1000);
  };

  // Fetch posts with animation delay
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      announce(`${res.data.length} posts loaded`);

      // Fetch comments for each post
      const commentsData = await Promise.all(
        res.data.map(async (post) => {
          try {
            const resComments = await axios.get(
              `http://localhost:5000/api/comments/post/${post._id}`
            );
            return { postId: post._id, comments: resComments.data };
          } catch (err) {
            console.error("Error fetching comments:", err);
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
      console.error("Error fetching posts:", error);
      announce("Error loading posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Post interaction handlers
  const handleLike = async (postId) => {
    if (!token) {
      alert("Please login to like posts");
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
    } catch (err) {
      console.error("Failed to like:", err);
      alert(err.response?.data?.message || "Failed to like the post");
    }
  };

  const handleComment = async (postId) => {
    if (!token) {
      alert("Please login to comment");
      return;
    }
    const comment = commentText[postId];
    if (!comment?.trim()) {
      alert("Please write a comment first");
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
    } catch (err) {
      console.error("Failed to comment:", err);
      alert(err.response?.data?.message || "Failed to send comment");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      announce("Post deleted");
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete:", err);
      alert(err.response?.data?.message || "Failed to delete post");
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

  // Filter options
  const filterOptions = [
    { value: "", label: "All", icon: <AiOutlineHome /> },
    { value: "volunteer", label: "Volunteer",  },
    { value: "disabled", label: "Disabled", },
    { value: "organization", label: "Organization", },
  ];

  const filteredPosts = filterCategory
    ? posts.filter(post => post.category === filterCategory)
    : posts;

  // Keyboard navigation
  const handleKeyDown = (e, action, ...args) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(...args);
    }
  };

  // CSS classes with theme variables
  const theme = {
    bg: isHighContrast ? '#121212' : '#f8f9fa',
    text: isHighContrast ? '#ffffff' : '#333333',
    primary: isHighContrast ? '#bb86fc' : '#4a6fa5',
    secondary: isHighContrast ? '#03dac6' : '#4a8c7a',
    danger: isHighContrast ? '#cf6679' : '#c44545',
    cardBg: isHighContrast ? '#1e1e1e' : '#ffffff',
    border: isHighContrast ? '#bb86fc' : '#e0e0e0',
    fontSize: `${fontSize}px`,
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    shadow: '0 2px 10px rgba(0,0,0,0.08)',
    shadowHover: '0 4px 15px rgba(0,0,0,0.12)'
  };

  // Component styles
  const styles = {
    container: {
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      fontSize: theme.fontSize,
      transition: theme.transition,
      paddingBottom: '60px'
    },
    screenReader: {
      position: 'absolute',
      left: '-10000px'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: theme.primary,
      color: 'white',
      padding: '15px 20px',
      boxShadow: theme.shadow,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    accessibilityControls: {
      backgroundColor: isHighContrast ? '#1e1e1e' : '#f0f0f0',
      padding: '12px 20px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.border}`
    },
    mainContent: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    },
    filterButton: (active) => ({
      padding: '10px 15px',
      background: active ? theme.primary : 'transparent',
      color: active ? 'white' : theme.text,
      border: `1px solid ${active ? theme.primary : theme.border}`,
      borderRadius: theme.borderRadius,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: theme.transition,
      fontWeight: active ? '600' : '400'
    }),
    postCard: {
      backgroundColor: theme.cardBg,
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadow,
      marginBottom: '24px',
      overflow: 'hidden',
      border: `1px solid ${theme.border}`,
      transition: theme.transition,
      ':hover': {
        boxShadow: theme.shadowHover
      }
    },
    postHeader: {
      padding: '16px 20px',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    postTitle: {
      margin: 0,
      color: theme.primary,
      fontSize: '1.25em',
      fontWeight: '600'
    },
    categoryBadge: {
      backgroundColor: theme.secondary,
      color: 'white',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85em',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontWeight: '500'
    },
    postContent: {
      padding: '20px'
    },
    actionButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: theme.text,
      padding: '6px 8px',
      borderRadius: '6px',
      transition: theme.transition,
      ':hover': {
        backgroundColor: isHighContrast ? '#2d2d2d' : '#f5f5f5'
      }
    },
    commentInput: {
      flex: 1,
      padding: '12px 16px',
      border: `1px solid ${theme.border}`,
      borderRadius: '24px',
      background: theme.cardBg,
      color: theme.text,
      fontSize: theme.fontSize,
      outline: 'none',
      transition: theme.transition,
      ':focus': {
        borderColor: theme.primary,
        boxShadow: `0 0 0 2px ${theme.primary}20`
      }
    },
    submitButton: {
      padding: '0 20px',
      background: theme.primary,
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: theme.transition,
      ':hover': {
        opacity: 0.9
      }
    },
    commentItem: {
      padding: '12px 16px',
      marginBottom: '10px',
      background: isHighContrast ? '#2d2d2d' : '#f8f8f8',
      borderRadius: '8px',
      borderLeft: `3px solid ${theme.primary}`
    },
    scrollToTop: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: theme.primary,
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.shadow,
      zIndex: 100,
      fontSize: '1.2em'
    }
  };

  return (
    <div style={styles.container}>
      {/* Screen Reader Announcements */}
      <div aria-live="polite" style={styles.screenReader}>
        {announceMessage}
      </div>

      {/* Header */}
      <header style={styles.header}>
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          style={{ margin: 0, fontSize: '1.5em', fontWeight: '600' }}
        >
          Community Posts
        </motion.h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate("/")}
            style={{
              ...styles.actionButton,
              color: 'white',
              ':hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
            aria-label="Return to home"
          >
            <AiOutlineHome size={20} />
          </button>
        </div>
      </header>

      {/* Accessibility Controls */}
      <div style={styles.accessibilityControls}>
        
        
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
          {isHighContrast ? 'Light Mode' : 'Dark Mode'}
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
              fontSize: '0.9em'
            }}
            aria-label="Decrease font size"
          >
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
              fontSize: '0.9em'
            }}
            aria-label="Increase font size"
          >
            A+
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Category Filters */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '30px' }}
        >
          <h2 style={{ 
            marginBottom: '15px', 
            color: theme.primary,
            fontSize: '1.3em'
          }}>
            Filter by Category
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filterOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFilterCategory(option.value);
                  announce(`Showing ${option.label} posts`);
                }}
                style={styles.filterButton(filterCategory === option.value)}
                aria-label={`Filter by ${option.label}`}
                aria-pressed={filterCategory === option.value}
              >
                {option.icon}
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Posts List */}
        <section ref={postsContainerRef}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: theme.primary,
            fontSize: '1.3em'
          }}>
            {filterCategory ? `${filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)} Posts` : 'All Posts'}
            <span style={{ 
              fontSize: '0.8em', 
              marginLeft: '10px', 
              color: theme.text,
              fontWeight: 'normal'
            }}>
              ({filteredPosts.length} posts)
            </span>
          </h2>

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
              No posts found. Be the first to create one!
            </motion.div>
          )}

          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={styles.postCard}
              >
                {/* Post Header */}
                <div style={styles.postHeader}>
                  <div>
                    <h3 style={styles.postTitle}>
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
                      </p>
                    )}
                  </div>
                  
                  {post.category && (
                    <div style={styles.categoryBadge}>
                      {filterOptions.find(o => o.value === post.category)?.icon}
                      <span>{post.category}</span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div style={styles.postContent}>
                  <p style={{ 
                    margin: '0 0 15px',
                    lineHeight: '1.6',
                    color: theme.text
                  }}>
                    {post.description}
                  </p>

                  {post.image?.url && (
                    <motion.img
                      src={post.image.url}
                      alt={`Post by ${post.user?.username || 'user'}`}
                      style={{
                        maxWidth: '100%',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        border: `1px solid ${theme.border}`,
                        cursor: 'pointer'
                      }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => window.open(post.image.url, '_blank')}
                    />
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
                          ...styles.actionButton,
                          color: post.likes.includes(userId) ? theme.primary : theme.text
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
                          ...styles.actionButton,
                          color: activePost === post._id ? theme.primary : theme.text
                        }}
                        aria-label={`${activePost === post._id ? 'Hide' : 'Show'} comments`}
                      >
                        <FaCommentAlt size={18} />
                        <span>{comments[post._id]?.length || 0}</span>
                      </motion.button>
                    </div>

                    {role === "admin" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(post._id)}
                        style={{
                          ...styles.actionButton,
                          color: theme.danger
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
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText[post._id] || ""}
                            onChange={(e) => setCommentText({ 
                              ...commentText, 
                              [post._id]: e.target.value 
                            })}
                            style={styles.commentInput}
                            aria-label="Comment input"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleComment(post._id)}
                            style={styles.submitButton}
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
                                  style={styles.commentItem}
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
                              textAlign: 'center', 
                              padding: '15px',
                              color: theme.text,
                              opacity: 0.7,
                              fontSize: '0.9em'
                            }}>
                              No comments yet. Be the first to comment!
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      </main>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={styles.scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </motion.button>
    </div>
  );
}

export default PostsPage;