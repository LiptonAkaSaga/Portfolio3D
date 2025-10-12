import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './components/portfolio/App.tsx';
import NewPortfolio from './components/portfolio/NewPortfolio.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/portfolio/css/Style.css'; // <-- styl główny
import HomeFullscreen3D from './components/3d/HomeFullscreen3D.tsx';
import Section3DWithControls from './components/3d/Section3D-with-controls.tsx';
import CyberpunkPortfolio from './components/portfolio/CyberpunkPortfolio.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new-portfolio" element={<NewPortfolio />} />
        <Route path="/cyberpunk" element={<CyberpunkPortfolio />} />
        <Route path="/3d-home" element={<HomeFullscreen3D />} />
        <Route path="/3d-section" element={<Section3DWithControls />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
