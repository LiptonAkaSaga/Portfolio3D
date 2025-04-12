import { Canvas } from '@react-three/fiber';
import { EffectComposer, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import { Suspense } from 'react';

const ThreeScene = () => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // canvas w tle
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <EffectComposer>
          <Glitch
            delay={[1.5, 3.5]}
            duration={[0.6, 1.0]}
            strength={[0.3, 1.0]}
            mode={GlitchMode.SPORADIC}
            active
            ratio={0.85}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};

export default ThreeScene;
