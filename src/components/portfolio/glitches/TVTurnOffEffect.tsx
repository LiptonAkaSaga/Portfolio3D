// TVTurnOffEffect.tsx
import React, { useEffect, useRef } from 'react';
import { GlitchConfig } from './glitchConfig';

interface Props {
  onComplete: () => void;
  duration?: number;
}

const TVTurnOffEffect: React.FC<Props> = ({ onComplete, duration = 1.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Czyścimy canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (progress < 1) {
        // Faza 1: Kurczenie się do poziomej linii (0-60% czasu)
        if (progress < 0.6) {
          const phase1Progress = progress / 0.6;
          const height = canvas.height * (1 - phase1Progress);
          const y = (canvas.height - height) / 2;

          // Biały prostokąt kurczący się w pionie
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, y, canvas.width, height);

          // Dodajemy efekt skanowania linii
          const scanLineY = y + height / 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * (1 - phase1Progress)})`;
          ctx.fillRect(0, scanLineY - 2, canvas.width, 4);
        }
        // Faza 2: Kurczenie do punktu (60-100% czasu)
        else {
          const phase2Progress = (progress - 0.6) / 0.4;
          const width = canvas.width * (1 - phase2Progress);
          const height = 4 * (1 - phase2Progress);
          const x = (canvas.width - width) / 2;
          const y = canvas.height / 2;

          // Biały prostokąt kurczący się do punktu
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y - height / 2, width, height);

          // Jasny punkt w centrum
          if (phase2Progress > 0.7) {
            const glowAlpha = (1 - phase2Progress) * 2;
            const glowSize = 20 * (1 - phase2Progress);

            const gradient = ctx.createRadialGradient(
              canvas.width / 2,
              canvas.height / 2,
              0,
              canvas.width / 2,
              canvas.height / 2,
              glowSize
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(
              canvas.width / 2 - glowSize,
              canvas.height / 2 - glowSize,
              glowSize * 2,
              glowSize * 2
            );
          }
        }

        // Dodajemy efekt przyciemnienia
        ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.3})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(animate);
      } else {
        // Efekt zakończony - czarny ekran
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Czekamy moment i wywołujemy callback
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    };

    animate();

    // Dźwięk charakterystyczny dla starego TV (jeśli włączony w konfiguracji)
    if (GlitchConfig.tvEffect.enableSound) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Sprawdź czy AudioContext wymaga resume (user gesture)
        if (audioContext.state === 'suspended') {
          // Próbuj resume, ale nie czekaj na to
          audioContext.resume().catch(() => {
            // Ignoruj - dźwięk nie zadziała bez user gesture
            console.log('AudioContext requires user gesture - sound disabled');
          });
        }

        // Tylko jeśli context jest running, odtwórz dźwięk
        if (audioContext.state === 'running') {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(
            GlitchConfig.tvEffect.soundStartFreq,
            audioContext.currentTime
          );
          oscillator.frequency.exponentialRampToValueAtTime(
            GlitchConfig.tvEffect.soundEndFreq,
            audioContext.currentTime + duration * 0.6
          );

          gainNode.gain.setValueAtTime(GlitchConfig.tvEffect.soundVolume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

          oscillator.start();
          oscillator.stop(audioContext.currentTime + duration);
        }
      } catch (error) {
        // Całkowicie ignoruj błędy audio - nie wpływają na wizualny efekt
        // console.warn('Could not create audio context:', error);
      }
    }
  }, [duration, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    />
  );
};

export default TVTurnOffEffect;
