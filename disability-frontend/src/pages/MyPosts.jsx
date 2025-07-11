import React, { useState, useEffect } from "react";
import axios from "axios";

function MyPosts({ refreshFlag }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
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
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshFlag]);

  const startEdit = (post) => {
    setEditPostId(post._id);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setEditCategory(
      typeof post.category === "object"
        ? post.category._id || ""
        : post.category || ""
    );
  };

  const cancelEdit = () => {
    setEditPostId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("");
  };

  const saveEdit = async () => {
    if (!editTitle || !editDescription || !editCategory) {
      alert("Please fill all fields.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/posts/${editPostId}`,
        {
          title: editTitle,
          description: editDescription,
          category: editCategory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Post updated");
      cancelEdit();
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert("Failed to update post");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted");
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete post");
    }
  };

  return (
    <div>
      <h2>My Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div
          key={post._id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          {editPostId === post._id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                style={{ marginBottom: 8 }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <p>
                <b>Category:</b>{" "}
                {categories.find((cat) => cat._id === post.category)?.title ||
                  "Unknown"}
              </p>
              <button onClick={() => startEdit(post)}>Edit</button>
              <button
                onClick={() => deletePost(post._id)}
                style={{ marginLeft: 8, color: "red" }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyPosts;
