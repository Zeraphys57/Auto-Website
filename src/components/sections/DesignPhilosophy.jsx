import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// Craft showcase — 4 detail beats, panels wipe in via clip-path (alternating
// direction), text fades up. Deliberately different from the Models horizontal
// scrub. ACT 2 palette. Gradient placeholders await real photography.
const BEATS = [
  {
    label: 'AERODINAMIKA',
    poetic: 'Setiap lekuk punya alasan.',
    spec: 'CD 0.28 · DOWNFORCE 320 KG @ 300 KM/H',
    grad: 'linear-gradient(135deg, #15171b 0%, #0b0b0d 70%, rgba(0,212,255,0.07) 100%)',
    note: 'IMAGE: profil aero eksterior / diffuser belakang',
  },
  {
    label: 'INTERIOR',
    poetic: 'Ruang kerja bagi mereka yang mengemudi untuk hidup.',
    spec: 'NAPPA · ALCANTARA · TENUN SERAT KARBON',
    grad: 'linear-gradient(135deg, #1a1714 0%, #0b0a09 70%, rgba(201,169,110,0.07) 100%)',
    note: 'IMAGE: kokpit / interior berpusat pada pengemudi',
  },
  {
    label: 'MATERIAL',
    poetic: 'Serat karbon, kulit, titanium. Tanpa kompromi.',
    spec: 'MONOCOQUE SERAT KARBON · 1.420 KG KERING',
    grad: 'linear-gradient(135deg, #161616 0%, #0a0a0a 70%, rgba(192,192,192,0.05) 100%)',
    note: 'IMAGE: makro anyaman karbon / detail material',
  },
  {
    label: 'CAHAYA',
    poetic: 'Tanda tangan dalam gelap.',
    spec: 'MATRIX LED · 84 DIODA ADAPTIF',
    grad: 'linear-gradient(135deg, #14171a 0%, #0a0a0b 70%, rgba(0,212,255,0.06) 100%)',
    note: 'IMAGE: DRL signature / lampu depan dalam gelap',
  },
]

export default function DesignPhilosophy() {
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

      gsap.utils.toArray('.philo-beat').forEach((beat, i) => {
        const panel = beat.querySelector('.philo-panel')
        const text = beat.querySelector('.philo-text')
        const flip = i % 2 === 1

        gsap.from(panel, {
          clipPath: flip ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
          duration: 1.15,
          ease: 'velox',
          scrollTrigger: { trigger: beat, start: 'top 75%' },
        })
        gsap.from(text.children, {
          autoAlpha: 0,
          y: 30,
          filter: 'blur(8px)',
          stagger: 0.08,
          duration: 0.9,
          ease: 'velox',
          scrollTrigger: { trigger: beat, start: 'top 70%' },
        })
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="philosophy-section relative overflow-hidden py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div ref={headRef} className="mb-20 max-w-2xl md:mb-28">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-electric/60" />
            <span className="font-accent text-[0.62rem] font-extralight uppercase tracking-[0.4em] text-muted">
              Filosofi Desain
            </span>
          </div>
          <h2
            className="font-serif italic text-chrome"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}
          >
            Bentuk mengikuti kecepatan.
          </h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {BEATS.map((b, i) => {
            const flip = i % 2 === 1
            return (
              <div
                key={b.label}
                className="philo-beat grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                {/* Visual panel — replace gradient with real photography */}
                <div
                  className={`philo-panel relative h-[42vh] w-full overflow-hidden border border-white/5 md:h-[56vh] ${
                    flip ? 'md:order-2' : ''
                  }`}
                  style={{ background: b.grad, willChange: 'clip-path' }}
                >
                  {/* IMAGE: {b.note} */}
                  <span className="absolute left-6 top-6 font-mono text-[0.55rem] tracking-[0.18em] text-muted/40">
                    {`// ${b.note}`}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-electric/40 to-transparent"
                  />
                </div>

                {/* Text */}
                <div className={flip ? 'md:order-1' : ''}>
                  <div className="philo-text">
                    <span className="font-accent text-[0.6rem] font-extralight uppercase tracking-[0.3em] text-muted">
                      0{i + 1}
                    </span>
                    <h3
                      className="mt-3 font-display text-chrome"
                      style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 0.95 }}
                    >
                      {b.label}
                    </h3>
                    <p
                      className="mt-5 max-w-md font-serif italic text-chrome/70"
                      style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', lineHeight: 1.4 }}
                    >
                      {b.poetic}
                    </p>
                    <p className="mt-6 font-mono text-[0.7rem] tracking-[0.15em] text-electric/70">
                      {b.spec}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
