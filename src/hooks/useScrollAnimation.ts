import { useEffect } from 'react';

/**
 * Hook do animacji elementów przy scrollowaniu
 * Dodaje klasę 'visible' do elementów gdy są widoczne w viewport
 */
export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animuj skill bars
          if (entry.target.classList.contains('skill-item')) {
            const progressBar = entry.target.querySelector('.skill-progress') as HTMLElement;
            if (progressBar) {
              const width = progressBar.style.width;
              progressBar.style.setProperty('--skill-width', width);
            }
          }
        }
      });
    }, observerOptions);

    // Obserwuj wszystkie sekcje
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => observer.observe(section));

    // Obserwuj skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item) => observer.observe(item));

    // Obserwuj project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => observer.observe(card));

    // Obserwuj stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);
};

export default useScrollAnimation;
