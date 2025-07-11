import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.from_name.trim()) newErrors.from_name = 'Name is required';
    if (!formData.from_email.trim()) newErrors.from_email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) newErrors.from_email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus(null);

    try {
      await emailjs.send(
        'service_abc123', // Replace with your EmailJS service ID
        'template_zbfy1cc', // Replace with your EmailJS template ID
        {
          from_name: formData.from_name,
          from_email: formData.from_email,
          message: formData.message,
          to_email: 'essoubairedouaness@gmail.com'
        },
        'WOA0KCfru8nWhqj-F' // Replace with your EmailJS user ID (public key)
      );
      setStatus('success');
      setFormData({ from_name: '', from_email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you! Reach out for questions, partnerships, or just to say hello.</p>
        </motion.div>
        <div className="hero-wave"></div>
      </section>

      {/* Main Content */}
      <div className="contact-main">
        {/* Contact Info */}
        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="info-card">
            <div className="info-icon">
              <FiMail />
            </div>
            <div className="info-text">
              <h3>Email Us</h3>
              <a href="mailto:essoubairedouaness@gmail.com">essoubairedouaness@gmail.com</a>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FiPhone />
            </div>
            <div className="info-text">
              <h3>Call Us</h3>
              <a href="tel:+212614510462">+212 614 510 462</a>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FiMapPin />
            </div>
            <div className="info-text">
              <h3>Visit Us</h3>
              <p>Technopark Agadir, Agadir, Morocco</p>
            </div>
          </div>

          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          className="contact-form-wrapper"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Send a Message</h2>
            
            {status === 'success' && (
              <div className="form-alert success">
                <p>Your message has been sent successfully!</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="form-alert error">
                <p>Failed to send message. Please try again.</p>
              </div>
            )}

            <div className="form-group">
              <div className="input-icon">
                <FiUser />
              </div>
              <input
                type="text"
                name="from_name"
                placeholder="Your Name"
                value={formData.from_name}
                onChange={handleChange}
                className={errors.from_name ? 'error' : ''}
              />
              {errors.from_name && <span className="error-message">{errors.from_name}</span>}
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FiMail />
              </div>
              <input
                type="email"
                name="from_email"
                placeholder="Your Email"
                value={formData.from_email}
                onChange={handleChange}
                className={errors.from_email ? 'error' : ''}
              />
              {errors.from_email && <span className="error-message">{errors.from_email}</span>}
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FiMessageSquare />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={errors.message ? 'error' : ''}
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <FiSend /> Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Map Section */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.321313398931!2d-9.57483792417138!3d30.41660887475036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6fd13c8e6d5%3A0x6a1c912a3a1b3d8a!2sTechnopark%20Agadir!5e0!3m2!1sen!2sma!4v1710000000000!5m2!1sen!2sma"
          allowFullScreen
          loading="lazy"
          title="Our Location"
        ></iframe>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        :root {
          --primary: #4361ee;
          --primary-dark: #3a0ca3;
          --primary-light: #4895ef;
          --secondary: #f72585;
          --accent: #4cc9f0;
          --light: #f8f9fa;
          --dark: #212529;
          --gray: #6c757d;
          --light-gray: #e9ecef;
          --success: #4bb543;
          --error: #ff3333;
          --white: #ffffff;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
          --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
          --transition: all 0.3s ease;
        }

        /* Base Styles */
        .contact-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--dark);
          line-height: 1.6;
        }

        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          text-align: center;
          padding: 6rem 2rem 8rem;
          position: relative;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .hero-content p {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .hero-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='%23f8f9fa'/%3E%3C/svg%3E");
          background-size: cover;
          background-repeat: no-repeat;
        }

        /* Main Content */
        .contact-main {
          max-width: 1200px;
          margin: -4rem auto 4rem;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          position: relative;
          z-index: 1;
        }

        /* Contact Info */
        .contact-info {
          background: var(--white);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-card {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: rgba(67, 97, 238, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .info-text h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .info-text a, .info-text p {
          color: var(--gray);
          transition: var(--transition);
        }

        .info-text a:hover {
          color: var(--primary);
        }

        .social-links h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--dark);
        }

        .social-icons {
          display: flex;
          gap: 1rem;
        }

        .social-icons a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--light-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray);
          transition: var(--transition);
        }

        .social-icons a:hover {
          background: var(--primary);
          color: var(--white);
          transform: translateY(-3px);
        }

        /* Contact Form */
        .contact-form-wrapper {
          background: var(--white);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-form h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .form-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 15px;
          color: var(--gray);
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: 1px solid var(--light-gray);
          border-radius: 10px;
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition);
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }

        .contact-form textarea {
          min-height: 150px;
          resize: vertical;
        }

        .error {
          border-color: var(--error) !important;
        }

        .error:focus {
          box-shadow: 0 0 0 3px rgba(255, 51, 51, 0.2) !important;
        }

        .error-message {
          color: var(--error);
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: block;
        }

        .submit-btn {
          background: linear-gradient(to right, var(--primary), var(--primary-dark));
          color: var(--white);
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: var(--transition);
          margin-top: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: var(--white);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-alert {
          padding: 1rem;
          border-radius: 8px;
          font-weight: 500;
        }

        .form-alert.success {
          background: rgba(75, 181, 67, 0.1);
          color: var(--success);
          border-left: 4px solid var(--success);
        }

        .form-alert.error {
          background: rgba(255, 51, 51, 0.1);
          color: var(--error);
          border-left: 4px solid var(--error);
        }

        /* Map Section */
        .map-container {
          width: 100%;
          height: 400px;
          margin-top: 4rem;
        }

        .map-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .contact-hero {
            padding: 4rem 1.5rem 6rem;
          }

          .hero-content h1 {
            font-size: 2.25rem;
          }

          .hero-content p {
            font-size: 1.1rem;
          }

          .contact-main {
            margin-top: -2rem;
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .contact-hero {
            padding: 3rem 1rem 5rem;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .contact-info,
          .contact-form-wrapper {
            padding: 1.5rem;
          }

          .info-card {
            flex-direction: column;
            gap: 1rem;
          }

          .info-icon {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;