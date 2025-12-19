import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import FloatingChatButton from "./components/FloatingChatButton";
import "./styles/userlayout.css";
import "./styles/floatingchat.css";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
      {location.pathname !== "/user/chatbot" && <FloatingChatButton />}
    </div>
  );
}
