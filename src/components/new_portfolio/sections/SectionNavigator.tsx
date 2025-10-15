import React from 'react';

interface SectionNavigatorProps {
  sections: string[];
  activeSection: string;
  onSectionClick: (section: string) => void;
}

const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  activeSection,
  onSectionClick,
}) => {
  return (
    <div className="section-navigator">
      {sections.map((section) => (
        <button
          key={section}
          className={`nav-dot ${activeSection === section ? 'active' : ''}`}
          onClick={() => onSectionClick(section)}
          title={section.charAt(0).toUpperCase() + section.slice(1)}
        >
          <span className="dot-inner"></span>
        </button>
      ))}
    </div>
  );
};

export default SectionNavigator;
