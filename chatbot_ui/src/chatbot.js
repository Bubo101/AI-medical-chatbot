import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FormatMessage from './formatmsg';
import DisclaimerPopup from './disclaimerPopup';
import Feedback from './feedback';
import './style.css';

function Chatbot() {
    const [messages, setMessages] = useState([
        { role: "system", content: "Hello! My name is Uro. I am here to answer any of your urology related questions! (Disclaimer: I'm not a doctor.)" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null); 
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const startSession = async () => {
        try {
            await fetch(`${apiUrl}/start-session`, { method: 'POST' });
            console.log('Chatbot session started.');
        } catch (error) {
            console.error('Error starting session:', error);
        }
        };
    
        startSession();
    }, [apiUrl]);

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

    // useEffect(() => {
    //     if (acceptedDisclaimer && inputRef.current) {
    //         inputRef.current.focus();
    //     }
    // }, [acceptedDisclaimer]);

    const handleAcceptDisclaimer = () => {
        setAcceptedDisclaimer(true);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const newUserMessage = { role: 'user', content: userInput };
        setMessages(currentMessages => [...currentMessages, newUserMessage]);

        const loadingMessage = { role: 'loading', content: '...' };
        setMessages(currentMessages => [...currentMessages, loadingMessage]);
    
        try {
            const response = await axios.post(`${apiUrl}/chat`, {
                messages: [...messages, newUserMessage].map(msg => ({ role: msg.role, content: msg.content })),
            });

            setMessages(currentMessages => 
                currentMessages.slice(0, -1) 
                .concat({ role: 'system', content: response.data.response })
            );
        } catch (error) {
            console.error("Error sending message:", error);

            setMessages(currentMessages => currentMessages.slice(0, -1));
        } finally {
            setIsLoading(false);
            setUserInput(''); 
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
                    <Feedback />
                </>
            )}
        </div>
    );
}

export default Chatbot;