// src/pages/user/UserLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import "./styles/dashboard.css";

export default function UserLayout() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header user={user} />
        <div className="dashboard-main">
          {/* Child pages (Dashboard, Bookmarks, Scholarships) will render here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
