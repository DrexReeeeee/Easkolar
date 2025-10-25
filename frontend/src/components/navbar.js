import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="/assets/LOGO.png"
            alt="EaseKolar Logo"
            className="me-2"
            style={{ width: "40px", height: "40px" }}
          />
          <span className="fw-bold text-primary fs-4">EaseKolar</span>
        </Link>

        {/* Center: Navigation Links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className={`nav-link ${isActiveLink("/")}`} to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActiveLink("/scholarships")}`} to="/scholarships">
              Scholarships
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActiveLink("/about")}`} to="/about">
              About
            </Link>
          </li>
        </ul>

        {/* Right: Action Buttons */}
        <div className="navbar-actions">
          <Link to="/signin" className="btn-outline-primary">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}