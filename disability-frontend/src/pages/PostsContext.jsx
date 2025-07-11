import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// إنشاء السياق
const PostsContext = createContext();

// دالة الوصول للسياق
export const usePosts = () => useContext(PostsContext);

// Provider ديال السياق
export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchUserPosts = async () => {
    try {
      setLoadingPosts(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/posts/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPosts, fetchUserPosts, loadingPosts }}>
      {children}
    </PostsContext.Provider>
  );
};
