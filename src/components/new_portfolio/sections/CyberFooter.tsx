import React from 'react';

const CyberFooter: React.FC = () => {
  return (
    <footer className="cyber-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-bracket">{'<'}</span>
            <span className="logo-text">CYBER</span>
            <span className="logo-bracket">{'/>'}</span>
          </div>
          <p className="footer-text">
            Built with <span className="highlight">React</span>,{' '}
            <span className="highlight">Three.js</span> & lots of{' '}
            <span className="highlight">caffeine</span>
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Cyberpunk Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CyberFooter;
