import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiChevronDown,
  FiLayout,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut
} from "react-icons/fi";
import "../styles/header.css";

export default function Header({ user, onSidebarToggle }) {
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [dropdownAvatarError, setDropdownAvatarError] = useState(false);

  const dropdownRef = useRef(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate("/user/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getAvatarInitials = () => {
    if (!user?.first_name && !user?.last_name) return "U";
    const f = user?.first_name?.charAt(0).toUpperCase() || "";
    const l = user?.last_name?.charAt(0).toUpperCase() || "";
    return `${f}${l}`;
  };

  const hasCustomAvatar = () => {
    const avatar = user?.avatar;
    return (
      avatar &&
      avatar !== "https://via.placeholder.com/35" &&
      avatar.trim() !== "" &&
      !avatar.includes("placeholder")
    );
  };

  const handleAvatarError = () => setAvatarError(true);
  const handleDropdownAvatarError = () => setDropdownAvatarError(true);

  /* =========================
     EFFECTS
  ========================== */

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset avatar errors when user changes
  useEffect(() => {
    setAvatarError(false);
    setDropdownAvatarError(false);
  }, [user]);

  /* =========================
     RENDER
  ========================== */

  return (
    <header className={`header ${isDarkMode ? "dark-mode" : ""}`}>
      {/* LEFT */}
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onSidebarToggle}>
          <FiLayout size={22} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        {/* Theme Toggle 
        <button className="icon-btn" onClick={toggleTheme}>
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        */}
        {/* Notifications
        <button className="icon-btn">
          <FiBell size={20} />
        </button>
        */}
        {/* USER */}
        <div className="user-section" ref={dropdownRef}>
          {/* Avatar */}
          {hasCustomAvatar() && !avatarError ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="user-avatar"
              onError={handleAvatarError}
            />
          ) : (
            <div className="user-avatar-initials">
              {getAvatarInitials()}
            </div>
          )}

          <span className="user-name">
            {user?.first_name} {user?.last_name}
          </span>

          <button className="dropdown-btn" onClick={toggleDropdown}>
            <FiChevronDown size={18} />
          </button>

          {/* DROPDOWN */}
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-user-info">
                {hasCustomAvatar() && !dropdownAvatarError ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="dropdown-avatar"
                    onError={handleDropdownAvatarError}
                  />
                ) : (
                  <div className="dropdown-avatar-initials">
                    {getAvatarInitials()}
                  </div>
                )}

                <div className="dropdown-name-info">
                  <span className="dropdown-name">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="dropdown-email">{user?.email}</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button className="dropdown-item" onClick={handleProfile}>
                <FiUser size={16} />
                <span>Profile</span>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout"
                onClick={handleLogout}
              >
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
