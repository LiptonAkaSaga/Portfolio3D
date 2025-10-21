import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGLTF } from '@react-three/drei';
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

  // Preload assets in the background - video AND 3D models
  useEffect(() => {
    console.log('🚀 Starting asset preloading...');

    // 1. Preload video first (highest priority - będzie pokazane jako pierwsze)
    const preloadVideo = () => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = '/terminal.mp4';
      video.muted = true;

      video.addEventListener('progress', () => {
        if (video.buffered.length > 0 && video.duration > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const percent = Math.round((bufferedEnd / video.duration) * 100);
          console.log(`📹 Video preloading: ${percent}%`);
        }
      });

      video.addEventListener('canplaythrough', () => {
        console.log('✅ Video fully preloaded and cached!');
      });

      video.addEventListener('error', (e) => {
        console.warn('⚠ Video preload error:', e);
      });

      video.load();
    };

    // 2. Preload 3D model (lower priority)
    const preloadModel = () => {
      try {
        useGLTF.preload('/models/head2.glb');
        console.log('✅ 3D Model preload initiated: /models/head2.glb');
      } catch (error) {
        console.warn('⚠ Error preloading model:', error);
      }
    };

    // Start preloading video immediately
    preloadVideo();

    // Start preloading model after small delay (prioritize video)
    setTimeout(preloadModel, 500);
  }, []);

  useEffect(() => {
    const stage2 = setTimeout(() => setGlitchStage(2), 6000); // image glitch
    return () => {
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
      {showVideo && (
        <VideoPlayer videoSrc="/terminal.mp4" onEnded={handleVideoComplete} autoPlay={true} />
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
