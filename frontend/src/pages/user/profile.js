import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/root.css";
import "./styles/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this page.");
          return;
        }

        const response = await axios.get("http://localhost:5001/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setFormData(response.data.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please log in again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5001/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !user) {
    return <div className="profile-error">{error}</div>;
  }

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {/* Cover Photo Section with overlapping avatar and side info */}
      <div className="profile-cover">
        <div className="cover-photo"></div>
        <div className="profile-avatar-overlap">
          <div className="avatar-placeholder">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
        </div>
        <div className="profile-info-main">
          <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-stats">
            <span className="stat-item">
              <strong>Student</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {success && <div className="profile-success">{success}</div>}
        {error && <div className="profile-error">{error}</div>}

        <div className="content-grid">
          {/* Left Column - Basic Info, Address & Academic Information */}
          <div className="content-column">
            {/* Basic Information Card - Top left */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Basic Information</h2>
                <p className="card-subtitle">Personal details and contact</p>
              </div>

              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Birth Date</label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date ? formData.birth_date.split('T')[0] : ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender || ""} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Address</h2>
                <p className="card-subtitle">Location information</p>
              </div>

              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Region</label>
                    <input
                      type="text"
                      name="address_region"
                      value={formData.address_region || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Province</label>
                    <input
                      type="text"
                      name="address_province"
                      value={formData.address_province || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address_city"
                      value={formData.address_city || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Academic Information</h2>
                <p className="card-subtitle">Education and achievements</p>
              </div>

              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group">
                    <label>School</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Course</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year Level</label>
                    <input
                      type="text"
                      name="year_level"
                      value={formData.year_level || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>GPA</label>
                    <input
                      type="number"
                      name="gpa"
                      value={formData.gpa || ""}
                      onChange={handleChange}
                      min="0"
                      max="4"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Side Cards, Additional Info & Save Button */}
          <div className="content-column">
            {/* Side Info Cards */}
            <div className="side-card">
              <div className="info-section">
                <h3 className="info-title">Profile Completion</h3>
                <div className="completion-bar">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <span className="progress-text">75% Complete</span>
                </div>
              </div>

              <div className="info-section">
                <h3 className="info-title">Quick Stats</h3>
                <div className="stats-list">
                  <div className="stat">
                    <span className="stat-label">Scholarships Applied</span>
                    <span className="stat-value">8</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Bookmarks</span>
                    <span className="stat-value">12</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Profile Views</span>
                    <span className="stat-value">24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Additional Information</h2>
                <p className="card-subtitle">Skills and experiences</p>
              </div>

              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Academic Awards</label>
                    <textarea
                      name="academic_awards"
                      value={formData.academic_awards || ""}
                      onChange={handleChange}
                      placeholder="List any academic awards or achievements..."
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Leadership Experience</label>
                    <textarea
                      name="leadership_experience"
                      value={formData.leadership_experience || ""}
                      onChange={handleChange}
                      placeholder="Describe your leadership experience..."
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Special Skills</label>
                    <textarea
                      name="special_skills"
                      value={formData.special_skills || ""}
                      onChange={handleChange}
                      placeholder="List any special skills or talents..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading} 
                className="action-btn primary" 
                onClick={handleSubmit}
              >
                {loading ? "Updating..." : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;