import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './chatbot';
import UserMetrics from './UserMetrics';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Chatbot />} exact />
          <Route path="/user-metrics" element={<UserMetrics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

