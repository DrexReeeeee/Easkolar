import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./styles/bookmarks.css";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkRemoving, setBookmarkRemoving] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(() => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, [token]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        const res = await axios.get("http://localhost:5001/api/bookmarks", axiosConfig);
        setBookmarks(res.data.bookmarks || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to load bookmarks. Please try again later.");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [axiosConfig, token]);

  const removeBookmark = async (scholarship_id, e) => {
    if (e) e.stopPropagation();
    
    setBookmarkRemoving(scholarship_id);
    try {
      await axios.delete(`http://localhost:5001/api/bookmarks/${scholarship_id}`, axiosConfig);

      setBookmarks((prev) =>
        prev.filter((b) => b.Scholarship.scholarship_id !== scholarship_id)
      );
      
      if (selectedScholarship?.scholarship_id === scholarship_id) {
        setShowModal(false);
        setSelectedScholarship(null);
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      alert("Failed to remove bookmark. Please try again.");
    } finally {
      setBookmarkRemoving(null);
    }
  };

  const viewDetails = (scholarship) => {
    setSelectedScholarship(scholarship.Scholarship);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedScholarship(null);
  };

  useEffect(() => {
    const pageWrapper = document.querySelector(".page-wrapper");

    if (showModal) {
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
  }, [showModal]);

  const filteredBookmarks = bookmarks.filter((b) => {
    const name = (b.Scholarship.name || "").toLowerCase();
    const description = (b.Scholarship.description || "").toLowerCase();
    const provider = (b.Scholarship.provider || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || description.includes(q) || provider.includes(q);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookmarks = filteredBookmarks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const BookmarkButton = ({ scholarship, size = 22 }) => {
    const isRemoving = bookmarkRemoving === scholarship.scholarship_id;

    return (
      <button
        className={`bookmark-icon active ${isRemoving ? "loading" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          removeBookmark(scholarship.scholarship_id, e);
        }}
        disabled={isRemoving}
        title="Remove Bookmark"
        aria-label="Remove Bookmark"
      >
        {isRemoving ? (
          <div className="bookmark-spinner" />
        ) : (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="bookmarks-page">
        <div className="toolbar-section">
          <div className="toolbar-main">
            <div className="search-container">
              <div className="search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search bookmarks..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>
            
            {filteredBookmarks.length > 0 && (
              <div className="bookmarks-count">
                {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="scholarships-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading bookmarks...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg className="error-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3>Unable to Load Bookmarks</h3>
              <p>{error}</p>
              <button className="primary-btn" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <h3>No bookmarks found</h3>
              <p>{searchQuery ? "Try a different search term" : "You haven't saved any scholarships to your bookmarks yet."}</p>
              <a href="/scholarships" className="secondary-btn">
                Explore Scholarships
              </a>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h3 className="section-title">Your Bookmarked Scholarships</h3>
                {filteredBookmarks.length > 0 && (
                  <div className="results-count">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookmarks.length)} of {filteredBookmarks.length} bookmarks
                  </div>
                )}
              </div>

              <div className="scholarship-grid">
                {currentBookmarks.map((b) => {
                  const daysUntilDeadline = getDaysUntilDeadline(b.Scholarship.deadline);
                  
                  return (
                    <div 
                      key={b.bookmark_id} 
                      className="scholarship-card"
                      onClick={() => viewDetails(b)}
                    >
                      <div className="card-header">
                        <div className="scholarship-name-container">
                          <h3 className="scholarship-name">{b.Scholarship.name}</h3>
                          {b.Scholarship.provider && (
                            <div className="scholarship-provider">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              {b.Scholarship.provider}
                            </div>
                          )}
                        </div>
                        <div className="card-actions">
                          <BookmarkButton scholarship={b.Scholarship} size={18} />
                        </div>
                      </div>

                      <div className="card-content">
                        <div className="scholarship-meta">
                          {b.Scholarship.amount && (
                            <div className="meta-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              </svg>
                              <span className="meta-value">{formatAmount(b.Scholarship.amount)}</span>
                            </div>
                          )}
                          
                          {b.Scholarship.deadline && (
                            <div className={`meta-item ${daysUntilDeadline <= 7 ? "urgent" : ""}`}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span className="meta-value">
                                {formatDate(b.Scholarship.deadline)}
                                {daysUntilDeadline > 0 && (
                                  <span className="days-remaining"> ({daysUntilDeadline} days)</span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="scholarship-description">
                          <p>
                            {b.Scholarship.description
                              ? b.Scholarship.description.length > 120 
                                ? b.Scholarship.description.substring(0, 120) + "..." 
                                : b.Scholarship.description
                              : "No description available."}
                          </p>
                        </div>
                      </div>

                      <div className="card-footer">
                        <button 
                          className="view-more-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            viewDetails(b);
                          }}
                        >
                          View Details
                        </button>
                      </div>

                      <div className="bookmark-indicator" title="Bookmarked">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                          <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="pagination-section">
                  <div className="pagination">
                    <button 
                      className="pagination-btn prev" 
                      onClick={handlePrevPage}
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
                            onClick={() => handlePageChange(pageNum)}
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
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button 
                      className="pagination-btn next" 
                      onClick={handleNextPage}
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

        {showModal && selectedScholarship && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedScholarship.name}</h2>
                <div className="modal-actions">
                  <BookmarkButton scholarship={selectedScholarship} size={22} />
                  <button 
                    className="close-btn" 
                    onClick={closeModal}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="modal-body">
                <div className="modal-details-grid">
                  {selectedScholarship.provider && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div>
                        <label>Provider</label>
                        <p>{selectedScholarship.provider}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedScholarship.amount && (
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
                  )}
                  
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
                        {formatDate(selectedScholarship.deadline)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedScholarship.description && (
                  <div className="detail-section">
                    <h4>Description</h4>
                    <p>{selectedScholarship.description}</p>
                  </div>
                )}
                
                {selectedScholarship.eligibility && (
                  <div className="detail-section">
                    <h4>Eligibility Criteria</h4>
                    <p>{selectedScholarship.eligibility}</p>
                  </div>
                )}
                
                <div className="action-section">
                  {selectedScholarship.registration_link ? (
                    <a 
                      href={selectedScholarship.registration_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="apply-btn primary-btn"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Apply Now
                    </a>
                  ) : selectedScholarship.website_link ? (
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
                      Visit Website
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}