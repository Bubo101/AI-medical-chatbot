import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style.css';

function Chatbot() {
    const [messages, setMessages] = useState([
        { role: "system", content: "Hello! My name is Uro. I am here to answer any of your urology related questions! (Disclaimer: I'm not a doctor.)" }
    ]);
    const [userInput, setUserInput] = useState('');
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const updatedMessages = [...messages, { role: 'user', content: userInput }];

        try {
            const response = await axios.post('http://localhost:3001/chat', {
                messages: updatedMessages,
            });
            setMessages([...messages, { role: 'user', content: userInput }, { role: 'system', content: response.data.response }]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setUserInput('');
    };

    return (
        <div className="chat-container">
            <div className="messages-container" ref={messagesContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>{msg.content}</div>
                ))}
            </div>
            <form className="input-container" onSubmit={sendMessage}>
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type a message..." />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chatbot;
