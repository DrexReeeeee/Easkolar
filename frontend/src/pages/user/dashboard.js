import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import "../../styles/root.css";
import "./styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [chatInput, setChatInput] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const computeProfileCompletion = (p) => {
    if (!p) return 0;
    const fields = [
      "first_name", "last_name", "email", "birth_date", "gender", "contact_number",
      "location", "school", "course", "strand_or_course", "year_level", "gpa",
      "address_region", "address_province", "address_city", "parents_occupation",
      "parents_education", "household_income_range", "siblings_in_school",
      "field_of_interest", "preferred_fields"
    ];
    const filled = fields.filter(key => {
      const v = p[key];
      return v && v !== "";
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getTodayFormatted = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setErr("");
      try {
        const [schRes, profileRes, bookmarksRes] = await Promise.all([
          axios.get("http://localhost:5001/api/scholarships", { headers: authHeader }),
          token ? axios.get("http://localhost:5001/api/auth/profile", { headers: authHeader }) : Promise.resolve({ data: { user: null } }),
          token ? axios.get("http://localhost:5001/api/bookmarks", { headers: authHeader }) : Promise.resolve({ data: { bookmarks: [] } }),
        ]);

        const allScholarships = Array.isArray(schRes.data.scholarships) ? schRes.data.scholarships : [];
        setScholarships(allScholarships);
        const profileUser = profileRes.data?.user ?? null;
        setProfile(profileUser);

        const bmRaw = bookmarksRes.data?.bookmarks ?? [];
        const bookmarkedIds = bmRaw.map((b) => Number(b.scholarshipId ?? b.scholarship_id ?? b.scholarship?.scholarship_id ?? b));
        setBookmarks(bookmarkedIds);

        const bmScholarships = allScholarships.filter(s => bookmarkedIds.includes(Number(s.scholarship_id || s.id)));
        setBookmarkedScholarships(bmScholarships);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setErr("Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const profileCompletion = computeProfileCompletion(profile);

  const upcomingDeadlines = scholarships
    .filter((s) => s.deadline && new Date(s.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const deadlinesThisMonth = scholarships.filter(s => {
    if (!s.deadline) return false;
    const deadline = new Date(s.deadline);
    const now = new Date();
    const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return deadline >= now && deadline <= monthFromNow;
  }).length;

  const recommendations = [
    { text: "Complete your profile to unlock personalized scholarship recommendations.", type: "tip" },
    { text: "Check your bookmarked scholarships for upcoming deadlines.", type: "info" },
    { text: "Use the AI chatbot to get instant answers about scholarships.", type: "action" },
  ];

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      navigate("/user/chatbot", { state: { initialMessage: chatInput } });
    }
  };

  if (loading) {
    return (
      <div className="dashboard loading-screen">
        <div className="loader-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (err) {
    return <div className="dashboard error-screen"><p>{err}</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Hero Section */}
          <div className="hero-card">
            <div className="hero-cloud cloud-1"></div>
            <div className="hero-cloud cloud-2"></div>
            <p className="hero-date">{getTodayFormatted()}</p>
            <h1 className="hero-title">HELLO, {profile?.first_name || "There"}!</h1>
            <p className="hero-subtitle">Let's help you find your matched scholarship today.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/user/chatbot")}>
                <FiMessageCircle size={16} /> Talk with AI
              </button>
              <button className="btn-outline" onClick={() => navigate("/user/scholarships")}>
                Find Scholarship
              </button>
            </div>
          </div>

          {/* Quick Stats Section */}
          <h3 className="section-label">Quick Stats</h3>
          <div className="stats-grid">
            {/* Available Scholarships */}
            <div className="stat-card">
              <div className="stat-icon-circle blue">
                <span>📚</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{scholarships.length}</div>
                <div className="stat-label">Available Scholarships</div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="stat-card">
              <div className="stat-icon-circle purple">
                <span>⏰</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{deadlinesThisMonth}</div>
                <div className="stat-label">Deadlines This Month</div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="stat-card">
              <div className="stat-icon-circle green">
                <span>👤</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{profileCompletion}%</div>
                <div className="stat-label">Profile Complete</div>
              </div>
            </div>

            {/* Bookmarked */}
            <div className="stat-card">
              <div className="stat-icon-circle orange">
                <span>🔖</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{bookmarks.length}</div>
                <div className="stat-label">Bookmarked</div>
              </div>
            </div>
          </div>

          {/* AI Assistant & Tips */}
          <div className="bottom-row">
            {/* AI Chatbot */}
            <div className="action-card">
              <div className="action-header">
                <FiMessageCircle size={24} className="action-icon" />
                <div>
                  <h4>AI Assistant</h4>
                  <p>Get instant help and recommendations</p>
                </div>
              </div>
              <div className="chat-quick-input">
                <input
                  type="text"
                  placeholder="Ask me anything about scholarships..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                />
                <button className="btn-send" onClick={handleChatSubmit}>
                  <FiSend size={18} />
                </button>
              </div>
              <div className="chat-suggestions">
                <button className="suggestion-chip" onClick={() => { setChatInput("What scholarships match my profile?"); handleChatSubmit(); }}>
                  What scholarships match my profile?
                </button>
                <button className="suggestion-chip" onClick={() => { setChatInput("Show me scholarships with upcoming deadlines"); handleChatSubmit(); }}>
                  Show me scholarships with upcoming deadlines
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="action-card">
              <div className="action-header">
                <span className="tips-icon">💡</span>
                <div>
                  <h4>Quick Tips</h4>
                  <p>Maximize your scholarship success</p>
                </div>
              </div>
              <div className="tips-list">
                {recommendations.map((r, i) => (
                  <div key={i} className="tip-item">
                    <span className="tip-bullet">•</span>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Deadlines */}
        <div className="dashboard-right">
          <div className="deadlines-header">
            <h3>Upcoming Deadlines</h3>
            <span className="deadline-count">{upcomingDeadlines.length}</span>
          </div>
          <div className="deadlines-list">
            {upcomingDeadlines.length === 0 ? (
              <div className="empty-deadlines">
                <span className="empty-icon">📅</span>
                <p>No upcoming deadlines</p>
              </div>
            ) : (
              upcomingDeadlines.map((s, idx) => {
                const daysUntil = Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={idx} className="deadline-card" onClick={() => navigate("/user/scholarships")}>
                    <div className="deadline-top">
                      <div className="deadline-info">
                        <h5>{s.name}</h5>
                        <p className="deadline-provider">{s.provider || "Scholarship Provider"}</p>
                      </div>
                    </div>
                    <div className="deadline-meta">
                      <span className="deadline-date">{formatDate(s.deadline)}</span>
                      <span className="deadline-days-badge">{daysUntil} days left</span>
                    </div>
                    <p className="deadline-desc">{(s.description || "Scholarship details will appear here.").slice(0, 80)}...</p>
                    <div className="deadline-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="btn-view-deadline" onClick={() => navigate("/user/scholarships")}>
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>


    </div>
  );
}