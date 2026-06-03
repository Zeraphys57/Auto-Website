import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// Numbers in motion — figures count up with a scale-pop and a drawing bar.
// Distinct from the static Specs table. ACT 2 palette, three brand accents.
const FIGURES = [
  {
    value: 2.9,
    decimals: 1,
    suffix: 'SEC',
    caption: '0–100. Faster than you can read this sentence.',
    accent: 'electric',
  },
  {
    value: 1250,
    decimals: 0,
    suffix: 'KG',
    caption: 'Light as intent. Strong as resolve.',
    accent: 'chrome',
  },
  {
    value: 640,
    decimals: 0,
    suffix: 'HP',
    caption: 'Power that demands respect.',
    accent: 'crimson',
  },
  {
    value: 6,
    decimals: 0,
    suffix: 'TITLES',
    caption: 'The podium is not a goal. It is a habit.',
    accent: 'gold',
  },
]

const NUM_CLASS = {
  electric: 'text-electric',
  chrome: 'text-chrome',
  crimson: 'text-crimson',
  gold: 'text-gold',
}
const BAR_CLASS = {
  electric: 'bg-electric/40',
  chrome: 'bg-silver/40',
  crimson: 'bg-crimson/40',
  gold: 'bg-gold/40',
}

const fmt = (v, decimals) =>
  decimals > 0
    ? v.toFixed(decimals).replace('.', ',')
    : Math.round(v).toLocaleString('id-ID')

export default function Performance() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      const figs = gsap.utils.toArray('.perf-figure')

      if (rm) {
        figs.forEach((fig, i) => {
          const f = FIGURES[i]
          fig.querySelector('.perf-num').textContent = fmt(f.value, f.decimals)
          gsap.set(fig.querySelector('.perf-bar'), { scaleX: 1 })
        })
        return
      }

      gsap.from(headRef.current.children, {
        autoAlpha: 0,
        y: 26,
        filter: 'blur(8px)',
        stagger: 0.12,
        duration: 1,
        ease: 'velox',
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      })

      figs.forEach((fig, i) => {
        const f = FIGURES[i]
        const numEl = fig.querySelector('.perf-num')
        const barEl = fig.querySelector('.perf-bar')

        gsap.from(fig, {
          autoAlpha: 0,
          y: 44,
          scale: 0.92,
          transformOrigin: 'left bottom',
          duration: 0.9,
          ease: 'velox',
          scrollTrigger: { trigger: fig, start: 'top 82%' },
        })

        const obj = { v: 0 }
        gsap.to(obj, {
          v: f.value,
          duration: 1.9,
          ease: 'velox',
          scrollTrigger: { trigger: fig, start: 'top 80%' },
          onUpdate: () => {
            numEl.textContent = fmt(obj.v, f.decimals)
          },
        })

        gsap.fromTo(
          barEl,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'velox',
            scrollTrigger: { trigger: fig, start: 'top 80%' },
          }
        )
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section
      ref={sectionRef}
      id="performance"
      className="performance-section relative overflow-hidden py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div ref={headRef} className="mb-16 max-w-2xl md:mb-24">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-crimson/60" />
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
              By the Numbers
            </span>
          </div>
          <h2
            className="font-serif italic text-chrome"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}
          >
            When numbers become a feeling.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-16 gap-y-16 sm:grid-cols-2 md:gap-y-24">
          {FIGURES.map((f, i) => (
            <div key={i} className="perf-figure">
              <div className="flex items-baseline gap-3">
                <span
                  className={`perf-num font-display leading-none ${NUM_CLASS[f.accent]}`}
                  style={{
                    fontSize: 'clamp(4rem, 9vw, 8rem)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  0
                </span>
                <span
                  className={`font-display leading-none ${NUM_CLASS[f.accent]} opacity-70`}
                  style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2rem)' }}
                >
                  {f.suffix}
                </span>
              </div>
              <span
                className={`perf-bar mt-5 block h-px w-full origin-left ${BAR_CLASS[f.accent]}`}
                style={{ transform: 'scaleX(0)' }}
              />
              <p
                className="mt-5 max-w-sm font-serif italic text-chrome/65"
                style={{ fontSize: 'clamp(1rem, 1.6vw, 1.3rem)', lineHeight: 1.45 }}
              >
                {f.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
