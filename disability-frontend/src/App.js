import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsPage from './pages/PostsPage';  
import ProfilePage from './pages/ProfilePage';
import CreatePost from "./pages/ManagePosts.jsx";
import CategoriesPage from './pages/CategoriesPage';
import AdminDashboard from './pages/AdminDashboard';
import MyPosts from './pages/MyPosts'; 
import PostDetails from "./pages/PostDetails";
import ForgotPassword from "./pages/ForgotPassword.jsx"; 
import ResetPassword from "./pages/ResetPassword"; 
import About from "./components/About.jsx";       
import Contact from "./components/contact.jsx";   

import ChatApp from './components/ChatApp'; // خاصك تستورد المكون ديال chat هنا

function App() {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user")); // أو الطريقة اللي كتخدم بيها تخزين المستخدم
    if (token && userData) {
      setUser(userData);
      setUserToken(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
      

        <Route path="/about" element={<About />} />       
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />      
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {/* هنا كنضيفو ChatApp */}
      {user && userToken && <ChatApp currentUserId={user._id} token={userToken} />}
    </Router>
  );
}

export default App;
