import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "👋 Hi! I'm Gemini. Ask me anything or try one of the examples below.",
      sender: "bot",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const suggestions = [
    "Summarize this paragraph: AI is transforming the world...",
    "Explain quantum computing in simple words",
    "Draft a professional email to HR for leave",
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { text: data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong!", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const resetChat = () => {
    setMessages([
      {
        text: "👋 Hi! I'm Gemini. Ask me anything or try one of the examples below.",
        sender: "bot",
      },
    ]);
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="app">
      <header className="topbar">
        <span>⚡ Gemini Chatbot</span>
        <button className="reset-button" onClick={resetChat}>
          🗑️ Clear
        </button>
      </header>

      <div className="chat-wrapper">
        <div className="chat-box" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.sender}`}>
              {msg.sender === "bot" && <div className="avatar">🤖</div>}
              <div className={`bubble ${msg.sender}`}>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message-row bot">
              <div className="avatar">🤖</div>
              <div className="bubble bot">⏳ Typing...</div>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            {suggestions.map((sugg, idx) => (
              <div
                key={idx}
                className="suggestion"
                onClick={() => handleSuggestionClick(sugg)}
              >
                💡 {sugg}
              </div>
            ))}
          </div>
        )}

        <div className="input-area">
          <input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

export default App;
