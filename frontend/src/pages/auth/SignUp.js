import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/root.css";
import "../../styles/signup.css";

import { FaEye, FaEyeSlash, FaArrowRight, FaRocket } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/signup",
        formData
      );
      console.log("Signup success:", res.data);
      navigate("/signin");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-responsive">
      {/* Responsive Background Elements */}
      <div className="signup-orb signup-orb-1"></div>
      <div className="signup-orb signup-orb-2"></div>
      
      <div className="signup-wrapper">
        {/* Left Panel - Visual (Swapped from sign-in) */}
        <div className="signup-left">
          <div className="signup-visual">
            <div className="signup-visual-core">
              <div className="signup-core-shape"></div>
              <img 
                src="../assets/signup-img.png" 
                alt="Join Scholarship Platform" 
                className="signup-core-image" 
              />
            </div>
            
            <div className="signup-badge signup-badge-1">
              <span>🚀</span>
            </div>
            <div className="signup-badge signup-badge-2">
              <span>🎯</span>
            </div>
            <div className="signup-badge signup-badge-3">
              <span>💫</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Form (Swapped from sign-in) */}
        <div className="signup-right">
          <div className="signup-header">
            <div className="signup-logo">
              <FaRocket className="signup-logo-icon" />
              <span>EASEKOLAR</span>
            </div>
          </div>

          <div className="signup-content">
            <div className="signup-title-group">
              <h1 className="signup-title">SIGN UP</h1>
              <div className="signup-underline"></div>
            </div>

            <p className="signup-subtitle">
              Join EaseKolar and unlock scholarship opportunities with ease.
            </p>

            <form onSubmit={handleSubmit} className="signup-form">
              {/* Name Row */}
              <div className="signup-name-row">
                <div className="signup-input-group">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="signup-input"
                  />
                </div>

                <div className="signup-input-group">
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="signup-input"
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="signup-input"
                />
              </div>

              <div className="signup-input-group">
                <div className="signup-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="signup-input"
                  />
                  <button
                    type="button"
                    className="signup-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="signup-input-group">
                <div className="signup-password">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="signup-input"
                  />
                  <button
                    type="button"
                    className="signup-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="signup-actions">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="signup-btn"
                >
                  <span className="signup-btn-text">
                    {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </span>
                  <FaArrowRight className="signup-btn-icon" />
                </button>
              </div>
            </form>

            {error && (
              <div className="signup-error">
                <div className="signup-error-dot"></div>
                {error}
              </div>
            )}

            <div className="signup-signin">
              <span>Already have an account?</span>
              <Link to="/signin" className="signup-signin-link">
                SIGN IN <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;