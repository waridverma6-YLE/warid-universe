# Warid Universe — Interactive 3D Cosmic Explorer

A browser-based, procedural 3D visualization built with Three.js and Vite. Explore a stylized galaxy and cosmic-web-inspired structure through an interactive WebGL scene.

**Live demo:** https://warid-universe.vercel.app/  
**Source:** https://github.com/waridverma6-YLE/warid-universe

> **Scientific scope:** This is an artistic, procedurally generated visualization. The stars, galaxy, and cosmic-web geometry are simulated and are not a map of observed astronomical objects or a scientifically calibrated model of the universe.

## Features

- Procedurally generated star layers.
- A four-arm spiral-galaxy particle visualization.
- A stylized network inspired by the cosmic web.
- Interactive camera rotation by dragging.
- Zoom with the mouse wheel / trackpad scroll.
- A reset-view control.
- Responsive layout and a dark, space-inspired interface.
- Live particle-count display.

## Built with

- JavaScript (ES modules)
- Three.js
- Vite
- WebGL

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/waridverma6-YLE/warid-universe.git
cd warid-universe
```

### 2. Install dependencies

Use a current Node.js LTS release, then run:

```bash
npm ci
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

### 4. Build for production

```bash
npm run build
npm run preview
```

The production bundle is generated in `dist/`.

## Project structure

```text
warid-universe/
├── index.html
├── public/
├── src/
│   ├── main.js
│   └── style.css
├── package.json
├── package-lock.json
└── LICENSE
```

## How it works

1. Three.js creates the scene, camera, renderer, and universe group.
2. Buffer geometries store particle positions and colors efficiently.
3. Procedural functions generate star layers, a spiral galaxy, and a stylized cosmic-web network.
4. Pointer and wheel events update the camera's target rotation and distance.
5. A render loop animates the scene, while resize handling updates the camera aspect ratio and renderer dimensions.

## Performance considerations

The current scene displays approximately 48,500 star/galaxy particles, in addition to the cosmic-web geometry. Rendering cost varies by GPU, browser, screen resolution, and device pixel ratio. The renderer caps pixel ratio to reduce the cost on high-density displays.

## Roadmap

- [ ] Add screenshots or a short recorded demo.
- [ ] Test keyboard accessibility and touch interactions on mobile.
- [ ] Add a visible loading/error state and graceful WebGL fallback.
- [ ] Verify production build and browser-console behavior in CI.
- [ ] Document performance testing on desktop and mobile devices.
- [ ] Consider optional, sourced astronomical datasets as a separate mode from the procedural visualization.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).

## Author

**Warid Verma** — [GitHub profile](https://github.com/waridverma6-YLE)
