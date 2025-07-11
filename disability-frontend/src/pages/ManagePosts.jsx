import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        showError("Failed to load categories. Please try again later.");
      }
    };
    fetchCategories();
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setSuccess(null);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!title || !description || !imageFile || !category) {
      showError("Please fill all fields, select image and category.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageFile);
    formData.append("category", category);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccess("Post created successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setCategory("");
  };

  const handleViewPosts = () => {
    navigate("/my-posts");
  };

  return (
    <div className="create-post-container">
      <h1 className="sr-only">Create Post</h1>
      
      <section aria-labelledby="create-post-heading" className="post-section">
        <div className="section-header">
          <h2 id="create-post-heading">Create New Post</h2>
          <div className="header-decoration"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group floating">
            <input
              id="post-title"
              type="text"
              placeholder=" "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-required="true"
            />
            <label htmlFor="post-title">Title</label>
            <div className="underline"></div>
          </div>
          
          <div className="form-group floating">
            <textarea
              id="post-description"
              placeholder=" "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              aria-required="true"
              rows={5}
            />
            <label htmlFor="post-description">Description</label>
            <div className="underline"></div>
          </div>
          
          <div className="form-group floating">
            <select 
              id="post-category"
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
              aria-required="true"
            >
              <option value=""></option>
              <option value="volunteer">Volunteer</option>
              <option value="disabled">Disabled</option>
              <option value="organization">Organization</option>
              {userRole === "admin" && <option value="admin">Admin</option>}
            </select>
            <label htmlFor="post-category">Category</label>
            <div className="underline"></div>
          </div>
          
          <div className="form-group file-upload">
            <label htmlFor="post-image">
              <span className="upload-label">Choose Image</span>
              <span className="file-name">
                {imageFile ? imageFile.name : "No file selected"}
              </span>
              <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                required
                aria-required="true"
              />
            </label>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn create-btn" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <span className="btn-icon">+</span>
                  <span>Create Post</span>
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="btn view-posts-btn"
              onClick={handleViewPosts}
            >
              View My Posts
            </button>
          </div>
        </form>
      </section>

      {/* Error Message */}
      {error && (
        <div className="alert-popup error">
          <div className="alert-content">
            <div className="alert-icon">!</div>
            <div className="alert-message">{error}</div>
            <button 
              className="alert-close"
              onClick={() => setError(null)}
              aria-label="Close error message"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="modal-content">
            <div className="modal-icon">✓</div>
            <h3 className="modal-title">Success!</h3>
            <p className="modal-message">{success}</p>
            <div className="modal-actions">
              <button 
                className="btn modal-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Continue
              </button>
              <button 
                className="btn view-posts-btn"
                onClick={handleViewPosts}
              >
                View Posts
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Radical Design System */
        :root {
          --primary: #FF4D4D;
          --secondary: #FF9E3D;
          --accent: #4DFF8B;
          --dark: #1A1A2E;
          --light: #F5F5F5;
          --gray: #E6E6E6;
          --success: #00C853;
          --error: #FF1744;
          --warning: #FF9100;
          --text: #333333;
          --text-light: #777777;
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--light);
          color: var(--text);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
        }

        .create-post-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 0 1rem;
          position: relative;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Section Styles */
        .post-section {
          margin-bottom: 3rem;
        }

        .section-header {
          position: relative;
          margin-bottom: 2rem;
          text-align: center;
        }

        h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--dark);
          margin-bottom: 0.5rem;
          position: relative;
          display: inline-block;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .header-decoration {
          height: 8px;
          width: 100px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: 4px;
          margin: 0 auto;
        }

        /* Form Styles */
        .post-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow);
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        /* Floating Label Style */
        .floating {
          position: relative;
        }

        .floating input,
        .floating textarea,
        .floating select {
          width: 100%;
          padding: 1rem 0.5rem 0.5rem;
          border: none;
          border-bottom: 2px solid var(--gray);
          font-size: 1rem;
          background: transparent;
          transition: all 0.3s ease;
        }

        .floating textarea {
          min-height: 100px;
          resize: vertical;
        }

        .floating select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 1em;
        }

        .floating label {
          position: absolute;
          top: 1rem;
          left: 0.5rem;
          color: var(--text-light);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .floating input:focus ~ label,
        .floating input:not(:placeholder-shown) ~ label,
        .floating textarea:focus ~ label,
        .floating textarea:not(:placeholder-shown) ~ label,
        .floating select:focus ~ label,
        .floating select:not([value=""]) ~ label {
          top: 0.25rem;
          left: 0.5rem;
          font-size: 0.75rem;
          color: var(--primary);
        }

        .underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: width 0.3s ease;
        }

        .floating input:focus ~ .underline,
        .floating textarea:focus ~ .underline,
        .floating select:focus ~ .underline {
          width: 100%;
        }

        /* File Upload */
        .file-upload label {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 1rem;
          border: 2px dashed var(--gray);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .file-upload label:hover {
          border-color: var(--primary);
        }

        .upload-label {
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          border-radius: 4px;
          margin-right: 1rem;
          font-weight: 600;
        }

        .file-name {
          color: var(--text-light);
        }

        .file-upload input {
          display: none;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }

        /* Buttons */
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .create-btn {
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          color: white;
          font-size: 1rem;
          width: 100%;
          padding: 1rem;
          box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
        }

        .view-posts-btn {
          background: white;
          color: var(--primary);
          border: 2px solid var(--primary);
          width: 100%;
        }

        .view-posts-btn:hover {
          background: rgba(255, 77, 77, 0.1);
        }

        .btn-icon {
          margin-right: 0.5rem;
          font-weight: bold;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Alert Popup */
        .alert-popup {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        .alert-popup.error {
          background-color: white;
          border-left: 5px solid var(--error);
          box-shadow: var(--shadow);
          border-radius: 8px;
          overflow: hidden;
        }

        .alert-content {
          display: flex;
          align-items: center;
          padding: 1rem;
          max-width: 350px;
        }

        .alert-icon {
          font-weight: bold;
          margin-right: 0.75rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: var(--error);
          flex-shrink: 0;
        }

        .alert-message {
          flex-grow: 1;
          margin-right: 0.5rem;
        }

        .alert-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-light);
          padding: 0 0.5rem;
          line-height: 1;
        }

        .alert-close:hover {
          color: var(--text);
        }

        /* Success Modal */
        .success-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: var(--shadow);
          animation: scaleUp 0.3s ease-out;
        }

        .modal-icon {
          width: 60px;
          height: 60px;
          background: var(--success);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1rem;
        }

        .modal-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .modal-message {
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .modal-btn {
          background: var(--primary);
          color: white;
        }

        /* Animations */
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .post-form {
            padding: 1.5rem;
          }

          h2 {
            font-size: 1.8rem;
          }

          .alert-popup {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: calc(100% - 2rem);
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default CreatePost;