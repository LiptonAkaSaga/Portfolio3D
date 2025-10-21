// VideoPlayer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { GlitchConfig } from './glitchConfig';

interface Props {
  videoSrc: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<Props> = ({ videoSrc, onEnded, autoPlay = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  console.log('VideoPlayer rendering with videoSrc:', videoSrc);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hasStartedPlaying = false;

    const handleCanPlayThrough = () => {
      console.log('✅ Video can play through - enough data buffered');

      if (autoPlay && !hasStartedPlaying) {
        hasStartedPlaying = true;
        // Upewnij się że video jest muted dla autoplay
        video.muted = true;

        // Czekamy 100ms dla pewności że bufor jest gotowy
        setTimeout(() => {
          video.play().catch((error) => {
            console.warn('Autoplay prevented, user interaction required:', error);
            setNeedsUserGesture(true);
            hasStartedPlaying = false;
          });
        }, 100);
      }
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      console.error('Video error details:', (e.target as HTMLVideoElement).error);
    };

    const handleLoadStart = () => {
      console.log('Video loading started');
    };

    const handleStalled = () => {
      console.warn('Video stalled');
      // Nie próbuj reload - to może powodować loop
    };

    const handleWaiting = () => {
      console.log('⏳ Video buffering...');
    };

    const handlePlaying = () => {
      console.log('▶️ Video is playing');
      hasStartedPlaying = true;
    };

    const handlePause = () => {
      console.log('Video paused unexpectedly');
      // Nie próbuj auto-resume - to może powodować konflikty z buffering
    };

    const handleSuspend = () => {
      console.log('Video loading suspended by browser');
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          const percent = Math.round((bufferedEnd / duration) * 100);
          console.log(`📊 Video buffered: ${percent}%`);

          // Jeśli mamy przynajmniej 30% bufora i video nie gra, spróbuj odtworzyć
          if (percent >= 30 && video.paused && autoPlay && !hasStartedPlaying) {
            console.log('🎬 Enough buffer - starting playback');
            hasStartedPlaying = true;
            video.muted = true;
            video.play().catch((err) => {
              console.warn('Could not start playback:', err);
              hasStartedPlaying = false;
            });
          }
        }
      }
    };

    const handleEnded = () => {
      console.log('Video ended');
      if (onEnded) {
        onEnded();
      }
    };

    // Używamy canplaythrough zamiast canplay - czeka na wystarczająco danych
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('suspend', handleSuspend);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);

    // Force load
    video.load();

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('suspend', handleSuspend);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay, onEnded, needsUserGesture]);

  // Zarządzanie klasą body dla zapobiegania scrollowaniu
  useEffect(() => {
    // Dodanie klasy do body gdy video jest aktywne
    document.body.classList.add('video-playing');

    // Wymusza ukrycie interfejsu mobilnego
    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');

    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    return () => {
      // Usunięcie klasy gdy komponent się unmountuje
      document.body.classList.remove('video-playing');

      // Przywrócenie oryginalnego viewport
      if (viewport && originalContent) {
        viewport.setAttribute('content', originalContent);
      }
    };
  }, []);

  return (
    <div
      className="video-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Zapobieganie scrollowaniu na mobilnych
        overflow: 'hidden',
        // Wyłączenie zoom na dotyk
        touchAction: 'none',
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          // Wycentrowanie wideo na wszystkich urządzeniach
          display: 'block',
          margin: 'auto',
        }}
        controls={GlitchConfig.video.showControls}
        loop={GlitchConfig.video.loop}
        playsInline // Bardzo ważne dla iOS - zapobiega fullscreen
        muted // ZAWSZE muted dla autoplay
        preload="auto" // Ładuj cały plik
        crossOrigin="anonymous"
        // Wyłączenie picture-in-picture na mobilnych
        disablePictureInPicture
      >
        <source src={videoSrc} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {needsUserGesture && (
        <div
          onClick={async () => {
            const v = videoRef.current;
            if (!v) return;
            try {
              // unmute when user explicitly interacts (optional)
              v.muted = false;
              await v.play();
              setNeedsUserGesture(false);
            } catch (err) {
              console.error('Play still failed after user gesture:', err);
            }
          }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            // Zapobieganie scrollowaniu
            touchAction: 'none',
          }}
          aria-label="Play video"
        >
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#000',
              border: '2px solid #fff',
              padding: '16px 24px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 'bold',
              cursor: 'pointer',
              // Większy przycisk na mobilnych
              minWidth: '120px',
              minHeight: '60px',
              // Lepsze dotykanie na mobilnych
              touchAction: 'manipulation',
              userSelect: 'none',
              // Animacja
              transition: 'all 0.2s ease',
            }}
            onTouchStart={(e) => {
              // Zapobiega wielokrotnym dotknięciom
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ▶ Play Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
