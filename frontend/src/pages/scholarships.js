import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/scholarships.css";

export default function Scholarships() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/signup");
  const handleSignIn = () => navigate("/signin");

  return (
    <div className="scholarships-page" style={{ paddingTop: '80px' }}>
      {/* Abstract Background Elements - SAME AS HOME PAGE */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Hero Section - UPDATED TO MATCH HOME PAGE STYLE */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="title-block">
            <h1 className="main-title">
              <span className="title-line">CEBU'S</span>
              <span className="title-line accent-line">SCHOLARSHIP</span>
              <span className="title-line">NETWORK</span>
            </h1>
            <div className="title-underline"></div>
          </div>
          
          <p className="hero-statement">
            Future-focused scholarship matching for Cebu students. 
            <span className="highlight-text"> No fluff, just verified opportunities.</span>
          </p>

          <div className="cta-section">
            <button className="primary-cta" onClick={handleGetStarted}>
              FIND YOUR MATCHES
            </button>
            <div className="cta-arrow">↗</div>
          </div>
        </div>

        <div className="hero-visual">
          {/* Floating Cards - Scholarship focused */}
          <div className="floating-card card-1">
            <div className="card-icon">🎯</div>
            <span>Personalized Matches</span>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">✅</div>
            <span>Manually Verified</span>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📋</div>
            <span>Cebu-Focused</span>
          </div>
          <div className="main-visual">
            <div className="gradient-sphere"></div>
          </div>
        </div>
      </section>

      {/* Scholarship Sourcing Section */}
      <section className="sourcing-section">
        <div className="page-wrapper">
          <h2 className="section-title">How We Source Scholarships</h2>
          <p className="section-subtitle">Transparency in our process</p>
          
          <div className="sourcing-process">
            <div className="process-step">
              <div className="step-visual">
                <div className="step-circle">1</div>
                <div className="step-connector"></div>
              </div>
              <div className="step-content">
                <h3>Direct Partnership Collection</h3>
                <p>Our team establishes direct partnerships with educational institutions, government offices, and private organizations across Cebu to obtain first-hand scholarship information.</p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-circle">2</div>
                <div className="step-connector"></div>
              </div>
              <div className="step-content">
                <h3>Manual Verification Process</h3>
                <p>Every scholarship opportunity undergoes manual review by our verification team to ensure accuracy, legitimacy, and current availability. We check eligibility requirements, deadlines, and application procedures.</p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-circle">3</div>
                <div className="step-connector"></div>
              </div>
              <div className="step-content">
                <h3>Cebu-Focused Curation</h3>
                <p>We focus exclusively on Cebu-based opportunities, including scholarships from Cebu City Government, Mandaue City, Lapu-Lapu City, Cebu Province, local universities, and Cebu-based private organizations.</p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-circle">4</div>
              </div>
              <div className="step-content">
                <h3>Regular Updates & Maintenance</h3>
                <p>Our administrative team regularly updates scholarship information, removes expired opportunities, and adds new ones as they become available throughout the academic year.</p>
              </div>
            </div>
          </div>
          
          <div className="transparency-note">
            <div className="note-icon">💡</div>
            <div className="note-content">
              <h4>Our Commitment to Accuracy</h4>
              <p>We understand that scholarship information can change. While we strive for accuracy through manual verification, we always recommend confirming details directly with the scholarship provider before applying.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="platform-features">
        <div className="page-wrapper">
          <h2 className="section-title">How EaseKolar Works for You</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Matching</h3>
              <p>Our AI analyzes your profile against verified scholarships to find matches based on your specific eligibility, academic background, and preferences.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Centralized Applications</h3>
              <p>Keep track of all your scholarship applications in one place. Save time by managing deadlines, requirements, and submission statuses efficiently.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Dashboard</h3>
              <p>Monitor your scholarship journey with visual tracking of applications submitted, pending reviews, and awards received.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="scholarships-cta">
        <div className="page-wrapper">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">Start Your Scholarship Journey</h2>
              <p className="cta-subtitle">
                Access our verified database of Cebu scholarships. 
                <span className="highlight-text"> Personalized matches await.</span>
              </p>
              
              <div className="benefits-list">
                <div className="benefit">
                  <span className="checkmark">✓</span>
                  <span>Manually verified Cebu scholarships</span>
                </div>
                <div className="benefit">
                  <span className="checkmark">✓</span>
                  <span>AI-powered personalized matching</span>
                </div>
                <div className="benefit">
                  <span className="checkmark">✓</span>
                  <span>Deadline tracking & reminders</span>
                </div>
                <div className="benefit">
                  <span className="checkmark">✓</span>
                  <span>Application status monitoring</span>
                </div>
              </div>
            </div>
            
            <div className="cta-actions">
              <button className="primary-cta large" onClick={handleGetStarted}>
                GET PERSONALIZED MATCHES
                <span className="cta-arrow">↗</span>
              </button>
              
              <div className="auth-prompt">
                <p>Already have an account?</p>
                <button className="secondary-cta" onClick={handleSignIn}>
                  Sign In to View Your Matches
                </button>
              </div>
              
              <div className="access-note">
                <small>Scholarship details and personalized matches are available after account creation</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="page-wrapper">
          <h2 className="section-title">Common Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Why do I need to sign up to see scholarships?</h3>
              <p>We provide personalized scholarship matches based on your specific profile, academic background, and eligibility. Creating an account allows our AI to tailor recommendations specifically for you.</p>
            </div>
            
            <div className="faq-item">
              <h3>Is EaseKolar free to use?</h3>
              <p>Yes, EaseKolar is completely free for students. We're committed to increasing access to educational opportunities across Cebu.</p>
            </div>
            
            <div className="faq-item">
              <h3>How often are scholarships updated?</h3>
              <p>Our administrative team updates the database regularly as new scholarships are announced and deadlines change, with major updates at the start of each academic semester.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
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
              <div className="footer-tagline">Cebu's Scholarship Matchmaker</div>
            </div>
            
            <div className="footer-actions">
              <button className="footer-cta" onClick={handleGetStarted}>
                FIND SCHOLARSHIPS
              </button>
              <div className="social-links">
                <a href="#" className="social-link">GitHub</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© 2025 EASEKOLAR</span>
            <span>EMPOWERING CEBU'S FUTURE SCHOLARS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}