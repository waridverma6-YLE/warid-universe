
import * as THREE from 'three'
import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#">WARID <span>UNIVERSE</span></a>
    <div class="status"><span class="status-dot"></span> COSMIC EXPLORER · LIVE RENDER</div>
  </header>

  <main class="hero">
    <div class="intro">
      <p class="eyebrow">AN EXPLORATION OF THE COSMOS</p>
      <h1>Beyond the<br><span>Observable.</span></h1>
      <p class="description">A personal journey through a simulated universe. Explore the stars, drift through the cosmic web, and discover your own perspective.</p>
      <div class="controls-hint">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</div>
    </div>
    <div class="telemetry">
      <div><span>STAR PARTICLES</span><strong id="star-count">—</strong></div>
      <div><span>SIMULATION</span><strong>DEEP SPACE</strong></div>
      <div><span>RENDER ENGINE</span><strong>WEBGL / THREE.JS</strong></div>
    </div>
  </main>
  <div id="scene" aria-label="Interactive 3D star field"></div>
  <div class="crosshair">+</div>
  <footer><span>WARID UNIVERSE © 2026</span><span>AN ORIGINAL CREATIVE PROJECT</span></footer>
`

const sceneHost = document.querySelector('#scene')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#03040a')
scene.fog = new THREE.FogExp2('#03040a', 0.012)

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1500
)
camera.position.set(0, 5, 32)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
sceneHost.appendChild(renderer.domElement)

// A deterministic star field generated for this project.
const STAR_COUNT = 12000
const positions = new Float32Array(STAR_COUNT * 3)
const colors = new Float32Array(STAR_COUNT * 3)
const random = (min, max) => min + Math.random() * (max - min)

for (let i = 0; i < STAR_COUNT; i++) {
  const i3 = i * 3
  const radius = 8 + Math.pow(Math.random(), 0.55) * 90
  const theta = Math.random() * Math.PI * 2
  const vertical = random(-0.48, 0.48)

  positions[i3] = Math.cos(theta) * radius
  positions[i3 + 1] = vertical * radius
  positions[i3 + 2] = Math.sin(theta) * radius

  const tint = Math.random()
  colors[i3] = 0.64 + tint * 0.36
  colors[i3 + 1] = 0.70 + tint * 0.27
  colors[i3 + 2] = 0.90 + tint * 0.10
}

const starGeometry = new THREE.BufferGeometry()
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const starMaterial = new THREE.PointsMaterial({
  size: 0.15,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true,
  depthWrite: false
})

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

// A luminous spiral structure made from our own procedural point cloud.
const GALAXY_COUNT = 18000
const galaxyPositions = new Float32Array(GALAXY_COUNT * 3)
const galaxyColors = new Float32Array(GALAXY_COUNT * 3)
const armCount = 4

for (let i = 0; i < GALAXY_COUNT; i++) {
  const i3 = i * 3
  const radius = Math.pow(Math.random(), 0.72) * 15
  const arm = i % armCount
  const angle = arm * (Math.PI * 2 / armCount) + radius * 0.48
  const spread = 0.35 + radius * 0.045

  galaxyPositions[i3] = Math.cos(angle) * radius + random(-spread, spread)
  galaxyPositions[i3 + 1] = random(-spread, spread) * 0.65
  galaxyPositions[i3 + 2] = Math.sin(angle) * radius + random(-spread, spread)

  const glow = 1 - radius / 19
  galaxyColors[i3] = 0.25 + glow * 0.42
  galaxyColors[i3 + 1] = 0.38 + glow * 0.42
  galaxyColors[i3 + 2] = 0.75 + glow * 0.25
}

const galaxyGeometry = new THREE.BufferGeometry()
galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3))
galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3))

const galaxyMaterial = new THREE.PointsMaterial({
  size: 0.11,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  blending: THREE.AdditiveBlending
})

const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
scene.add(galaxy)

// A soft central light adds depth without external image assets.
const coreLight = new THREE.PointLight('#668cff', 90, 35)
coreLight.position.set(0, 0, 0)
scene.add(coreLight)

const ambientLight = new THREE.AmbientLight('#24304f', 1.2)
scene.add(ambientLight)

document.querySelector('#star-count').textContent =
  (STAR_COUNT + GALAXY_COUNT).toLocaleString()

// Simple pointer controls: drag to rotate, wheel to zoom.
let dragging = false
let previousX = 0
let previousY = 0
let targetRotationX = 0
let targetRotationY = 0
let cameraDistance = 32

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
  targetRotationY += (event.clientX - previousX) * 0.004
  targetRotationX += (event.clientY - previousY) * 0.003
  targetRotationX = THREE.MathUtils.clamp(targetRotationX, -1.2, 1.2)
  previousX = event.clientX
  previousY = event.clientY
})

renderer.domElement.addEventListener('wheel', (event) => {
  event.preventDefault()
  cameraDistance = THREE.MathUtils.clamp(
    cameraDistance + event.deltaY * 0.025,
    10,
    100
  )
}, { passive: false })

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', resize)

function animate() {
  requestAnimationFrame(animate)

  galaxy.rotation.y += 0.0005
  stars.rotation.y += 0.00008

  galaxy.rotation.y += (targetRotationY - galaxy.rotation.y) * 0.035
  galaxy.rotation.x += (targetRotationX - galaxy.rotation.x) * 0.035

  camera.position.z += (cameraDistance - camera.position.z) * 0.06
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

animate()
