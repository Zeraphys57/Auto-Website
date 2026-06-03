import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { applyTilt } from '../../lib/tilt'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// Ownership world — three pillars that justify the price emotionally. This is
// where ACT 3 (gold warmth) begins. Pillars wipe in via clip-path, staggered.
const PILLARS = [
  {
    n: '01',
    label: 'CONCIERGE',
    line: 'Satu nomor. Kapan saja. Untuk apa saja.',
    note: 'IMAGE: layanan concierge privat',
  },
  {
    n: '02',
    label: 'SIRKUIT PRIVAT',
    line: 'Lepaskan sepenuhnya. Tanpa batas, tanpa penonton.',
    note: 'IMAGE: lintasan privat saat fajar',
  },
  {
    n: '03',
    label: 'ATELIER',
    line: 'Setiap VELOX dibuat untuk satu orang. Anda.',
    note: 'IMAGE: atelier / perakitan bespoke',
  },
]

export default function Experience() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) return

      gsap.from(headRef.current.children, {
        autoAlpha: 0,
        y: 28,
        filter: 'blur(8px)',
        stagger: 0.12,
        duration: 1,
        ease: 'velox',
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      })

      gsap.from('.exp-pillar', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.1,
        ease: 'velox',
        stagger: 0.15,
        scrollTrigger: { trigger: '.exp-grid', start: 'top 78%' },
      })
      gsap.from('.exp-pillar .exp-inner', {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        ease: 'velox',
        stagger: 0.15,
        scrollTrigger: { trigger: '.exp-grid', start: 'top 74%' },
      })

      // 3D tilt + glare on each pillar.
      const cleanups = gsap.utils.toArray('.exp-pillar').map((p) => {
        const glare = p.querySelector('.exp-glare')
        return applyTilt(p, { max: 9, glare })
      })
      return () => cleanups.forEach((c) => c())
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience-section relative overflow-hidden py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div ref={headRef} className="mb-16 max-w-3xl md:mb-24">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-gold/60" />
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-gold/80">
              Kepemilikan
            </span>
          </div>
          <h2
            className="font-serif italic text-chrome"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.8rem)', lineHeight: 1.12 }}
          >
            Anda tidak membeli sebuah mobil.
            <br />
            Anda memasuki sebuah dunia.
          </h2>
        </div>

        <div className="exp-grid grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {PILLARS.map((p) => (
            <article
              key={p.label}
              data-cursor="hover"
              className="exp-pillar group relative overflow-hidden border-t border-gold/30 p-8 md:p-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(201,169,110,0.06) 0%, rgba(20,16,10,0.4) 100%)',
                willChange: 'clip-path',
              }}
            >
              <div className="exp-inner">
                <span className="font-mono text-micro tracking-macro text-gold/50">
                  {p.n}
                </span>
                <h3
                  className="mt-6 font-display leading-none text-chrome"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
                >
                  {p.label}
                </h3>
                <p
                  className="mt-4 font-serif italic text-chrome/65"
                  style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)', lineHeight: 1.45 }}
                >
                  {p.line}
                </p>
                {/* IMAGE: {p.note} */}
                <span className="mt-8 block font-mono text-micro tracking-wide-caps text-muted/40">
                  {`// ${p.note}`}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-gold/50 transition-[width] duration-700 group-hover:w-full"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              <span
                className="exp-glare pointer-events-none absolute inset-0 z-10"
                aria-hidden="true"
                style={{ opacity: 0, mixBlendMode: 'overlay' }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
