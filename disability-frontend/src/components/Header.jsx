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
        /* Modern color palette with gradients */
        :root {
          --primary: #6366f1;
          --primary-hover: #4f46e5;
          --secondary: #f59e0b;
          --text: #1e293b;
          --text-light: #64748b;
          --bg: #ffffff;
          --bg-accent: #f8fafc;
          --border: #e2e8f0;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --radius: 0.5rem;
          --radius-lg: 1rem;
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Base navbar with subtle glass effect */
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Logo with gradient text */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.65rem;
          color: transparent;
          background: linear-gradient(45deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          background-clip: text;
          transition: var(--transition);
        }

        .logo:hover {
          opacity: 0.9;
        }

        .logo-image {
          height: 3.5rem;
          transition: var(--transition);
        }

        .logo:hover .logo-image {
          transform: rotate(-5deg) scale(1.05);
        }

        /* Navigation links with animated underline */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-links a {
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition);
          padding: 0.5rem 0;
          position: relative;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: var(--transition);
        }

        .nav-links a:hover {
          color: var(--text);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        /* Profile dropdown with card-like design */
        .profile-wrapper {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-accent);
          border: none;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg);
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .profile-button:hover {
          background: #f1f5f9;
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .profile-image {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .profile-name {
          font-weight: 600;
          color: var(--text);
          font-size: 0.9rem;
        }

        .profile-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 0.75rem);
          background: var(--bg);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border);
          min-width: 220px;
          overflow: hidden;
          z-index: 40;
          opacity: 0;
          transform: translateY(-10px);
          transition: var(--transition);
          visibility: hidden;
        }

        .profile-dropdown.open {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }

        .profile-dropdown a, 
        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
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

        .profile-dropdown a:hover {
          background: var(--bg-accent);
          color: var(--primary);
          padding-left: 1.5rem;
        }

        .logout-button {
          color: #ef4444;
          border-top: 1px solid var(--border);
        }

        .logout-button:hover {
          background: #fef2f2;
          padding-left: 1.5rem;
        }

        /* Mobile menu button with animation */
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 60;
        }

        .mobile-menu-icon {
          display: block;
          width: 28px;
          height: 2px;
          background: var(--primary);
          position: relative;
          transition: var(--transition);
        }

        .mobile-menu-icon::before,
        .mobile-menu-icon::after {
          content: '';
          position: absolute;
          width: 28px;
          height: 2px;
          background: var(--primary);
          left: 0;
          transition: var(--transition);
        }

        .mobile-menu-icon::before {
          top: -8px;
        }

        .mobile-menu-icon::after {
          top: 8px;
        }

        .mobile-menu-button.open .mobile-menu-icon {
          background: transparent;
        }

        .mobile-menu-button.open .mobile-menu-icon::before {
          transform: rotate(45deg);
          top: 0;
          background: var(--primary);
        }

        .mobile-menu-button.open .mobile-menu-icon::after {
          transform: rotate(-45deg);
          top: 0;
          background: var(--primary);
        }

        /* Mobile menu overlay with gradient */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(245, 158, 11, 0.1));
          backdrop-filter: blur(5px);
          z-index: 30;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* Responsive styles with smooth transitions */
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 300px;
            background: var(--bg);
            flex-direction: column;
            align-items: flex-start;
            padding: 6rem 2rem 2rem;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 50;
            border-left: 1px solid var(--border);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
          }

          .nav-links.open {
            transform: translateX(0);
          }

          .nav-links a {
            width: 100%;
            padding: 0.75rem 0;
            font-size: 1.1rem;
          }

          .nav-links a::after {
            display: none;
          }

          .profile-wrapper {
            width: 100%;
            margin-top: 1.5rem;
          }

          .profile-button {
            width: 100%;
            justify-content: space-between;
            padding: 0.75rem 1rem;
          }

          .profile-dropdown {
            position: static;
            box-shadow: none;
            border: none;
            width: 100%;
            margin-top: 0.5rem;
            opacity: 1;
            transform: none;
            visibility: visible;
            display: none;
          }

          .profile-dropdown.open {
            display: block;
          }
        }

        /* Animation for dropdown items */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-dropdown a,
        .profile-dropdown .logout-button {
          animation: fadeIn 0.2s ease forwards;
        }

        .profile-dropdown a:nth-child(1) { animation-delay: 0.05s; }
        .profile-dropdown a:nth-child(2) { animation-delay: 0.1s; }
        .profile-dropdown a:nth-child(3) { animation-delay: 0.15s; }
        .logout-button { animation-delay: 0.2s; }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <img src="/logo1.jpg" alt="handiUp Logo" className="logo-image" />
            <span>HandiUp</span>
          </Link>

          <button
            className={`mobile-menu-button ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="mobile-menu-icon"></span>
          </button>

          <div 
            className={`mobile-menu-overlay ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <Link to="/posts" onClick={() => setMobileMenuOpen(false)}>All Posts</Link>

            {token && (
              <>
                <Link to="/my-posts" onClick={() => setMobileMenuOpen(false)}>My Posts</Link>
                <Link to="/create-post" onClick={() => setMobileMenuOpen(false)}>Create Post</Link>

                <div className="profile-wrapper" ref={profileRef}>
                  <button
                    className="profile-button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-image" />
                    ) : (
                      <div className="profile-image">👤</div>
                    )}
                    <span className="profile-name">{username || "Profile"}</span>
                  </button>
                  
                  <div className={`profile-dropdown ${profileDropdownOpen ? "open" : ""}`}>
                    <Link 
                      to="/profile" 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setProfileDropdownOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    {role === "admin" && (
                      <>
                        <Link 
                          to="/categories" 
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setProfileDropdownOpen(false);
                          }}
                        >
                          Categories
                        </Link>
                        <Link 
                          to="/admin" 
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setProfileDropdownOpen(false);
                          }}
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="logout-button"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;