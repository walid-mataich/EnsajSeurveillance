import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatBot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false); // ✅ New state for loading
    const chatEndRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true); // ✅ Show loading

        try {
            const res = await axios.post("http://localhost:8080/api/chat", {
                prompt: input,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const botMessage = { text: res.data, sender: "bot" };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error("Error fetching response", error);
            setMessages([...messages, userMessage, { text: "Error retrieving response", sender: "bot" }]);
        }

        setLoading(false); // ✅ Hide loading
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]); // ✅ Scroll when messages or loading state changes

    return (
        <div>
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                <img src="/bot.jpg" alt="Chatbot" style={{ width: "50px", height: "50px" }} />
            </button>
            {isOpen && (
                <div className="chatbot-container">
                    <div className="card chatbot-card shadow-lg">
                        <div className="card-header text-white text-center">
                            <img src="/LOGOENSA.png" alt="ENSAJ Logo" />
                            <h4>ENSAJ ChatBot</h4>
                        </div>
                        <div className="card-body chat-box" style={{ height: "300px", overflowY: "auto" }}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
                                    <div className={`p-2 rounded shadow ${msg.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && ( // ✅ Show "Loading response..." while waiting
                                <div className="d-flex justify-content-start">
                                    <div className="p-2 rounded bg-light text-dark">
                                        <em>Loading response...</em>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>
                        <div className="card-footer">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>
                {`
                    .chatbot-toggle {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .card-header {
                        background: rgb(57, 93, 212);
                    }
                    .chatbot-container {
                        position: fixed;
                        bottom: 80px;
                        right: 20px;
                        width: 450px;
                    }
                    .chatbot-card {
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .chatbot-card img {
                        width: 150px;
                    }
                    .card-body {
                        background-image: url("/backchat.jpg");
                        background-size: contain; 
                        background-repeat: repeat;
                        background-attachment: fixed;
                        backdrop-filter: blur(28px); 
                        -webkit-backdrop-filter: blur(8px); 
                    }

                `}
            </style>
        </div>
    );
};

export default ChatBot;
