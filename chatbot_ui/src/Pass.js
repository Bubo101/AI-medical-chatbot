import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pass.css';

const Pass = ({ onPasswordAccept }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === process.env.REACT_APP_METRICS_PASSWORD) {
      onPasswordAccept(true); // Call the onPasswordAccept callback with true
    } else {
      alert('Incorrect Password!');
      setPassword('');
    }
  };

  const handleReturn = () => {
    navigate('/'); // Navigate back to the Chatbot (homepage)
  };

  return (
    <div className="pass-container">
      <form className="pass-form" onSubmit={handleSubmit}>
        <input
          className="pass-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password..."
          required
        />
        <button className="pass-submit-button" type="submit">Enter</button>
        <button className="return-button" onClick={handleReturn}>Return to Chatbot</button>
      </form>
    </div>
  );
};

export default Pass;
