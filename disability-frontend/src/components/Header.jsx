import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const profileImage = localStorage.getItem("profileImage");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style jsx>{`
        /* Glassmorphism Design Variables */
        :root {
          --primary: rgba(99, 102, 241, 0.8);
          --primary-solid: #6366f1;
          --primary-hover: rgba(79, 70, 229, 0.9);
          --secondary: rgba(244, 63, 94, 0.8);
          --text: rgba(255, 255, 255, 0.9);
          --text-dark: #1e293b;
          --text-light: rgba(255, 255, 255, 0.7);
          --bg: rgba(15, 23, 42, 0.8);
          --bg-light: rgba(255, 255, 255, 0.1);
          --border: rgba(255, 255, 255, 0.1);
          --shadow-sm: 0 1px 12px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.2);
          --radius-sm: 8px;
          --radius-md: 12px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Base Navbar Styles */
        .navbar {
          background: var(--bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          border-bottom: 1px solid var(--border);
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Logo Styles */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text);
          z-index: 60;
        }

        .logo-image {
          height: 2.25rem;
          border-radius: var(--radius-sm);
        }

        .logo-text {
          background: linear-gradient(90deg, var(--text-light), var(--text));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Navigation Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-links a:not(.nav-btn) {
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
          padding: 0.5rem 0;
          transition: var(--transition);
        }

        .nav-links a:not(.nav-btn):hover {
          color: var(--text);
        }

        .nav-links a:not(.nav-btn)::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background: var(--primary);
          transition: var(--transition);
        }

        .nav-links a:not(.nav-btn):hover::after {
          width: 100%;
        }

        /* Button Styles */
        .nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: var(--transition);
          border: none;
          cursor: pointer;
        }

        .login-btn {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }

        .login-btn:hover {
          background: var(--bg-light);
          transform: translateY(-2px);
        }

        .register-btn {
          background: linear-gradient(135deg, var(--primary), rgba(139, 92, 246, 0.8));
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .register-btn:hover {
          background: linear-gradient(135deg, var(--primary-hover), rgba(124, 58, 237, 0.9));
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        /* Profile Dropdown */
        .profile-wrapper {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-light);
          border: 1px solid var(--border);
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
          backdrop-filter: blur(5px);
        }

        .profile-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .profile-image {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border);
        }

        .default-profile-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(241, 245, 249, 0.1);
          border-radius: 50%;
          color: var(--text-light);
        }

        .profile-name {
          font-weight: 500;
          color: var(--text);
        }

        .dropdown-icon {
          transition: var(--transition);
          margin-left: 0.25rem;
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .profile-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 0.5rem);
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border);
          min-width: 220px;
          overflow: hidden;
          z-index: 40;
          transform-origin: top right;
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .profile-dropdown a, .logout-button {
          display: block;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          color: var(--text-light);
          font-weight: 500;
          transition: var(--transition);
          text-align: left;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }

        .profile-dropdown a:hover, .logout-button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
        }

        .profile-dropdown a:hover {
          padding-left: 1.75rem;
        }

        .logout-button {
          color: rgba(239, 68, 68, 0.8);
        }

        .logout-button:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        /* Mobile Menu */
        .hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 60;
        }

        .hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text);
          transition: var(--transition);
          transform-origin: center;
        }

        .hamburger-line:not(:last-child) {
          margin-bottom: 6px;
        }

        .hamburger.active .hamburger-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .hamburger.active .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active .hamburger-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .navbar-container {
            padding: 1rem;
          }

          .hamburger {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 280px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3);
            flex-direction: column;
            align-items: flex-start;
            padding: 6rem 1.5rem 2rem;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            gap: 0.5rem;
            z-index: 50;
          }

          .nav-links.open {
            transform: translateX(0);
          }

          .nav-links a:not(.nav-btn) {
            width: 100%;
            padding: 0.75rem 0;
            font-size: 1rem;
          }

          .nav-btn {
            width: 100%;
            margin: 0.5rem 0;
            padding: 0.75rem;
            font-size: 1rem;
          }

          .profile-wrapper {
            width: 100%;
            margin-top: 1rem;
          }

          .profile-button {
            width: 100%;
            justify-content: space-between;
            padding: 0.75rem;
          }

          .profile-dropdown {
            position: static;
            box-shadow: none;
            width: 100%;
            margin-top: 0.5rem;
            animation: none;
            background: transparent;
            border: none;
            backdrop-filter: none;
          }
        }

        /* Animation for mobile menu items */
        @media (max-width: 768px) {
          .nav-links a:not(.nav-btn) {
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
          }

          .nav-links.open a:not(.nav-btn) {
            opacity: 1;
            transform: translateX(0);
            transition-delay: calc(0.1s * var(--i));
          }

          .nav-btn {
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
          }

          .nav-links.open .nav-btn {
            opacity: 1;
            transform: translateX(0);
            transition-delay: calc(0.1s * var(--i));
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <img src="/handiup2.avif" alt="handiUp Logo" className="logo-image" />
            <span className="logo-text">handiUp</span>
          </Link>

          <button
            className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <div className={`mobile-menu-overlay ${mobileMenuOpen ? "open" : ""}`} 
               onClick={() => setMobileMenuOpen(false)} />

          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            {/* Show these links only when NOT logged in */}
            {!token && (
              <>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ "--i": 1 }}>About</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ "--i": 2 }}>Contact</Link>
              </>
            )}

            {/* Always show Posts link */}
            <Link to="/posts" onClick={() => setMobileMenuOpen(false)} style={{ "--i": 3 }}>Posts</Link>

            {/* Show these links only when logged in */}
            {token && (
              <>
                <Link to="/my-posts" onClick={() => setMobileMenuOpen(false)} style={{ "--i": 1 }}>My Posts</Link>
                <Link to="/create-post" onClick={() => setMobileMenuOpen(false)} style={{ "--i": 2 }}>Create Post</Link>

                <div className="profile-wrapper" ref={profileRef} style={{ "--i": 3 }}>
                  <button
                    className="profile-button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    aria-haspopup="true"
                    aria-expanded={profileDropdownOpen}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-image" />
                    ) : (
                      <span className="default-profile-icon">👤</span>
                    )}
                    <span className="profile-name">{username || "Profile"}</span>
                    <svg
                      className={`dropdown-icon ${profileDropdownOpen ? "open" : ""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.708a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {profileDropdownOpen && (
                    <div className="profile-dropdown" role="menu">
                      <Link to="/profile" onClick={() => { setMobileMenuOpen(false); setProfileDropdownOpen(false); }}>My Profile</Link>
                      {role === "admin" && (
                        <>
                          <Link to="/categories" onClick={() => { setMobileMenuOpen(false); setProfileDropdownOpen(false); }}>Categories</Link>
                          <Link to="/admin" onClick={() => { setMobileMenuOpen(false); setProfileDropdownOpen(false); }}>Dashboard Admin</Link>
                        </>
                      )}
                      <button onClick={handleLogout} className="logout-button" role="menuitem">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Show these buttons only when NOT logged in */}
            {!token && (
              <>
                <Link to="/login" className="nav-btn login-btn" onClick={() => setMobileMenuOpen(false)} style={{ "--i": 3 }}>
                  Login
                </Link>
                <Link to="/register" className="nav-btn register-btn" onClick={() => setMobileMenuOpen(false)} style={{ "--i": 4 }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;