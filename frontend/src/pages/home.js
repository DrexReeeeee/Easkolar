// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/root.css"; // global styles
import "../styles/home.css"; // page-specific styles

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to EaseKolar</h1>
      <p>Empowering students to achieve their dreams through scholarships.</p>

      <div className="home-buttons">
        <Link to="/signin" className="btn-primary">
          Sign In
        </Link>
        <Link to="/signup" className="btn-outline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home;
