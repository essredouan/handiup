import React, { useEffect, useState } from "react";
import axios from "axios";

function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Posts</h2>
      {posts.length === 0 && <p>No posts found</p>}

      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid gray", margin: "10px 0", padding: "10px" }}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {post.image?.url && (
            <img
              src={post.image.url}
              alt={post.title}
              style={{ maxWidth: "300px", display: "block", marginBottom: "10px" }}
            />
          )}
          <p>Author: {post.user?.username || "Unknown"}</p>
          <p>Likes: {post.likes.length}</p>
        </div>
      ))}
    </div>
  );
}

export default PostsPage;
