import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGLTF } from '@react-three/drei';
import './CyberpunkIntro.css';

const CyberpunkIntro: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const terminalLines = [
    '> SYSTEM INITIALIZING...',
    '> LOADING CYBERPUNK INTERFACE...',
    '> ESTABLISHING NEURAL CONNECTION...',
    '> ENCRYPTION PROTOCOL ACTIVE',
    '> ACCESS GRANTED',
    '',
    '> HELLO, I AM CZYZ',
  ];

  // Preload 3D model for the next page (last chance before heavy 3D page)
  useEffect(() => {
    console.log('🔄 CyberpunkIntro: Preloading 3D assets for next page...');

    // Preload 3D model - to jest ostatni moment przed CyberpunkPortfolioAdvanced
    try {
      useGLTF.preload('/models/head2.glb');
      console.log('✅ CyberpunkIntro: 3D Model preload initiated');
    } catch (error) {
      console.warn('⚠ CyberpunkIntro: Error preloading 3D model:', error);
    }
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setShowSkip(true), 2000),
      setTimeout(() => startTransition(), 5000),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (stage >= 1 && visibleLines < terminalLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [stage, visibleLines]);

  const startTransition = () => {
    if (transitioning) return;
    setTransitioning(true);

    setTimeout(() => {
      navigate('/new');
    }, 1000);
  };

  return (
    <div className="cyberpunk-intro-container">
      {/* Animated Background */}
      <div className="cyber-bg">
        <div className="cyber-grid"></div>
        <div className="cyber-lines"></div>
      </div>

      {/* Main Content */}
      <div className="intro-wrapper">
        {/* Logo */}
        <div className={`cyber-logo ${stage >= 1 ? 'active' : ''}`}>
          <h1>
            <span className="bracket-left">{'<'}</span>
            <span className="logo-main">Czyz</span>
            <span className="bracket-right">{'/>'}</span>
          </h1>
          <div className="logo-underline"></div>
        </div>

        {/* Terminal */}
        <div className="terminal-container">
          <div className="terminal-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">system_init.exe</span>
          </div>
          <div className="terminal-body">
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="terminal-line">
                {line}
                {i === visibleLines - 1 && <span className="cursor">_</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(visibleLines / terminalLines.length) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            Loading: {Math.floor((visibleLines / terminalLines.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Particles */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Skip Button */}
      {showSkip && !transitioning && (
        <button className="skip-btn" onClick={startTransition}>
          <span>SKIP</span>
          <span className="arrow">→</span>
        </button>
      )}

      {/* Transition Effect */}
      {transitioning && (
        <div className="transition-effect">
          <div className="glitch-overlay"></div>
        </div>
      )}

      {/* Scanlines */}
      <div className="scanlines"></div>
    </div>
  );
};

export default CyberpunkIntro;
