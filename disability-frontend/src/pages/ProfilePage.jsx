import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaPaperPlane, FaUser, FaComment, FaTimes, FaEdit, FaTrash, FaCamera, FaSpinner } from "react-icons/fa";
import io from 'socket.io-client';

function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef();
  const messagesEndRef = useRef();

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      let response;
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (userId) {
        response = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
      } else {
        response = await axios.get("http://localhost:5000/api/users/profile", config);
      }

      const data = response.data;
      setUser(data);
      setUsername(data.username);
      setBio(data.bio || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");

      if (data.profilePhoto?.url) {
        localStorage.setItem("profileImage", data.profilePhoto.url);
        setImagePreview(data.profilePhoto.url);
      } else {
        localStorage.removeItem("profileImage");
        setImagePreview("/default-profile.png");
      }
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket']
    });

    // Load previous messages
    socketRef.current.on('previousMessages', (msgs) => {
      setMessages(msgs);
    });

    // Handle new messages
    socketRef.current.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchProfile();
    if (userId) setIsEditing(false);
  }, [userId]);

  // Send message handler
  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && user) {
      socketRef.current.emit('sendMessage', {
        senderId: user._id,
        receiverId: "all",
        content: messageInput,
      });
      setMessageInput('');
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { username, bio, email, phone, address },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    window.location.href = "/";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image first.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await axios.post("http://localhost:5000/api/users/profile-photo-upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.imageUrl) {
        localStorage.setItem("profileImage", res.data.imageUrl);
      } else if (res.data.profilePhoto?.url) {
        localStorage.setItem("profileImage", res.data.profilePhoto.url);
      }
      setImageFile(null);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("profileImage");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  if (!user) return (
    <div className="profile-loading">
      <div className="spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div className="profile-page">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <h2>{userId ? `${user.username}'s Profile` : "My Profile"}</h2>
          <div className="header-actions">
            {!userId && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="edit-btn"
                aria-label="Edit profile"
              >
                <FaEdit /> Edit
              </button>
            )}
            {userId && (
              <button 
                onClick={() => setShowChat(!showChat)} 
                className="chat-profile-btn"
                aria-label="Open chat"
              >
                <FaComment /> Chat
              </button>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-image-section">
            <div className="image-container">
              <img
                src={imagePreview}
                alt="Profile"
                className="profile-image"
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              {isEditing && !userId && (
                <label className="image-upload-label">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    disabled={loading}
                    accept="image/*"
                  />
                  <span className="upload-icon">
                    <FaCamera />
                  </span>
                </label>
              )}
            </div>

            {isEditing && imageFile && !userId && (
              <button 
                onClick={handleImageUpload} 
                disabled={loading}
                className="upload-btn"
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin" /> Uploading...
                  </>
                ) : (
                  "Save Photo"
                )}
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing || loading}
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing || loading}
                placeholder="Enter your email"
                type="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing || loading}
                placeholder="Enter your phone number"
                type="tel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditing || loading}
                placeholder="Enter your address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing || loading}
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>

            <div className="profile-actions">
              {isEditing && !userId ? (
                <>
                  <button 
                    onClick={handleUpdate} 
                    disabled={loading}
                    className="save-btn"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="spin" /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }} 
                    disabled={loading}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete} 
                    disabled={loading}
                    className="delete-btn"
                  >
                    <FaTrash /> Delete Account
                  </button>
                </>
              ) : !userId ? (
                <button onClick={handleDone} className="done-btn">
                  Back to Home
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <div className={`chat-widget ${showChat ? 'open' : ''}`}>
        {!showChat ? (
          <button 
            className="chat-toggle"
            onClick={() => setShowChat(true)}
            aria-label="Open chat"
          >
            <FaComment size={24} />
          </button>
        ) : (
          <div className="chat-container">
            <div className="chat-header">
              <h3>Community Chat</h3>
              <button 
                onClick={() => setShowChat(false)}
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>

            <div className="messages-container">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`message ${msg.sender === user.username ? 'sent' : 'received'}`}
                >
                  <div className="message-sender">
                    <FaUser /> {msg.sender === user.username ? 'You' : msg.sender}
                  </div>
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                aria-label="Type your message"
                disabled={!user}
              />
              <button type="submit" aria-label="Send message" disabled={!user}>
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        /* Base Styles */
        :root {
          --primary: #4f46e5;
          --primary-light: #6366f1;
          --primary-dark: #4338ca;
          --secondary: #10b981;
          --accent: #f59e0b;
          --danger: #ef4444;
          --light: #f8fafc;
          --dark: #0f172a;
          --gray: #64748b;
          --light-gray: #e2e8f0;
          --border-radius: 12px;
          --border-radius-lg: 16px;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          box-sizing: border-box;
        }

        /* Profile Page */
        .profile-page {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding: 2rem;
          background-color: #f1f5f9;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: var(--dark);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(79, 70, 229, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Profile Card */
        .profile-card {
          background-color: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 900px;
          overflow: hidden;
          transition: var(--transition);
          z-index: 1;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
        }

        .profile-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .edit-btn, .chat-profile-btn {
          background-color: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(4px);
        }

        .edit-btn:hover, .chat-profile-btn:hover {
          background-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          padding: 2rem;
        }

        @media (min-width: 768px) {
          .profile-content {
            flex-direction: row;
            gap: 3rem;
          }
        }

        /* Profile Image Section */
        .profile-image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .profile-image-section {
            width: 35%;
            margin-bottom: 0;
          }
        }

        .image-container {
          position: relative;
          width: 180px;
          height: 180px;
          margin-bottom: 1.5rem;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: var(--shadow-lg);
        }

        .image-upload-label {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background-color: var(--accent);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-md);
        }

        .image-upload-label:hover {
          background-color: #e67e22;
          transform: scale(1.1) rotate(10deg);
        }

        .image-upload-label input[type="file"] {
          display: none;
        }

        .upload-icon {
          color: white;
          font-size: 1.1rem;
        }

        .upload-btn {
          background-color: var(--accent);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: var(--shadow-md);
        }

        .upload-btn:hover {
          background-color: #e67e22;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .upload-btn:disabled {
          background-color: var(--gray);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Profile Info */
        .profile-info {
          flex: 1;
        }

        @media (min-width: 768px) {
          .profile-info {
            width: 65%;
          }
        }

        .form-group {
          margin-bottom: 1.75rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--dark);
          font-size: 0.9375rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid var(--light-gray);
          border-radius: 8px;
          font-size: 0.9375rem;
          transition: var(--transition);
          background-color: var(--light);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          background-color: white;
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background-color: #f8fafc;
          cursor: not-allowed;
          opacity: 0.8;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.5;
        }

        /* Profile Actions */
        .profile-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2.5rem;
        }

        .save-btn {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: var(--shadow-md);
        }

        .save-btn:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .save-btn:disabled {
          background-color: var(--gray);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .cancel-btn {
          background-color: white;
          color: var(--gray);
          border: 1px solid var(--light-gray);
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: var(--transition);
        }

        .cancel-btn:hover {
          background-color: #f8fafc;
          color: var(--dark);
          border-color: var(--gray);
        }

        .delete-btn {
          background-color: white;
          color: var(--danger);
          border: 1px solid var(--danger);
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }

        .delete-btn:hover {
          background-color: #fef2f2;
          border-color: #dc2626;
        }

        .done-btn {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: var(--transition);
          width: 100%;
          box-shadow: var(--shadow-md);
        }

        .done-btn:hover {
          background-color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg);
        }

        /* Chat Widget */
        .chat-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .chat-toggle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: var(--primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-xl);
          transition: var(--transition);
        }

        .chat-toggle:hover {
          background-color: var(--primary-dark);
          transform: scale(1.1) rotate(5deg);
        }

        .chat-container {
          width: 380px;
          height: 520px;
          background-color: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-widget.open .chat-container {
          transform: translateY(0);
          opacity: 1;
        }

        .chat-header {
          padding: 1.25rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .chat-header button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1.25rem;
          transition: var(--transition);
        }

        .chat-header button:hover {
          transform: rotate(90deg);
        }

        .messages-container {
          flex: 1;
          padding: 1.25rem;
          overflow-y: auto;
          background-color: #f8fafc;
          scrollbar-width: thin;
          scrollbar-color: var(--light-gray) transparent;
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background-color: var(--light-gray);
          border-radius: 3px;
        }

        .message {
          margin-bottom: 1rem;
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          position: relative;
          font-size: 0.9375rem;
          line-height: 1.4;
          word-break: break-word;
        }

        .message.received {
          background-color: white;
          align-self: flex-start;
          border: 1px solid var(--light-gray);
          box-shadow: var(--shadow-sm);
        }

        .message.sent {
          background-color: var(--primary);
          color: white;
          align-self: flex-end;
          box-shadow: var(--shadow-sm);
        }

        .message-sender {
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          opacity: 0.9;
        }

        .message.received .message-sender {
          color: var(--gray);
        }

        .message.sent .message-sender {
          color: rgba(255, 255, 255, 0.9);
        }

        .message-content {
          font-size: 0.9375rem;
        }

        .message-time {
          font-size: 0.6875rem;
          text-align: right;
          margin-top: 0.25rem;
          opacity: 0.7;
        }

        .message-form {
          display: flex;
          padding: 1rem;
          border-top: 1px solid var(--light-gray);
          background-color: white;
        }

        .message-form input {
          flex: 1;
          padding: 0.875rem 1rem;
          border: 1px solid var(--light-gray);
          border-radius: 50px;
          outline: none;
          font-size: 0.9375rem;
          transition: var(--transition);
        }

        .message-form input:focus {
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .message-form button {
          width: 44px;
          height: 44px;
          margin-left: 0.75rem;
          border: none;
          border-radius: 50%;
          background-color: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .message-form button:hover {
          background-color: var(--primary-dark);
          transform: rotate(15deg) scale(1.05);
        }

        .message-form button:disabled {
          background-color: var(--gray);
          cursor: not-allowed;
          transform: none;
        }

        /* Spinner animation */
        .spin {
          animation: spin 1s linear infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .profile-page {
            padding: 1rem;
          }
          
          .profile-content {
            flex-direction: column;
          }
          
          .profile-image-section {
            width: 100%;
          }
          
          .chat-container {
            width: 320px;
            height: 450px;
          }
        }

        @media (max-width: 480px) {
          .chat-widget {
            bottom: 1rem;
            right: 1rem;
          }
          
          .chat-container {
            width: calc(100vw - 2rem);
            height: 65vh;
          }
          
          .header-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .profile-actions {
            flex-direction: column;
          }

          .delete-btn {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;