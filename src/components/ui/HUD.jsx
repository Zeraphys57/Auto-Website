import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const SECTIONS = [
  { sel: '.hero-section',         num: '01' },
  { sel: '.marquee-section',      num: '02' },
  { sel: '.models-section',       num: '03' },
  { sel: '.specs-section',        num: '04' },
  { sel: '.legacy-section',       num: '05' },
  { sel: '.testimonials-section', num: '06' },
  { sel: '.cta-section',          num: '07' },
]

// Engineered HUD overlay — progress bar, section counter, frame readout, est. label.
// All elements are aria-hidden and respect prefers-reduced-motion (freeze, not remove).
export default function HUD() {
  const progressBarRef  = useRef(null)
  const counterRef      = useRef(null)
  const frameReadoutRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    // Full-page scroll progress — drives the left-edge scaleY bar
    const progressST = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'max',
      scrub: true,
      onUpdate: (self) => {
        if (progressBarRef.current)
          progressBarRef.current.style.transform = `scaleY(${self.progress})`
      },
    })

    // Section counter — updates to whichever section is centred in the viewport
    const sectionSTs = SECTIONS.map(({ sel, num }) => {
      const el = document.querySelector(sel)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive && counterRef.current)
            counterRef.current.textContent = `${num} / 07`
        },
      })
    }).filter(Boolean)

    // Frame counter — FrameSequence dispatches 'velox:frame' on every index change
    const handleFrame = ({ detail: { index, total } }) => {
      if (!frameReadoutRef.current) return
      const i = String(index + 1).padStart(3, '0')
      const t = String(total).padStart(3, '0')
      frameReadoutRef.current.textContent = `FRAME ${i} / ${t}`
    }
    window.addEventListener('velox:frame', handleFrame, { passive: true })

    return () => {
      progressST.kill()
      sectionSTs.forEach((st) => st.kill())
      window.removeEventListener('velox:frame', handleFrame)
    }
  }, [])

  return (
    <>
      {/* Scroll progress bar — fixed left edge, scaleY 0 → 1 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[8990] w-px"
        style={{ height: '100vh', backgroundColor: 'rgba(0,212,255,0.06)' }}
      >
        <div
          ref={progressBarRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#00D4FF',
            transformOrigin: 'top',
            transform: 'scaleY(0)',
          }}
        />
      </div>

      {/* Section counter — bottom-right, mono, muted */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-8 right-8 z-[8990] font-mono text-[0.58rem] tracking-[0.22em] text-muted"
      >
        <span ref={counterRef}>01 / 07</span>
      </div>

      {/* Hero frame readout — top-right, electric, 0.6rem */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-6 z-[8990] font-mono text-[0.58rem] tracking-[0.15em]"
        style={{ top: 88, color: 'rgba(0,212,255,0.45)' }}
      >
        <span ref={frameReadoutRef}>FRAME 001 / 240</span>
      </div>

      {/* EST. corner label — top-left, Jost 200, very muted */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-6 z-[8990] font-accent text-[0.55rem] tracking-[0.3em] text-muted"
        style={{ top: 88, fontWeight: 200 }}
      >
        EST. 1987
      </div>
    </>
  )
}
