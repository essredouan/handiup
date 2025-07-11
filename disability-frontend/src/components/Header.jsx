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
        /* Simple and clean variables */
        :root {
          --primary: #4f46e5;
          --primary-hover: #4338ca;
          --text: #1f2937;
          --text-light: #6b7280;
          --bg: #ffffff;
          --border: #e5e7eb;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --radius: 0.375rem;
          --transition: all 0.15s ease;
        }

        /* Base navbar styles */
        .navbar {
          background: var(--bg);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          border-bottom: 1px solid var(--border);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Logo styles */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.25rem;
          color: var(--text);
        }

        .logo-image {
          height: 2rem;
        }

        /* Navigation links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .nav-links a {
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition);
          padding: 0.5rem 0;
        }

        .nav-links a:hover {
          color: var(--primary);
        }

        /* Profile dropdown */
        .profile-wrapper {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid var(--border);
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius);
          transition: var(--transition);
        }

        .profile-button:hover {
          border-color: var(--primary);
        }

        .profile-image {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-name {
          font-weight: 500;
          color: var(--text);
          font-size: 0.9rem;
        }

        .profile-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 0.5rem);
          background: var(--bg);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          min-width: 200px;
          overflow: hidden;
          z-index: 40;
        }

        .profile-dropdown a, 
        .logout-button {
          display: block;
          padding: 0.75rem 1rem;
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
          background: #f9fafb;
          color: var(--primary);
        }

        .logout-button {
          color: #ef4444;
        }

        .logout-button:hover {
          background: #fef2f2;
        }

        /* Mobile menu button */
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .mobile-menu-icon {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text);
          position: relative;
        }

        .mobile-menu-icon::before,
        .mobile-menu-icon::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background: var(--text);
          left: 0;
          transition: var(--transition);
        }

        .mobile-menu-icon::before {
          top: -6px;
        }

        .mobile-menu-icon::after {
          top: 6px;
        }

        .mobile-menu-button.open .mobile-menu-icon {
          background: transparent;
        }

        .mobile-menu-button.open .mobile-menu-icon::before {
          transform: rotate(45deg);
          top: 0;
        }

        .mobile-menu-button.open .mobile-menu-icon::after {
          transform: rotate(-45deg);
          top: 0;
        }

        /* Mobile menu overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 30;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 280px;
            background: var(--bg);
            flex-direction: column;
            align-items: flex-start;
            padding: 5rem 1.5rem 2rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 40;
            border-left: 1px solid var(--border);
          }

          .nav-links.open {
            transform: translateX(0);
          }

          .profile-wrapper {
            width: 100%;
            margin-top: 1rem;
          }

          .profile-button {
            width: 100%;
            justify-content: space-between;
          }

          .profile-dropdown {
            position: static;
            box-shadow: none;
            border: none;
            width: 100%;
            margin-top: 0.5rem;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <img src="/handiup2.avif" alt="handiUp Logo" className="logo-image" />
            <span>handiUp</span>
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
            <Link to="/posts" onClick={() => setMobileMenuOpen(false)}>Posts</Link>

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
                  
                  {profileDropdownOpen && (
                    <div className="profile-dropdown">
                      <Link 
                        to="/profile" 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setProfileDropdownOpen(false);
                        }}
                      >
                        My Profile
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
                  )}
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