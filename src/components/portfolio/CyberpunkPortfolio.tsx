import React from 'react';
import AdvancedCyberpunkScene from '../3d/AdvancedCyberpunkScene';

function UltimatePortfolio() {
  return (
    <div>
      {/* Header z wszystkimi efektami */}
      <section style={{ height: '100vh', position: 'relative' }}>
        <AdvancedCyberpunkScene
          enableAscii={true}
          enableBloom={true}
          enableRipples={true}
          modelPath="/models/head.glb"
        />

        {/* Hero Text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontSize: '5rem',
              fontWeight: 'bold',
              color: '#00ffff',
              textShadow: '0 0 30px #00ffff',
              fontFamily: 'Fira Code',
              marginBottom: '20px',
            }}
          >
            CYBERPUNK
            <br />
            <span style={{ color: '#ff00ff' }}>DEVELOPER</span>
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              color: '#fff',
              fontFamily: 'Fira Code',
            }}
          >
            {'>'} Crafting Digital Experiences
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            zIndex: 20,
            cursor: 'pointer',
          }}
          onClick={() => {
            document.getElementById('content')?.scrollIntoView({
              behavior: 'smooth',
            });
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

      {/* Content Section */}
      <section
        id="content"
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#fff',
          padding: '100px 50px',
        }}
      >
        <h2>Projects</h2>
        {/* Your content here */}
      </section>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes scroll {
          0% { top: 8px; opacity: 1; }
          100% { top: 28px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default UltimatePortfolio;
