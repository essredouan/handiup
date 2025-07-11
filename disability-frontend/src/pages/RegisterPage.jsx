import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "username":
        if (!value) error = "Username is required";
        else if (value.length < 3) error = "Username must be at least 3 characters";
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = "Username can only contain letters, numbers and underscores";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(value)) error = "Password must contain at least one uppercase letter";
        else if (!/[a-z]/.test(value)) error = "Password must contain at least one lowercase letter";
        else if (!/[0-9]/.test(value)) error = "Password must contain at least one number";
        else if (!/[^A-Za-z0-9]/.test(value)) error = "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords don't match";
        break;
      case "role":
        if (!value) error = "Please select a role";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
      if (newErrors[key]) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000
      });

      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         (err.code === "ECONNABORTED" ? "Request timeout. Please try again." : 
                         "Registration failed. Please try again.");
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join our community today</p>
        </div>

        {serverError && (
          <div className="alert error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        {success && (
          <div className="alert success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your username"
              className={errors.username ? "error" : ""}
              autoComplete="username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="your@email.com"
              className={errors.email ? "error" : ""}
              autoComplete="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="At least 8 characters"
              className={errors.password ? "error" : ""}
              autoComplete="new-password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "error" : ""}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.role ? "error" : ""}
              required
            >
              <option value="" disabled>Select your role</option>
              <option value="disabled">Disabled</option>
              <option value="volunteer">Volunteer</option>
              <option value="organization">Organization</option>
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <button className="link-btn" onClick={() => navigate("/login")}>Sign in</button></p>
        </div>
      </div>

      <style jsx>{`
        /* Base Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background-color: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .register-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 32px;
          margin: 16px;
        }

        /* Header */
        .register-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .register-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .register-header p {
          color: #718096;
          font-size: 0.875rem;
        }

        /* Alerts */
        .alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .alert.error {
          background-color: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fed7d7;
        }

        .alert.success {
          background-color: #f0fff4;
          color: #38a169;
          border: 1px solid #c6f6d5;
        }

        /* Form */
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
        }

        .input-group input,
        .input-group select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          -webkit-appearance: none;
        }

        .input-group input:focus,
        .input-group select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }

        .input-group input.error,
        .input-group select.error {
          border-color: #e53e3e;
        }

        .input-group input.error:focus,
        .input-group select.error:focus {
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.2);
        }

        .error-text {
          color: #e53e3e;
          font-size: 0.75rem;
        }

        .input-group select {
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          cursor: pointer;
        }

        /* Button */
        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #3182ce;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .register-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #718096;
        }

        .link-btn {
          background: none;
          border: none;
          color: #4299e1;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        .link-btn:hover {
          text-decoration: underline;
        }

        /* Mobile Optimizations */
        @media (max-width: 480px) {
          .register-card {
            padding: 24px;
            margin: 8px;
          }

          .register-header h1 {
            font-size: 1.25rem;
          }

          .input-group input,
          .input-group select {
            padding: 0.625rem 0.875rem;
          }

          /* Prevent zoom on input focus on mobile */
          @media screen and (max-width: 480px) {
            input, select {
              font-size: 16px;
            }
          }
        }

        @media (max-width: 360px) {
          .register-card {
            padding: 20px 16px;
          }

          .submit-btn {
            height: 40px;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;