import React, { useState, useEffect, useCallback } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import CyberNavbar from './sections/CyberNavbar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';
import CyberFooter from './sections/CyberFooter';
import SectionNavigator from './sections/SectionNavigator';
import './CyberpunkPortfolioAdvanced.css';

const CyberpunkPortfolioAdvanced: React.FC = () => {
  const [showAscii, setShowAscii] = useState(true);
  const [showBloom, setShowBloom] = useState(true);
  const [showHeroSection, setShowHeroSection] = useState(true);
  const [showHolographicRings, setShowHolographicRings] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Hook do animacji przy scrollowaniu
  useScrollAnimation();

  // Sections array for snap scroll navigation
  const sections = ['home', 'about', 'skills', 'projects', 'contact'];

  // Check if device is mobile or has small screen
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || window.innerHeight <= 600;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const newIsMobile = isMobileDevice || isTouchDevice;

      // Update mobile state
      setIsMobile(newIsMobile);

      // Snap scroll będzie włączony przez osobny effect po załadowaniu
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Enhanced scroll management without snap behavior
  useEffect(() => {
    if (!isLoaded) return;

    let scrollTimeout: number;

    const handleScroll = () => {
      setIsScrolling(true);

      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Update active section based on scroll position
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Set scrolling to false after scroll ends
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isLoaded, isScrolling]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsScrolling(true);

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, []);

  // Loading effect simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`cyberpunk-portfolio ${isLoaded ? 'loaded' : ''}`}>
      {/* Navigation */}
      <CyberNavbar activeSection={activeSection} onSectionClick={scrollToSection} />

      {/* Hero Section with 3D */}
      <HeroSection
        showAscii={showAscii}
        showBloom={showBloom}
        showHeroSection={showHeroSection}
        showHolographicRings={showHolographicRings}
        onAsciiChange={useCallback((value: boolean) => setShowAscii(value), [])}
        onBloomChange={useCallback((value: boolean) => setShowBloom(value), [])}
        onHeroSectionChange={useCallback((value: boolean) => setShowHeroSection(value), [])}
        onHolographicRingsChange={useCallback(
          (value: boolean) => setShowHolographicRings(value),
          []
        )}
        onSectionClick={scrollToSection}
      />

      {/* About Section */}
      <AboutSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <CyberFooter />

      {/* Section Navigator */}
      <SectionNavigator
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
    </div>
  );
};

export default CyberpunkPortfolioAdvanced;
