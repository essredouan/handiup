import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src="/logo.png" alt="Logo" style={styles.logoImg} />
        <h1 style={styles.logoText}>HandiUp</h1>
      </div>
      <nav style={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link> {/* 👈 هذا هو اللينك اللي كيديك لصفحة PostPage */}
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    color: 'white',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    width: '40px',
    marginRight: '10px',
  },
  logoText: {
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    gap: '15px',
  },
};

export default Header;
