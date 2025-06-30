import React, { useEffect, useState } from "react";
import axios from "axios";

function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.length === 0 && <p>ما كايناش أي تدوينات</p>}

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            borderRadius: "6px",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)"
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {post.image?.url && (
            <img
              src={post.image.url}
              alt={post.title}
              style={{ maxWidth: "300px", borderRadius: "4px" }}
            />
          )}
          <p>Author: {post.user?.username || "Unknown"}</p>

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {/* Like Icon and Count */}
            <span style={{ cursor: "pointer", userSelect: "none" }}>
              ❤️ {post.likes.length}
            </span>

            {/* Comments count (assumes post.commentsCount exists from backend) */}
            <span>
              💬 {post.commentsCount !== undefined ? post.commentsCount : "0"} Comments
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostsList;
