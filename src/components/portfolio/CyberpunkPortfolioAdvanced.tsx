import React, { useState, useEffect } from 'react';
import AdvancedCyberpunkScene from '../3d/AdvancedCyberpunkScene';
import './CyberpunkPortfolioAdvanced.css';

const CyberpunkPortfolioAdvanced: React.FC = () => {
  const [showAscii, setShowAscii] = useState(true);
  const [showBloom, setShowBloom] = useState(true);
  const [showRipples, setShowRipples] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cyberpunk-portfolio">
      {/* Navigation */}
      <nav className="cyber-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-bracket">{'<'}</span>
            <span className="logo-text">Czyz</span>
            <span className="logo-bracket">{'>'}</span>
          </div>

          <ul className="nav-links">
            {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
              <li key={section}>
                <button
                  onClick={() => scrollToSection(section)}
                  className={`nav-link ${activeSection === section ? 'active' : ''}`}
                >
                  <span className="nav-slash">/</span>
                  {section}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile menu toggle */}
          <button className="mobile-menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section with 3D */}
      <section id="home" className="hero-section">
        <AdvancedCyberpunkScene
          enableAscii={showAscii}
          enableBloom={showBloom}
          enableRipples={showRipples}
          modelPath="/models/head.glb"
          backgroundColor="#0a0a0a"
        />

        {/* Hero Content Overlay */}
        <div className="hero-content">
          <div className="hero-text">
            <div className="glitch-wrapper">
              <h1 className="hero-title glitch" data-text="Webdesign">
                Webdesign
              </h1>
            </div>
            <div className="glitch-wrapper">
              <h2 className="hero-subtitle glitch" data-text="DEVELOPER">
                DEVELOPER
              </h2>
            </div>
            <p className="hero-description">
              <span className="terminal-prompt">{'>'}</span> Full-Stack Developer
              <br />
              <span className="terminal-prompt">{'>'}</span> 3D Graphics Enthusiast
              <br />
              <span className="terminal-prompt">{'>'}</span> Cyberpunk Aesthetics Lover
            </p>
            <div className="hero-buttons">
              <button className="cyber-button primary" onClick={() => scrollToSection('projects')}>
                <span className="button-text">View Projects</span>
                <span className="button-icon">→</span>
              </button>
              <button className="cyber-button secondary" onClick={() => scrollToSection('contact')}>
                <span className="button-text">Contact Me</span>
                <span className="button-icon">✉</span>
              </button>
            </div>
          </div>
        </div>

        {/* Effects Control Panel */}
        <div className="effects-panel">
          <h3 className="panel-title">
            <span className="panel-icon">⚙</span> FX Control
          </h3>
          <div className="panel-controls">
            <label className="control-item">
              <input
                type="checkbox"
                checked={showAscii}
                onChange={(e) => setShowAscii(e.target.checked)}
              />
              <span className="control-label">ASCII</span>
            </label>
            <label className="control-item">
              <input
                type="checkbox"
                checked={showBloom}
                onChange={(e) => setShowBloom(e.target.checked)}
              />
              <span className="control-label">BLOOM</span>
            </label>
            <label className="control-item">
              <input
                type="checkbox"
                checked={showRipples}
                onChange={(e) => setShowRipples(e.target.checked)}
              />
              <span className="control-label">RIPPLE</span>
            </label>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={() => scrollToSection('about')}>
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p className="scroll-text">SCROLL</p>
        </div>
      </section>

      {/* About Section */}
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
                  <div className="stat-number">5+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
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
                  <div className="placeholder-text">
                    <span className="terminal-prompt">{'>'}</span> INSERT_IMAGE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section content-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-bracket">{'<'}</span>
              SKILLS
              <span className="title-bracket">{'/>'}</span>
            </h2>
            <div className="title-line"></div>
          </div>

          <div className="skills-grid">
            {/* Frontend */}
            <div className="skill-category">
              <h3 className="category-title">
                <span className="category-icon">⚡</span> Frontend
              </h3>
              <div className="skill-items">
                {[
                  { name: 'React', level: 95 },
                  { name: 'TypeScript', level: 90 },
                  { name: 'Three.js', level: 85 },
                  { name: 'WebGL/Shaders', level: 80 },
                  { name: 'CSS/SASS', level: 90 },
                ].map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="skill-category">
              <h3 className="category-title">
                <span className="category-icon">⚙</span> Backend
              </h3>
              <div className="skill-items">
                {[
                  { name: 'Node.js', level: 88 },
                  { name: 'Python', level: 85 },
                  { name: 'PostgreSQL', level: 80 },
                  { name: 'MongoDB', level: 82 },
                  { name: 'REST APIs', level: 90 },
                ].map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Other */}
            <div className="skill-category">
              <h3 className="category-title">
                <span className="category-icon">🔧</span> Tools & DevOps
              </h3>
              <div className="skill-items">
                {[
                  { name: 'Git/GitHub', level: 92 },
                  { name: 'Docker', level: 75 },
                  { name: 'AWS/Cloud', level: 70 },
                  { name: 'CI/CD', level: 78 },
                  { name: 'Blender/3D', level: 80 },
                ].map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section content-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-bracket">{'<'}</span>
              PROJECTS
              <span className="title-bracket">{'/>'}</span>
            </h2>
            <div className="title-line"></div>
          </div>

          <div className="projects-grid">
            {[
              {
                title: 'Cyberpunk 3D Portfolio',
                description: 'Interactive 3D portfolio with ASCII effects and WebGL shaders',
                tech: ['React', 'Three.js', 'WebGL', 'TypeScript'],
                status: 'Live',
                link: '#',
              },
              {
                title: 'Neural Network Visualizer',
                description: 'Real-time visualization of neural networks using WebGL',
                tech: ['Three.js', 'TensorFlow.js', 'React'],
                status: 'In Progress',
                link: '#',
              },
              {
                title: 'Holographic UI Kit',
                description: 'Futuristic UI components library with neon effects',
                tech: ['React', 'CSS', 'Framer Motion'],
                status: 'Live',
                link: '#',
              },
              {
                title: 'WebGL Particle System',
                description: 'High-performance particle effects engine for the web',
                tech: ['WebGL', 'GLSL', 'JavaScript'],
                status: 'Open Source',
                link: '#',
              },
              {
                title: 'Neon City Generator',
                description: 'Procedural city generator with cyberpunk aesthetics',
                tech: ['Three.js', 'WebGL', 'React'],
                status: 'Beta',
                link: '#',
              },
              {
                title: 'Matrix Rain Effect',
                description: 'Classic Matrix digital rain with modern WebGL',
                tech: ['WebGL', 'Canvas API', 'TypeScript'],
                status: 'Live',
                link: '#',
              },
            ].map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span
                    className={`project-status status-${project.status.toLowerCase().replace(' ', '-')}`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-footer">
                  <a href={project.link} className="project-link">
                    View Project <span className="link-arrow">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section content-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-bracket">{'<'}</span>
              CONTACT
              <span className="title-bracket">{'/>'}</span>
            </h2>
            <div className="title-line"></div>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <h3 className="contact-subtitle">Let's Connect</h3>
              <p className="contact-text">
                I'm always interested in hearing about new projects and opportunities. Whether you
                have a question or just want to say hi, feel free to reach out!
              </p>

              <div className="contact-methods">
                <a href="mailto:your@email.com" className="contact-method">
                  <span className="method-icon">✉</span>
                  <span className="method-text">your@email.com</span>
                </a>
                <a href="https://github.com/yourusername" className="contact-method">
                  <span className="method-icon">⚡</span>
                  <span className="method-text">github.com/yourusername</span>
                </a>
                <a href="https://linkedin.com/in/yourprofile" className="contact-method">
                  <span className="method-icon">💼</span>
                  <span className="method-text">linkedin.com/yourprofile</span>
                </a>
                <a href="https://twitter.com/yourusername" className="contact-method">
                  <span className="method-icon">🐦</span>
                  <span className="method-text">@yourusername</span>
                </a>
              </div>
            </div>

            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="terminal-prompt">{'>'}</span> Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="terminal-prompt">{'>'}</span> Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <span className="terminal-prompt">{'>'}</span> Message
                </label>
                <textarea
                  id="message"
                  className="form-input form-textarea"
                  placeholder="Your message..."
                  rows={5}
                  required
                ></textarea>
              </div>

              <button type="submit" className="cyber-button primary full-width">
                <span className="button-text">Send Message</span>
                <span className="button-icon">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default CyberpunkPortfolioAdvanced;
