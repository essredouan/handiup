import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  // Rate limiting - disable form after 5 failed attempts
  useEffect(() => {
    if (attempts >= 5) {
      const timer = setTimeout(() => {
        setAttempts(0);
      }, 300000); // 5 minute lockout
      return () => clearTimeout(timer);
    }
  }, [attempts]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    // Client-side validation
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    if (attempts >= 5) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      // Store minimal necessary data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin ? "true" : "false");
      localStorage.setItem("role", res.data.isAdmin ? "admin" : "user");
      localStorage.setItem("username", res.data.username || "");

      if (res.data.profileImage) {
        localStorage.setItem("profileImage", res.data.profileImage);
      } else {
        localStorage.removeItem("profileImage");
      }

      navigate("/");
    } catch (err) {
      setAttempts(prev => prev + 1);
      const errorMessage = err.response?.data?.message || 
                         (err.code === "ECONNABORTED" ? "Request timeout. Please try again." : 
                         "Login failed. Please check your credentials and try again.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Please enter your credentials to login</p>
        </div>

        {error && (
          <div className="auth-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                if (email && !validateEmail(email)) {
                  setEmailError("Please enter a valid email address");
                }
              }}
              required
              autoComplete="username"
              className={emailError ? "input-error" : ""}
              disabled={attempts >= 5}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                if (password && !validatePassword(password)) {
                  setPasswordError("Password must be at least 6 characters");
                }
              }}
              required
              autoComplete="current-password"
              minLength="6"
              className={passwordError ? "input-error" : ""}
              disabled={attempts >= 5}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading || attempts >= 5}
          >
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            type="button" 
            className="forgot-password"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Base Styles */
        :root {
          --primary: #4f46e5;
          --primary-hover: #4338ca;
          --error: #dc2626;
          --error-bg: #fee2e2;
          --success: #10b981;
          --text: #374151;
          --text-light: #6b7280;
          --border: #e5e7eb;
          --white: #ffffff;
          --radius: 8px;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Layout */
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
          padding: 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 28rem;
          background-color: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 2rem;
        }

        /* Header */
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .auth-header p {
          color: var(--text-light);
          margin: 0;
          font-size: 1rem;
        }

        /* Error Message */
        .auth-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: var(--error-bg);
          color: var(--error);
          border-radius: var(--radius);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .auth-error svg {
          flex-shrink: 0;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .form-group input {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .input-error {
          border-color: var(--error) !important;
        }

        .error-message {
          color: var(--error);
          font-size: 0.75rem;
        }

        /* Button */
        .auth-button {
          width: 100%;
          padding: 0.875rem 1.5rem;
          background-color: var(--primary);
          color: var(--white);
          border: none;
          border-radius: var(--radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-button:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.5);
        }

        /* Loader */
        .loader {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: var(--white);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
        }

        .forgot-password {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .forgot-password:focus {
          outline: none;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .auth-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;