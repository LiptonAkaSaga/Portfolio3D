import React from 'react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const SkillsSection: React.FC = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend',
      icon: '⚡',
      skills: [
        { name: 'React', level: 90 },
        { name: 'TypeScript', level: 80 },
        { name: 'Three.js', level: 70 },
        { name: 'WebGL/Shaders', level: 60 },
        { name: 'Figma', level: 80 },
      ],
    },
    {
      title: 'Backend',
      icon: '⚙',
      skills: [
        { name: 'Node.js', level: 88 },
        { name: 'Python', level: 65 },
        { name: 'PostgreSQL', level: 65 },
        { name: 'MongoDB', level: 75 },
        { name: 'REST APIs', level: 90 },
      ],
    },
    {
      title: 'Tools & DevOps',
      icon: '🔧',
      skills: [
        { name: 'Git/GitHub', level: 90 },
        { name: 'Docker', level: 80 },
        { name: 'Blender/3D', level: 60 },
        { name: 'After Effects', level: 70 },
        { name: 'Gimp', level: 78 },
      ],
    },
  ];

  return (
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
          {skillCategories.map((category) => (
            <div key={category.title} className="skill-category">
              <h3 className="category-title">
                <span className="category-icon">{category.icon}</span> {category.title}
              </h3>
              <div className="skill-items">
                {category.skills.map((skill) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
