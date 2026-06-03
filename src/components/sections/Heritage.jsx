import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// Vertical timeline — each segment's line draws (scaleY) as its milestone
// enters, dot pops, text fades up. Reinforces the marque's history without a
// second horizontal pin. Sits after Legacy, bridging toward ACT 3.
const EVENTS = [
  { year: '1987', text: 'Sebuah bengkel sempit di Bandung. Satu mesin. Satu obsesi.' },
  { year: '1998', text: 'VELOX pertama melewati 300 km/jam. Dunia mulai memperhatikan.' },
  { year: '2008', text: 'Gelar juara pertama. Ternyata bukan yang terakhir.' },
  { year: '2016', text: 'Atelier dibuka. Satu mobil, satu pemilik, satu cerita.' },
  { year: '2026', text: 'Empat dekade. Prinsip yang sama. Jalan masih panjang.' },
]

export default function Heritage() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) {
        gsap.set('.heritage-line', { scaleY: 1 })
        gsap.set('.heritage-dot', { scale: 1 })
        return
      }

      gsap.from(headRef.current.children, {
        autoAlpha: 0,
        y: 24,
        filter: 'blur(8px)',
        stagger: 0.12,
        duration: 1,
        ease: 'velox',
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      })

      gsap.utils.toArray('.heritage-event').forEach((ev) => {
        const line = ev.querySelector('.heritage-line')
        const dot = ev.querySelector('.heritage-dot')
        const body = ev.querySelector('.heritage-body')

        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.9,
            ease: 'velox',
            scrollTrigger: { trigger: ev, start: 'top 82%' },
          }
        )
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: ev, start: 'top 80%' },
          }
        )
        gsap.from(body.children, {
          autoAlpha: 0,
          y: 22,
          filter: 'blur(6px)',
          stagger: 0.1,
          duration: 0.85,
          ease: 'velox',
          scrollTrigger: { trigger: ev, start: 'top 78%' },
        })
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className="heritage-section relative py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div ref={headRef} className="mb-16 max-w-2xl md:mb-24">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-gold/60" />
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
              Perjalanan
            </span>
          </div>
          <h2
            className="font-serif italic text-chrome"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}
          >
            Empat dekade, satu garis lurus.
          </h2>
        </div>

        <div>
          {EVENTS.map((e, i) => (
            <div
              key={e.year}
              className="heritage-event grid grid-cols-[2rem_1fr] gap-6 md:grid-cols-[3rem_1fr] md:gap-10"
            >
              {/* Spine column */}
              <div className="relative flex justify-center">
                <span
                  className="heritage-line absolute top-1 h-full w-px origin-top bg-gradient-to-b from-gold/50 via-silver/20 to-silver/5"
                  style={{ transform: 'scaleY(0)' }}
                />
                <span
                  className="heritage-dot relative top-2 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-carbon"
                  style={{ transform: 'scale(0)' }}
                />
              </div>

              {/* Body */}
              <div className={`heritage-body ${i === EVENTS.length - 1 ? 'pb-0' : 'pb-16 md:pb-24'}`}>
                <div
                  className="font-display leading-none text-chrome"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  {e.year}
                </div>
                <p
                  className="mt-3 max-w-lg font-serif italic text-chrome/60"
                  style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)', lineHeight: 1.4 }}
                >
                  {e.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
