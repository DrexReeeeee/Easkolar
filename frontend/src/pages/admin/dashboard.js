// frontend/src/pages/admin/dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/admin.css";

const Dashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    eligibility: "",
    deadline: "",
    website_link: "",
    registration_link: "",
  });
  const [editScholarship, setEditScholarship] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5001/api/admin/scholarships";

 
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch scholarships
  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      // Updated to match backend response structure
      setScholarships(res.data.scholarships || []);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Fetch Scholarships Error:", err);
      setError(
        "Failed to fetch scholarships: " +
          (err.response?.data?.message || err.message)
      );
      setScholarships([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Add ESC key support for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        setEditScholarship(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  // Input change handler
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new scholarship - UPDATED for backend structure
  const handleAddScholarship = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/", form);

      // Updated success check - look for scholarship data in response
      if (response.data.scholarship || response.status === 201) {
        setForm({
          name: "",
          description: "",
          eligibility: "",
          deadline: "",
          website_link: "",
          registration_link: "",
        });
        setSuccess("Scholarship added successfully!");
        fetchScholarships();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Add Scholarship Error:", err);
      setError(
        "Failed to add scholarship: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // Delete scholarship - UPDATED for backend structure
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?"))
      return;

    try {
      const response = await api.delete(`/${id}`);

      // Updated success check - assume success on 200 status
      if (response.status === 200) {
        setSuccess("Scholarship deleted successfully!");
        fetchScholarships();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Delete Scholarship Error:", err);
      setError(
        "Failed to delete scholarship: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // Open edit modal
  const handleEdit = (scholarship) => {
    setEditScholarship(scholarship);
    setForm({
      name: scholarship.name || "",
      description: scholarship.description || "",
      eligibility: scholarship.eligibility || "",
      deadline: scholarship.deadline ? scholarship.deadline.split("T")[0] : "",
      website_link: scholarship.website_link || "",
      registration_link: scholarship.registration_link || "",
    });
    setShowModal(true);
  };

  // Update scholarship - UPDATED for backend structure
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editScholarship) return;

    setSaving(true);

    try {
      const response = await api.put(`/${editScholarship.scholarship_id}`, form);

      // Updated success check - look for scholarship data or 200 status
      if (response.data.scholarship || response.status === 200) {
        // Close modal immediately
        setShowModal(false);
        setEditScholarship(null);

        // Refresh scholarships in the background
        await fetchScholarships();

        // Show success notification
        setSuccess("Changes saved successfully!");
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Update Scholarship Error:", err);
      setError(
        "Failed to update scholarship: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  // Stats calculations
  const totalScholarships = scholarships.length;
  const activeScholarships = scholarships.filter(
    (s) => s.deadline && new Date(s.deadline) > new Date()
  ).length;
  const expiredScholarships = scholarships.filter(
    (s) => s.deadline && new Date(s.deadline) <= new Date()
  ).length;

  return (
    <div className="admin-dashboard-page">
      {/* Header Section */}
      <div className="admin-header">
        <div className="admin-cover">
          <div className="cover-photo">
            <div className="cover-pattern"></div>
          </div>
          
          <div className="admin-header-content">
            <div className="admin-avatar-section">
              <div className="avatar-container">
                <div className="avatar-placeholder admin-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="admin-info-section">
              <div className="admin-name-badge">
                <h1 className="admin-name">Admin Dashboard</h1>
                <span className="verified-badge admin-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  Administrator
                </span>
              </div>
              <p className="admin-subtitle">
                Manage scholarships and monitor system activity
              </p>
            </div>

            <div className="admin-stats-preview">
              <div className="stat-preview">
                <div className="stat-preview-value">{totalScholarships}</div>
                <div className="stat-preview-label">Total Scholarships</div>
              </div>
              <div className="stat-preview">
                <div className="stat-preview-value">{activeScholarships}</div>
                <div className="stat-preview-label">Active</div>
              </div>
              <div className="stat-preview">
                <div className="stat-preview-value">{expiredScholarships}</div>
                <div className="stat-preview-label">Expired</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-wrapper">
        <div className="admin-content">
          {/* Alerts */}
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

          {/* Navigation Tabs */}
          <div className="admin-tabs">
            <button 
              className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === "scholarships" ? "active" : ""}`}
              onClick={() => setActiveTab("scholarships")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Manage Scholarships
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="content-grid">
              <div className="content-column">
                {/* Quick Stats Card */}
                <div className="content-card">
                  <div className="card-header">
                    <div className="card-header-content">
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="20" x2="18" y2="10"/>
                          <line x1="12" y1="20" x2="12" y2="4"/>
                          <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="card-title">Dashboard Overview</h2>
                        <p className="card-subtitle">System statistics and quick actions</p>
                      </div>
                    </div>
                  </div>

                  <div className="stats-grid-admin">
                    <div className="stat-card-admin">
                      <div className="stat-icon-admin total">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                      </div>
                      <div className="stat-content-admin">
                        <div className="stat-value-admin">{totalScholarships}</div>
                        <div className="stat-label-admin">Total Scholarships</div>
                      </div>
                    </div>

                    <div className="stat-card-admin">
                      <div className="stat-icon-admin active">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <div className="stat-content-admin">
                        <div className="stat-value-admin">{activeScholarships}</div>
                        <div className="stat-label-admin">Active Scholarships</div>
                      </div>
                    </div>

                    <div className="stat-card-admin">
                      <div className="stat-icon-admin expired">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <div className="stat-content-admin">
                        <div className="stat-value-admin">{expiredScholarships}</div>
                        <div className="stat-label-admin">Expired Scholarships</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="content-card">
                  <div className="card-header">
                    <div className="card-header-content">
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="card-title">Quick Actions</h2>
                        <p className="card-subtitle">Common administrative tasks</p>
                      </div>
                    </div>
                  </div>

                  <div className="quick-actions">
                    <button 
                      className="quick-action-btn"
                      onClick={() => setActiveTab("scholarships")}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Add New Scholarship
                    </button>
                    <button className="quick-action-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Export Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="content-column">
                {/* Recent Activity Card */}
                <div className="content-card">
                  <div className="card-header">
                    <div className="card-header-content">
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="card-title">Recent Activity</h2>
                        <p className="card-subtitle">Latest system updates</p>
                      </div>
                    </div>
                  </div>

                  <div className="activity-list">
                    {scholarships.slice(0, 5).map((scholarship, index) => (
                      <div key={scholarship.scholarship_id || index} className="activity-item">
                        <div className="activity-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          </svg>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">{scholarship.name}</div>
                          <div className="activity-time">
                            Updated {new Date(scholarship.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {scholarships.length === 0 && (
                      <div className="no-activity">No recent activity</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scholarships Management Tab */}
          {activeTab === "scholarships" && (
            <div className="content-grid">
              <div className="content-column">
                {/* Add Scholarship Card */}
                <div className="content-card">
                  <div className="card-header">
                    <div className="card-header-content">
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="card-title">Add New Scholarship</h2>
                        <p className="card-subtitle">Create a new scholarship opportunity</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <form onSubmit={handleAddScholarship}>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label>Scholarship Name *</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Enter scholarship name"
                            value={form.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Deadline</label>
                          <input
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group full-width">
                          <label>Description</label>
                          <textarea
                            name="description"
                            placeholder="Enter scholarship description"
                            value={form.description}
                            onChange={handleInputChange}
                            rows="3"
                          />
                        </div>
                        <div className="form-group full-width">
                          <label>Eligibility Criteria</label>
                          <textarea
                            name="eligibility"
                            placeholder="Enter eligibility requirements"
                            value={form.eligibility}
                            onChange={handleInputChange}
                            rows="3"
                          />
                        </div>
                        <div className="form-group">
                          <label>Website Link</label>
                          <input
                            type="url"
                            name="website_link"
                            placeholder="https://example.com"
                            value={form.website_link}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Registration Link</label>
                          <input
                            type="url"
                            name="registration_link"
                            placeholder="https://example.com/apply"
                            value={form.registration_link}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="save-changes-btn">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                          </svg>
                          Add Scholarship
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="content-column">
                {/* Scholarships List Card */}
                <div className="content-card">
                  <div className="card-header">
                    <div className="card-header-content">
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="card-title">Manage Scholarships</h2>
                        <p className="card-subtitle">View and edit all scholarships</p>
                      </div>
                    </div>
                  </div>

                  <div className="scholarships-list">
                    {loading ? (
                      <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading scholarships...</p>
                      </div>
                    ) : scholarships.length === 0 ? (
                      <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                        <h3>No Scholarships Found</h3>
                        <p>Get started by adding your first scholarship opportunity.</p>
                      </div>
                    ) : (
                      <div className="scholarships-table-container">
                        <table className="scholarships-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Deadline</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scholarships.map((scholarship) => (
                              <tr key={scholarship.scholarship_id}>
                                <td>
                                  <div className="scholarship-name">{scholarship.name}</div>
                                  <div className="scholarship-description">
                                    {scholarship.description?.substring(0, 60)}...
                                  </div>
                                </td>
                                <td>
                                  {scholarship.deadline ? (
                                    <div className="deadline-info">
                                      <div className="deadline-date">
                                        {new Date(scholarship.deadline).toLocaleDateString()}
                                      </div>
                                    </div>
                                  ) : (
                                    'No deadline'
                                  )}
                                </td>
                                <td>
                                  <span className={`status-badge ${
                                    !scholarship.deadline ? 'status-active' : 
                                    new Date(scholarship.deadline) > new Date() ? 'status-active' : 'status-expired'
                                  }`}>
                                    {!scholarship.deadline ? 'Active' : 
                                     new Date(scholarship.deadline) > new Date() ? 'Active' : 'Expired'}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    <button 
                                      className="action-btn edit-btn"
                                      onClick={() => handleEdit(scholarship)}
                                      title="Edit scholarship"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                      </svg>
                                      Edit
                                    </button>
                                    <button 
                                      className="action-btn delete-btn"
                                      onClick={() => handleDelete(scholarship.scholarship_id)}
                                      title="Delete scholarship"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                      </svg>
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editScholarship && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setEditScholarship(null);
            }
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Scholarship</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setEditScholarship(null);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                <div className="form-group full-width required">
                  <label>Scholarship Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter scholarship name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter scholarship description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Eligibility Criteria</label>
                  <textarea
                    name="eligibility"
                    placeholder="Enter eligibility requirements"
                    value={form.eligibility}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Website Link</label>
                  <input
                    type="url"
                    name="website_link"
                    placeholder="https://example.com"
                    value={form.website_link}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Registration Link</label>
                  <input
                    type="url"
                    name="registration_link"
                    placeholder="https://example.com/apply"
                    value={form.registration_link}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowModal(false);
                    setEditScholarship(null);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-changes-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;