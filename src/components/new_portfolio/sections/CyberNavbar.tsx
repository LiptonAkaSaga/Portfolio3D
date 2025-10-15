import React from 'react';

interface CyberNavbarProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

const CyberNavbar: React.FC<CyberNavbarProps> = ({ activeSection, onSectionClick }) => {
  const sections = ['home', 'about', 'skills', 'projects', 'contact'];

  return (
    <nav className="cyber-nav fade-in">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-bracket">{'<'}</span>
          <span className="logo-text">Czyz</span>
          <span className="logo-bracket">{'>'}</span>
        </div>

        <ul className="nav-links">
          {sections.map((section, index) => (
            <li key={section} style={{ animationDelay: `${index * 0.1}s` }}>
              <button
                onClick={() => onSectionClick(section)}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
              >
                <span className="nav-slash">/</span>
                {section}
              </button>
            </li>
          ))}
        </ul>

        <button className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default CyberNavbar;
