// Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FormatMessage from './formatmsg'; // Adjust the path if necessary
import DisclaimerPopup from './disclaimerPopup'; // Make sure this path is correct
import './style.css';

function Chatbot() {
    const [messages, setMessages] = useState([
        { role: "system", content: "Hello! My name is Uro. I am here to answer any of your urology related questions! (Disclaimer: I'm not a doctor.)" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messages]);

    const handleAcceptDisclaimer = () => {
        setAcceptedDisclaimer(true);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const tempMessages = [...messages, { role: 'loading', content: '...' }];
        setMessages(tempMessages);

        try {
            const response = await axios.post('http://localhost:3001/chat', {
                messages: [{ role: 'user', content: userInput }],
            });
            setMessages([...tempMessages.slice(0, -1), { role: 'user', content: userInput }, { role: 'system', content: response.data.response }]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }

        setUserInput('');
    };

    return (
        <div className="chat-container">
            {!acceptedDisclaimer && <DisclaimerPopup onAccept={handleAcceptDisclaimer} />}
            <div className="messages-container" ref={messagesContainerRef} style={{ display: acceptedDisclaimer ? 'block' : 'none' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`} style={{ marginBottom: '15px' }}>
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
            {acceptedDisclaimer && (
                <form className="input-container" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            )}
        </div>
    );
}

export default Chatbot;
