import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";

export default function FloatingChatButton() {
  const navigate = useNavigate();

  return (
    <button className="floating-chat" onClick={() => navigate("/user/chatbot")}>
      <span>Ask me anything!</span>
      <FiMessageCircle size={20} />
    </button>
  );
}
