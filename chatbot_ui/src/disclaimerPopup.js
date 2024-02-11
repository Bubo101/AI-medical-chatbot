// DisclaimerPopup.js
import React from 'react';
import './popup.css'; // Assuming you have a separate CSS file for styling the popup

const DisclaimerPopup = ({ onAccept }) => {
  return (
    <div className="disclaimer-overlay">
      <div className="disclaimer-content">
        <h2>Disclaimer</h2>
        <p>Welcome to the Enloe Urology Services Chatbot. Please note:</p>
        <ul>
          <li>This chatbot provides general urology information. It is not a substitute for professional medical advice.</li>
          <li>Interactions with this chatbot do not create a doctor-patient relationship.</li>
          <li>We do not store or retain any personal or confidential information shared during the chat.</li>
          <li>Enloe Urology Services and its affiliates are not liable for decisions made based on information provided by this chatbot.</li>
        </ul>
        <button onClick={onAccept}>I Accept</button>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
