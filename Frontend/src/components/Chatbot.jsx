import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post(
        "/chat",
        { prompt: input },
        { headers: { "Content-Type": "application/json" } }
      );

      const botMessage = { text: res.data, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error retrieving response", sender: "bot" },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        className="chatbot-toggle bg-blue-600 text-white w-18 h-18 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 my-6 mx-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <img src="/chat.jpg" alt="Chatbot" className="w-16 h-16 rounded-full" />
        )}
      </button>

      {/* Chatbot Container */}
      {isOpen && (
        <div
          className={`chatbot-container fixed bottom-20 right-4 w-96 my-9 mx-5 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="chatbot-card flex flex-col h-[600px]">
            {/* Header */}
            <div className="chatbot-header bg-blue-600 text-white flex items-center justify-center py-2">
              <img
                src="/logo.png"
                alt="ENSAJ Logo"
                className="w-20 rounded-full"
              />
            </div>

            {/* Body */}
            <div
              className="chatbot-body flex-1 p-4 overflow-y-auto bg-no-repeat bg-center bg-cover relative"
              style={{ backgroundColor: "white" }}
            >
              {/* Blur Overlay */}
              <div
                className="absolute inset-0 bg-black opacity-50"
                style={{ filter: "blur(10px)", zIndex: "-1" }}
              ></div>

              {/* Messages */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message mb-2 p-3 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white self-end place-self-end"
                      : "bg-gray-300 text-black self-start"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}

              {loading && (
                <div className="message bot flex items-center justify-start">
                  <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full mr-2 "></div>
                  <span>Loading...</span>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Footer */}
            <div className="chatbot-footer p-2 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  className="chatbot-input flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="chatbot-send bg-blue-600 text-white p-2 ml-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
