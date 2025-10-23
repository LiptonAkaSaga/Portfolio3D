# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production (TypeScript check + Vite build)
npm run build

# Run ESLint validation
npm run lint

# Format code with Prettier
npm run format

# Preview production build locally
npm run preview
```

## Project Architecture

This is a **React 19 + TypeScript + Vite 3D Portfolio** project that showcases modern web development with Three.js 3D graphics. The architecture consists of:

### Core Structure
- **React Router DOM** with three main routes:
  - `/` - Standard portfolio page
  - `/cyberpunk-advanced` - Advanced cyberpunk-themed portfolio with 3D scenes
  - `/cyberpunk-intro` - Cyberpunk introduction page

### 3D Components (src/components/3d/)
- `AdvancedCyberpunkScene.tsx` - Main cyberpunk 3D scene with post-processing effects
- `AsciiHead.tsx` - ASCII art 3D head model
- `TextureAsciiEffect.tsx` - Texture-based ASCII effect shader

### Portfolio Components (src/components/new_portfolio/)
- `CyberpunkPortfolioAdvanced.tsx` - Advanced cyberpunk portfolio layout
- `CyberpunkIntro.tsx` - Introduction page component
- `sections/` - Modular portfolio sections (About, Contact, Projects, etc.)

### Key Technologies
- **React Three Fiber** (`@react-three/fiber`) - React renderer for Three.js
- **React Three Drei** (`@react-three/drei`) - Helpers and abstractions for R3F
- **React Three Postprocessing** - WebGL post-processing effects
- **Tailwind CSS 4** - Primary styling framework
- **Bootstrap 5** - Additional UI components
- **TypeScript** with strict configuration

### Build System
- **Vite** is the primary build tool with fast HMR
- TypeScript compilation happens during `npm run build` (`tsc -b && vite build`)
- No custom Webpack configuration - relies on Vite's optimized defaults

## Development Notes

### Code Quality
- ESLint is configured with strict React, TypeScript, and Prettier rules
- Prettier uses single quotes, 2-space indentation, and ES5 trailing commas
- TypeScript strict mode is enabled with unused variable checking

### 3D Development
- Uses `lil-gui` for debug controls in 3D scenes
- Post-processing effects are handled by `@react-three/postprocessing`
- Three.js version 0.175.0 - check compatibility when adding new 3D features

### Asset Management
- Static assets (images, videos) are in the `public/` folder
- 3D models should be placed in `public/3d-models/`
- Video files (terminal.mp4, terminal2.mp4) are used in cyberpunk themes

### Testing
- No testing framework is currently configured
- Consider adding Vitest for unit testing when implementing new features

## Architecture Patterns

### Component Organization
- 3D components are separated from UI components
- Portfolio sections are modular and reusable
- Custom hooks are in dedicated `hooks/` directories

### Route Structure
- Main portfolio uses standard React components
- Cyberpunk routes integrate 3D scenes with UI overlays
- Each route serves a distinct visual theme and purpose

### Performance Considerations
- 3D scenes use React Three Fiber's built-in optimization
- Post-processing effects can impact performance - use judiciously
- Video assets are large - consider lazy loading or compression for production