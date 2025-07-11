import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateAndManagePosts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        setError("Failed to load categories. Please try again later.");
      }
    };
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/posts/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setError("Failed to load posts. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!title || !description || !imageFile || !category) {
      setError("Please fill all fields, select image and category.");
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
      const res = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts((prevPosts) => [res.data, ...prevPosts]);
      setSuccess("Post created successfully!");
      setTitle("");
      setDescription("");
      setImageFile(null);
      setCategory("");
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (post) => {
    setEditPostId(post._id);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setEditCategory(post.category || "");
    setTimeout(() => document.getElementById(`edit-title-${post._id}`)?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditPostId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("");
  };

  const saveEdit = async () => {
    setError(null);
    
    if (!editTitle || !editDescription || !editCategory) {
      setError("Please fill all fields to update");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/posts/${editPostId}`,
        { title: editTitle, description: editDescription, category: editCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess("Post updated successfully");
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === editPostId ? res.data : post))
      );
      
      setTimeout(() => setSuccess(null), 5000);
      cancelEdit();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to update post");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Post deleted successfully");
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div className="post-management-container">
      <h1 className="sr-only">Post Management</h1>
      
      <section aria-labelledby="create-post-heading" className="post-section">
        <div className="section-header">
          <h2 id="create-post-heading">Create New Post</h2>
          <div className="header-decoration"></div>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">!</div>
            <div>{error}</div>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <div className="alert-icon">✓</div>
            <div>{success}</div>
          </div>
        )}
        
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
        </form>
      </section>

      <div className="divider">
        <div className="divider-line"></div>
        <div className="divider-circle"></div>
        <div className="divider-line"></div>
      </div>

      <section aria-labelledby="my-posts-heading" className="post-section">
        <div className="section-header">
          <h2 id="my-posts-heading">My Posts</h2>
          <div className="header-decoration"></div>
        </div>
        
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✏️</div>
            <h3>No Posts Yet</h3>
            <p>Your creative journey starts here</p>
          </div>
        ) : (
          <div className="posts-container">
            {posts
              .filter(post => ["volunteer", "disabled", "organization", "admin"].includes(post.category))
              .map((post) => (
                <article key={post._id} className={`post-card ${editPostId === post._id ? "editing" : ""}`}>
                  {editPostId === post._id ? (
                    <div className="edit-form">
                      <div className="form-group floating">
                        <input
                          id={`edit-title-${post._id}`}
                          type="text"
                          placeholder=" "
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          required
                          aria-required="true"
                        />
                        <label htmlFor={`edit-title-${post._id}`}>Title</label>
                        <div className="underline"></div>
                      </div>
                      
                      <div className="form-group floating">
                        <textarea
                          id={`edit-description-${post._id}`}
                          placeholder=" "
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={4}
                          required
                          aria-required="true"
                        />
                        <label htmlFor={`edit-description-${post._id}`}>Description</label>
                        <div className="underline"></div>
                      </div>
                      
                      <div className="form-group floating">
                        <select
                          id={`edit-category-${post._id}`}
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          required
                          aria-required="true"
                        >
                          <option value=""></option>
                          <option value="volunteer">Volunteer</option>
                          <option value="disabled">Disabled</option>
                          <option value="organization">Organization</option>
                          {userRole === "admin" && <option value="admin">Admin</option>}
                        </select>
                        <label htmlFor={`edit-category-${post._id}`}>Category</label>
                        <div className="underline"></div>
                      </div>
                      
                      <div className="edit-actions">
                        <button 
                          type="button" 
                          onClick={saveEdit} 
                          className="btn save-btn"
                        >
                          Save
                        </button>
                        <button 
                          type="button" 
                          onClick={cancelEdit} 
                          className="btn cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="post-header">
                        <span className={`category-badge ${post.category}`}>
                          {post.category}
                        </span>
                        <time className="post-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      <div className="post-content">
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                      </div>
                      <div className="post-actions">
                        <button 
                          onClick={() => startEdit(post)} 
                          className="btn edit-btn"
                          aria-label={`Edit post titled ${post.title}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePost(post._id)}
                          className="btn delete-btn"
                          aria-label={`Delete post titled ${post.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
          </div>
        )}
      </section>

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

        .post-management-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
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
        }

        /* Form Styles */
        .post-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          max-width: 600px;
          margin: 0 auto;
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

        .save-btn {
          background-color: var(--success);
          color: white;
        }

        .cancel-btn {
          background-color: var(--gray);
          color: var(--text);
        }

        .edit-btn {
          background-color: var(--warning);
          color: white;
        }

        .delete-btn {
          background-color: var(--error);
          color: white;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          margin: 3rem 0;
        }

        .divider-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gray));
        }

        .divider-circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--primary);
          margin: 0 1rem;
        }

        /* Posts Container */
        .posts-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .post-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .post-card.editing {
          box-shadow: 0 0 0 3px var(--primary);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--light);
        }

        .category-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
        }

        .category-badge.volunteer {
          background-color: var(--primary);
        }

        .category-badge.disabled {
          background-color: var(--secondary);
        }

        .category-badge.organization {
          background-color: var(--accent);
          color: var(--dark);
        }

        .category-badge.admin {
          background-color: var(--dark);
        }

        .post-date {
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .post-content {
          padding: 1.5rem;
          flex-grow: 1;
        }

        .post-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: var(--dark);
        }

        .post-content p {
          color: var(--text-light);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .post-actions {
          display: flex;
          border-top: 1px solid var(--gray);
          padding: 0.75rem;
        }

        .post-actions .btn {
          flex: 1;
          margin: 0 0.25rem;
          padding: 0.5rem;
          font-size: 0.85rem;
        }

        .edit-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .empty-state p {
          color: var(--text-light);
        }

        /* Alerts */
        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
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
        }

        .alert-error {
          background-color: rgba(255, 23, 68, 0.1);
          color: var(--error);
        }

        .alert-error .alert-icon {
          background-color: var(--error);
          color: white;
        }

        .alert-success {
          background-color: rgba(0, 200, 83, 0.1);
          color: var(--success);
        }

        .alert-success .alert-icon {
          background-color: var(--success);
          color: white;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .posts-container {
            grid-template-columns: 1fr;
          }

          .post-form {
            padding: 1.5rem;
          }

          h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CreateAndManagePosts;