// src/components/3d/AsciiEffect.tsx
import React, { useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform } from 'three';

// Shader do konwersji renderowanej sceny na ASCII
const asciiShader = `
  uniform sampler2D tDiffuse;
  uniform vec2 resolution;
  uniform float pixelSize;
  uniform float brightness;
  
  // ASCII characters w kolejności od najciemniejszego do najjaśniejszego
  const vec2 charSize = vec2(8.0, 12.0);
  
  float character(float n, vec2 p) {
    p = floor(p * charSize + 0.5);
    
    // Simplified ASCII character map
    if (n < 0.1) return 0.0;
    if (n < 0.2) return step(0.5, p.x) * step(0.5, p.y);
    if (n < 0.3) return step(0.3, max(p.x, p.y));
    if (n < 0.4) return step(0.4, length(p - charSize * 0.5));
    if (n < 0.5) return step(abs(p.x - p.y), 2.0);
    if (n < 0.6) return step(max(abs(p.x - 4.0), abs(p.y - 6.0)), 3.0);
    if (n < 0.7) return step(length(p - charSize * 0.5), 4.0);
    if (n < 0.8) return 1.0 - step(length(p - charSize * 0.5), 2.0);
    if (n < 0.9) return 1.0 - step(max(abs(p.x - 4.0), abs(p.y - 6.0)), 2.0);
    return 1.0;
  }
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 pixelatedUV = floor(uv * resolution / pixelSize) * pixelSize / resolution;
    vec4 color = texture2D(tDiffuse, pixelatedUV);
    
    // Oblicz jasność
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    gray = gray * brightness;
    
    // Pozycja wewnątrz pixela
    vec2 charPos = mod(uv * resolution / pixelSize, 1.0);
    
    // Wybierz znak ASCII na podstawie jasności
    float char = character(gray, charPos);
    
    // Cyberpunk color scheme
    vec3 asciiColor = mix(
      vec3(0.0, 0.5, 1.0),  // ciemny niebieski
      vec3(0.0, 1.0, 1.0),  // cyan
      gray
    );
    
    outputColor = vec4(asciiColor * char, 1.0);
  }
`;

// Klasa efektu ASCII
class AsciiEffectImpl extends Effect {
  constructor({
    pixelSize = 6,
    brightness = 1.2,
  }: {
    pixelSize?: number;
    brightness?: number;
  } = {}) {
    super('AsciiEffect', asciiShader, {
      uniforms: new Map([
        ['resolution', new Uniform([window.innerWidth, window.innerHeight])],
        ['pixelSize', new Uniform(pixelSize)],
        ['brightness', new Uniform(brightness)],
      ]),
    });
  }

  update() {
    const resolution = this.uniforms.get('resolution')?.value;
    if (resolution) {
      resolution[0] = window.innerWidth;
      resolution[1] = window.innerHeight;
    }
  }
}

// React komponent
export const AsciiEffect: React.FC<{
  pixelSize?: number;
  brightness?: number;
}> = ({ pixelSize = 6, brightness = 1.2 }) => {
  const effect = useMemo(
    () => new AsciiEffectImpl({ pixelSize, brightness }),
    [pixelSize, brightness]
  );

  return <primitive object={effect} dispose={null} />;
};
