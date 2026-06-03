import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../../context/AppContext'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const ACCENTS = {
  electric: '0,212,255',
  gold: '201,169,110',
}

// dotScale, ring size (px), ring fill alpha, ring border alpha, label, solid fill
const STATES = {
  default:  { dot: 1, ring: 32, bg: 0,    border: 0.5, label: '',      solid: false },
  hover:    { dot: 0, ring: 52, bg: 0.08, border: 0.5, label: '',      solid: false },
  link:     { dot: 0, ring: 48, bg: 0.06, border: 0.45, label: 'VIEW', solid: false },
  drag:     { dot: 1, ring: 66, bg: 0.05, border: 0.6, label: 'DRAG', solid: false },
  cta:      { dot: 5, ring: 80, bg: 1,    border: 0,   label: 'DRIVE', solid: true  },
  external: { dot: 0, ring: 48, bg: 0.06, border: 0.45, label: '↗',    solid: false },
}

export default function Cursor() {
  const { currentAct } = useApp()
  const dotRef  = useRef(null)
  const trailRef = useRef(null)
  const ringRef  = useRef(null)
  const labelRef = useRef(null)

  const accentRef = useRef('electric')
  const stateRef  = useRef('default')
  const applyRef  = useRef(null)

  const disabled =
    prefersReducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches)

  // Re-theme cursor when act (accent) changes.
  useEffect(() => {
    accentRef.current = currentAct === 3 ? 'gold' : 'electric'
    applyRef.current?.(stateRef.current)
  }, [currentAct])

  useEffect(() => {
    if (disabled) return
    document.body.classList.add('has-custom-cursor')

    const dot   = dotRef.current
    const trail = trailRef.current
    const ring  = ringRef.current
    const label = labelRef.current

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX  = mouseX, ringY  = mouseY
    let trailX = mouseX, trailY = mouseY
    let prevMouseX = mouseX, prevMouseY = mouseY

    gsap.set([dot, ring, trail], { xPercent: -50, yPercent: -50, x: mouseX, y: mouseY })

    const applyState = (name) => {
      const s = STATES[name] || STATES.default
      const a = ACCENTS[accentRef.current]
      gsap.to(dot, {
        scale: s.dot,
        backgroundColor: `rgb(${a})`,
        duration: 0.3,
        ease: 'power3.out',
      })
      gsap.to(ring, {
        width: s.ring, height: s.ring,
        backgroundColor: s.solid ? `rgb(${a})` : `rgba(${a},${s.bg})`,
        borderColor: `rgba(${a},${s.border})`,
        duration: 0.35,
        ease: 'power3.out',
      })
      if (label) {
        label.textContent = s.label
        gsap.to(label, {
          autoAlpha: s.label ? 1 : 0,
          color: s.solid ? '#0A0A0A' : `rgb(${a})`,
          duration: 0.25,
        })
      }
      // Trail accent
      gsap.to(trail, {
        backgroundColor: `rgba(${a},0.25)`,
        duration: 0.4,
      })
    }
    applyRef.current = applyState
    applyState('default')

    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY }
    const onOver = (e) => {
      const el = e.target.closest?.('[data-cursor]')
      const next = el ? el.getAttribute('data-cursor') : 'default'
      if (next !== stateRef.current) {
        stateRef.current = next
        applyState(next)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })

    const getMagnets = () => Array.from(document.querySelectorAll('[data-magnetic]'))

    let raf = 0
    const tick = () => {
      // Exact dot
      gsap.set(dot, { x: mouseX, y: mouseY })

      // Ring — lerp 0.07
      ringX  += (mouseX - ringX)  * 0.07
      ringY  += (mouseY - ringY)  * 0.07
      gsap.set(ring, { x: ringX, y: ringY })

      // Trailing dot — lerp 0.15 for depth
      trailX += (mouseX - trailX) * 0.15
      trailY += (mouseY - trailY) * 0.15
      gsap.set(trail, { x: trailX, y: trailY })

      // Velocity-based ring stretch
      const vx = mouseX - prevMouseX
      const vy = mouseY - prevMouseY
      prevMouseX = mouseX
      prevMouseY = mouseY
      const speed = Math.hypot(vx, vy)
      const stretch = Math.min(1.4, 1 + speed * 0.022)
      gsap.set(ring, { scaleX: stretch, scaleY: 1 / Math.sqrt(stretch) })

      // Magnetic elements — per-element strength via data-magnetic-strength
      for (const el of getMagnets()) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top  + r.height / 2
        const dx = mouseX - cx
        const dy = mouseY - cy
        const within = Math.hypot(dx, dy) < 80
        const strength = parseFloat(el.dataset.magneticStrength || '0.3')
        const tx = within ? dx * strength : 0
        const ty = within ? dy * strength : 0
        el._mx = (el._mx || 0) + (tx - (el._mx || 0)) * 0.15
        el._my = (el._my || 0) + (ty - (el._my || 0)) * 0.15
        gsap.set(el, { x: el._mx, y: el._my })
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.body.classList.remove('has-custom-cursor')
      applyRef.current = null
    }
  }, [disabled])

  if (disabled) return null

  return (
    <>
      {/* Layer 1 — trailing ghost, lerp 0.15 */}
      <div
        ref={trailRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9997] rounded-full"
        style={{ width: 10, height: 10, backgroundColor: 'rgba(0,212,255,0.25)' }}
      />
      {/* Layer 2 — ring, lerp 0.07 */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full border"
        style={{
          width: 32, height: 32,
          borderColor: 'rgba(0,212,255,0.5)',
          backgroundColor: 'rgba(0,212,255,0)',
        }}
      >
        <span
          ref={labelRef}
          className="font-accent font-extralight uppercase"
          style={{ fontSize: 9, letterSpacing: '0.15em', opacity: 0 }}
        />
      </div>
      {/* Layer 3 — exact dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{ width: 6, height: 6, backgroundColor: 'rgb(0,212,255)' }}
      />
    </>
  )
}
