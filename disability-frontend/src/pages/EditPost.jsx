import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch post data on mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPost(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setPreview(data.image?.url || null);
      } catch (err) {
        setError("Failed to load post data.");
      }
    };
    fetchPost();
  }, [id]);

  // Handle image change & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let updatedPost = {
        title,
        description,
        category,
      };

      // If image changed, upload image first
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        // Upload image endpoint (change if different)
        const uploadRes = await axios.post("/api/posts/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        updatedPost.image = uploadRes.data.image; // assuming backend returns new image object
      }

      // Update post
      await axios.put(`/api/posts/${id}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess("Post updated successfully!");
      setLoading(false);

      setTimeout(() => {
        navigate("/myposts");
      }, 1500);
    } catch (err) {
      setError("Failed to update post.");
      setLoading(false);
    }
  };

  if (error) return <div className="edit-post-container">{error}</div>;
  if (!post) return <div className="edit-post-container">Loading...</div>;

  return (
    <>
      <style>{`
        .edit-post-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #f9f9f9;
          box-shadow: 0 0 12px rgba(0,0,0,0.1);
          border-radius: 8px;
          font-family: Arial, sans-serif;
        }
        .edit-post-container h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        label {
          font-weight: bold;
          color: #555;
        }
        input[type="text"],
        textarea,
        select {
          padding: 0.6rem 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          resize: vertical;
          transition: border-color 0.3s ease;
        }
        input[type="text"]:focus,
        textarea:focus,
        select:focus {
          border-color: #4e54c8;
          outline: none;
        }
        textarea {
          min-height: 100px;
        }
        .image-preview {
          max-width: 100%;
          max-height: 250px;
          object-fit: contain;
          border-radius: 6px;
          margin-top: 0.5rem;
          border: 1px solid #ddd;
        }
        button {
          background: linear-gradient(135deg, #6b73ff 0%, #000dff 100%);
          color: white;
          font-weight: bold;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background 0.3s ease;
        }
        button:disabled {
          background: #999;
          cursor: not-allowed;
        }
        button:hover:not(:disabled) {
          background: linear-gradient(135deg, #000dff 0%, #6b73ff 100%);
        }
        .message {
          text-align: center;
          font-weight: bold;
          margin-top: 1rem;
        }
        .error {
          color: #ff4d4f;
        }
        .success {
          color: #4caf50;
        }
      `}</style>

      <div className="edit-post-container">
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
          />

          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            minLength={2}
          />

          <label htmlFor="image">Image</label>
          <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}
      </div>
    </>
  );
};

export default EditPost;
