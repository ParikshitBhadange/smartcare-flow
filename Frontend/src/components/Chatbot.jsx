import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chatbot/chat",
        {
          message,
          language: "English",
        }
      );

      setChat((prev) => [
        ...prev,
        { user: message, bot: res.data.reply },
      ]);
      setMessage("");
    } catch (err) {
      console.error("Chatbot error:", err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "320px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        padding: "12px",
        zIndex: 1000,
      }}
    >
      <h4>🩺 SmartCare Assistant</h4>

      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {chat.map((c, i) => (
          <div key={i}>
            <p><b>You:</b> {c.user}</p>
            <p><b>Bot:</b> {c.bot}</p>
            <hr />
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask medical question..."
        style={{ width: "100%", marginBottom: "6px" }}
      />

      <button onClick={sendMessage} style={{ width: "100%" }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;
