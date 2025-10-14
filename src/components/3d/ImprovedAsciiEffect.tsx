import React, { useMemo, useEffect } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2, CanvasTexture, NearestFilter } from 'three';

// Funkcja tworząca teksturę z fontów ASCII
function createFontTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // ASCII characters - od najciemniejszego do najjaśniejszego
  // Możesz dostosować te znaki według swoich preferencji
  const chars = ' .:!*oe&#%@';
  const fontSize = 16;
  const charWidth = fontSize * 0.6; // Szerokość znaku mono

  const charsPerRow = chars.length;
  canvas.width = charWidth * charsPerRow;
  canvas.height = fontSize;

  // Czarne tło
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Białe znaki
  ctx.fillStyle = '#ffffff';
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  // Narysuj każdy znak
  chars.split('').forEach((char, i) => {
    ctx.fillText(char, i * charWidth + 1, 0);
  });

  const texture = new CanvasTexture(canvas);
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.needsUpdate = true;

  return texture;
}

// Shader ASCII - dokładnie jak w artykule
const asciiShader = `
  uniform sampler2D tLowRes;
  uniform sampler2D tDepth;
  uniform sampler2D tFont;
  uniform vec2 fontCharSize;
  uniform vec2 fontCharCount;
  uniform float fontCharTotalCount;
  uniform vec2 renderCharSize;
  uniform vec2 renderCharCount;
  uniform float cameraNear;
  uniform float cameraFar;
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying vec2 vUv;
  
  float readDepth(sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = texture2D(depthSampler, coord).x;
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
    return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
  }
  
  void main() {
    // Zaokrąglij UV do najbliższego znaku
    vec2 roundedUv = vec2(
      floor(vUv.x * renderCharCount.x),
      floor(vUv.y * renderCharCount.y)
    ) * renderCharSize;
    
    // Odczytaj głębokość i kolor z low-res render
    float depth = readDepth(tDepth, roundedUv);
    vec4 color = texture2D(tLowRes, roundedUv);
    
    // Oblicz luminance
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    // Wybierz znak ASCII na podstawie głębokości (lub jasności)
    float charIndex = depth * fontCharTotalCount;
    
    // Możesz też użyć gray zamiast depth dla innego efektu:
    // float charIndex = gray * fontCharTotalCount;
    
    // Oblicz UV dla fontu
    vec2 fontUv = vec2(
      mod(vUv.x, renderCharSize.x),
      mod(vUv.y, renderCharSize.y)
    ) * renderCharCount * fontCharSize + vec2(
      floor(mod(charIndex, fontCharCount.x)) * fontCharSize.x,
      floor(charIndex * fontCharSize.x) * fontCharSize.y
    );
    
    // Pobierz wartość z font texture
    vec4 fontColor = texture2D(tFont, fontUv);
    
    // Cyberpunk color gradient
    vec3 finalColor = mix(color1, color2, gray);
    
    // Połącz font z kolorem
    gl_FragColor = vec4(fontColor.rgb * finalColor, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

class ImprovedAsciiEffectImpl extends Effect {
  private fontTexture: CanvasTexture;
  private FONT_CHAR_SIZE = new Vector2(8, 16);
  private FONT_MAP_SIZE = new Vector2(88, 16); // 11 znaków * 8px szerokości

  constructor({
    color1 = [0.0, 0.3, 0.8],
    color2 = [0.0, 1.0, 1.0],
  }: {
    color1?: number[];
    color2?: number[];
  } = {}) {
    const fontTexture = createFontTexture();

    // Oblicz parametry fontu
    const fontCountX = 11; // liczba znaków w font texture
    const fontCountY = 1;
    const fontCharTotalCount = Math.floor(fontCountX) * Math.floor(fontCountY);

    // Oblicz rozmiar renderowania
    const charCountX = Math.ceil(window.innerWidth / 8);
    const charCountY = Math.ceil(window.innerHeight / 16);

    super('ImprovedAsciiEffect', asciiShader, {
      vertexShader,
      uniforms: new Map([
        ['tLowRes', new Uniform(null)],
        ['tDepth', new Uniform(null)],
        ['tFont', new Uniform(fontTexture)],
        ['fontCharSize', new Uniform(new Vector2(1 / fontCountX, 1 / fontCountY))],
        ['fontCharCount', new Uniform(new Vector2(fontCountX, fontCountY))],
        ['fontCharTotalCount', new Uniform(fontCharTotalCount)],
        ['renderCharSize', new Uniform(new Vector2(1 / charCountX, 1 / charCountY))],
        ['renderCharCount', new Uniform(new Vector2(charCountX, charCountY))],
        ['cameraNear', new Uniform(0.1)],
        ['cameraFar', new Uniform(20)],
        ['color1', new Uniform(color1)],
        ['color2', new Uniform(color2)],
      ]),
    });

    this.fontTexture = fontTexture;
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    const charCountX = Math.ceil(window.innerWidth / 8);
    const charCountY = Math.ceil(window.innerHeight / 16);

    const renderCharSize = this.uniforms.get('renderCharSize')?.value;
    const renderCharCount = this.uniforms.get('renderCharCount')?.value;

    if (renderCharSize instanceof Vector2) {
      renderCharSize.set(1 / charCountX, 1 / charCountY);
    }
    if (renderCharCount instanceof Vector2) {
      renderCharCount.set(charCountX, charCountY);
    }
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    this.fontTexture.dispose();
    super.dispose();
  }
}

export const ImprovedAsciiEffect: React.FC<{
  color1?: [number, number, number];
  color2?: [number, number, number];
}> = ({ color1 = [0.0, 0.3, 0.8], color2 = [0.0, 1.0, 1.0] }) => {
  const effect = useMemo(
    () =>
      new ImprovedAsciiEffectImpl({
        color1: Array.from(color1),
        color2: Array.from(color2),
      }),
    [color1, color2]
  );

  return <primitive object={effect} />;
};
