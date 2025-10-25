// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

{/* landing components */}
import Navbar from "./components/navbar";
import Home from "./pages/home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

{/* User Pages */}
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/dashboard";
import BookmarksPage from "./pages/user/bookmarks";
import ScholarshipsPage from "./pages/user/scholarships";
import ChatbotPage from "./pages/user/Chatbot";

{/* Admin Pages */}
import AdminDashboard from "./pages/admin/dashboard";

{/* styles */}
import "./styles/root.css";


function App() {
  return (
    <Router>
      <AppContent />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User Layout with Sidebar/Header shared */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="scholarships" element={<ScholarshipsPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthenticatedPage = location.pathname.startsWith('/user') || location.pathname.startsWith('/admin');

  return (
    <>
      {!isAuthenticatedPage && <Navbar />}
    </>
  );
}

export default App;
