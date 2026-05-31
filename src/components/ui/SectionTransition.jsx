import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// A full-viewport panel that wipes across as `trigger` enters: it sweeps in
// from the left (covering momentarily, showing `color`) and continues off to
// the right, revealing the incoming section. Driven by a *played* timeline —
// not scrub — so it always completes to a fully off-screen rest state and can
// never get stranded covering the viewport.
//
// gsap owns the transform entirely (initial xPercent set in a layout effect,
// before first paint). We must NOT also set `transform` inline: a percentage
// transform in the style prop stacks on top of gsap's xPercent, knocking the
// whole sweep one viewport-width off so it rests dead-center over the content.
export default function SectionTransition({
  trigger,
  color = '#0A0A0A',
  accent = '#00D4FF',
}) {
  const overlayRef = useRef(null)

  useGSAP(() => {
    if (!overlayRef.current) return
    gsap.set(overlayRef.current, { xPercent: -100 })

    const sweep = gsap.to(overlayRef.current, {
      xPercent: 100,
      ease: 'veloxIn',
      duration: 0.9,
      paused: true,
    })

    const st = ScrollTrigger.create({
      trigger,
      start: 'top 80%',
      onEnter: () => sweep.play(),
      onLeaveBack: () => sweep.reverse(),
    })

    return () => {
      st.kill()
      sweep.kill()
    }
  }, [trigger])

  if (prefersReducedMotion) return null

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 55,
        pointerEvents: 'none',
        backgroundColor: color,
        borderRight: `2px solid ${accent}`,
        boxShadow: `0 0 60px -10px ${accent}`,
        willChange: 'transform',
      }}
    />
  )
}
