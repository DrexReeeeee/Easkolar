import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/root.css";
import "../styles/navbar.css";

import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActiveLink = (path) => (location.pathname === path ? "active" : "");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo & Brand - Keeping your exact structure */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img
            src="/assets/logo-trans.png"
            alt="EaseKolar Logo"
            className="brand-logo"
          />
          <span className="brand-text">
            <span className="brand-ease">Ease</span>
            <span className="brand-kolar">Kolar</span>
          </span>
        </Link>

        {/* Center: Navigation Links - Enhanced but familiar */}
        <div className={`navbar-links-wrapper ${isMenuOpen ? "mobile-open" : ""}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActiveLink("/")}`} 
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActiveLink("/scholarships")}`}
                to="/scholarships"
                onClick={closeMenu}
              >
                Scholarships
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActiveLink("/about")}`} 
                to="/about"
                onClick={closeMenu}
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: Action Buttons - Enhanced interactions */}
        <div className="navbar-actions">
          <Link to="/signin" className="btn-outline-primary">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Overlay */}
        {isMenuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}