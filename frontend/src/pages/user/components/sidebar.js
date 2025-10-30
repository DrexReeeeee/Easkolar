import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBookmark,
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiAward
} from 'react-icons/fi';
import '../styles/sidebar.css'; 

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      {/* ===== LOGO SECTION ===== */}
      <div className="sidebar-logo">
          <span className="brand-text">
          <span className="brand-ease">Ease</span>
          <span className="brand-kolar">Kolar</span>
        </span>
      </div>

      {/* ===== SIDEBAR MENU SECTIONS ===== */}
      <div className="sidebar-sections">
        {/* GENERAL */}
        <div className="sidebar-section">
          <h4 className="sidebar-category">General</h4>
          <ul className="sidebar-menu">
            <li 
              className={isActive('/user/dashboard') ? 'active' : ''}
              onClick={() => navigate('/user/dashboard')}
            >
              <FiHome className="menu-icon" /> 
              <span>Dashboard</span>
            </li>
          </ul>
        </div>

        {/* SCHOLARSHIPS */}
        <div className="sidebar-section">
          <h4 className="sidebar-category">Scholarships</h4>
          <ul className="sidebar-menu">
            <li 
              className={isActive('/user/scholarships') ? 'active' : ''}
              onClick={() => navigate('/user/scholarships')}
            >
              <FiAward className="menu-icon" /> 
              <span>Find Scholarships</span>
            </li>
            <li 
              className={isActive('/user/bookmarks') ? 'active' : ''}
              onClick={() => navigate('/user/bookmarks')}
            >
              <FiBookmark className="menu-icon" /> 
              <span>Bookmarks</span>
            </li>
          </ul>
        </div>

        {/* AI TOOLS */}
        <div className="sidebar-section">
          <h4 className="sidebar-category">AI Tools</h4>
          <ul className="sidebar-menu">
            <li 
              className={isActive('/user/chatbot') ? 'active' : ''}
              onClick={() => navigate('/user/chatbot')}
            >
              <FiMessageSquare className="menu-icon" /> 
              <span>AI Chatbot</span>
            </li>
          </ul>
        </div>

        {/* PROFILE */}
        <div className="sidebar-section">
          <h4 className="sidebar-category">Profile</h4>
          <ul className="sidebar-menu">
            <li 
              className={isActive('/user/profile') ? 'active' : ''}
              onClick={() => navigate('/user/profile')}
            >
              <FiUser className="menu-icon" /> 
              <span>Edit Profile</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut className="menu-icon" /> 
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}