import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown } from '@fortawesome/free-regular-svg-icons';
import './feedback.css'; 

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

  let color = 'green'

  if (feedbackSubmitted) {
    return (
      <div className="feedback-thankyou">
        Thank you for submitting feedback!
        {helpfulPercentage >= 80 && (
          <div>
            <span style={{ color }}>{` ${helpfulPercentage}%`}</span> of users have found this tool helpful!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <p>Was this helpful?</p>
      <button className="thumbs-up" onClick={() => submitFeedback(true)}>
        <FontAwesomeIcon icon={farThumbsUp} />
      </button>
      <button className="thumbs-down" onClick={() => submitFeedback(false)}>
        <FontAwesomeIcon icon={farThumbsDown} />
      </button>
    </div>
  );
}

export default Feedback;
