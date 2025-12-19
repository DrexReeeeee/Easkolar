import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/scholarships.css";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("deadline");
  
  const itemsPerPage = 12;
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(() => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, [token]);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/scholarships", axiosConfig);
        setScholarships(res.data.scholarships || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching scholarships:", err);
        setError("Failed to load scholarships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [axiosConfig]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!token) {
          console.log("No token available for bookmarks");
          return;
        }

        const res = await axios.get("http://localhost:5001/api/bookmarks", axiosConfig);

        const bookmarked = (res.data.bookmarks || []).map((b) =>
          Number(b.Scholarship?.scholarship_id || b.scholarship_id)
        );

        setBookmarkedIds(bookmarked);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        console.error("Error details:", err.response?.data);
      }
    };
    fetchBookmarks();
  }, [axiosConfig, token]);

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

  const handleBookmark = async (scholarshipId, scholarshipName) => {
    if (!token) {
      alert("Please log in to bookmark scholarships.");
      return;
    }

    const id = Number(scholarshipId);
    setBookmarkLoading(id);

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
      console.error("Full error:", err.response?.data);
      alert("Failed to update bookmark. Please try again.");
    } finally {
      setBookmarkLoading(null);
    }
  };

  const filteredScholarships = scholarships.filter((sch) => {
    const name = (sch.name || "").toLowerCase();
    const description = (sch.description || "").toLowerCase();
    const provider = (sch.provider || "").toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = name.includes(q) || description.includes(q) || provider.includes(q);

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
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      
      case "amount":
        const amountA = parseFloat((a.amount || "0").replace(/[^0-9.]/g, "")) || 0;
        const amountB = parseFloat((b.amount || "0").replace(/[^0-9.]/g, "")) || 0;
        return amountB - amountA;
      
      case "provider":
        return (a.provider || "").localeCompare(b.provider || "");
      
      case "deadline":
      default:
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
    }
  });

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatAmount = (amount) => {
    if (!amount) return "Varies";
    if (amount.includes("$") || amount.includes("USD") || amount.match(/\d/)) {
      return amount;
    }
    return `$${amount}`;
  };

  const calculatePagination = () => {
    const totalItems = sortedScholarships.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentScholarships = sortedScholarships.slice(startIndex, endIndex);
    
    return { totalItems, totalPages, startIndex, endIndex, currentScholarships };
  };

  const { totalItems, totalPages, startIndex, endIndex, currentScholarships } = calculatePagination();

  const BookmarkButton = ({ scholarship, size = 20 }) => {
    const scholarshipId = Number(scholarship.scholarship_id);
    const isBookmarked = bookmarkedIds.includes(scholarshipId);
    const isLoading = bookmarkLoading === scholarshipId;

    return (
      <button
        className={`bookmark-icon ${isBookmarked ? "active" : ""} ${isLoading ? "loading" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          handleBookmark(scholarship.scholarship_id, scholarship.name);
        }}
        disabled={isLoading}
        title={isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
        aria-label={isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
      >
        {isLoading ? (
          <div className="bookmark-spinner" />
        ) : (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    );
  };

  const handleFindScholarship = () => {
    navigate("/user/chatbot");
  };

  return (
    <div className="page-wrapper">
      <div className="scholarships-page">
        <div className="toolbar-section">
          <div className="toolbar-main">
            <button className="primary-btn find-scholarship-btn" onClick={handleFindScholarship}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Find My Scholarship
            </button>

            <div className="filter-group">
              <select className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Scholarships</option>
                <option value="active">Active Opportunities</option>
                <option value="deadline">Upcoming Deadlines</option>
              </select>
              <div className="sort-group">
                <label htmlFor="sort-select" className="sort-label">Sort By:</label>
                <select 
                  id="sort-select"
                  className="sort-dropdown" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="deadline">Deadline (Soonest)</option>
                  <option value="amount">Amount (Highest)</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="provider">Provider (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="search-container">
              <div className="search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search scholarships..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="scholarships-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading scholarships...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg className="error-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
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
                <h3 className="section-title">All Scholarships</h3>
                <div className="results-count">
                  Showing {startIndex + 1}-{endIndex} of {totalItems} scholarships
                </div>
              </div>

              <div className="scholarship-grid">
                {currentScholarships.map((sch) => {
                  const daysUntilDeadline = getDaysUntilDeadline(sch.deadline);
                  const isBookmarked = bookmarkedIds.includes(Number(sch.scholarship_id));
                  
                  return (
                    <div key={sch.scholarship_id} className="scholarship-card">
                      <div className="card-header">
                        <div className="scholarship-name-container">
                          <h3 className="scholarship-name">{sch.name}</h3>
                          {sch.provider && (
                            <div className="scholarship-provider">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              {sch.provider}
                            </div>
                          )}
                        </div>
                        <div className="card-actions">
                          <BookmarkButton scholarship={sch} size={18} />
                        </div>
                      </div>

                      <div className="card-content">
                        <div className="scholarship-meta">
                          {sch.amount && (
                            <div className="meta-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              </svg>
                              <span className="meta-value">{formatAmount(sch.amount)}</span>
                            </div>
                          )}
                          
                          {sch.deadline && (
                            <div className={`meta-item ${daysUntilDeadline <= 7 ? "urgent" : ""}`}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span className="meta-value">
                                {new Date(sch.deadline).toLocaleDateString("en-US", { 
                                  month: "short", 
                                  day: "numeric" 
                                })}
                                {daysUntilDeadline > 0 && (
                                  <span className="days-remaining"> ({daysUntilDeadline} days)</span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="scholarship-description">
                          <p>{sch.description?.length > 120 ? sch.description.substring(0, 120) + "..." : sch.description}</p>
                        </div>
                      </div>

                      <div className="card-footer">
                        <button 
                          className="view-more-btn" 
                          onClick={() => setSelectedScholarship(sch)}
                          aria-label={`View details for ${sch.name}`}
                        >
                          View Details
                        </button>
                      </div>

                      {isBookmarked && (
                        <div className="bookmark-indicator" title="Bookmarked">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="pagination-section">
                  <div className="pagination">
                    <button 
                      className="pagination-btn prev" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="page-numbers">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="page-dots">...</span>
                          <button
                            className="page-btn"
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button 
                      className="pagination-btn next" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {selectedScholarship && (
          <div className="modal-overlay" onClick={() => setSelectedScholarship(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedScholarship.name}</h2>
                <div className="modal-actions">
                  <BookmarkButton scholarship={selectedScholarship} size={22} />
                  <button 
                    className="close-btn" 
                    onClick={() => setSelectedScholarship(null)}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="modal-details-grid">
                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <label>Provider</label>
                      <p>{selectedScholarship.provider || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div>
                      <label>Amount</label>
                      <p className="amount">{formatAmount(selectedScholarship.amount)}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <label>Deadline</label>
                      <p className={`deadline ${getDaysUntilDeadline(selectedScholarship.deadline) <= 7 ? "urgent" : ""}`}>
                        {selectedScholarship.deadline 
                          ? new Date(selectedScholarship.deadline).toLocaleDateString("en-US", { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : "Rolling"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedScholarship.eligibility && (
                  <div className="detail-section">
                    <h4>Eligibility Criteria</h4>
                    <p>{selectedScholarship.eligibility}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Description</h4>
                  <p>{selectedScholarship.description}</p>
                </div>

                {selectedScholarship.website_link && (
                  <div className="action-section">
                    <a 
                      href={selectedScholarship.website_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="apply-btn primary-btn"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
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