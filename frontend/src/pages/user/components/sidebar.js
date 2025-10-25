import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiBookmark, FiUser, FiLogOut, FiMessageSquare, FiBookOpen } from 'react-icons/fi';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>EaseKolar</h2>
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => navigate('/user/dashboard')}>
          <FiHome /> Dashboard
        </li>
        <li onClick={() => navigate('/user/bookmarks')}>
          <FiBookmark /> Bookmarks
        </li>
        <li onClick={() => navigate('/user/scholarships')}>
          <FiBookOpen /> Scholarships
        </li>
        <li onClick={() => navigate('/user/profile')}>
          <FiUser /> Profile
        </li>
        <li onClick={() => navigate('/user/chatbot')}>
          <FiMessageSquare /> Chatbot
        </li>
      </ul>

      <div className="sidebar-footer">
        <button onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}
