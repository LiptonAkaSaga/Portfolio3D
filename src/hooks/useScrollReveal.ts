import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
};

// Przykład użycia w komponencie:
/*

import { useScrollReveal } from '../hooks/useScrollReveal';

function MySection() {
  const { elementRef, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section 
      ref={elementRef}
      className={`section ${isVisible ? 'visible' : ''}`}
    >
      Content
    </section>
  );
}

// W CSS:
.section {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease-out;
}

.section.visible {
  opacity: 1;
  transform: translateY(0);
}

*/

// ===== DODATKOWE HOOKI =====

/**
 * Hook for parallax scroll effect
 */
export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

// Użycie:
/*
function ParallaxElement() {
  const offset = useParallax(0.5);

  return (
    <div style={{ transform: `translateY(${offset}px)` }}>
      Parallax content
    </div>
  );
}
*/

/**
 * Hook for typing animation
 */
export const useTypingEffect = (text: string, speed: number = 50, delay: number = 0) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        setCurrentIndex(0);
      }, delay);
      return () => clearTimeout(delayTimeout);
    }
  }, [delay]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

// Użycie:
/*
function TypedText() {
  const text = useTypingEffect('Hello, World!', 100, 500);

  return <h1>{text}<span className="cursor">|</span></h1>;
}
*/

/**
 * Hook for counting animation
 */
export const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);

  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, end, start, duration]);

  return { count, elementRef };
};

// Użycie:
/*
function StatCounter() {
  const { count, elementRef } = useCountUp(100, 2000);

  return <div ref={elementRef}>{count}+</div>;
}
*/

/**
 * Hook for mouse parallax effect
 */
export const useMouseParallax = (strength: number = 20) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  return position;
};

// Użycie:
/*
function FloatingElement() {
  const { x, y } = useMouseParallax(30);

  return (
    <div style={{ transform: `translate(${x}px, ${y}px)` }}>
      Follows mouse
    </div>
  );
}
*/

export default useScrollReveal;
