import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FormatMessage from './formatmsg';
import DisclaimerPopup from './disclaimerPopup';
import './style.css';

function Chatbot() {
    const [messages, setMessages] = useState([
        { role: "system", content: "Hello! My name is Uro. I am here to answer any of your urology related questions! (Disclaimer: I'm not a doctor.)" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null); // Ref for the input field

    useEffect(() => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!isLoading) {
            inputRef.current && inputRef.current.focus();
        }
    }, [isLoading, messages.length]);

    const handleAcceptDisclaimer = () => {
        setAcceptedDisclaimer(true);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Add a loading message to display loading dots
        const loadingMessage = { role: 'loading', content: '...' };
        setMessages(currentMessages => [...currentMessages, loadingMessage]);

        try {
            const response = await axios.post('http://localhost:3001/chat', {
                messages: messages.concat({ role: 'user', content: userInput }).map(msg => ({ role: msg.role, content: msg.content })),
            });
            // Successfully received a response, remove the loading message, then add user message and GPT response
            setMessages(currentMessages =>
                currentMessages.slice(0, -1).concat({ role: 'user', content: userInput }, { role: 'system', content: response.data.response })
            );
        } catch (error) {
            console.error("Error sending message:", error);
            // Remove the loading message in case of an error
            setMessages(currentMessages => currentMessages.slice(0, -1));
        } finally {
            setIsLoading(false);
            setUserInput(''); // Clear the input field after sending
        }
    };

    return (
        <div className="chat-container">
            {!acceptedDisclaimer ? (
                <DisclaimerPopup onAccept={handleAcceptDisclaimer} />
            ) : (
                <>
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
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>Send</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Chatbot;