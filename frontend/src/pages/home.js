import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/root.css";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/signup");

  return (
    <div className="home-page" style={{ paddingTop: '80px' }}>
      {/* Abstract Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      
      {/* Hero with Asymmetric Layout */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="title-block">
            <h1 className="main-title">
              <span className="title-line">EMPOWERING</span>
              <span className="title-line accent-line">SCHOLARS</span>
              <span className="title-line">EVERYWHERE</span>
            </h1>
            <div className="title-underline"></div>
          </div>
          
          <p className="hero-statement">
            Future-focused scholarship matching. 
            <span className="highlight-text"> No fluff, just opportunities.</span>
          </p>

          <div className="cta-section">
            <button className="primary-cta" onClick={handleGetStarted}>
              START YOUR JOURNEY
            </button>
            <div className="cta-arrow">↗</div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">🎓</div>
            <span>Scholarship Matches</span>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⚡</div>
            <span>Instant Alerts</span>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📊</div>
            <span>Track Progress</span>
          </div>
          <div className="main-visual">
            <div className="gradient-sphere"></div>
          </div>
        </div>
      </section>

      {/* Diagonal Feature Section */}
      <section className="features-section">
        <div className="section-angle"></div>
        
        <div className="feature-stack">
          <div className="feature-item">
            <div className="feature-number">01</div>
            <h3>AI-Powered Matching</h3>
            <p>Smart algorithms that learn your profile and recommend perfect scholarship fits</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-number">02</div>
            <h3>Real-Time Tracking</h3>
            <p>Monitor application statuses and deadlines with live updates</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-number">03</div>
            <h3>Verified Opportunities</h3>
            <p>Every scholarship manually verified for legitimacy and accuracy</p>
          </div>
        </div>
      </section>

      {/* Stats Marquee */}
      <div className="stats-marquee">
        <div className="marquee-track">
          <span className="stat-item">5000+ ACTIVE SCHOLARSHIPS</span>
          <span className="stat-divider">•</span>
          <span className="stat-item">$2M+ IN AWARDS</span>
          <span className="stat-divider">•</span>
          <span className="stat-item">98% MATCH ACCURACY</span>
          <span className="stat-divider">•</span>
          <span className="stat-item">24/7 SUPPORT</span>
          <span className="stat-divider">•</span>
          <span className="stat-item">5000+ ACTIVE SCHOLARSHIPS</span>
          <span className="stat-divider">•</span>
          <span className="stat-item">$2M+ IN AWARDS</span>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="minimal-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img
            src="/assets/logo-trans.png"
            alt="EaseKolar Logo"
            className="me-2"
            style={{ width: "50px", height: "50px" }}
            />
            <div className="footer-logo">EASEKOLAR</div>
            <div className="footer-tagline">Redefining educational access</div>
          </div>
          
          <div className="footer-actions">
            <button className="footer-cta" onClick={handleGetStarted}>
              JOIN NOW
            </button>
            <div className="social-links">
              <a href="#" className="social-link">GitHub</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>© 2025 EASEKOLAR</span>
          <span>BUILT FOR THE FUTURE OF EDUCATION</span>
        </div>
      </footer>
    </div>
  );
}