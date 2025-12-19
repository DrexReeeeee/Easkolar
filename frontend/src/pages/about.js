import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/root.css";
import "../styles/about.css";

export default function About() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/signup");
  const handleBackToHome = () => navigate("/");

  return (
    <div className="about-page" style={{ paddingTop: '80px' }}>
      {/* Abstract Background Elements (consistent with home) */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Header with back navigation */}
      <header className="about-header">
        <div className="page-wrapper">
          <div className="header-content">
            <h1 className="about-main-title">
              <span className="title-accent">About</span> Easekolar
            </h1>
            <p className="about-subtitle">
              A student-built platform designed to simplify scholarship discovery 
              for fellow scholars.
            </p>
          </div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="page-wrapper">
          <div className="section-header">
            <div className="section-number">01</div>
            <h2>Our Mission</h2>
            <div className="section-underline"></div>
          </div>
          <div className="mission-content">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Simplify Scholarship Discovery</h3>
              <p>
                To help students find relevant 
                scholarships efficiently by reducing the time spent searching 
                through countless opportunities. We focus on quality matches 
                that align with each student's unique profile and eligibility.
              </p>
            </div>
            <div className="mission-stats">
              <div className="stat">
                <div className="stat-number">2</div>
                <div className="stat-label">Developers</div>
              </div>
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Student-Built</div>
              </div>
              <div className="stat">
                <div className="stat-number">USC</div>
                <div className="stat-label">Talamban Campus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="page-wrapper">
          <div className="section-header dark">
            <div className="section-number">02</div>
            <h2>Our Values</h2>
            <div className="section-underline"></div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>By Students, For Students</h3>
              <p>
                Built with firsthand understanding of student challenges. 
                Every feature addresses real pain points we've experienced 
                in our own scholarship search journey.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔍</div>
              <h3>Clarity & Efficiency</h3>
              <p>
                Eliminate information overload. We present only relevant 
                scholarships with clear requirements and deadlines, saving 
                valuable study time.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>Educational Impact</h3>
              <p>
                We believe in empowering fellow students to focus on 
                learning rather than worrying about financial barriers 
                to education.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Practical Innovation</h3>
              <p>
                Applying classroom knowledge to solve real-world problems. 
                This project represents our commitment to practical 
                software engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="page-wrapper">
          <div className="story-content">
            <div className="story-text">
              <div className="section-header">
                <div className="section-number">03</div>
                <h2>Our Story</h2>
                <div className="section-underline"></div>
              </div>
              <div className="story-body">
                <p>
                  Easekolar began as a school Web Development project at University of San Carlos 
                  Talamban Campus. As Computer Science students, we saw an opportunity 
                  to apply our technical skills to a problem we understood intimately 
                  — the challenging and time-consuming process of finding scholarships.
                </p>
                <p>
                  We personally experienced the frustration of navigating through 
                  scattered scholarship information, missing deadlines, and applying 
                  to opportunities we weren't eligible for. This project became our 
                  chance to create a solution that could help fellow Carolinians 
                  focus more on their studies and less on financial worries.
                </p>
                <div className="story-quote">
                  <div className="quote-mark">"</div>
                  <p className="quote-text">
                    We built what we wished existed — a smart, student-friendly 
                    platform that makes scholarship discovery straightforward and efficient.
                  </p>
                  <div className="quote-author">— Osbev & Drixyl</div>
                </div>
              </div>
            </div>
            <div className="story-visual">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-date">2025</div>
                  <div className="timeline-content">
                    <h4>Development Begins</h4>
                    <p>Started building Easekolar as our school project</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">Present</div>
                  <div className="timeline-content">
                    <h4>Platform Launch</h4>
                    <p>Making scholarship matching accessible to USC students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="page-wrapper">
          <div className="section-header">
            <div className="section-number">04</div>
            <h2>Behind Easekolar</h2>
            <div className="section-underline"></div>
          </div>
          <div className="team-intro">
            <p>
              We're Computer Science students from University of San Carlos Talamban Campus, 
              combining our complementary skills to build a platform that helps fellow 
              students overcome financial barriers in education.
            </p>
          </div>
          <div className="team-members">
            <div className="member-card">
              <div className="member-avatar">OC</div>
              <h3>Osbev Cabucos</h3>
              <p className="member-role">Frontend Developer</p>
              <p className="member-bio">
                Focuses on creating intuitive user interfaces and seamless experiences. 
                Ensures the platform is accessible, responsive, and student-friendly.
              </p>
              <div className="member-socials">
                <a href="#" className="social-placeholder" title="GitHub (Coming Soon)">GitHub</a>
                <a href="#" className="social-placeholder" title="LinkedIn (Coming Soon)">LinkedIn</a>
                <a href="#" className="social-placeholder" title="Portfolio (Coming Soon)">Portfolio</a>
              </div>
            </div>
            
            <div className="member-card">
              <div className="member-avatar">DN</div>
              <h3>Drixyl Nacu</h3>
              <p className="member-role">Backend Developer</p>
              <p className="member-bio">
                Handles server architecture, database management, and AI integration. 
                Builds the robust systems that power our intelligent matching algorithms.
              </p>
              <div className="member-socials">
                <a href="#" className="social-placeholder" title="GitHub (Coming Soon)">GitHub</a>
                <a href="#" className="social-placeholder" title="LinkedIn (Coming Soon)">LinkedIn</a>
                <a href="#" className="social-placeholder" title="Portfolio (Coming Soon)">Portfolio</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="page-wrapper">
          <div className="cta-content">
            <h2>Built by Carolinians, For Carolinians</h2>
            <p>
              Join us in making scholarship discovery easier for every USC student. 
              This is more than a project — it's our contribution to the student community.
            </p>
            <button className="primary-cta" onClick={handleGetStarted}>
              START YOUR JOURNEY
            </button>
          </div>
        </div>
      </section>

      {/* Footer (consistent with home) */}
      <footer className="minimal-footer">
        <div className="page-wrapper">
          <div className="footer-content">
            <div className="footer-brand">
              <img
                src="/assets/logo-trans.png"
                alt="EaseKolar Logo"
                className="me-2"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="footer-logo">EASEKOLAR</div>
              <div className="footer-tagline">
                A University of San Carlos Talamban Campus Project
              </div>
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
            <span>© 2025 EASEKOLAR | Built by Osbev & Drixyl</span>
            <span>UNIVERSITY OF SAN CARLOS TALAMBAN CAMPUS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}