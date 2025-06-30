import React, { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    // Fetch latest posts (limit 5)
    const fetchLatestPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts?limit=5");
        setLatestPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch latest posts:", err);
      }
    };

    fetchCategories();
    fetchLatestPosts();
  }, []);

  return (
    <aside style={{ width: "300px", padding: "20px", borderLeft: "1px solid #ddd" }}>
      {/* Categories */}
      <section>
        <h3>Categories</h3>
        {categories.length === 0 ? (
          <p>No categories found</p>
        ) : (
          <ul>
            {categories.map((cat) => (
              <li key={cat._id} style={{ cursor: "pointer" }}>
                {cat.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Latest Posts */}
      <section style={{ marginTop: "40px" }}>
        <h3>Latest Posts</h3>
        {latestPosts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          <ul>
            {latestPosts.map((post) => (
              <li key={post._id} style={{ marginBottom: "10px", cursor: "pointer" }}>
                {post.title.length > 40 ? post.title.slice(0, 40) + "..." : post.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

export default Sidebar;
