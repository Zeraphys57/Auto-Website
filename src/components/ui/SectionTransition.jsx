import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// A full-viewport panel that sweeps left→right as `trigger` enters, carrying
// `color` with a bright leading edge. Bridges two sections with a wipe instead
// of a hard cut. `trigger` is a CSS selector for the incoming section.
export default function SectionTransition({
  trigger,
  color = '#0A0A0A',
  accent = '#00D4FF',
}) {
  const overlayRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion || !overlayRef.current) return
    gsap.fromTo(
      overlayRef.current,
      { xPercent: -100 },
      {
        xPercent: 100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1,
        },
      }
    )
  }, [trigger])

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
        transform: 'translateX(-100%)',
        willChange: 'transform',
      }}
    />
  )
}
