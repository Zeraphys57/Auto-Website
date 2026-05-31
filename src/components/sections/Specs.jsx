import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import EngineParticles from '../canvas/EngineParticles'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const ROWS = [
  { label: 'MESIN',    value: '4.0L V8 BITURBO', fill: 0.78 },
  { label: 'TENAGA',  value: '580 HP',           fill: 0.96 },
  { label: 'TORSI',   value: '720 NM',           fill: 0.88 },
  { label: 'TOP SPEED', value: '320 KM/H',       fill: 0.80 },
  { label: 'BOBOT',   value: '1.420 KG',         fill: 0.52 },
]

export default function Specs() {
  const sectionRef = useRef(null)
  const bigRef     = useRef(null)
  const eyebrowRef = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) {
        gsap.set('.spec-bar', { scaleX: (i, el) => parseFloat(el.dataset.fill) })
        if (bigRef.current) bigRef.current.textContent = '3.2'
        return
      }

      // Eyebrow fade — different technique from Specs table to vary reveals
      gsap.from(eyebrowRef.current, {
        autoAlpha: 0,
        xPercent: -10,
        duration: 0.9,
        ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      // Count-up 8.0 → 3.2
      const num = { v: 8.0 }
      gsap.to(num, {
        v: 3.2,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        onUpdate: () => {
          if (bigRef.current) bigRef.current.textContent = num.v.toFixed(1)
        },
      })

      // Readout rows — blur fade in, staggered from center
      gsap.from('.spec-row', {
        autoAlpha: 0,
        filter: 'blur(10px)',
        stagger: { each: 0.09, from: 'center' },
        duration: 0.9,
        ease: 'velox',
        scrollTrigger: { trigger: '.spec-table', start: 'top 78%' },
      })

      // Bars — animate to their fill
      gsap.to('.spec-bar', {
        scaleX: (i, el) => parseFloat(el.dataset.fill),
        duration: 1.2,
        ease: 'velox',
        stagger: 0.1,
        scrollTrigger: { trigger: '.spec-table', start: 'top 75%' },
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="specs-section relative flex min-h-screen items-center overflow-hidden py-28"
    >
      {/* Engine particles — right side, behind table */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/2 opacity-80 md:block">
        <EngineParticles />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-16 px-6 md:grid-cols-2 md:px-12">
        {/* Left — feature spec */}
        <div>
          <div
            ref={eyebrowRef}
            className="mb-12 font-mono text-sm font-light tracking-[0.2em] text-electric"
          >
            [ SPESIFIKASI ]
          </div>

          <div className="font-accent text-[0.8rem] font-extralight uppercase tracking-[0.2em] text-muted">
            0–100 KM/H
          </div>
          <div className="my-5 h-px w-16 bg-electric/50" />
          <div
            ref={bigRef}
            className="font-display leading-[0.8] text-chrome"
            style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', fontVariantNumeric: 'tabular-nums' }}
          >
            8.0
          </div>
          <div className="mt-2 font-display text-[2rem] leading-none text-electric">
            DETIK
          </div>
        </div>

        {/* Right — spec table */}
        <div className="spec-table flex flex-col justify-center">
          {ROWS.map((row) => (
            <div
              key={row.label}
              className="spec-row grid grid-cols-[1fr_1.1fr_1fr] items-center gap-4 border-b border-silver/15 py-5 font-mono"
            >
              <span className="text-xs uppercase tracking-[0.15em] text-muted">
                {row.label}
              </span>
              <span className="text-sm text-chrome">{row.value}</span>
              <span className="relative block h-[2px] w-full bg-silver/10">
                <span
                  data-fill={row.fill}
                  className="spec-bar absolute left-0 top-0 block h-full w-full origin-left bg-electric"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
