import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Projects from './Projects';
import AboutMe from './AboutMe';
import Pricing from './Pricing';
import ContactMe from './ContactMe';
import Footer from './Footer';
import backgroundFiller from './images/fillerss.svg';
import GlitchWrapper from './glitches/GlitchWrapper';
import TVTurnOffEffect from './glitches/TVTurnOffEffect';
import VideoPlayer from './glitches/Videoplayer';
import './css/Style.css';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [glitchStage, setGlitchStage] = useState(0);
  const [showTVEffect, setShowTVEffect] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  console.log('Background filler path:', backgroundFiller);

  useEffect(() => {
    const stage1 = setTimeout(() => setGlitchStage(1), 2500); // shuffle text
    const stage2 = setTimeout(() => setGlitchStage(2), 8000); // image glitch
    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
    };
  }, []);

  // Ustaw tło body dla oryginalnej strony
  useEffect(() => {
    document.body.style.backgroundColor = '#333333';
    document.body.style.color = '#fdfff7';
    document.body.style.fontFamily = 'Fira Code';

    return () => {
      // Nie resetuj stylów tutaj, bo może to być potrzebne dla innych stron
    };
  }, []);

  const handleGlitchComplete = () => {
    // Po zakończeniu glitch (który będzie frozen), uruchom TV turn off effect po 1.5 sekundy
    setTimeout(() => {
      setShowTVEffect(true);
    }, 1500);
  };

  const handleTVEffectComplete = () => {
    setShowTVEffect(false);
    setShowVideo(true);
  };

  const handleVideoComplete = () => {
    // Przekierowanie do nowej strony portfolio
    navigate('/cyberpunk-intro');
    setShowVideo(false);
  };

  // Funkcja do testowania - można usunąć później
  const testVideoTransition = () => {
    setShowVideo(true);
  };

  const content = (
    <>
      <img
        src={backgroundFiller}
        alt="background"
        className="background-filler"
        onLoad={() => console.log('Background filler loaded successfully')}
        onError={(e) => console.error('Background filler failed to load:', e)}
      />
      <Navbar />
      <Home glitchStage={glitchStage} />
      <Projects />
      <AboutMe />
      <Pricing />
      <ContactMe />
      <Footer />
    </>
  );

  return (
    <div
      style={{
        backgroundColor: '#333333', // var(--Background-color)
        color: '#fdfff7', // var(--White-color)
        minHeight: '100vh',
        fontFamily: 'Fira Code',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Przycisk testowy - można usunąć po testach */}
      {!showVideo && !showTVEffect && (
        <button
          onClick={testVideoTransition}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            padding: '10px 20px',
            backgroundColor: '#3a29f5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🎬 Test Video
        </button>
      )}

      {showVideo && (
        <VideoPlayer videoSrc="terminal.mp4" onEnded={handleVideoComplete} autoPlay={true} />
      )}

      {showTVEffect && <TVTurnOffEffect onComplete={handleTVEffectComplete} duration={1.5} />}

      {!showVideo && !showTVEffect && (
        <>
          {glitchStage === 2 ? (
            <GlitchWrapper
              delayTime={0}
              rampUpTime={5}
              onComplete={handleGlitchComplete}
              freezeOnComplete={true}
            >
              {content}
            </GlitchWrapper>
          ) : (
            content
          )}
        </>
      )}
    </div>
  );
};

export default App;
