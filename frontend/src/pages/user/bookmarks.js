// src/pages/user/bookmarks.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import "./styles/dashboard.css";
import "./styles/bookmarks.css";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        // Fetch user profile
        const profileRes = await axios.get("http://localhost:5001/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data.user);
        localStorage.setItem("user", JSON.stringify(profileRes.data.user));

        // Fetch bookmarks
        const bookmarksRes = await axios.get("http://localhost:5001/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(bookmarksRes.data.bookmarks || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/signin";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeBookmark = async (scholarship_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/bookmarks/${scholarship_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(bookmarks.filter((b) => b.Scholarship.scholarship_id !== scholarship_id));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  if (loading) return <div className="loading">Loading bookmarks...</div>;

  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <section className="content-section">
          <h2 className="section-title">Your Bookmarked Scholarships</h2>
          {bookmarks.length === 0 ? (
            <p className="empty-text">You have no bookmarks yet.</p>
          ) : (
            <div className="card-grid">
              {bookmarks.map((b) => (
                <div key={b.bookmark_id} className="info-card">
                  <h3>{b.Scholarship.name}</h3>
                  <p>{b.Scholarship.description?.slice(0, 120)}...</p>
                  <p><strong>Deadline:</strong> {b.Scholarship.deadline}</p>
                  <button
                    className="remove-btn"
                    onClick={() => removeBookmark(b.Scholarship.scholarship_id)}
                  >
                    Remove Bookmark
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
