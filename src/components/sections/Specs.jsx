import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import EngineParticles from '../canvas/EngineParticles'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const ROWS = [
  { label: 'MESIN',     value: '4.0L V8 BITURBO', caption: 'Jantung yang dirakit dengan tangan.',     fill: 0.78, accent: '#FF2D2D' },
  { label: 'TENAGA',    value: '580 HP',          caption: 'Cadangan yang tak pernah habis.',          fill: 0.96, accent: '#00D4FF' },
  { label: 'TORSI',     value: '720 NM',          caption: 'Dorongan yang menempel di punggung Anda.', fill: 0.88, accent: '#FF2D2D' },
  { label: 'TOP SPEED', value: '320 KM/H',        caption: 'Tempat horizon datang lebih awal.',        fill: 0.80, accent: '#00D4FF' },
  { label: 'BOBOT',     value: '1.420 KG',        caption: 'Seni membuang yang tak perlu.',            fill: 0.52, accent: '#00D4FF' },
]

export default function Specs() {
  const sectionRef = useRef(null)
  const bigRef     = useRef(null)
  const eyebrowRef = useRef(null)
  const [hover, setHover] = useState(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) {
        gsap.set('.spec-bar', { scaleX: (i, el) => parseFloat(el.dataset.fill) })
        if (bigRef.current) bigRef.current.textContent = '3.2'
        return
      }

      gsap.from(eyebrowRef.current, {
        autoAlpha: 0, xPercent: -10, duration: 0.9, ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      // Count-up 8.0 → 3.2 — re-runs every time the section re-enters.
      const num = { v: 8.0 }
      gsap.to(num, {
        v: 3.2,
        duration: 1.6,
        ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'restart none none reset' },
        onUpdate: () => {
          if (bigRef.current) bigRef.current.textContent = num.v.toFixed(1)
        },
      })

      gsap.from('.spec-row', {
        autoAlpha: 0, filter: 'blur(10px)',
        stagger: { each: 0.09, from: 'center' },
        duration: 0.9, ease: 'velox',
        scrollTrigger: { trigger: '.spec-table', start: 'top 78%' },
      })

      gsap.to('.spec-bar', {
        scaleX: (i, el) => parseFloat(el.dataset.fill),
        duration: 1.2, ease: 'velox', stagger: 0.1,
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
      {/* Engine particles — react to the hovered spec row */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/2 opacity-80 md:block">
        <EngineParticles excite={hover !== null} accent={hover !== null ? ROWS[hover].accent : null} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-16 px-6 md:grid-cols-2 md:px-12">
        {/* Left — feature spec (cursor-near glow on the hero number) */}
        <div className="group">
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
            className="font-display leading-[0.8] text-chrome transition-[text-shadow] duration-500 group-hover:[text-shadow:0_0_45px_rgb(0_212_255_/_0.45)]"
            style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', fontVariantNumeric: 'tabular-nums' }}
          >
            8.0
          </div>
          <div className="mt-2 font-display text-[2rem] leading-none text-electric">
            DETIK
          </div>
          <p className="mt-7 max-w-xs font-serif text-lg italic text-chrome/55">
            Angka hanyalah awal cerita.
          </p>
        </div>

        {/* Right — spec table (hover a row → highlight it, dim the rest, wake particles) */}
        <div className="spec-table flex flex-col justify-center">
          {ROWS.map((row, i) => {
            const dim = hover !== null && hover !== i
            const active = hover === i
            return (
              <div
                key={row.label}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`spec-row grid grid-cols-[1fr_1.2fr_1fr] items-center gap-4 border-b py-5 transition-all duration-300 ${
                  dim ? 'opacity-40' : 'opacity-100'
                } ${active ? 'border-white/25' : 'border-silver/15'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              >
                <span
                  className="self-start pt-1 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-300"
                  style={{ color: active ? row.accent : '#666666' }}
                >
                  {row.label}
                </span>
                <div>
                  <span className="font-mono text-sm text-chrome">{row.value}</span>
                  <span className="mt-1.5 block max-w-[22ch] font-serif text-[0.92rem] italic leading-snug text-muted">
                    {row.caption}
                  </span>
                </div>
                <span className="relative block h-[2px] w-full self-center bg-silver/10">
                  <span
                    data-fill={row.fill}
                    className="spec-bar absolute left-0 top-0 block h-full w-full origin-left transition-shadow duration-300"
                    style={{
                      transform: 'scaleX(0)',
                      backgroundColor: row.accent,
                      boxShadow: active ? `0 0 12px ${row.accent}` : 'none',
                    }}
                  />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
