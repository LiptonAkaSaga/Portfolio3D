// Effects.tsx
import React from 'react';
import { EffectComposer, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';

const Effects = () => (
  <EffectComposer>
    <Glitch
      delay={[1.5, 3.5]}
      duration={[0.6, 1.0]}
      strength={[0.3, 1.0]}
      mode={GlitchMode.CONSTANT_MILD}
      active
      ratio={0.85}
    />
  </EffectComposer>
);

export default Effects;
