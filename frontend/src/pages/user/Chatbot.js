// /frontend/src/pages/user/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles/chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea to content height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [userInput]);

  const safeBotText = (data) => {
    // Accepts both { response: string } and more defensive shapes
    const raw = data?.response;
    const text = typeof raw === "string" ? raw.trim() : "";
    return text || "I'm not sure about that.";
  };

  const sendMessage = async () => {
    const trimmed = userInput.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { sender: "user", text: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/chatbot",
        { question: trimmed },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 30000,
        }
      );

      const botMessage = {
        sender: "bot",
        text: safeBotText(res?.data),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      let fallback = "Sorry, something went wrong. Please try again.";
      if (axios.isAxiosError?.(err)) {
        if (err.response?.status === 401) {
          fallback = "You're not signed in. Please log in and try again.";
        } else if (err.code === "ECONNABORTED") {
          fallback = "The request took too long. Please try again.";
        }
      }
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: fallback, timestamp: new Date() },
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

  const clearChat = () => setMessages([]);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  // Suggestion prompts (icons exactly as provided)
  const suggestions = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      title: "Find scholarships",
      prompt: "Help me find scholarships that match my profile",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      title: "Application tips",
      prompt: "What are some tips for writing a scholarship essay?",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      title: "Eligibility check",
      prompt: "What documents do I need for scholarship applications?",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: "Deadlines",
      prompt: "Show me scholarships with upcoming deadlines",
    },
  ];

  const handleSuggestionClick = (prompt) => {
    setUserInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        {/* Welcome Screen with Suggestions (keeps your logo path & classes) */}
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-content">
              <div className="brand-header">
                <div className="brand-logo-wrapper">
                  <img
                    src="/assets/logo-trans.png" // unchanged
                    alt="EaseKolar Logo"
                    className="brand-logo"
                  />
                </div>
                <h1 className="welcome-title">EaseKolar AI Assistant</h1>
                <p className="welcome-subtitle">
                  Your personal scholarship guide. Ask me anything about scholarships, applications, or financial aid.
                </p>
              </div>

              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(suggestion.prompt)}
                    type="button"
                  >
                    <div className="suggestion-icon" aria-hidden>{suggestion.icon}</div>
                    <span className="suggestion-title">{suggestion.title}</span>
                    <svg className="suggestion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="welcome-footer">
                <p className="disclaimer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  EaseKolar AI can make mistakes. Always verify important information.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Chat Messages
          <div className="chat-window">
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-wrapper ${msg.sender === "user" ? "user-wrapper" : "bot-wrapper"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="message-avatar bot-avatar" aria-hidden>
                      {/* bot avatar (unchanged) */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2" />
                        <circle cx="9" cy="14" r="1" />
                        <circle cx="15" cy="14" r="1" />
                      </svg>
                    </div>
                  )}

                  <div className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                   <div
                    className="message-content"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                ></div>
                    {msg.timestamp && (
                      <div className="message-time">{formatTime(msg.timestamp)}</div>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="message-avatar user-avatar" aria-hidden>
                      {/* user avatar (unchanged) */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="message-wrapper bot-wrapper">
                  <div className="message-avatar bot-avatar" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2" />
                      <circle cx="9" cy="14" r="1" />
                      <circle cx="15" cy="14" r="1" />
                    </svg>
                  </div>
                  <div className="message bot-message">
                    {/* Keep both classes to match either of your CSS loaders */}
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="chat-input-container">
          <div className="input-controls">
            {messages.length > 0 && (
              <button
                className="control-btn clear-btn"
                onClick={clearChat}
                title="New chat"
                type="button"
                aria-label="Start a new chat"
              >
                {/* plus icon unchanged */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </button>
            )}
          </div>

          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              placeholder="Message EaseKolar AI..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              rows={1}
              aria-label="Message input"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !userInput.trim()}
              className="send-button"
              title="Send message"
              type="button"
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="button-spinner" />
              ) : (
                // send icon unchanged (filled triangle)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>

          <div className="input-footer">
            <p className="input-hint">
              EaseKolar AI can assist with scholarship information, but always verify details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
