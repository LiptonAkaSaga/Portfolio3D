import React from 'react';
import { EffectComposer, Glitch, Bloom, Noise } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import CyberpunkTerminal from './Terminal2d';

const Scene: React.FC = () => {
  return (
    <>
      <color attach="background" args={['#000']} />

      {/* Terminal UI */}
      <CyberpunkTerminal />

      {/* Glitch / Glow / Noise Effects */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.1} />
        <Noise opacity={0.05} />
      </EffectComposer>
    </>
  );
};

export default Scene;
