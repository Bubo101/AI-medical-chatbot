// Feedback.js
import React, { useState } from 'react';
import './feedback.css'; // Make sure the path matches where you place the CSS file

function Feedback() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [helpfulPercentage, setHelpfulPercentage] = useState(null);

  const submitFeedback = async (helpful) => {
    try {
      await fetch('http://localhost:3001/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful }),
      });
      // Fetch the updated percentage of positive feedback
      const response = await fetch('http://localhost:3001/feedback-percentage');
      const data = await response.json();
      setHelpfulPercentage(data.percentage);
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (feedbackSubmitted) {
    return (
      <div className="feedback-thankyou">
        Thank you for submitting feedback, {helpfulPercentage}% of users have found this tool helpful!
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <p>Was this helpful?</p>
      <button className="thumbs-up" onClick={() => submitFeedback(true)}>👍</button>
      <button className="thumbs-down" onClick={() => submitFeedback(false)}>👎</button>
    </div>
  );
}

export default Feedback;
