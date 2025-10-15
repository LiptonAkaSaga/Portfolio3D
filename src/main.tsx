import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './components/portfolio/App.tsx';
import NewPortfolio from './components/portfolio/NewPortfolio.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/portfolio/css/Style.css'; // <-- styl główny
import CyberpunkPortfolioAdvanced from './components/portfolio/CyberpunkPortfolioAdvanced.tsx';
import HomeFullscreen3D from './components/3d/HomeFullscreen3D.tsx';
import UltimatePortfolio from './components/portfolio/CyberpunkPortfolio.tsx';
import CyberpunkIntro from './components/CyberpunkIntro.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new-portfolio" element={<NewPortfolio />} />
        <Route path="/cyberpunk" element={<UltimatePortfolio />} />
        <Route path="/3d-home" element={<HomeFullscreen3D />} />
        <Route path="/cyberpunk-advanced" element={<CyberpunkPortfolioAdvanced />} />
        <Route path="/cyberpunk-intro" element={<CyberpunkIntro />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
