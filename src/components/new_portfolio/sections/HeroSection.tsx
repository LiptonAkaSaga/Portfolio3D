import React from 'react';
import AdvancedCyberpunkScene from '../../3d/AdvancedCyberpunkScene';

interface HeroSectionProps {
  showAscii: boolean;
  showBloom: boolean;
  showHeroSection: boolean;
  showHolographicRings: boolean;
  onAsciiChange: (value: boolean) => void;
  onBloomChange: (value: boolean) => void;
  onHeroSectionChange: (value: boolean) => void;
  onHolographicRingsChange: (value: boolean) => void;
  onSectionClick: (section: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  showAscii,
  showBloom,
  showHeroSection,
  showHolographicRings,
  onAsciiChange,
  onBloomChange,
  onHeroSectionChange,
  onHolographicRingsChange,
  onSectionClick,
}) => {
  return (
    <section id="home" className="hero-section">
      <AdvancedCyberpunkScene
        enableAscii={showAscii}
        enableBloom={showBloom}
        enableHolographicRings={showHolographicRings}
        modelPath="/models/head2.glb"
        backgroundColor="#0a0a0a"
      />

      {/* Hero Content Overlay */}
      {showHeroSection && (
        <div className="hero-content">
          <div className="hero-text">
            <div className="glitch-wrapper slide-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="hero-title glitch" data-text="Web design">
                Web design
              </h1>
            </div>
            <div className="glitch-wrapper slide-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="hero-subtitle glitch" data-text="DEVELOPER">
                DEVELOPER
              </h2>
            </div>
            <p
              className="hero-description hero-description-animated"
              style={{
                animationDelay: '0.6s',
                opacity: 0,
                animation:
                  'slideInUp 0.8s ease-out 0.6s forwards, descriptionGlow 2s linear 1.4s infinite',
              }}
            >
              <span className="terminal-prompt">{'>'}</span> Full-Stack Developer
              <br />
              <span className="terminal-prompt">{'>'}</span> 3D Graphics Enthusiast
              <br />
              <span className="terminal-prompt">{'>'}</span> Open To Work
            </p>
          </div>
        </div>
      )}

      {/* Hero Buttons - Bottom of Section */}
      {showHeroSection && (
        <div className="hero-buttons-bottom slide-in-up" style={{ animationDelay: '0.8s' }}>
          <button className="cyber-button primary" onClick={() => onSectionClick('projects')}>
            <span className="button-text">View Projects</span>
            <span className="button-icon">→</span>
          </button>
          <button className="cyber-button secondary" onClick={() => onSectionClick('contact')}>
            <span className="button-text">Contact Me</span>
            <span className="button-icon">✉</span>
          </button>
        </div>
      )}

      {/* Effects Control Panel */}
      <div className="effects-panel fade-in" style={{ animationDelay: '1s' }}>
        <h3 className="panel-title">
          <span className="panel-icon">⚙</span> FX Control
        </h3>
        <div className="panel-controls">
          <label className="control-item">
            <input
              type="checkbox"
              checked={showHeroSection}
              onChange={(e) => onHeroSectionChange(e.target.checked)}
            />
            <span className="control-label">HERO</span>
          </label>
          <label className="control-item">
            <input
              type="checkbox"
              checked={showHolographicRings}
              onChange={(e) => onHolographicRingsChange(e.target.checked)}
            />
            <span className="control-label">RINGS</span>
          </label>
          <label className="control-item">
            <input
              type="checkbox"
              checked={showAscii}
              onChange={(e) => onAsciiChange(e.target.checked)}
            />
            <span className="control-label">ASCII</span>
          </label>
          <label className="control-item">
            <input
              type="checkbox"
              checked={showBloom}
              onChange={(e) => onBloomChange(e.target.checked)}
            />
            <span className="control-label">BLOOM</span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
