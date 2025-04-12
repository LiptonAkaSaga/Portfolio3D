import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Projects from './Projects';
import AboutMe from './AboutMe';
import Pricing from './Pricing';
import ContactMe from './ContactMe';
import Footer from './Footer';
import backgroundFiller from './images/fillerss.svg';
import GlitchWrapper from './GlitchWrapper';

const App: React.FC = () => {
  const [glitchStage, setGlitchStage] = useState(0);

  useEffect(() => {
    const stage1 = setTimeout(() => setGlitchStage(1), 3000); // shuffle text
    const stage2 = setTimeout(() => setGlitchStage(2), 8000); // image glitch
    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
    };
  }, []);

  const content = (
    <>
      <img src={backgroundFiller} alt="background" className="background-filler" />
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
    <>
      {glitchStage === 2 ? (
        <GlitchWrapper delayTime={1} rampUpTime={30}>
          {content}
        </GlitchWrapper>
      ) : (
        content
      )}
    </>
  );
};

export default App;
