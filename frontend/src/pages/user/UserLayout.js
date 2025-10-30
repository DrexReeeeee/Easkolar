import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import "./styles/userlayout.css";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="user-layout">
      <Sidebar />
      <div className="layout-content">
        <Header 
          user={user} 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="user-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}