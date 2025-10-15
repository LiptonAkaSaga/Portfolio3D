import React from 'react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  status: string;
  link: string;
}

const ProjectsSection: React.FC = () => {
  const projects: Project[] = [
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
      title: 'Travel planning application',
      description: 'A mobile application for planning and organizing trips',
      tech: ['React', 'ReactNative', 'Docker', 'Node.js'],
      status: 'In Progress',
      link: '#',
    },
    {
      title: 'Symfony Blog Platform',
      description: 'Simple blog platform built with Symfony and Docker',
      tech: ['Symfony', 'Docker', 'PostgreSQL'],
      status: 'Live',
      link: '#',
    },
    {
      title: 'App for arranging meetings',
      description:
        'A web application for scheduling and managing meetings integrated with Google Calendar',
      tech: ['PHP', 'JavaScript', 'Bootstrap', 'MySQL'],
      status: 'Beta',
      link: '#',
    },
    {
      title: 'Mobile app for arranging meetings',
      description:
        'A mobile application for scheduling and managing meetings integrated with Google Calendar',
      tech: ['React Native', 'Firebase', 'TypeScript'],
      status: 'In Progress',
      link: '#',
    },
  ];

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
                <a href={project.link} className="project-link">
                  View Project <span className="link-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
