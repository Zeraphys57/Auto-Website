import { gsap } from 'gsap'
import { prefersReducedMotion } from './prefersReducedMotion'

const isCoarse =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches

export const tiltEnabled = !prefersReducedMotion && !isCoarse

// Premium 3D tilt-toward-cursor on a card. Uses gsap.quickTo (one tween,
// re-targeted per move — no per-event tween churn). Optional:
//   inner  — a child lifted on translateZ for parallax-within-card
//   glare  — a child whose radial highlight follows the cursor across the face
//   onEnter/onLeave — hooks (e.g. Models color-bleed) fired with the event
// Returns a cleanup that resets all transforms. No-op on touch / reduced-motion.
export function applyTilt(
  el,
  { max = 14, perspective = 1200, lift = 40, inner = null, glare = null, onEnter, onLeave } = {}
) {
  if (!tiltEnabled || !el) return () => {}

  el.style.transformStyle = 'preserve-3d'
  gsap.set(el, { transformPerspective: perspective, transformOrigin: 'center' })

  const setRX = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power2.out' })
  const setRY = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power2.out' })
  const setZ = inner ? gsap.quickTo(inner, 'z', { duration: 0.5, ease: 'power2.out' }) : null

  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setRY(px * max)
    setRX(-py * max)
    if (setZ) setZ(lift)
    if (glare) {
      glare.style.opacity = '1'
      glare.style.background = `radial-gradient(circle at ${(px + 0.5) * 100}% ${
        (py + 0.5) * 100
      }%, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%)`
    }
  }

  const enter = (e) => {
    if (e.pointerType === 'touch') return
    onEnter?.(e)
  }
  const leave = (e) => {
    if (e.pointerType === 'touch') return
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
    if (setZ) setZ(0)
    if (glare) glare.style.opacity = '0'
    onLeave?.(e)
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerenter', enter)
  el.addEventListener('pointerleave', leave)

  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerenter', enter)
    el.removeEventListener('pointerleave', leave)
    gsap.set(el, { rotateX: 0, rotateY: 0, clearProps: 'transformPerspective' })
    if (inner) gsap.set(inner, { z: 0 })
  }
}
