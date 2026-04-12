import React, { useState, useEffect } from 'react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  status: string;
  link: string;
}

const ProjectsSection: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupProject, setPopupProject] = useState<string>('');

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showPopup]);

  const projects: Project[] = [
    {
      title: 'Aromelia.pl',
      description:
        'Large e-commerce store with complete custom design, modified theme, custom CSS and JavaScript for enhanced shopping experience.',
      tech: ['WooCommerce', 'WordPress', 'Custom CSS', 'PHP', 'JavaScript', 'Custom Design'],
      status: 'Live',
      link: 'https://aromelia.pl',
    },
    {
      title: 'Alicyna.com - One Product Store',
      description:
        'E-commerce single product store built with Elementor, custom CSS/JS modifications for cart and checkout flow optimization.',
      tech: ['Elementor', 'WordPress', 'Custom CSS', 'JavaScript', 'WooCommerce'],
      status: 'Live',
      link: 'https://alicyna.com',
    },
    {
      title: 'PusteKapsulki.pl',
      description:
        'E-commerce store built on PrestaShop with Creative Elements custom builder, custom CSS styling for product catalog.',
      tech: ['PrestaShop', 'Creative Elements', 'Custom CSS', 'JavaScript', 'PHP'],
      status: 'Live',
      link: 'https://pustekapsulki.pl',
    },
    {
      title: 'Electroviking.pl',
      description:
        'Landing page for electrician services built with Elementor and custom CSS styling.',
      tech: ['Elementor', 'WordPress', 'Custom CSS'],
      status: 'Live',
      link: 'https://electroviking.pl',
    },
    {
      title: 'Cyberpunk styled 3D Portfolio',
      description: 'Interactive 3D portfolio with ASCII effects and WebGL shaders',
      tech: ['React', 'Three.js', 'WebGL', 'TypeScript', 'After Effects'],
      status: 'Live',
      link: '#',
    },
    {
      title: 'E-learning Platform',
      description: 'A fully functional e-learning platform created for an engineering thesis.',
      tech: ['TypeScript', 'Node.js', 'React', 'Prisma ORM'],
      status: 'Live',
      link: 'learnup',
    },
    {
      title: 'Travel planning mobile application',
      description: 'A mobile application for planning and organizing trips',
      tech: ['React Native', 'Docker', 'Node.js', 'Expo', 'NestJS'],
      status: 'In Progress',
      link: '#',
    },
    {
      title: 'Symfony Blog Platform',
      description:
        'Simple blog platform built with Symfony and Docker, makes for university project',
      tech: ['Symfony', 'Docker', 'PostgreSQL'],
      status: 'Live',
      link: '#',
    },
    {
      title: 'App for arranging meetings',
      description:
        'A web application for scheduling and managing meetings integrated with Google Calendar, makes for university project',
      tech: ['PHP', 'JavaScript', 'Bootstrap', 'MySQL'],
      status: 'Beta',
      link: '#',
    },
  ];

  const handleProjectClick = (project: Project, e: React.MouseEvent) => {
    if (project.status === 'Beta' || project.status === 'In Progress') {
      e.preventDefault();
      setPopupProject(project.title);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
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
          {projects.map((project, index) => (
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
                <a
                  href={project.link}
                  className="project-link"
                  onClick={(e) => handleProjectClick(project, e)}
                >
                  View Project <span className="link-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Cyberpunk Popup */}
        {showPopup && (
          <div className="cyber-popup-overlay" onClick={closePopup}>
            <div className="cyber-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-scanlines"></div>
              <div className="popup-header">
                <div className="popup-icon">⚠️</div>
                <h3 className="popup-title">
                  <span className="glitch" data-text="ACCESS DENIED">
                    ACCESS DENIED
                  </span>
                </h3>
              </div>

              <div className="popup-body">
                <div className="popup-message">
                  <div className="terminal-line">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-text">
                      Initializing access to: <span className="highlight">{popupProject}</span>
                    </span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-text error-text">
                      ERROR: Project not ready for public access
                    </span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-text">
                      Status: <span className="warning-text">Under Development</span>
                    </span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-text">
                      This project is still in development phase
                    </span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-text">Please check back later...</span>
                  </div>
                </div>

                <div className="popup-footer">
                  <button className="cyber-button primary" onClick={closePopup}>
                    <span>UNDERSTOOD</span>
                    <span className="button-icon">✓</span>
                  </button>
                </div>
              </div>

              <div className="popup-corners">
                <span className="corner tl"></span>
                <span className="corner tr"></span>
                <span className="corner bl"></span>
                <span className="corner br"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
