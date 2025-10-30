import React, { useState, useRef, useEffect } from "react";
import { 
  FiBell, 
  FiChevronDown, 
  FiLayout, 
  FiSun, 
  FiMoon,
  FiUser,
  FiLogOut,
  FiSettings
} from "react-icons/fi";
import "../styles/header.css";

export default function Header({ user, onSidebarToggle }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`header ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Left: Sidebar Toggle */}
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onSidebarToggle}>
          <FiLayout size={22} />
        </button>
      </div>

      {/* Right: Actions & User */}
      <div className="header-right">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="icon-btn">
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* Notifications */}
        <button className="icon-btn">
          <FiBell size={20} />
        </button>

        {/* User Section */}
        <div className="user-section" ref={dropdownRef}>
          <img
            src={user?.avatar || "https://via.placeholder.com/35"}
            alt={`${user?.first_name} ${user?.last_name}`}
            className="user-avatar"
          />
          <span className="user-name">
            {user?.first_name} {user?.last_name}
          </span>

          {/* Dropdown Button */}
          <button className="dropdown-btn" onClick={toggleDropdown}>
            <FiChevronDown size={18} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-user-info">
                <span className="dropdown-name">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="dropdown-email">{user?.email}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <FiUser size={16} />
                <span>Profile</span>
              </button>
              <button className="dropdown-item">
                <FiSettings size={16} />
                <span>Settings</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <FiLogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}