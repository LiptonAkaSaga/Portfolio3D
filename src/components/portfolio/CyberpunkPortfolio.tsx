// src/components/portfolio/CyberpunkPortfolio.tsx
import React, { useState } from 'react';
import CyberpunkScene from '../3d/CyberpunkScene';
import Navbar from './Navbar';
import Projects from './Projects';
import AboutMe from './AboutMe';
import Pricing from './Pricing';
import ContactMe from './ContactMe';
import Footer from './Footer';
import './css/Style.css';

const CyberpunkPortfolio: React.FC = () => {
  const [showAscii, setShowAscii] = useState(true);
  const [showBloom, setShowBloom] = useState(true);

  return (
    <div style={{ position: 'relative', padding: 0 }}>
      {/* Navbar */}

      {/* 3D Header Section */}
      <section
        id="header-3d"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* 3D Canvas */}
        <CyberpunkScene
          enableAscii={showAscii}
          enableBloom={showBloom}
          enableControls={false}
          backgroundColor="#0a0a0a"
        />

        {/* Overlay Text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 5,
            pointerEvents: 'none',
            visibility: 'hidden',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 'bold',
              color: '#00ffff',
              textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
              marginBottom: '20px',
              fontFamily: 'Fira Code, monospace',
            }}
          >
            CYBERPUNK
            <br />
            <span style={{ color: '#ff00ff' }}>PORTFOLIO</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              color: '#ffffff',
              textShadow: '0 0 10px #ffffff',
              fontFamily: 'Fira Code, monospace',
            }}
          >
            {'>'} Full-Stack Developer • 3D Artist • Cyberpunk Enthusiast
          </p>
        </div>

        {/* Controls Panel */}
        <div
          style={{
            position: 'absolute',
            top: '100px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid #00ffff',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 10,
            fontFamily: 'Fira Code, monospace',
            color: '#00ffff',
          }}
        >
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#ff00ff' }}>
            EFFECTS CONTROL
          </h3>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            <input
              type="checkbox"
              checked={showAscii}
              onChange={(e) => setShowAscii(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            ASCII Effect
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            <input
              type="checkbox"
              checked={showBloom}
              onChange={(e) => setShowBloom(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Bloom / Glow
          </label>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            zIndex: 5,
          }}
        >
          <div
            style={{
              width: '30px',
              height: '50px',
              border: '2px solid #00ffff',
              borderRadius: '15px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '10px',
                background: '#00ffff',
                borderRadius: '3px',
                position: 'absolute',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'scroll 1.5s infinite',
              }}
            />
          </div>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }
        
        @keyframes scroll {
          0% {
            top: 8px;
            opacity: 1;
          }
          100% {
            top: 28px;
            opacity: 0;
          }
        }
        
        /* Cyberpunk scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ffff, #ff00ff);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00cccc, #cc00cc);
        }
      `}</style>
    </div>
  );
};

export default CyberpunkPortfolio;
