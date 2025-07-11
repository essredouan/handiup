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
    
    // Validate on change but only after first blur
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
          "X-Requested-With": "XMLHttpRequest"
        },
        timeout: 10000 // 10 second timeout
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our community today</p>
        </div>

        {serverError && (
          <div className="auth-alert error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your username"
              className={errors.username ? "input-error" : ""}
              autoComplete="username"
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="your@email.com"
              className={errors.email ? "input-error" : ""}
              autoComplete="email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="At least 8 characters"
              className={errors.password ? "input-error" : ""}
              autoComplete="new-password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "input-error" : ""}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.role ? "input-error" : ""}
              required
            >
              <option value="" disabled>Select your role</option>
              <option value="disabled">Disabled</option>
              <option value="volunteer">Volunteer</option>
              <option value="organization">Organization</option>
            </select>
            {errors.role && <div className="error-message">{errors.role}</div>}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <button className="text-button" onClick={() => navigate("/login")}>Sign in</button></p>
        </div>
      </div>

      <style jsx>{`
        /* Base Styles */
        :root {
          --primary: #4361ee;
          --primary-hover: #3a56d4;
          --error: #ef233c;
          --error-light: #fff5f5;
          --success: #06d6a0;
          --success-light: #f0fdf9;
          --text: #2b2d42;
          --text-light: #8d99ae;
          --border: #e9ecef;
          --border-error: #ffb8b8;
          --white: #ffffff;
          --radius: 8px;
          --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Layout */
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: #f8f9fa;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 480px;
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 32px;
        }

        /* Header */
        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-header h1 {
          font-size: 24px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 8px;
        }

        .auth-header p {
          color: var(--text-light);
          margin: 0;
          font-size: 14px;
        }

        /* Alerts */
        .auth-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          border-radius: var(--radius);
          font-size: 14px;
        }

        .auth-alert.error {
          background-color: var(--error-light);
          color: var(--error);
          border: 1px solid var(--border-error);
        }

        .auth-alert.success {
          background-color: var(--success-light);
          color: var(--success);
          border: 1px solid #ccfbf1;
        }

        .auth-alert svg {
          flex-shrink: 0;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
        }

        .input-error {
          border-color: var(--error) !important;
        }

        .input-error:focus {
          box-shadow: 0 0 0 2px rgba(239, 35, 60, 0.2) !important;
        }

        .error-message {
          color: var(--error);
          font-size: 12px;
          margin-top: 4px;
        }

        .form-group select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238D99AE' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          cursor: pointer;
        }

        /* Button */
        .auth-button {
          width: 100%;
          padding: 14px;
          background-color: var(--primary);
          color: var(--white);
          border: none;
          border-radius: var(--radius);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
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

        /* Loading Spinner */
        .loading-spinner {
          width: 20px;
          height: 20px;
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
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: var(--text-light);
        }

        .text-button {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
        }

        .text-button:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .auth-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;