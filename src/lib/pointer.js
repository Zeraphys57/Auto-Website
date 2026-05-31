import { gsap } from 'gsap'
import { prefersReducedMotion } from './prefersReducedMotion'

// Global pointer singleton — ONE mousemove listener + ONE rAF feed every
// cursor-reactive feature on the site (parallax, spotlight, R3F drift). Reading
// `pointer.nx/ny` (normalized −0.5..0.5) or `pointer.x/y` (px) is always live.
const isCoarse =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches

export const pointerEnabled = !prefersReducedMotion && !isCoarse

export const pointer = { x: 0, y: 0, nx: 0, ny: 0 }

if (typeof window !== 'undefined') {
  pointer.x = window.innerWidth / 2
  pointer.y = window.innerHeight / 2
}

// Parallax registry — each target lerps toward (nx*sx, ny*sy).
const targets = new Set()
let listening = false
let raf = 0

const onMove = (e) => {
  pointer.x = e.clientX
  pointer.y = e.clientY
  pointer.nx = e.clientX / window.innerWidth - 0.5
  pointer.ny = e.clientY / window.innerHeight - 0.5
}

const tick = () => {
  for (const t of targets) {
    const tx = pointer.nx * t.sx
    const ty = pointer.ny * t.sy
    t.cx += (tx - t.cx) * t.lerp
    t.cy += (ty - t.cy) * t.lerp
    gsap.set(t.el, { x: t.cx, y: t.cy })
  }
  raf = requestAnimationFrame(tick)
}

const ensureListening = () => {
  if (listening || !pointerEnabled) return
  listening = true
  window.addEventListener('mousemove', onMove, { passive: true })
  raf = requestAnimationFrame(tick)
}

// Register an element for mouse-parallax. Returns an unregister cleanup.
export function registerParallax(
  el,
  { strength = 12, strengthY = strength, invert = false, lerp = 0.1 } = {}
) {
  if (!pointerEnabled || !el) return () => {}
  ensureListening()
  const sign = invert ? -1 : 1
  const t = { el, sx: strength * sign, sy: strengthY * sign, cx: 0, cy: 0, lerp }
  targets.add(t)
  return () => {
    targets.delete(t)
    gsap.set(el, { x: 0, y: 0 })
  }
}
