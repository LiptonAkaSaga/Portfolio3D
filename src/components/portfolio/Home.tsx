import React, { useEffect, useState } from 'react';
import personImage from './images/Czyzz.png';

interface HomeProps {
  glitchStage?: number;
}

const Home: React.FC<HomeProps> = ({ glitchStage = 0 }) => {
  const [shuffledTitle, setShuffledTitle] = useState('C++ programmer');
  const [shuffledSubtitle, setShuffledSubtitle] = useState('back-end developer');

  const targetTitle = 'Web Designer';
  const targetSubtitle = 'Front-end developer';

  // Litery do losowania
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*';

  useEffect(() => {
    if (glitchStage === 1) {
      let progress = 0;
      const maxSteps = 20;
      const shuffleInterval = 50;

      const shuffle = (target: string, progress: number) => {
        const revealed = target.substring(0, Math.floor(progress * target.length));
        const shuffled = Array.from(target.substring(revealed.length))
          .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
          .join('');
        return revealed + shuffled;
      };

      const interval = setInterval(() => {
        progress += 1 / maxSteps;

        setShuffledTitle(shuffle(targetTitle, progress));
        setShuffledSubtitle(shuffle(targetSubtitle, progress));

        if (progress >= 1) {
          clearInterval(interval);
          setShuffledTitle(targetTitle);
          setShuffledSubtitle(targetSubtitle);
        }
      }, shuffleInterval);

      return () => clearInterval(interval);
    }
  }, [glitchStage]);

  return (
    <section id="home">
      <div className="container">
        <div className="row gy-5 align-items-center">
          <div className="col-lg-6 order-lg-first order-last">
            <h1 className="display-4 mt-5" style={{ color: 'white' }}>
              I'm a <strong>{glitchStage < 1 ? 'C++ programmer' : shuffledTitle}</strong> and
              <strong>
                <br />
                {glitchStage < 1 ? 'back-end developer' : shuffledSubtitle}
              </strong>
            </h1>
            <p className="mt-5">
              passionate about crafting efficient and robust solutions. Continuously learning and
              exploring new technologies, driven by a curiosity to solve complex problems.
              Detail-oriented and dedicated, with a strong focus on code quality and scalability. A
              team player who enjoys collaborating and contributing to innovative projects.
            </p>
            <a href="#contact-me" className="btn btn-outline-primary">
              Contact me
            </a>
            <div className="quote">
              <h3 className="quote">You know, I'm something of a scientist myself</h3>
              <h3 className="author">~ Norman Osborn</h3>
            </div>
          </div>
          <div className="col-lg-6 col-md-8">
            <div className="person-img">
              <img src={personImage} alt="person" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
