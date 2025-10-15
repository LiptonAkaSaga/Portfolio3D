import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './components/portfolio/App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/portfolio/css/Style.css'; // <-- styl główny
import CyberpunkPortfolioAdvanced from './components/new_portfolio/CyberpunkPortfolioAdvanced.tsx';
import CyberpunkIntro from './components/new_portfolio/CyberpunkIntro.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cyberpunk-advanced" element={<CyberpunkPortfolioAdvanced />} />
        <Route path="/cyberpunk-intro" element={<CyberpunkIntro />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
