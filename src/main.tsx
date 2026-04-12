import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load heavy routes - Three.js + html2canvas only loaded when needed
const App = lazy(() => import('./components/portfolio/App.tsx'));
const CyberpunkPortfolioAdvanced = lazy(() => import('./components/new_portfolio/CyberpunkPortfolioAdvanced.tsx'));
const CyberpunkIntro = lazy(() => import('./components/new_portfolio/CyberpunkIntro.tsx'));

// Keep critical CSS synchronous
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/portfolio/css/Style.css';

// Loading fallback for lazy routes
const LoadingFallback: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      color: '#00ffff',
      fontFamily: 'monospace',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '24px', marginBottom: '16px' }}>[ Loading ]</div>
      <div
        style={{
          width: '200px',
          height: '2px',
          background: '#333',
          borderRadius: '1px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: '#00ffff',
            animation: 'loadingProgress 2s ease-in-out infinite',
          }}
        />
      </div>
    </div>
    <style>{`
        @keyframes loadingProgress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/new" element={<CyberpunkPortfolioAdvanced />} />
          <Route path="/intro" element={<CyberpunkIntro />} />
        </Routes>
      </Suspense>
    </Router>
  </React.StrictMode>
);
