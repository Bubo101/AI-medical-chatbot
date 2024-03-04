import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserMetrics.css';

const apiUrl = process.env.REACT_APP_API_URL;

function UserMetrics() {
  const [metrics, setMetrics] = useState({
    totalSessions: 0,
    totalFeedbacks: 0,
    percentHelpful: 0,
    percentSessionsWithFeedback: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user-metrics`);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching user metrics:', error);
      }
    };

    fetchMetrics();
  }, []);


  return (
    <div className="user-metrics-container">
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
    </div>
  );
}

export default UserMetrics;
