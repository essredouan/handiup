import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage("Password reset link sent! Please check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span> Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          {message && <div className="auth-message success">{message}</div>}
          {error && <div className="auth-message error">{error}</div>}

          <div className="auth-footer">
            <button 
              type="button" 
              className="text-button"
              onClick={() => navigate("/login")}
            >
              Remember your password? Sign In
            </button>
          </div>
        </form>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        :root {
          --primary-color: #4361ee;
          --primary-dark: #3a5a8a;
          --secondary-color: #3f37c9;
          --accent-color: #4895ef;
          --danger-color: #f72585;
          --success-color: #4cc9f0;
          --light-color: #f8f9fa;
          --dark-color: #212529;
          --gray-color: #6c757d;
          --border-radius: 12px;
          --box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
          background-color: #f5f7fa;
          background-image: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }

        .auth-card {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          width: 100%;
          max-width: 450px;
          padding: 2.5rem;
          transition: var(--transition);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h2 {
          color: var(--dark-color);
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .auth-header p {
          color: var(--gray-color);
          font-size: 0.95rem;
        }

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
          font-size: 0.9rem;
          color: var(--dark-color);
          font-weight: 500;
        }

        .form-group input {
          padding: 0.9rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: var(--transition);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(72, 149, 239, 0.2);
        }

        .auth-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .auth-button:hover:not(:disabled) {
          background-color: var(--secondary-color);
          transform: translateY(-2px);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-message {
          padding: 0.8rem 1rem;
          border-radius: var(--border-radius);
          font-size: 0.9rem;
          text-align: center;
        }

        .auth-message.success {
          background-color: rgba(76, 201, 240, 0.1);
          color: var(--success-color);
          border: 1px solid rgba(76, 201, 240, 0.3);
        }

        .auth-message.error {
          background-color: rgba(247, 37, 133, 0.1);
          color: var(--danger-color);
          border: 1px solid rgba(247, 37, 133, 0.3);
        }

        .auth-footer {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        .text-button {
          background: none;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }

        .text-button:hover {
          text-decoration: underline;
          background-color: rgba(67, 97, 238, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .auth-container {
            padding: 1rem;
          }
          
          .auth-card {
            padding: 1.5rem;
          }
          
          .auth-header h2 {
            font-size: 1.5rem;
          }
        }

        /* Accessibility Focus Styles */
        button:focus,
        input:focus {
          outline: 2px solid var(--primary-dark);
          outline-offset: 2px;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;