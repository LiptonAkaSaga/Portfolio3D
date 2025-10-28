import React, { useState, useEffect } from 'react';

interface CyberNavbarProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

const CyberNavbar: React.FC<CyberNavbarProps> = ({ activeSection, onSectionClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sections = ['home', 'about', 'skills', 'projects', 'contact'];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionClick = (section: string) => {
    onSectionClick(section);
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('.cyber-nav')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className="cyber-nav fade-in">
      <div className="nav-container">
        <button className="nav-logo" onClick={() => handleSectionClick('home')}>
          <span className="logo-bracket">{'<'}</span>
          <span className="logo-text">Czyż</span>
          <span className="logo-bracket">{'>'}</span>
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {sections.map((section, index) => (
            <li key={section} style={{ animationDelay: `${index * 0.1}s` }}>
              <button
                onClick={() => handleSectionClick(section)}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
              >
                <span className="nav-slash">/</span>
                {section}
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default CyberNavbar;
