import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AllyInvestReviewPage } from './components/AllyInvestReviewPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/brokers/ally-invest" 
            element={<AllyInvestReviewPage />} 
          />
          <Route 
            path="/ally-invest-review" 
            element={<AllyInvestReviewPage />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/ally-invest-review" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to="/ally-invest-review" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;