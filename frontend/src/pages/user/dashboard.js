// src/pages/user/dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../user/styles/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        const res = await axios.get("http://localhost:5001/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // save user for layout
      } catch (err) {
        console.error("Error fetching profile:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard-main">
      <h2>Welcome, {user.first_name}!</h2>
      <p>Email: {user.email}</p>
      <p>Course: {user.course || "N/A"}</p>
      <p>GPA: {user.gpa || "N/A"}</p>
      <p>Location: {user.location || "Not set"}</p>

      <div className="card-section">
        <div className="info-card">
          <h3>Bookmarks</h3>
          <p>See your saved scholarships and updates.</p>
        </div>
        <div className="info-card">
          <h3>Scholarships</h3>
          <p>Browse and apply to available scholarship programs.</p>
        </div>
        <div className="info-card">
          <h3>Profile</h3>
          <p>View and update your academic and personal details.</p>
        </div>
        <div className="info-card">
          <h3>Chatbot</h3>
          <p>Get instant scholarship recommendations via EaseBot.</p>
        </div>
      </div>
    </div>
  );
}
