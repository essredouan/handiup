import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords don't match", type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password,
      });
      setMessage({ text: res.data.message, type: 'success' });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Error resetting password", 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Your Password</h2>
          <p>Create a new secure password for your account</p>
        </div>

        <form onSubmit={handleReset} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          {message.text && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}
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

        /* Password strength indicator */
        .password-strength {
          margin-top: 0.5rem;
          height: 4px;
          background-color: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }

        .password-strength-fill {
          height: 100%;
          width: 0%;
          transition: width 0.3s ease;
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

export default ResetPassword;