import React from "react";
import "../index"; // نوصي بفصل CSS فملف مستقل

const HeroHeader = () => {
  return (
    <section className="hero-header">
      <div className="overlay">
        <h2>Welcome to HandiUP Platform</h2>
        <p>SHARE YOUR PROBLEM OR HELP OTHERS</p>

        <div className="cards-wrapper">
          <div className="card">
            <div className="card-icon" role="img" aria-label="Organizations">🏢</div>
            <h3>Organizations</h3>
            <p>Find and connect with organizations that support disabled people.</p>
          </div>
          <div className="card">
            <div className="card-icon" role="img" aria-label="Volunteer">🤝</div>
            <h3>Volunteer</h3>
            <p>Join volunteers who help to improve lives and offer support.</p>
          </div>
          <div className="card">
            <div className="card-icon" role="img" aria-label="Events">📅</div>
            <h3>Events</h3>
            <p>Participate in inclusive events designed for everyone.</p>
          </div>
          <div className="card">
            <div className="card-icon" role="img" aria-label="Disabled">♿</div>
            <h3>Disabled</h3>
            <p>Access tailored services and community resources for disabled users.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHeader;
