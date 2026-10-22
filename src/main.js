
import * as THREE from 'three'
import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#">WARID <span>UNIVERSE</span></a>
    <div class="status"><span class="status-dot"></span> COSMIC EXPLORER · LIVE RENDER</div>
  </header>

  <main class="hero">
    <p class="eyebrow">AN EXPLORATION OF THE COSMOS</p>
    <h1>Beyond the<br><span>Observable.</span></h1>
    <p class="description">A personal journey through a simulated universe. Explore the stars, drift through the cosmic web, and discover your own perspective.</p>
    <div class="controls-hint">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</div>
    <button id="reset-camera" type="button">↺ RESET VIEW</button>
    <div class="telemetry">
      <div><span>PARTICLES</span><strong id="particle-count">—</strong></div>
      <div><span>STRUCTURE</span><strong>COSMIC WEB</strong></div>
      <div><span>ENGINE</span><strong>THREE.JS</strong></div>
    </div>
  </main>

  <div id="scene" aria-label="Interactive procedural 3D universe"></div>
  <div class="crosshair">+</div>
  <footer><span>WARID UNIVERSE © 2026</span><span>PROCEDURAL COSMIC EXPLORER</span></footer>
`

const host = document.querySelector('#scene')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#03040a')
scene.fog = new THREE.FogExp2('#03040a', 0.0025)

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1200
)
camera.position.set(0, 8, 36)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
host.appendChild(renderer.domElement)

const universe = new THREE.Group()
scene.add(universe)

const rand = (min, max) => min + Math.random() * (max - min)

// Create a procedural star layer.
function makeStarLayer(count, radius, size, opacity, verticalScale = 1) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const j = i * 3
    const r = radius * Math.cbrt(Math.random())
    const theta = rand(0, Math.PI * 2)
    const y = rand(-1, 1)

    positions[j] = Math.cos(theta) * r
    positions[j + 1] = y * r * verticalScale
    positions[j + 2] = Math.sin(theta) * r

    const tint = Math.random()
    colors[j] = 0.68 + tint * 0.32
    colors[j + 1] = 0.72 + tint * 0.24
    colors[j + 2] = 0.88 + tint * 0.12
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
  )

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity,
    sizeAttenuation: true,
    depthWrite: false
  })

  const points = new THREE.Points(geometry, material)
  universe.add(points)
  return points
}

const distantStars = makeStarLayer(10000, 150, 0.9, 0.72)
makeStarLayer(6500, 85, 1.2, 0.86, 0.7)

// Build a four-arm spiral galaxy.
function makeSpiralGalaxy(count = 32000) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const arms = 4
  const maxRadius = 17

  const inner = new THREE.Color('#fff0d6')
  const middle = new THREE.Color('#88aaff')
  const outer = new THREE.Color('#5665d9')

  for (let i = 0; i < count; i++) {
    const j = i * 3
    const radius = Math.pow(Math.random(), 0.72) * maxRadius
    const arm = Math.floor(Math.random() * arms)
    const armAngle = arm * Math.PI * 2 / arms
    const twist = radius * 0.42
    const scatter = 0.16 + radius * 0.035
    const angle = armAngle + twist + rand(-scatter, scatter)

    positions[j] =
      Math.cos(angle) * radius + rand(-scatter, scatter)
    positions[j + 1] = rand(-scatter, scatter) * 0.48
    positions[j + 2] =
      Math.sin(angle) * radius + rand(-scatter, scatter)

    const blend = Math.min(radius / maxRadius, 1)
    const color = inner.clone()
      .lerp(middle, blend * 0.65)
      .lerp(outer, blend * 0.45)

    colors[j] = color.r
    colors[j + 1] = color.g
    colors[j + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
  )

  const material = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  universe.add(points)
  return points
}

const galaxy = makeSpiralGalaxy()

// Generate a stylized cosmic web.
// This is simulated geometry, not observed astronomical data.
function makeCosmicWeb(nodeCount = 240) {
  const nodes = []

  for (let i = 0; i < nodeCount; i++) {
    const direction = new THREE.Vector3(
      rand(-1, 1),
      rand(-0.7, 0.7),
      rand(-1, 1)
    ).normalize()

    nodes.push(direction.multiplyScalar(rand(24, 75)))
  }

  const segments = []

  for (let i = 0; i < nodes.length; i++) {
    const neighbours = []

    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue

      neighbours.push({
        index: j,
        distance: nodes[i].distanceToSquared(nodes[j])
      })
    }

    neighbours.sort((a, b) => a.distance - b.distance)

    for (const neighbour of neighbours.slice(0, 3)) {
      if (neighbour.distance > 24 * 24) continue
      if (neighbour.index < i) continue

      const a = nodes[i]
      const b = nodes[neighbour.index]

      segments.push(
        a.x, a.y, a.z,
        b.x, b.y, b.z
      )
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(segments, 3)
  )

  const material = new THREE.LineBasicMaterial({
    color: '#526dca',
    transparent: true,
    opacity: 0.16,
    depthWrite: false
  })

  const web = new THREE.LineSegments(geometry, material)
  universe.add(web)
  return web
}

const cosmicWeb = makeCosmicWeb()

// Layered glow at the galaxy's center.
const core = new THREE.Group()
universe.add(core)

const coreLayers = [
  { radius: 0.55, color: '#fff0d8', opacity: 0.85 },
  { radius: 1.15, color: '#9bb8ff', opacity: 0.13 },
  { radius: 2.0, color: '#6a83ff', opacity: 0.055 }
]

for (const layer of coreLayers) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(layer.radius, 24, 16),
    new THREE.MeshBasicMaterial({
      color: layer.color,
      transparent: true,
      opacity: layer.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  )

  core.add(mesh)
}

const light = new THREE.PointLight('#789aff', 65, 55)
core.add(light)

// Display the number of simulated star and galaxy particles.
document.querySelector('#particle-count').textContent =
  (10000 + 6500 + 32000).toLocaleString()

// Style the reset button without requiring another CSS edit.
const resetButton = document.querySelector('#reset-camera')

Object.assign(resetButton.style, {
  pointerEvents: 'auto',
  display: 'block',
  marginTop: '18px',
  padding: '10px 14px',
  border: '1px solid #8998ff66',
  borderRadius: '4px',
  background: '#10162b99',
  color: '#cbd3ff',
  font: "10px 'DM Mono', monospace",
  letterSpacing: '0.12em',
  cursor: 'pointer',
  transition: 'background 180ms ease, border-color 180ms ease'
})

resetButton.addEventListener('pointerenter', () => {
  resetButton.style.background = '#28335b'
  resetButton.style.borderColor = '#aab5ff'
})

resetButton.addEventListener('pointerleave', () => {
  resetButton.style.background = '#10162b99'
  resetButton.style.borderColor = '#8998ff66'
})

// Camera and interaction state.
let dragging = false
let previousX = 0
let previousY = 0
let rotationX = 0
let rotationY = 0
let targetX = 0
let targetY = 0
let targetDistance = 36
let currentDistance = 36

resetButton.addEventListener('click', () => {
  targetX = 0
  targetY = 0
  targetDistance = 36
})

renderer.domElement.addEventListener('pointerdown', (event) => {
  dragging = true
  previousX = event.clientX
  previousY = event.clientY
  renderer.domElement.setPointerCapture(event.pointerId)
})

renderer.domElement.addEventListener('pointerup', () => {
  dragging = false
})

renderer.domElement.addEventListener('pointercancel', () => {
  dragging = false
})

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) return

  targetY += (event.clientX - previousX) * 0.004
  targetX += (event.clientY - previousY) * 0.003
  targetX = THREE.MathUtils.clamp(targetX, -1.1, 1.1)

  previousX = event.clientX
  previousY = event.clientY
})

renderer.domElement.addEventListener('wheel', (event) => {
  event.preventDefault()

  targetDistance = THREE.MathUtils.clamp(
    targetDistance + event.deltaY * 0.025,
    12,
    100
  )
}, { passive: false })

// Resize and animation.
let animationId = 0
let disposed = false

function resize() {
  if (disposed) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', resize)

const clock = new THREE.Clock()

function animate() {
  if (disposed) return

  animationId = requestAnimationFrame(animate)

  const delta = Math.min(clock.getDelta(), 0.05)
  const ease = 1 - Math.exp(-5 * delta)

  rotationX += (targetX - rotationX) * ease
  rotationY += (targetY - rotationY) * ease
  currentDistance += (targetDistance - currentDistance) * ease

  // Slow idle rotation.
  galaxy.rotation.y += delta * 0.012
  distantStars.rotation.y += delta * 0.0015

  universe.rotation.x = rotationX
  universe.rotation.y = rotationY

  camera.position.set(
    Math.sin(rotationY) * currentDistance,
    5 + rotationX * 4,
    Math.cos(rotationY) * currentDistance
  )

  camera.lookAt(0, 0, 0)
  renderer.render(scene, camera)
}

animate()

// Release GPU resources during Vite hot reload.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposed = true
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)

    scene.traverse((object) => {
      object.geometry?.dispose()

      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose())
      } else {
        object.material?.dispose()
      }
    })

    renderer.dispose()
    renderer.domElement.remove()
  })
}
