import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/scholarships.css";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // TEMPORARY MOCK — replace this with your actual logged-in user ID
  const userId = "671fabcde1234567890";

  // Fetch all scholarships
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/scholarships");
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

  // Fetch user's bookmarked scholarships
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/bookmarks/user/${userId}`
        );
        const bookmarked = res.data.bookmarks.map((b) => b.scholarshipId);
        setBookmarkedIds(bookmarked);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, [userId]);

  // Handle bookmark toggle
  const handleBookmark = async (scholarshipId) => {
    try {
      const isBookmarked = bookmarkedIds.includes(scholarshipId);

      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(
          `http://localhost:5001/api/bookmarks/${userId}/${scholarshipId}`
        );
        setBookmarkedIds((prev) =>
          prev.filter((id) => id !== scholarshipId)
        );
      } else {
        // Add bookmark
        await axios.post("http://localhost:5001/api/bookmarks", {
          userId,
          scholarshipId,
        });
        setBookmarkedIds((prev) => [...prev, scholarshipId]);
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
    }
  };

  return (
    <div className="scholarships-page">
      <h1>🎓 Explore Scholarships</h1>
      <p>Browse available scholarships. Click any card for more details or bookmark them for later.</p>

      {loading ? (
        <div className="loading">Loading scholarships...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : scholarships.length === 0 ? (
        <div className="no-scholarships">
          No scholarships available at the moment.
        </div>
      ) : (
        <div className="scholarship-grid">
          {scholarships.map((sch) => (
            <div
              key={sch._id}
              className="scholarship-card"
              onClick={() => setSelectedScholarship(sch)}
            >
              <div className="card-header">
                <h3>{sch.name}</h3>
                <button
                  className={`bookmark-btn ${
                    bookmarkedIds.includes(sch._id) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent modal open
                    handleBookmark(sch._id);
                  }}
                >
                  {bookmarkedIds.includes(sch._id) ? "★" : "☆"}
                </button>
              </div>

              <p className="short-desc">
                {sch.description.length > 120
                  ? sch.description.substring(0, 120) + "..."
                  : sch.description}
              </p>
              <p className="deadline">
                <strong>Deadline:</strong>{" "}
                {sch.deadline
                  ? new Date(sch.deadline).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedScholarship && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedScholarship(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedScholarship.name}</h2>
            <p>
              <strong>Provider:</strong> {selectedScholarship.provider || "N/A"}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              {selectedScholarship.amount || "Not specified"}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {selectedScholarship.deadline
                ? new Date(selectedScholarship.deadline).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Eligibility:</strong>{" "}
              {selectedScholarship.eligibility || "N/A"}
            </p>
            <p className="desc">
              <strong>Description:</strong>{" "}
              {selectedScholarship.description}
            </p>

            {selectedScholarship.website_link && (
              <a
                href={selectedScholarship.website_link}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn"
              >
                Visit Scholarship Website
              </a>
            )}
            <button
              className="close-btn"
              onClick={() => setSelectedScholarship(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
