import { useEffect } from 'react';

/**
 * Hook do animacji elementów przy scrollowaniu
 * Dodaje klasę 'visible' do elementów gdy są widoczne w viewport
 * Zoptymalizowany dla współpracy ze scroll snap
 */
export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15, // Zwiększony threshold dla szybszej reakcji
      rootMargin: '0px 0px -50px 0px', // Zmniejszony margin dla lepszej synchronizacji
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Dodaj visible z małym opóźnieniem dla płynności
          requestAnimationFrame(() => {
            entry.target.classList.add('visible');
          });

          // Animuj skill bars
          if (entry.target.classList.contains('skill-item')) {
            const progressBar = entry.target.querySelector('.skill-progress') as HTMLElement;
            if (progressBar) {
              const width = progressBar.style.width;
              progressBar.style.setProperty('--skill-width', width);
            }
          }

          // Przestań obserwować po animacji dla lepszej wydajności
          if (
            !entry.target.classList.contains('content-section') &&
            !entry.target.classList.contains('skill-item')
          ) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    // Obserwuj wszystkie sekcje
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      observer.observe(section);
      // Pokaż od razu pierwszą sekcję jeśli jest widoczna
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        section.classList.add('visible');
      }
    });

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
