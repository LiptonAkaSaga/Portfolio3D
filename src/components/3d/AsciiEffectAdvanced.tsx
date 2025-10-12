// src/components/3d/AsciiEffectAdvanced.tsx
import React, { useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';

// Bardziej zaawansowany shader ASCII z prawdziwymi znakami
const advancedAsciiShader = `
  uniform sampler2D tDiffuse;
  uniform vec2 resolution;
  uniform float pixelSize;
  uniform float brightness;
  uniform vec3 color1;
  uniform vec3 color2;
  
  // ASCII character patterns (8x8 bitmap dla każdego znaku)
  const float chars[10] = float[10](
    0.0,      // " " (spacja)
    126.0,    // "."
    2016.0,   // "l"
    6168.0,   // "e"
    8190.0,   // "w"
    16254.0,  // "c"
    32382.0,  // "@"
    32766.0,  // "█" (pełny blok)
    65535.0,  // "■" (pełniejszy)
    65535.0   // maksymalna jasność
  );
  
  float getBit(float char, vec2 pos) {
    pos = floor(pos * 8.0);
    float bit = floor(char / pow(2.0, pos.x + pos.y * 8.0));
    return mod(bit, 2.0);
  }
  
  float character(float gray, vec2 pos) {
    // Wybierz znak na podstawie jasności
    int charIndex = int(gray * 9.0);
    charIndex = clamp(charIndex, 0, 9);
    
    return getBit(chars[charIndex], pos);
  }
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Pixelate UV
    vec2 pixelatedUV = floor(uv * resolution / pixelSize) * pixelSize / resolution;
    vec4 texColor = texture2D(tDiffuse, pixelatedUV);
    
    // Oblicz luminance
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    gray = clamp(gray * brightness, 0.0, 1.0);
    
    // Pozycja w obrębie character cell
    vec2 charPos = fract(uv * resolution / pixelSize);
    
    // Pobierz wartość dla tego pixela z character pattern
    float asciiValue = character(gray, charPos);
    
    // Cyberpunk gradient color
    vec3 finalColor = mix(color1, color2, gray);
    
    // Dodaj subtelny grid effect
    float grid = 1.0;
    if (mod(uv.x * resolution.x / pixelSize, 1.0) < 0.1 || 
        mod(uv.y * resolution.y / pixelSize, 1.0) < 0.1) {
      grid = 0.9;
    }
    
    outputColor = vec4(finalColor * asciiValue * grid, 1.0);
    
    // Dodaj subtle glow
    if (asciiValue > 0.5) {
      outputColor.rgb += vec3(0.1, 0.2, 0.3) * gray;
    }
  }
`;

class AdvancedAsciiEffectImpl extends Effect {
  constructor({
    pixelSize = 6,
    brightness = 1.5,
    color1 = [0.0, 0.3, 0.8],
    color2 = [0.0, 1.0, 1.0],
  }: {
    pixelSize?: number;
    brightness?: number;
    color1?: number[];
    color2?: number[];
  } = {}) {
    super('AdvancedAsciiEffect', advancedAsciiShader, {
      uniforms: new Map([
        ['resolution', new Uniform(new Vector2(window.innerWidth, window.innerHeight))],
        ['pixelSize', new Uniform(pixelSize)],
        ['brightness', new Uniform(brightness)],
        ['color1', new Uniform(color1)],
        ['color2', new Uniform(color2)],
      ]),
    });

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    const resolution = this.uniforms.get('resolution')?.value;
    if (resolution instanceof Vector2) {
      resolution.set(window.innerWidth, window.innerHeight);
    }
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    super.dispose();
  }
}

export const AdvancedAsciiEffect: React.FC<{
  pixelSize?: number;
  brightness?: number;
  color1?: [number, number, number];
  color2?: [number, number, number];
}> = ({ pixelSize = 6, brightness = 1.5, color1 = [0.0, 0.3, 0.8], color2 = [0.0, 1.0, 1.0] }) => {
  const effect = useMemo(
    () =>
      new AdvancedAsciiEffectImpl({
        pixelSize,
        brightness,
        color1: Array.from(color1),
        color2: Array.from(color2),
      }),
    [pixelSize, brightness, color1, color2]
  );

  return <primitive object={effect} />;
};
