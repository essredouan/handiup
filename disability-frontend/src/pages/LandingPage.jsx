import React from "react";
import { Link } from "react-router-dom";
import "../index";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">HandiConnect</div>
        <nav>
          <Link to="/">Accueil</Link>
          <Link to="/about">À propos</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/register" className="btn-register">Créer un compte</Link>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Connecter les capacités, pas les limites</h1>
          <p>Une plateforme inclusive dédiée aux personnes en situation de handicap, bénévoles et organisations solidaires.</p>
          <Link to="/register" className="cta-button">Rejoignez-nous</Link>
        </div>
        <div className="hero-image">
          <img src="/hc3.jpeg" alt="Inclusion" />
        </div>
      </main>

      <section className="features-section">
        <h2>Fonctionnalités clés</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Événements adaptés</h3>
            <p>Participez à des activités accessibles selon vos besoins.</p>
          </div>
          <div className="feature-card">
            <h3>Aide & Bénévolat</h3>
            <p>Recevez ou proposez une aide humaine ou matérielle.</p>
          </div>
          <div className="feature-card">
            <h3>Emplois inclusifs</h3>
            <p>Opportunités professionnelles pensées pour vous.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} HandiConnect. Pour une société inclusive.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
