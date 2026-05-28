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
  default: { dot: 1, ring: 32, bg: 0, border: 0.5, label: '', solid: false },
  hover: { dot: 0, ring: 52, bg: 0.08, border: 0.5, label: '', solid: false },
  drag: { dot: 1, ring: 66, bg: 0.05, border: 0.6, label: 'DRAG', solid: false },
  cta: { dot: 5, ring: 80, bg: 1, border: 0, label: 'DRIVE', solid: true },
}

export default function Cursor() {
  const { currentAct } = useApp()
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  const accentRef = useRef('electric')
  const stateRef = useRef('default')
  const applyRef = useRef(null)

  const disabled =
    prefersReducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches)

  // Re-theme the cursor when the act (accent) changes.
  useEffect(() => {
    accentRef.current = currentAct === 3 ? 'gold' : 'electric'
    applyRef.current?.(stateRef.current)
  }, [currentAct])

  useEffect(() => {
    if (disabled) return
    document.body.classList.add('has-custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: mouseX, y: mouseY })

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
        width: s.ring,
        height: s.ring,
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
    }
    applyRef.current = applyState
    applyState('default')

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
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

    const getMagnets = () =>
      Array.from(document.querySelectorAll('[data-magnetic]'))

    let raf = 0
    const tick = () => {
      gsap.set(dot, { x: mouseX, y: mouseY })
      ringX += (mouseX - ringX) * 0.07
      ringY += (mouseY - ringY) * 0.07
      gsap.set(ring, { x: ringX, y: ringY })

      for (const el of getMagnets()) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = mouseX - cx
        const dy = mouseY - cy
        const within = Math.hypot(dx, dy) < 80
        const tx = within ? dx * 0.3 : 0
        const ty = within ? dy * 0.3 : 0
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
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{ width: 6, height: 6, backgroundColor: 'rgb(0,212,255)' }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border"
        style={{
          width: 32,
          height: 32,
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
    </>
  )
}
