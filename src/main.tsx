import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './components/portfolio/App.tsx';
import NewPortfolio from './components/portfolio/NewPortfolio.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/portfolio/css/Style.css'; // <-- styl główny

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new-portfolio" element={<NewPortfolio />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
