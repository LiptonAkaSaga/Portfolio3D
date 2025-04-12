import React from 'react';
import lineImage from './images/line.svg';
import aboutMeImage from './images/About-me.svg';

const AboutMe: React.FC = () => (
  <section id="about-me">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="header row mb-5">
            <div className="col-lg-4 title">
              <h2>
                <span className="oneword">/</span>about-me
              </h2>
            </div>
            <div className="col-lg-8 line">
              <img src={lineImage} alt="line" />
            </div>
          </div>
          <div className="col-lg-12 mb-4">
            <p>
              I’m young C++ programmer and back-end developer, skilled in crafting efficient and
              scalable solutions. With a strong foundation in programming principles, I specialize
              in creating robust back-end systems that power dynamic and interactive applications.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-12 mb-4">
              <p>
                Continuously expanding my knowledge and staying up-to- date with the latest
                technologies, I thrive on tackling complex challenges and finding innovative
                solutions. Detail-oriented, I prioritize code quality and maintainability, ensuring
                the longevity of my projects.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 mb-4">
              <p>
                A proactive team player, I enjoy collaborating and contributing to the success of
                ambitious projects. Committed to continuous growth, I am always seeking new
                opportunities to enhance my skills and make a meaningful impact in the ever-evolving
                field of software development.
              </p>
            </div>
          </div>
          <a href="#pricing" className="btn btn-outline-primary">
            pricing
          </a>
        </div>
        <div className="col-lg-6">
          <img src={aboutMeImage} alt="About me" />
        </div>
      </div>
    </div>
  </section>
);

export default AboutMe;
