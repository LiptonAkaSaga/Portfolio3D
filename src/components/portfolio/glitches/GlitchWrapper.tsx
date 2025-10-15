// GlitchWrapper.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import html2canvas from 'html2canvas';

interface Props {
  children: React.ReactNode;
  delayTime?: number; // Czas opóźnienia w sekundach
  rampUpTime?: number; // Czas narastania efektu w sekundach
  onComplete?: () => void; // Callback po zakończeniu efektu
  freezeOnComplete?: boolean; // Czy zatrzymać efekt w ostatnim stanie
}

const GlitchWrapper: React.FC<Props> = ({
  children,
  delayTime = 0, // 10 sekund opóźnienia
  rampUpTime = 5, // 5 sekund narastania
  onComplete,
  freezeOnComplete = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef<boolean>(false);
  const frozenRef = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const element = containerRef.current;
    const rect = element.getBoundingClientRect();

    html2canvas(element, {
      backgroundColor: '#333333',
      useCORS: true,
      scale: 1,
      width: rect.width,
      height: rect.height,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    }).then((canvas) => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setTexture(tex);
    });
  }, [visible]);

  useEffect(() => {
    if (!texture || !canvasRef.current || !containerRef.current) return;

    const el = containerRef.current;
    const rect = el.getBoundingClientRect();

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, rect.width, rect.height, 0, -1000, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(rect.width, rect.height);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const canvasEl = canvasRef.current;
    canvasEl.style.position = 'absolute';
    canvasEl.style.top = '0';
    canvasEl.style.left = '0';
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.pointerEvents = 'none';
    canvasEl.style.zIndex = '11110';

    // Inicjalizacja uniformów z zerową intensywnością
    const uniforms = {
      uTime: { value: 0 },
      uTexture: { value: texture },
      glitchAmount: { value: 0.0 }, // Zaczynamy od 0
      blockSize: { value: 10.0 }, // Zmniejszone z 20.0 - większe bloki glitcha
      rgbShift: { value: 0.0 }, // Zaczynamy od 0
    };
    uniformsRef.current = uniforms;

    // Docelowe wartości efektów
    const targetGlitchAmount = 0.15; // Znacznie zmniejszone z 0.4
    const targetRgbShift = 0.002; // Znacznie zmniejszone z 0.005

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float glitchAmount;
        uniform float blockSize;
        uniform float rgbShift;
        varying vec2 vUv;

        float rand(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv;
          vec2 block = floor(uv * blockSize);
          float glitch = step(1.0 - glitchAmount, rand(block + uTime));
          vec2 offset = glitch * vec2(0.05 * rand(block), 0.05 * rand(block + 1.0));

          vec2 rUV = uv + offset + vec2(rgbShift, 0.0);
          vec2 gUV = uv + offset;
          vec2 bUV = uv + offset - vec2(rgbShift, 0.0);

          vec3 color;
          color.r = texture2D(uTexture, rUV).r;
          color.g = texture2D(uTexture, gUV).g;
          color.b = texture2D(uTexture, bUV).b;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(rect.width, rect.height);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(rect.width / 2, rect.height / 2, 0);
    scene.add(mesh);

    startTimeRef.current = performance.now() / 1000; // Zapisujemy czas startu w sekundach
    let last = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = (now - last) / 1000000; // Drastycznie zwiększone z 100000
      last = now;

      // Jeśli jest frozen, nie zmieniamy czasu ani uniformów - zatrzymujemy w ostatnim stanie
      if (!frozenRef.current) {
        // Dodajemy losowość do aktualizacji czasu - tylko czasami aktualizujemy czas
        if (Math.random() < 0.2) {
          // Tylko 20% szans na aktualizację w każdej klatce
          uniforms.uTime.value += delta;
        }

        const currentTime = performance.now() / 1000;
        const elapsedTime = currentTime - (startTimeRef.current || 0);

        // Obliczamy wartości efektów w zależności od czasu
        if (elapsedTime > delayTime) {
          // Jeśli minęło opóźnienie, zaczynamy ramping
          const rampProgress = Math.min(1.0, (elapsedTime - delayTime) / rampUpTime);

          // Sprawdzamy czy efekt powinien się zakończyć (po rampUpTime sekund od rozpoczęcia)
          if (elapsedTime >= delayTime + rampUpTime && !completedRef.current) {
            completedRef.current = true;

            if (freezeOnComplete) {
              // Zatrzymujemy animację w ostatnim stanie glitch
              frozenRef.current = true;
              // Wywołujemy callback po krótkim opóźnieniu
              setTimeout(() => {
                if (onComplete) {
                  onComplete();
                }
              }, 100);
            } else {
              // Normalnie kończymy efekt
              if (onComplete) {
                onComplete();
              }
              return; // Kończymy animację
            }
          }

          if (!frozenRef.current) {
            // Dodajemy pulsację do efektu glitch - wolniejsze zmiany intensywności
            const pulseIntensity = 0.6 + Math.sin(elapsedTime * 0.03) * 0.4; // Wolna sinusoida

            // Płynne przejście z 0 do docelowych wartości z pulsacją
            uniforms.glitchAmount.value = targetGlitchAmount * rampProgress * pulseIntensity;
            uniforms.rgbShift.value = targetRgbShift * rampProgress;
          }
        } else {
          // Przed opóźnieniem, efekt jest wyłączony
          uniforms.glitchAmount.value = 0;
          uniforms.rgbShift.value = 0;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
      if (canvasRef.current) {
        const canvas = canvasRef.current.querySelector('canvas');
        if (canvas) {
          canvasRef.current.removeChild(canvas);
        }
      }
    };
  }, [texture, delayTime, rampUpTime]);

  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      <div ref={containerRef}>{children}</div>
      <div ref={canvasRef} />
    </div>
  );
};

export default GlitchWrapper;
