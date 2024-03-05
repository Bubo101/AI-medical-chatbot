import React, { useState } from 'react';
import axios from 'axios';
import Pass from './Pass'; // Import the Pass component
import './UserMetrics.css';

const apiUrl = process.env.REACT_APP_API_URL;

function UserMetrics() {
  const [metrics, setMetrics] = useState(null); // Initialize metrics state to null
  const [accepted, setAccepted] = useState(false); // Initialize accepted state to false

  const handlePasswordAccept = (isAccepted) => {
    setAccepted(isAccepted); // Set accepted state based on the value passed
    if (isAccepted) {
      fetchMetrics(); // Fetch metrics data if password is accepted
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${apiUrl}/user-metrics`);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching user metrics:', error);
    }
  };

  return (
    <div className="user-metrics-container">
      {!accepted && <Pass onPasswordAccept={handlePasswordAccept} />} {/* Render Pass component if password is not accepted */}
      {accepted && metrics && ( // Render metrics if password is accepted and metrics data is available
        <>
          <div className="user-metrics-header">
            <h1>User Metrics</h1>
          </div>
          <div className="metrics-grid">
            <div className="metric-item">
              <span>Total Sessions</span>
              <span className="metric-value">{metrics.totalSessions}</span>
            </div>
            <div className="metric-item">
              <span>Total Feedbacks</span>
              <span className="metric-value">{metrics.totalFeedbacks}</span>
            </div>
            <div className="metric-item">
              <span>Percent Sessions With Feedback</span>
              <span className="metric-value">{metrics.percentSessionsWithFeedback}%</span>
            </div>
            <div className="metric-item">
              <span>Percent Helpful</span>
              <span className="metric-value">{metrics.percentHelpful}%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserMetrics;
