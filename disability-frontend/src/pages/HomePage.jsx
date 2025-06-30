import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroHeader from '../components/HeroHeader';
import Sidebar from '../components/Sidebar';
import PostsList from '../components/PostsList';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
      }

      try {
        const postsRes = await axios.get('http://localhost:5000/api/posts');
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <HeroHeader />
      <main style={styles.main}>
        <Sidebar categories={categories} posts={posts} />
        <PostsList posts={posts} />
      </main>
    </>
  );
};

const styles = {
  main: {
    display: 'flex',
    minHeight: '70vh',
  },
};

export default HomePage;
