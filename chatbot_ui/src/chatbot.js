import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style.css'; // Make sure this path is correct
import FormatMessage from './formatmsg'; // Make sure this path is correct

function Chatbot() {
    const [messages, setMessages] = useState([
        { role: "system", content: "Hello! My name is Uro. I am here to answer any of your urology related questions! (Disclaimer: I'm not a doctor.)" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading before sending the message
        const tempMessages = [...messages, { role: 'loading', content: '...' }]; // Temporarily show loading indicator
        setMessages(tempMessages);

        try {
            const response = await axios.post('http://localhost:3001/chat', {
                messages: [{ role: 'user', content: userInput }],
            });
            setMessages([...tempMessages.slice(0, -1), { role: 'user', content: userInput }, { role: 'system', content: response.data.response }]);
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally handle error state here
        } finally {
            setIsLoading(false); // Stop loading after receiving the response
        }

        setUserInput(''); // Clear input field after sending
    };

    return (
        <div className="chat-container">
            <div className="messages-container" ref={messagesContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.role === 'loading' ? (
                          <div className="loading-dots">
                              <span className="loading-dot"></span>
                              <span className="loading-dot"></span>
                              <span className="loading-dot"></span>
                          </div>
                        ) : (
                          <FormatMessage content={msg.content} />
                        )}
                    </div>
                ))}
            </div>
            <form className="input-container" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chatbot;