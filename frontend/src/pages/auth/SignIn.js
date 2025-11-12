import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/root.css";
import "../../styles/signin.css";

import { FaEye, FaEyeSlash, FaArrowRight, FaRocket } from "react-icons/fa";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-responsive">
      {/* Responsive Background Elements */}
      <div className="resp-orb resp-orb-1"></div>
      <div className="resp-orb resp-orb-2"></div>
      
      <div className="resp-wrapper">
        {/* Left Panel - Responsive */}
        <div className="resp-left">
          <div className="resp-header">
            <div className="resp-logo">
              <FaRocket className="resp-logo-icon" />
              <span>EASEKOLAR</span>
            </div>
          </div>

          <div className="resp-content">
            <div className="resp-title-group">
              <h1 className="resp-title">SIGN IN</h1>
              <div className="resp-underline"></div>
            </div>

            <p className="resp-subtitle">
              Welcome back! Ready to continue your journey?
            </p>

            <form onSubmit={handleSubmit} className="resp-form">
              <div className="resp-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  onChange={handleChange}
                  required
                  className="resp-input"
                />
              </div>

              <div className="resp-input-group">
                <div className="resp-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="resp-input"
                  />
                  <button
                    type="button"
                    className="resp-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="resp-actions">
                <Link to="/forgot-password" className="resp-forgot">
                  Forgot password?
                </Link>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="resp-btn"
                >
                  <span className="resp-btn-text">
                    {loading ? "SIGNING IN..." : "CONTINUE"}
                  </span>
                  <FaArrowRight className="resp-btn-icon" />
                </button>
              </div>
            </form>

            {error && (
              <div className="resp-error">
                <div className="resp-error-dot"></div>
                {error}
              </div>
            )}

            <div className="resp-signup">
              <span>No account?</span>
              <Link to="/signup" className="resp-signup-link">
                SIGN UP <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Responsive (hidden on mobile) */}
        <div className="resp-right">
          <div className="resp-visual">
            <div className="resp-visual-core">
              <div className="resp-core-shape"></div>
              <img 
                src="../assets/signin-img.png" 
                alt="Scholarship Access" 
                className="resp-core-image" 
              />
            </div>
            
            <div className="resp-badge resp-badge-1">
              <span>🎓</span>
            </div>
            <div className="resp-badge resp-badge-2">
              <span>⚡</span>
            </div>
            <div className="resp-badge resp-badge-3">
              <span>📊</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;