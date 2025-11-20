/* /frontend/src/pages/user/scholarships.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/scholarships.css";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/scholarships", axiosConfig);
        setScholarships(res.data.scholarships || []);
      } catch (err) {
        console.error("Error fetching scholarships:", err);
        setError("Failed to load scholarships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!token) return;
        const res = await axios.get("http://localhost:5001/api/bookmarks/user/me", axiosConfig);
        const bookmarked = res.data.bookmarks.map((b) => Number(b.scholarshipId || b.scholarship_id));
        setBookmarkedIds(bookmarked);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, [token]);

  useEffect(() => {
    const pageWrapper = document.querySelector(".page-wrapper");

    if (selectedScholarship) {
      document.body.style.overflow = "hidden";
      if (pageWrapper) pageWrapper.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      if (pageWrapper) pageWrapper.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      if (pageWrapper) pageWrapper.style.overflow = "auto";
    };
  }, [selectedScholarship]);

  const handleBookmark = async (scholarshipId) => {
    if (!token) {
      alert("Please log in to bookmark scholarships.");
      return;
    }

    const id = Number(scholarshipId);
    try {
      const isBookmarked = bookmarkedIds.includes(id);

      if (isBookmarked) {
        await axios.delete(`http://localhost:5001/api/bookmarks/${id}`, axiosConfig);
        setBookmarkedIds((prev) => prev.filter((x) => x !== id));
      } else {
        await axios.post("http://localhost:5001/api/bookmarks", { scholarship_id: id }, axiosConfig);
        setBookmarkedIds((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
    }
  };

  const filteredScholarships = scholarships.filter((sch) => {
    const matchesSearch = sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sch.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const today = new Date();
    const hasDeadline = sch.deadline && new Date(sch.deadline) > today;

    switch (filter) {
      case "deadline":
        return hasDeadline && matchesSearch;
      case "bookmarked":
        return bookmarkedIds.includes(Number(sch.scholarship_id)) && matchesSearch;
      case "active":
        return hasDeadline && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="page-wrapper">
      <div className="scholarships-page">

        {/* Toolbar */}
        <div className="toolbar-section">
          <div className="toolbar-main">
            <button className="primary-btn find-scholarship-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Find My Scholarship
            </button>

            <div className="filter-group">
              <button className="filter-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter
              </button>
              <select
                className="filter-dropdown"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Scholarships</option>
                <option value="active">Active Opportunities</option>
                <option value="deadline">Upcoming Deadlines</option>
                <option value="bookmarked">Bookmarked</option>
              </select>
            </div>

            <div className="search-container">
              <div className="search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search scholarships"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <button className="deadlines-btn">Deadlines</button>
          </div>
        </div>

        {/* Scholarships Content */}
        <div className="scholarships-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading scholarships...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg className="error-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Unable to Load Scholarships</h3>
              <p>{error}</p>
              <button className="primary-btn" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <h3>No scholarships found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="secondary-btn" onClick={() => { setSearchQuery(""); setFilter("all"); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h2 className="section-title">Matched Scholarships</h2>
                <button className="see-all-btn">See All</button>
              </div>

              <div className="scholarship-grid">
                {sortedScholarships.slice(0, 3).map((sch) => {
                  const daysUntilDeadline = getDaysUntilDeadline(sch.deadline);
                  return (
                    <div key={sch.scholarship_id} className="scholarship-card matched">
                      <div className="card-header">
                        <h3 className="scholarship-name">{sch.name}</h3>
                        <div className="card-actions">
                          <button className="icon-btn" onClick={(e) => e.stopPropagation()}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1"/>
                              <circle cx="19" cy="12" r="1"/>
                              <circle cx="5" cy="12" r="1"/>
                            </svg>
                          </button>

                          {/* Bookmark Button */}
                          <button
                            className={`bookmark-icon ${bookmarkedIds.includes(Number(sch.scholarship_id)) ? "active" : ""}`}
                            onClick={(e) => { e.stopPropagation(); handleBookmark(sch.scholarship_id); }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarkedIds.includes(Number(sch.scholarship_id)) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="scholar-info-section">
                        <h4 className="section-label">Scholar Info</h4>
                        <p className="scholar-description">
                          {sch.description.length > 150 ? sch.description.substring(0, 150) + "..." : sch.description}
                        </p>
                      </div>

                      <div className="card-footer">
                        <button className="view-more-btn" onClick={() => setSelectedScholarship(sch)}>View More</button>
                        <button className="match-btn">Match</button>
                      </div>

                      {sch.deadline && (
                        <div className="deadline-badge">
                          {new Date(sch.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Recommendations Section */}
              {sortedScholarships.length > 3 && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Recommendations</h2>
                    <button className="see-all-btn">See All</button>
                  </div>

                  <div className="scholarship-grid">
                    {sortedScholarships.slice(3).map((sch) => (
                      <div key={sch.scholarship_id} className="scholarship-card">
                        <div className="card-header">
                          <h3 className="scholarship-name">{sch.name}</h3>
                          <div className="card-actions">
                            <button className="icon-btn" onClick={(e) => e.stopPropagation()}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1"/>
                                <circle cx="19" cy="12" r="1"/>
                                <circle cx="5" cy="12" r="1"/>
                              </svg>
                            </button>

                            <button
                              className={`bookmark-icon ${bookmarkedIds.includes(Number(sch.scholarship_id)) ? "active" : ""}`}
                              onClick={(e) => { e.stopPropagation(); handleBookmark(sch.scholarship_id); }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarkedIds.includes(Number(sch.scholarship_id)) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="scholar-info-section">
                          <h4 className="section-label">Scholar Info</h4>
                          <p className="scholar-description">
                            {sch.description.length > 150 ? sch.description.substring(0, 150) + "..." : sch.description}
                          </p>
                        </div>

                        <div className="card-footer">
                          <button className="view-more-btn" onClick={() => setSelectedScholarship(sch)}>View More</button>
                          <button className="match-btn">Match</button>
                        </div>

                        {sch.deadline && (
                          <div className="deadline-badge">
                            {new Date(sch.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {selectedScholarship && (
          <div className="modal-overlay" onClick={() => setSelectedScholarship(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedScholarship.name}</h2>
                <button className="close-btn" onClick={() => setSelectedScholarship(null)}>×</button>
              </div>

              <div className="modal-body">
                <div className="scholarship-details-grid">
                  <div className="detail-item">
                    <label>Provider</label>
                    <p>{selectedScholarship.provider || "Not specified"}</p>
                  </div>
                  <div className="detail-item">
                    <label>Amount</label>
                    <p className="amount">{selectedScholarship.amount || "Varies"}</p>
                  </div>
                  <div className="detail-item">
                    <label>Deadline</label>
                    <p className={`deadline ${getDaysUntilDeadline(selectedScholarship.deadline) <= 7 ? 'urgent' : ''}`}>
                      {selectedScholarship.deadline ? new Date(selectedScholarship.deadline).toLocaleDateString() : "Rolling"}
                    </p>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Eligibility Criteria</h4>
                  <p>{selectedScholarship.eligibility || "No specific eligibility criteria provided."}</p>
                </div>

                <div className="detail-section">
                  <h4>Description</h4>
                  <p>{selectedScholarship.description}</p>
                </div>

                {selectedScholarship.website_link && (
                  <div className="action-section">
                    <a href={selectedScholarship.website_link} target="_blank" rel="noopener noreferrer" className="apply-btn primary-btn">
                      Visit Scholarship Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
