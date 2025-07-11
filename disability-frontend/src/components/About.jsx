import React from 'react';
import { FaAccessibleIcon, FaHandsHelping, FaLightbulb, FaUsers, FaChartLine, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutPage = () => {
  // Image URLs
  const images = {
    headerBg: "https://media.gettyimages.com/id/520779162/photo/group-of-special-needs-girls-with-instructor-in-gym.jpg?s=612x612&w=0&k=20&c=htq_FWBPzidNDqQPwGl4WJSscwXKcL2sjpVJ0mhlC2w=",
    missionImage: "https://media.gettyimages.com/id/2168909018/photo/occupational-therapy.jpg?s=612x612&w=0&k=20&c=FuYUXmxBcQ3w0hPfTR_lyVzuEnzSAG82N7V-ZviTEYY=",
    teamMember1: "essoubai.jpg",
    gallery1: "https://media.gettyimages.com/id/1529812292/photo/asian-indian-disabled-woman-in-wheelchair-participate-in-business-conference-workshop-leading.jpg?s=612x612&w=0&k=20&c=RP9KCWSmvMU66uMQgfdctcJ0NkFckCpq43AierhWd_Y=",
    gallery2: "https://media.gettyimages.com/id/1372606890/photo/mid-adult-man-talking-in-a-meeting-at-a-community-center-including-a-disabled-person.jpg?s=612x612&w=0&k=20&c=qYs76JaLVgsuXSziEQJiBH5OhPelE89GlB9nID1YRxs=",
    gallery3: "https://media.gettyimages.com/id/1654534783/photo/disable-asian-indian-entrepreneur-in-wheelchair-asking-question-at-business-conference-among.jpg?s=612x612&w=0&k=20&c=rCuiAZvJrgLnySHKY9R9kvYgJD0NrUSfZtY2sz5ajbE=",
    gallery4: "https://media.gettyimages.com/id/1726577787/photo/man-in-a-wheelchair-giving-a-speech-in-a-conference.jpg?s=612x612&w=0&k=20&c=KSFN6N5UIe55rkyUXryiDiulqDJ4_7cgor9jFOqgUw0=",
    ctaBg: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
  };

  return (
    <div className="about-container">
      {/* Header Section */}
      <header className="about-header">
        <div className="header-content">
          <motion.h1 
            className="header-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About HandiUp
          </motion.h1>
          <motion.p 
            className="header-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Building bridges to opportunity through accessibility and innovation
          </motion.p>
        </div>
      </header>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-content">
          <div className="mission-text">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-description">
              We're dedicated to creating a world where disability doesn't limit potential. 
              Through technology, community, and advocacy, we're breaking down barriers 
              and building inclusive pathways to success.
            </p>
            <div className="mission-stats">
              <div className="stat-item">
                <div className="stat-number">2025</div>
                <div className="stat-label">Founded</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1K+</div>
                <div className="stat-label">Members</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Accessible</div>
              </div>
            </div>
          </div>
          <div className="mission-image-container">
            <motion.div 
              className="mission-image"
              style={{ backgroundImage: `url(${images.missionImage})` }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-content">
          <h2 className="section-title centered">Our Core Values</h2>
          <div className="values-grid">
            <motion.div 
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="value-icon">
                <FaAccessibleIcon />
              </div>
              <h3>Accessibility First</h3>
              <p>We design every experience with diverse needs in mind from the start.</p>
            </motion.div>
            
            <motion.div 
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="value-icon">
                <FaUsers />
              </div>
              <h3>Community Power</h3>
              <p>We believe in the collective strength of shared experiences and support.</p>
            </motion.div>
            
            <motion.div 
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="value-icon">
                <FaLightbulb />
              </div>
              <h3>Innovative Solutions</h3>
              <p>We challenge assumptions to create better ways forward.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="section-content">
          <div className="impact-text">
            <h2 className="section-title">Making an Impact</h2>
            <p>
              Since our founding, we've helped thousands of individuals with disabilities find meaningful 
              employment, access vital resources, and connect with supportive communities.
            </p>
            <ul className="impact-list">
              <li>85% of members report increased confidence in their abilities</li>
              <li>3x more likely to find employment through our network</li>
              <li>92% satisfaction rate with our accessibility features</li>
            </ul>
          </div>
          <div className="impact-visual">
            <div className="impact-image-grid">
              <motion.div 
                className="impact-image"
                style={{ backgroundImage: `url(${images.gallery1})` }}
                whileHover={{ scale: 1.03 }}
              />
              <motion.div 
                className="impact-image"
                style={{ backgroundImage: `url(${images.gallery2})` }}
                whileHover={{ scale: 1.03 }}
              />
              <motion.div 
                className="impact-image"
                style={{ backgroundImage: `url(${images.gallery3})` }}
                whileHover={{ scale: 1.03 }}
              />
              <motion.div 
                className="impact-image"
                style={{ backgroundImage: `url(${images.gallery4})` }}
                whileHover={{ scale: 1.03 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-content">
          <h2 className="section-title centered">Meet Our Leadership</h2>
          <div className="team-grid">
            <motion.div 
              className="team-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div 
                className="team-image"
                style={{ backgroundImage: `url(${images.teamMember1})` }}
              />
              <div className="team-info">
                <h3>Redouan Essoubai</h3>
                <p className="team-role">Founder & CEO</p>
                <p className="team-bio">
                  Passionate accessibility advocate with a vision for inclusive technology.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-content">
          <h2 className="section-title">Ready to join our community?</h2>
          <p>
            Whether you're seeking support, opportunities, or ways to contribute, we welcome you.
          </p>
          <motion.a 
            href="/register" 
            className="cta-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started <FaChevronRight className="cta-icon" />
          </motion.a>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx global>{`
        :root {
          --primary: #2563eb;
          --primary-light: #3b82f6;
          --primary-dark: #1d4ed8;
          --secondary: #7c3aed;
          --accent: #10b981;
          --light: #f8fafc;
          --dark: #0f172a;
          --gray: #64748b;
          --light-gray: #e2e8f0;
          --border-radius: 12px;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.5;
          color: var(--dark);
          background-color: var(--light);
        }
        
        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          overflow-x: hidden;
        }
        
        /* Header Styles */
        .about-header {
          padding: 100px 20px;
          text-align: center;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .header-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        
        .header-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .header-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }
        
        /* Section Styles */
        .section-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
        }
        
        .section-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--primary-dark);
          position: relative;
          display: inline-block;
        }
        
        .section-title:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50%;
          height: 4px;
          background: var(--accent);
          border-radius: 2px;
        }
        
        .centered {
          text-align: center;
          display: block;
        }
        
        .centered:after {
          left: 50%;
          transform: translateX(-50%);
        }
        
        .section-description {
          font-size: 1.125rem;
          color: var(--gray);
          margin-bottom: 2rem;
          max-width: 600px;
        }
        
        /* Mission Section */
        .mission-section {
          background-color: white;
        }
        
        .mission-section .section-content {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          align-items: center;
        }
        
        .mission-text {
          flex: 1;
          min-width: 300px;
        }
        
        .mission-image-container {
          flex: 1;
          min-width: 300px;
        }
        
        .mission-image {
          height: 400px;
          border-radius: var(--border-radius);
          background-size: cover;
          background-position: center;
          box-shadow: var(--shadow-lg);
        }
        
        .mission-stats {
          display: flex;
          gap: 20px;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        
        .stat-item {
          background: var(--light);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          min-width: 120px;
        }
        
        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: var(--gray);
        }
        
        /* Values Section */
        .values-section {
          background-color: var(--light);
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 2rem;
        }
        
        .value-card {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          transition: var(--transition);
        }
        
        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        
        .value-icon {
          font-size: 2rem;
          color: var(--primary);
          margin-bottom: 1rem;
        }
        
        .value-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--dark);
        }
        
        .value-card p {
          color: var(--gray);
        }
        
        /* Impact Section */
        .impact-section {
          background-color: white;
        }
        
        .impact-section .section-content {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          align-items: center;
        }
        
        .impact-text {
          flex: 1;
          min-width: 300px;
        }
        
        .impact-visual {
          flex: 1;
          min-width: 300px;
        }
        
        .impact-list {
          margin-top: 1.5rem;
          list-style-type: none;
        }
        
        .impact-list li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 0.75rem;
        }
        
        .impact-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: bold;
        }
        
        .impact-image-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .impact-image {
          height: 150px;
          border-radius: var(--border-radius);
          background-size: cover;
          background-position: center;
          transition: var(--transition);
        }
        
        /* Team Section */
        .team-section {
          background-color: var(--light);
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 2rem;
        }
        
        .team-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: var(--transition);
        }
        
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        
        .team-image {
          height: 250px;
          background-size: cover;
          background-position: center;
        }
        
        .team-info {
          padding: 1.5rem;
        }
        
        .team-info h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        
        .team-role {
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }
        
        .team-bio {
          color: var(--gray);
          font-size: 0.9375rem;
        }
        
        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          text-align: center;
          padding: 100px 20px;
        }
        
        .cta-section .section-title {
          color: white;
        }
        
        .cta-section .section-title:after {
          background: white;
        }
        
        .cta-section p {
          max-width: 600px;
          margin: 0 auto 2rem;
          opacity: 0.9;
        }
        
        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: var(--primary);
          padding: 0.875rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .cta-icon {
          transition: transform 0.3s ease;
        }
        
        .cta-button:hover .cta-icon {
          transform: translateX(3px);
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .header-title {
            font-size: 2.25rem;
          }
          
          .header-subtitle {
            font-size: 1.1rem;
          }
          
          .section-title {
            font-size: 1.75rem;
          }
          
          .mission-image {
            height: 300px;
          }
          
          .impact-image-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;