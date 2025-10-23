// VideoPlayer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { GlitchConfig } from './glitchConfig';

interface Props {
  videoSrc?: string;
  preloadedVideo?: HTMLVideoElement | undefined;
  onEnded?: () => void;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<Props> = ({ videoSrc, preloadedVideo, onEnded, autoPlay = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  console.log('VideoPlayer rendering with preloadedVideo:', preloadedVideo ? 'YES' : 'NO', 'videoSrc:', videoSrc);

  useEffect(() => {
    if (!containerRef.current) return;

    // Jeśli mamy preloaded video, użyj go bezpośrednio
    if (preloadedVideo) {
      console.log('🎬 Using preloaded video element directly!');

      // Ustaw style na preloaded video
      Object.assign(preloadedVideo.style, {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
      });

      // Ustaw atrybuty na preloaded video
      preloadedVideo.muted = true;
      preloadedVideo.controls = GlitchConfig.video.showControls;
      preloadedVideo.loop = GlitchConfig.video.loop;
      preloadedVideo.playsInline = true;
      preloadedVideo.crossOrigin = 'anonymous';
      preloadedVideo.disablePictureInPicture = true;

      let hasStartedPlaying = false;

      const handleCanPlayThrough = () => {
        console.log('✅ Preloaded video can play through');

        if (autoPlay && !hasStartedPlaying) {
          hasStartedPlaying = true;
          preloadedVideo.muted = true;

          setTimeout(() => {
            preloadedVideo.play().catch((error) => {
              console.warn('Autoplay prevented for preloaded video:', error);
              setNeedsUserGesture(true);
              hasStartedPlaying = false;
            });
          }, 100);
        }
      };

      const handleEnded = () => {
        console.log('Preloaded video ended');
        if (onEnded) onEnded();
      };

      // Dodaj event listeners do preloaded video
      preloadedVideo.addEventListener('canplaythrough', handleCanPlayThrough);
      preloadedVideo.addEventListener('ended', handleEnded);
      preloadedVideo.addEventListener('playing', () => console.log('▶️ Preloaded video is playing'));

      // Jeśli preloaded video jest już gotowe do odtworzenia
      if (preloadedVideo.readyState >= 4) {
        console.log('🚀 Preloaded video has enough data!');
        handleCanPlayThrough();
      }

      // Wstaw preloaded video do kontenera (przenieś z ukrycia)
      containerRef.current.appendChild(preloadedVideo);

      return () => {
        preloadedVideo.removeEventListener('canplaythrough', handleCanPlayThrough);
        preloadedVideo.removeEventListener('ended', handleEnded);
        // Nie usuwamy z DOM - zostanie użyty ponownie
      };
    }

    // Fallback dla standardowego wideo
    return () => {};
  }, [preloadedVideo, autoPlay, onEnded]);

  // Zarządzanie klasą body dla zapobiegania scrollowaniu
  useEffect(() => {
    document.body.classList.add('video-playing');

    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');

    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    return () => {
      document.body.classList.remove('video-playing');

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
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* Kontener na preloaded video */}
      {preloadedVideo ? (
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        />
      ) : (
        // Standardowy video element dla fallback
        <video
          ref={containerRef as any}
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            display: 'block',
            margin: 'auto',
          }}
          controls={GlitchConfig.video.showControls}
          loop={GlitchConfig.video.loop}
          playsInline
          muted
          preload="auto"
          crossOrigin="anonymous"
          disablePictureInPicture
        >
          {videoSrc && (
            <>
              <source src={videoSrc} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
              <source src={videoSrc} type="video/mp4" />
              <source src={videoSrc} type="video/webm" />
            </>
          )}
          {!videoSrc && (
            <>Your browser does not support the video tag.</>
          )}
        </video>
      )}

      {needsUserGesture && (
        <div
          onClick={async () => {
            // Użyj preloaded video jeśli dostępne, w przeciwnym razie znajdź video w kontenerze
            const videoToPlay = preloadedVideo || (containerRef.current?.querySelector('video') as HTMLVideoElement);
            if (!videoToPlay) return;
            try {
              videoToPlay.muted = false;
              await videoToPlay.play();
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
              minWidth: '120px',
              minHeight: '60px',
              touchAction: 'manipulation',
              userSelect: 'none',
              transition: 'all 0.2s ease',
            }}
            onTouchStart={(e) => {
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