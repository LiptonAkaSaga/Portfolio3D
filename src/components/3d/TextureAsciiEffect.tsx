// src/components/3d/TextureAsciiEffect.tsx
/**
 * ASCII Effect używający canvas z tekstem jako tekstury
 * Inspirowane artykułem: https://jmswrnr.com/blog/creating-my-websites-3d-header
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, CanvasTexture, LinearFilter } from 'three';

// Funkcja tworząca teksturę z znakami ASCII
function createAsciiTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // ASCII characters od najciemniejszego do najjaśniejszego
  const chars = ' cwel';
  const fontSize = 16;
  const charWidth = fontSize * 0.6;

  canvas.width = charWidth * chars.length;
  canvas.height = fontSize;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = 'top';

  // Narysuj każdy znak
  chars.split('').forEach((char, i) => {
    ctx.fillText(char, i * charWidth, 0);
  });

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

// Shader używający tekstury z znakami
const textureAsciiShader = `
  uniform sampler2D tDiffuse;
  uniform sampler2D tAscii;
  uniform vec2 resolution;
  uniform vec2 cellSize;
  uniform float brightness;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float time;
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Oblicz pozycję cell
    vec2 cell = floor(uv * resolution / cellSize);
    vec2 cellUV = cell * cellSize / resolution;
    
    // Sample koloru z oryginalnej tekstury
    vec4 texColor = texture2D(tDiffuse, cellUV + cellSize / resolution * 0.5);
    
    // Oblicz luminance
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    gray = clamp(gray * brightness, 0.0, 1.0);
    
    // Wybierz znak ASCII na podstawie jasności
    float charIndex = gray * 9.0; // 10 znaków = 0-9
    vec2 asciiUV = vec2((charIndex + 0.5) / 10.0, 0.5);
    
    // Sample znak z tekstury ASCII
    vec2 charPos = fract(uv * resolution / cellSize);
    asciiUV.x += (charPos.x - 0.5) / 10.0;
    
    float asciiValue = texture2D(tAscii, asciiUV).r;
    
    // Cyberpunk color gradient
    vec3 finalColor = mix(color1, color2, gray);
    
    // Dodaj pulsację
    float pulse = 0.95 + sin(time * 2.0 + gray * 10.0) * 0.05;
    
    // Scanline effect
    float scanline = sin(uv.y * resolution.y * 2.0 + time * 10.0) * 0.05 + 0.95;
    
    outputColor = vec4(finalColor * asciiValue * pulse * scanline, 1.0);
    
    // Dodaj glow dla jasnych obszarów
    if (gray > 0.7) {
      outputColor.rgb += color2 * 0.3 * (gray - 0.7);
    }
  }
`;

class TextureAsciiEffectImpl extends Effect {
  private asciiTexture: CanvasTexture;
  private time: number = 0;

  constructor({
    cellSize = [8, 12],
    brightness = 1.5,
    color1 = [0.0, 0.2, 0.6],
    color2 = [0.0, 1.0, 1.0],
  }: {
    cellSize?: [number, number];
    brightness?: number;
    color1?: number[];
    color2?: number[];
  } = {}) {
    const asciiTexture = createAsciiTexture();

    super('TextureAsciiEffect', textureAsciiShader, {
      uniforms: new Map([
        ['resolution', new Uniform([window.innerWidth, window.innerHeight])],
        ['cellSize', new Uniform(cellSize)],
        ['brightness', new Uniform(brightness)],
        ['color1', new Uniform(color1)],
        ['color2', new Uniform(color2)],
        ['tAscii', new Uniform(asciiTexture)],
        ['time', new Uniform(0)],
      ]),
    });

    this.asciiTexture = asciiTexture;
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    const resolution = this.uniforms.get('resolution')?.value;
    if (resolution) {
      resolution[0] = window.innerWidth;
      resolution[1] = window.innerHeight;
    }
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    this.time += deltaTime;
    const timeUniform = this.uniforms.get('time');
    if (timeUniform) {
      timeUniform.value = this.time;
    }
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    this.asciiTexture.dispose();
    super.dispose();
  }
}

export const TextureAsciiEffect: React.FC<{
  cellSize?: [number, number];
  brightness?: number;
  color1?: [number, number, number];
  color2?: [number, number, number];
}> = ({
  cellSize = [8, 12],
  brightness = 1.5,
  color1 = [0.0, 0.2, 0.6],
  color2 = [0.0, 1.0, 1.0],
}) => {
  const effect = useMemo(
    () =>
      new TextureAsciiEffectImpl({
        cellSize,
        brightness,
        color1: Array.from(color1),
        color2: Array.from(color2),
      }),
    [cellSize, brightness, color1, color2]
  );

  return <primitive object={effect} />;
};
