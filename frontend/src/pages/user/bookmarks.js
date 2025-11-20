import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import "./styles/bookmarks.css"; 

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        const res = await axios.get("http://localhost:5001/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookmarks(res.data.bookmarks || []);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Remove Bookmark
  const removeBookmark = async (scholarship_id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5001/api/bookmarks/${scholarship_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookmarks((prev) =>
        prev.filter((b) => b.Scholarship.scholarship_id !== scholarship_id)
      );
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <Header />
      <Sidebar />

      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Your Bookmarked Scholarships</h2>
        </div>

        {bookmarks.length === 0 ? (
          <div className="empty-state">
            <h3>No Bookmarks Yet</h3>
            <p>You haven't saved any scholarships to your bookmarks.</p>
            <a href="/scholarships" className="explore-btn">
              Explore Scholarships
            </a>
          </div>
        ) : (
          <div className="scholarship-grid">
            {bookmarks.map((b) => (
              <div key={b.bookmark_id} className="scholarship-card">
                {/* Header */}
                <div className="card-header">
                  <h3 className="scholarship-name">{b.Scholarship.name}</h3>
                  <button
                    className="bookmark-icon active"
                    onClick={() => removeBookmark(b.Scholarship.scholarship_id)}
                    title="Remove Bookmark"
                  >
                    ★
                  </button>
                </div>

                {/* Description */}
                <div className="scholar-info-section">
                  <p className="scholar-description">
                    {b.Scholarship.description
                      ? b.Scholarship.description.slice(0, 140) + "..."
                      : "No description available."}
                  </p>
                </div>

                {/* Footer */}
                <div className="card-footer">
                  <span className="deadline-badge">
                    {b.Scholarship.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}