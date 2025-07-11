import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import PostsList from "../components/PostsList";
import { FaUsers, FaHandsHelping, FaLightbulb, FaChartLine, FaHeart, FaComments, FaChevronRight, FaChevronLeft, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const postsPerPage = 6;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetchPostsAndComments();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPostsAndComments = async () => {
    try {
      setLoading(true);
      const [postsRes, commentsData] = await Promise.all([
        axios.get("http://localhost:5000/api/posts"),
        fetchCommentsForAllPosts()
      ]);

      setPosts(postsRes.data);
      setComments(commentsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsForAllPosts = async () => {
    try {
      const postsRes = await axios.get("http://localhost:5000/api/posts");
      const commentsPromises = postsRes.data.map(post => 
        axios.get(`http://localhost:5000/api/comments/post/${post._id}`)
          .then(res => ({ postId: post._id, comments: res.data }))
          .catch(() => ({ postId: post._id, comments: [] }))
      );

      const commentsResults = await Promise.all(commentsPromises);
      return commentsResults.reduce((acc, { postId, comments }) => {
        acc[postId] = comments;
        return acc;
      }, {});
    } catch (err) {
      console.error("Error fetching comments:", err);
      return {};
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="home-page">
        <Header />
        <main className="main-content">
          <LoadingSpinner fullPage />
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      {isLoggedIn && <Header />}
      <main className={`main-content ${!isLoggedIn ? 'full-screen-landing' : ''}`}>
        {!isLoggedIn ? (
          <LandingPage />
        ) : (
          <>
            <section className="posts-section" aria-labelledby="posts-heading">
              <h2 id="posts-heading" className="section-title">Community Posts</h2>
              <PostsList posts={currentPosts} comments={comments} />
            </section>
            
            {posts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      <Footer />

      <style jsx global>{`
        :root {
          --color-primary: #4a6fa5;
          --color-primary-dark: #3a5a8a;
          --color-secondary: #6e8efb;
          --color-accent: #a777e3;
          --color-text-primary: #2c3e50;
          --color-text-secondary: #7f8c8d;
          --color-background: #f5f7fa;
          --color-white: #ffffff;
          --color-border: #e0e0e0;
          --color-disabled: #e0e0e0;
          --color-success: #4CAF50;
        }

        /* HomePage styles */
        .home-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--color-background);
        }

        .main-content {
          flex: 1;
          padding: 2rem 5%;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .main-content.full-screen-landing {
          max-width: 100%;
          padding: 0;
        }

        /* Landing Page Styles */
        .landing-hero {
          text-align: center;
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          color: white;
          margin-bottom: 0;
          box-shadow: none;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.pexels.com/photos/2026764/pexels-photo-2026764.jpeg');
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          padding: 2rem;
        }

        .hero-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          max-width: 800px;
          margin: 0 auto 2rem;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .cta-button {
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .primary-button {
          background-color: white;
          color: var(--color-primary);
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .secondary-button {
          background-color: transparent;
          color: white;
          border: 2px solid white;
        }

        .secondary-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .features-section {
          padding: 3rem 5%;
        }

        .section-title {
          text-align: center;
          font-size: 2.2rem;
          color: var(--color-primary);
          margin-bottom: 3rem;
          position: relative;
        }

        .section-title:after {
          content: '';
          display: block;
          width: 80px;
          height: 4px;
          background: var(--color-accent);
          margin: 1rem auto 0;
          border-radius: 2px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .feature-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          text-align: center;
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .feature-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(167, 119, 227, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-icon {
          font-size: 2rem;
          color: var(--color-accent);
        }

        .feature-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--color-text-primary);
        }

        .feature-description {
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          color: white;
          padding: 4rem 5%;
          margin: 0;
          position: relative;
          overflow: hidden;
        }

        .stats-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://equity.ucla.edu/wp-content/uploads/2021/06/iStock-1298415912-1200x750.jpg');
          background-size: cover;
          background-position: center;
          opacity: 0.1;
          z-index: 0;
        }

        .stats-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .stat-item {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(5px);
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        /* Testimonials */
        .testimonials-section {
          padding: 3rem 5%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .testimonial-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--color-border);
          position: relative;
        }

        .testimonial-quote {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 3rem;
          color: rgba(167, 119, 227, 0.1);
          font-family: serif;
        }

        .testimonial-text {
          font-style: italic;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-accent);
        }

        .author-info h4 {
          margin: 0;
          font-size: 1.1rem;
        }

        .author-info p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        /* Image Gallery Section */
        .gallery-section {
          padding: 3rem 5%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .gallery-item {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 200px;
          background-color: #eee;
          background-size: cover;
          background-position: center;
        }

        .gallery-item:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        /* Posts Section */
        .posts-section {
          margin-bottom: 3rem;
        }

        /* LoadingSpinner styles */
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .loading-spinner.full-page {
          height: 70vh;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(74, 111, 165, 0.2);
          border-radius: 50%;
          border-top-color: var(--color-primary);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: var(--color-text-secondary);
          font-size: 1rem;
        }

        /* Pagination styles */
        .pagination-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 3rem 0 1rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .pagination-button {
          background-color: var(--color-primary);
          color: var(--color-white);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          min-width: 120px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .pagination-button:hover:not(:disabled) {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
        }

        .pagination-button:disabled {
          background-color: var(--color-disabled);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .page-indicator {
          font-size: 1rem;
          color: var(--color-text-secondary);
          min-width: 150px;
          text-align: center;
        }

        /* Footer styles */
        .site-footer {
          background-color: #2c3e50;
          color: white;
          padding: 3rem 0 0;
          margin-top: 4rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 5%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
        }

        .footer-logo {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
          display: flex;
          align-items: center;
        }

        .footer-logo span {
          color: var(--color-accent);
        }

        .footer-about {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .footer-heading {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          position: relative;
          font-weight: 600;
          color: white;
        }

        .footer-heading:after {
          content: '';
          display: block;
          width: 40px;
          height: 3px;
          background: var(--color-accent);
          margin-top: 0.5rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 0.95rem;
        }

        .footer-link:hover {
          color: var(--color-accent);
          transform: translateX(5px);
        }

        .footer-link svg {
          font-size: 0.9rem;
          color: var(--color-accent);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .contact-icon {
          color: var(--color-accent);
          font-size: 1rem;
          margin-top: 0.2rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-link {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--color-accent);
          transform: translateY(-3px);
        }

        .footer-bottom {
          background: rgba(0, 0, 0, 0.2);
          padding: 1.5rem 5%;
          margin-top: 3rem;
          text-align: center;
        }

        .copyright {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          margin: 0;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .main-content:not(.full-screen-landing) {
            padding: 1.5rem;
          }
          
          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .section-title {
            font-size: 1.8rem;
          }

          .feature-card {
            padding: 1.5rem;
          }

          .footer-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .main-content:not(.full-screen-landing) {
            padding: 1rem;
          }
          
          .hero-title {
            font-size: 1.8rem;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stat-item {
            padding: 1rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="footer-logo">Handi<span>Up</span></div>
          <p className="footer-about">
            HandiUp is a community platform dedicated to empowering individuals with disabilities 
            through connection, resources, and support. Join us in creating a more inclusive world.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/about" className="footer-link">
                <FaChevronRight /> About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="footer-link">
                <FaChevronRight /> we want to hear you
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Contact Info</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>ESSOUBAIREDOUAN@GMAIL.COM</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+212614510462</span>
            </div>
            {/* <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>AGADIR <br />TECHNOPARK</span>
            </div> */}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} HandiUp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <>
      <section className="landing-hero">
        <div className="hero-image-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to HandiUp</h1>
          <p className="hero-subtitle">
            A platform dedicated to empowering individuals with disabilities through community, resources, and opportunities
          </p>
          <div className="cta-buttons">
            <a href="/register" className="cta-button primary-button">
              Join Our Community <FaChevronRight />
            </a>
            <a href="/login" className="cta-button secondary-button">
              Sign In <FaChevronRight />
            </a>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Our Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaUsers className="feature-icon" />
            </div>
            <h3 className="feature-title">Inclusive Community</h3>
            <p className="feature-description">
              Connect with others who understand your experiences in our supportive and moderated community spaces.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaHandsHelping className="feature-icon" />
            </div>
            <h3 className="feature-title">Resources & Support</h3>
            <p className="feature-description">
              Access curated tools, guides, and technologies specifically designed for various disabilities.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaLightbulb className="feature-icon" />
            </div>
            <h3 className="feature-title">Innovation Hub</h3>
            <p className="feature-description">
              Discover and contribute to assistive technologies that make everyday life more accessible.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaChartLine className="feature-icon" />
            </div>
            <h3 className="feature-title">Career Development</h3>
            <p className="feature-description">
              Explore job opportunities and career resources from inclusive employers who value diversity.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaHeart className="feature-icon" />
            </div>
            <h3 className="feature-title">Volunteer Network</h3>
            <p className="feature-description">
              Find volunteers ready to assist or become one yourself to help others in the community.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FaComments className="feature-icon" />
            </div>
            <h3 className="feature-title">Discussion Forums</h3>
            <p className="feature-description">
              Share experiences, ask questions, and get advice in our accessible discussion spaces.
            </p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-bg-overlay"></div>
        <div className="stats-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Community Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Partner Organizations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Report Improved Access</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Accessibility Features</div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">What Our Community Says</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              "This platform has completely changed how I connect with others who understand my daily challenges. The resources here are invaluable."
            </p>
            <div className="testimonial-author">
              <div className="author-info">
                <h4>Sara KHALID.</h4>
                <p>Community Member</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              "As an employer, we've found amazing talent through HandiUp. The platform makes inclusive hiring so much easier."
            </p>
            <div className="testimonial-author">
              <div className="author-info">
                <h4>OMAYMA LESSIGUI.</h4>
                <p>HR Director</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              "The assistive technology discussions helped me find solutions I didn't know existed. This community is a game-changer."
            </p>
            <div className="testimonial-author">
              <div className="author-info">
                <h4>ESSOUBAI REDOUAN.</h4>
                <p>Technology Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <h2 className="section-title">Our Community in Action</h2>
        <div className="gallery-grid">
          <div className="gallery-item" style={{ backgroundImage: 'url(https://www.meetingstoday.com/sites/default/files/styles/mt_default/public/2024-07/Woman%20in%20wheelchair%20at%20a%20business%20meeting.jpg?itok=VeP2QOC0)' }}></div>
          <div className="gallery-item" style={{ backgroundImage: 'url(https://live-production.wcms.abc-cdn.net.au/e943a3f194cea8194a892700516f1bb0?impolicy=wcms_crop_resize&cropH=1688&cropW=3000&xPos=0&yPos=94&width=862&height=485)' }}></div>
          <div className="gallery-item" style={{ backgroundImage: 'url(https://assuretonsport.com/blog/wp-content/uploads/2023/10/paralympics-8251440_1280-1.jpg)' }}></div>
          <div className="gallery-item" style={{ backgroundImage: 'url(https://www.edenseniorhc.com/wp-content/uploads/2024/02/istockphoto-1184362383-612x612-1.jpg)' }}></div>
          <div className="gallery-item" style={{ backgroundImage: 'url(https://joniandfriends.org/wp-content/uploads/2024/05/23_WFTW_West_Bank_0658.jpg)' }}></div>
          <div className="gallery-item" style={{ backgroundImage: 'url(https://disabilityfoundation.org/wp-content/uploads/2021/05/DF-Volunteer-Home-01.png)' }}></div>
        </div>
      </section>
    </>
  );
};

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`loading-spinner ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination-nav" aria-label="Pagination">
      <button
        className="pagination-button prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft /> Previous
      </button>
      
      <span className="page-indicator">
        Page <span className="current-page">{currentPage}</span> of <span className="total-pages">{totalPages}</span>
      </span>
      
      <button
        className="pagination-button next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next <FaChevronRight />
      </button>
    </nav>
  );
};

export default HomePage;