import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsPage from './pages/PostsPage';  // ✅ صفحة جميع البوستات
// import PostPage from './pages/PostPage';    // ✅ صفحة تفاصيل بوست واحد

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />      {/* ← جميع البوستات */}
        {/* <Route path="/posts/:id" element={<PostPage />} />   ← تفاصيل بوست */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
