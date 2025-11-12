// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Landing Components
import Navbar from "./components/navbar";
import Home from "./pages/home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// User Pages
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/dashboard";
import BookmarksPage from "./pages/user/bookmarks";
import ScholarshipsPage from "./pages/user/scholarships";
import ChatbotPage from "./pages/user/Chatbot";
import UserProfile from "./pages/user/profile";

// Admin Pages
import AdminDashboard from "./pages/admin/dashboard";

// Global Styles
import "./styles/root.css";

function App() {
  return (
    <Router>
      <AppContent />

      <Routes>
        {/* Landing Pages */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User Layout (with sidebar/header) */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="scholarships" element={<ScholarshipsPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Admin Section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

// Hide Navbar on authenticated pages
function AppContent() {
  const location = useLocation();
  const isAuthenticated =
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/admin");

  return !isAuthenticated ? <Navbar /> : null;
}

export default App;
