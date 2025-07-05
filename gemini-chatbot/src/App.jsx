import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/gemini", {
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
    setMessages([]);
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
              <div className="bubble">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message-row bot">
              <div className="avatar">🤖</div>
              <div className="bubble">⏳ Typing...</div>
            </div>
          )}
        </div>

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
