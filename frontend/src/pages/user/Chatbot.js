import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles/chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/chatbot",
        { question: userInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { sender: "bot", text: res.data.response || "I'm not sure about that." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        {/* Minimal Header */}
        {messages.length === 0 && (
          <div className="chat-welcome">
            <img
              src="/assets/logo-trans.png"
              alt="EaseKolar Logo"
              className="brand-logo"
            />
            <h1>EaseKolar AI</h1>
            <p>What can I help you with today?</p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="message-content loading">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea
              placeholder="Message EaseKolar AI..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              rows="1"
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !userInput.trim()}
              className="send-button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          {messages.length > 0 && (
            <button className="clear-chat" onClick={clearChat}>
              Clear chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;