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
  const [isEditing, setIsEditing] = useState(false);

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
      setFormData(response.data.user);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    const fields = [
      formData.first_name, formData.last_name, formData.email, 
      formData.birth_date, formData.gender, formData.contact_number,
      formData.location, formData.school, formData.course, formData.gpa
    ];
    const filled = fields.filter(field => field && field !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  if (error && !user) {
    return (
      <div className="page-wrapper">
        <div className="profile-error-page">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>Unable to Load Profile</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="profile-loading-page">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletion();

  return (
    <div className="profile-page">
      {/* Cover Photo Section */}
      <div className="profile-cover">
        <div className="cover-photo">
          <div className="cover-pattern"></div>
        </div>
        
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <div className="avatar-placeholder">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <button className="avatar-edit-btn" title="Change photo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="profile-info-section">
            <div className="profile-name-badge">
              <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
              <span className="verified-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </span>
            </div>
            <p className="profile-email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {user.email}
            </p>
            <div className="profile-meta">
              <span className="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Student
              </span>
              {formData.school && (
                <span className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  {formData.school}
                </span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
            ) : (
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-wrapper">
        <div className="profile-content">
          {success && (
            <div className="alert alert-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="content-grid">
            {/* Left Column */}
            <div className="content-column">
              {/* Basic Information Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-header-content">
                    <div className="card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="card-title">Basic Information</h2>
                      <p className="card-subtitle">Personal details and contact</p>
                    </div>
                  </div>
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
                        disabled={!isEditing}
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
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
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
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select 
                        name="gender" 
                        value={formData.gender || ""} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Contact Number</label>
                      <input
                        type="text"
                        name="contact_number"
                        value={formData.contact_number || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="+63 xxx xxx xxxx"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-header-content">
                    <div className="card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="card-title">Address</h2>
                      <p className="card-subtitle">Location information</p>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Street Address</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="House/Unit No., Street Name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Region</label>
                      <input
                        type="text"
                        name="address_region"
                        value={formData.address_region || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Province</label>
                      <input
                        type="text"
                        name="address_province"
                        value={formData.address_province || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>City/Municipality</label>
                      <input
                        type="text"
                        name="address_city"
                        value={formData.address_city || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-header-content">
                    <div className="card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="card-title">Academic Information</h2>
                      <p className="card-subtitle">Education and achievements</p>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>School/University</label>
                      <input
                        type="text"
                        name="school"
                        value={formData.school || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Course/Program</label>
                      <input
                        type="text"
                        name="course"
                        value={formData.course || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Year Level</label>
                      <input
                        type="text"
                        name="year_level"
                        value={formData.year_level || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="e.g., 2nd Year"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>GPA / General Average</label>
                      <input
                        type="number"
                        name="gpa"
                        value={formData.gpa || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        min="0"
                        max="4"
                        step="0.01"
                        placeholder="0.00 - 4.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="content-column">
              {/* Profile Insights Card */}
              <div className="insights-card">
                <h3 className="insights-title">Profile Insights</h3>
                
                <div className="insight-item completion-insight">
                  <div className="insight-header">
                    <span className="insight-label">Profile Completion</span>
                    <span className="insight-value">{completionPercentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="insight-tip">
                    {completionPercentage === 100 
                      ? "🎉 Your profile is complete!" 
                      : "Complete your profile to increase scholarship matches"}
                  </p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon scholarships">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">8</div>
                      <div className="stat-label">Applications</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon bookmarks">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">12</div>
                      <div className="stat-label">Bookmarks</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon matches">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">24</div>
                      <div className="stat-label">Matches</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-header-content">
                    <div className="card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="card-title">Additional Information</h2>
                      <p className="card-subtitle">Skills and experiences</p>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Academic Awards</label>
                      <textarea
                        name="academic_awards"
                        value={formData.academic_awards || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="List any academic awards or achievements..."
                        rows="3"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Leadership Experience</label>
                      <textarea
                        name="leadership_experience"
                        value={formData.leadership_experience || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Describe your leadership experience..."
                        rows="3"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Special Skills</label>
                      <textarea
                        name="special_skills"
                        value={formData.special_skills || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="List any special skills or talents..."
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="form-actions">
                  <button 
                    type="button" 
                    disabled={loading} 
                    className="save-changes-btn" 
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <>
                        <div className="btn-spinner"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save All Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;