import React, { useState, useEffect } from 'react';
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

  // Włącz scroll snap po załadowaniu i pierwszej animacji
  useEffect(() => {
    if (!isLoaded) return;

    // Poczekaj na zakończenie animacji wejścia (1 sekunda)
    const snapTimeout = setTimeout(() => {
      if (!isMobile) {
        document.documentElement.classList.add('snap-enabled');
      }
    }, 1200); // 1.2s po załadowaniu - daje czas na animacje

    return () => {
      clearTimeout(snapTimeout);
      document.documentElement.classList.remove('snap-enabled');
    };
  }, [isLoaded, isMobile]);

  // Enhanced scroll management with snap behavior
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

      // Auto-snap to nearest section after scroll ends (only on desktop)
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false);
        if (!isMobile) {
          snapToNearestSection();
        }
      }, 150);
    };

    const snapToNearestSection = () => {
      // Only snap on desktop devices
      if (isMobile) return;

      const scrollPosition = window.scrollY;
      let nearestSection = sections[0];
      let minDistance = Infinity;

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const distance = Math.abs(element.offsetTop - scrollPosition);
          if (distance < minDistance) {
            minDistance = distance;
            nearestSection = sectionId;
          }
        }
      });

      // Snap to nearest section if we're not already there
      const nearestElement = document.getElementById(nearestSection);
      if (nearestElement && Math.abs(nearestElement.offsetTop - scrollPosition) > 50) {
        nearestElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    // Wheel event handler for section-by-section navigation (desktop only)
    const handleWheel = (e: WheelEvent) => {
      // Disable wheel navigation on mobile devices
      if (isMobile || isScrolling) return;

      e.preventDefault();

      const currentIndex = sections.indexOf(activeSection);
      let targetIndex = currentIndex;

      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        // Scroll down
        targetIndex = currentIndex + 1;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up
        targetIndex = currentIndex - 1;
      }

      if (targetIndex !== currentIndex) {
        scrollToSection(sections[targetIndex]);
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      const currentIndex = sections.indexOf(activeSection);
      let targetIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          if (currentIndex < sections.length - 1) {
            targetIndex = currentIndex + 1;
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          if (currentIndex > 0) {
            targetIndex = currentIndex - 1;
          }
          break;
        case 'Home':
          e.preventDefault();
          targetIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          targetIndex = sections.length - 1;
          break;
      }

      if (targetIndex !== currentIndex) {
        scrollToSection(sections[targetIndex]);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Add wheel and keyboard navigation only on desktop
    if (!isMobile) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (!isMobile) {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeyDown);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isLoaded, activeSection, isScrolling, isMobile]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsScrolling(true);

      // Different behavior for mobile vs desktop
      if (isMobile) {
        // On mobile, just scroll smoothly without snap manipulation
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      } else {
        // Desktop behavior with snap scroll manipulation
        document.documentElement.classList.remove('snap-enabled');

        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        setTimeout(() => {
          document.documentElement.classList.add('snap-enabled');
          setIsScrolling(false);
        }, 1000);
      }
    }
  };

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
        onAsciiChange={setShowAscii}
        onBloomChange={setShowBloom}
        onHeroSectionChange={setShowHeroSection}
        onHolographicRingsChange={setShowHolographicRings}
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
