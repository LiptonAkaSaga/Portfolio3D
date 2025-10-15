import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-section content-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-bracket">{'<'}</span>
            ABOUT_ME
            <span className="title-bracket">{'/>'}</span>
          </h2>
          <div className="title-line"></div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-intro">
              <span className="highlight">Hello World!</span> I'm a passionate developer who loves
              creating immersive digital experiences.
            </p>
            <p>
              With expertise in <span className="code-highlight">modern web technologies</span>, I
              specialize in building interactive 3D applications using{' '}
              <span className="code-highlight">React</span>,{' '}
              <span className="code-highlight">Three.js</span>, and{' '}
              <span className="code-highlight">WebGL</span>.
            </p>
            <p>
              My work combines technical proficiency with creative design, always pushing the
              boundaries of what's possible in the browser.
            </p>

            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">1+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="about-image">
            <div className="image-frame">
              <div className="frame-corner tl"></div>
              <div className="frame-corner tr"></div>
              <div className="frame-corner bl"></div>
              <div className="frame-corner br"></div>
              <div className="image-placeholder">
                <div className="profile-img">
                  <img src="czyzzz2.png" alt="Profile" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
