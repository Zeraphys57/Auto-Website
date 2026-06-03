import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { applyTilt } from '../../lib/tilt'
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
  const [hovered, setHovered] = useState(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) return

      gsap.from(headRef.current.children, {
        autoAlpha: 0,
        y: 28,
        filter: 'blur(8px)',
        stagger: 0.12,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      })

      gsap.utils.toArray('.philo-beat').forEach((beat, i) => {
        const panel = beat.querySelector('.philo-panel')
        const bg = beat.querySelector('.philo-panel-bg')
        const text = beat.querySelector('.philo-text')
        const title = beat.querySelector('h3')
        const flip = i % 2 === 1

        gsap.fromTo(panel,
          { clipPath: flip ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: beat, start: 'top 75%' } }
        )
        
        if (bg) {
          gsap.from(bg, { scale: 1.2, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: beat, start: 'top 75%' }})
        }

        const splitTitle = new SplitText(title, { type: 'chars' })
        gsap.from(splitTitle.chars, {
          y: 40,
          opacity: 0,
          rotateX: 90,
          stagger: 0.02,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: beat, start: 'top 70%' },
        })

        // Select all text elements except the title
        const otherText = Array.from(text.children).filter(child => child !== title)
        gsap.from(otherText, {
          autoAlpha: 0,
          y: 20,
          filter: 'blur(8px)',
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: beat, start: 'top 70%' },
        })
      })

      // 3D tilt + glare on each visual panel.
      const cleanups = gsap.utils.toArray('.philo-panel').map((panel) => {
        const glare = panel.querySelector('.philo-glare')
        return applyTilt(panel, { max: 10, glare })
      })
      return () => cleanups.forEach((c) => c())
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
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
              Filosofi Desain
            </span>
          </div>
          <h2 className="font-serif italic text-chrome text-fluid-h2 leading-snug">
            Bentuk mengikuti kecepatan.
          </h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {BEATS.map((b, i) => {
            const flip = i % 2 === 1
            const dim = hovered !== null && hovered !== i
            return (
              <div
                key={b.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`philo-beat grid grid-cols-1 items-center gap-10 transition-[opacity,transform] duration-500 md:grid-cols-2 md:gap-16 ${
                  dim ? 'opacity-45' : 'opacity-100'
                } ${hovered === i ? 'md:scale-[1.015]' : ''}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              >
                {/* Visual panel — replace gradient with real photography */}
                <div
                  className={`philo-panel relative h-[42vh] w-full overflow-hidden border border-white/5 md:h-[56vh] ${
                    flip ? 'md:order-2' : ''
                  }`}
                  style={{ willChange: 'clip-path' }}
                >
                  {/* Cinematic zoom background */}
                  <div className="philo-panel-bg absolute inset-0 z-0" style={{ background: b.grad }} />
                  
                  {/* IMAGE: {b.note} */}
                  <span className="absolute left-6 top-6 z-10 font-mono text-micro tracking-wide-caps text-muted/40">
                    {`// ${b.note}`}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-electric/40 to-transparent"
                  />
                  <span
                    className="philo-glare pointer-events-none absolute inset-0 z-10"
                    aria-hidden="true"
                    style={{ opacity: 0, mixBlendMode: 'overlay' }}
                  />
                </div>

                {/* Text */}
                <div className={flip ? 'md:order-1' : ''}>
                  <div className="philo-text">
                    <span className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
                      0{i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-chrome text-fluid-h1 leading-none">
                      {b.label}
                    </h3>
                    <p className="mt-5 max-w-md font-serif italic text-chrome/70 text-fluid-h3 leading-relaxed">
                      {b.poetic}
                    </p>
                    <p className="mt-6 font-mono text-caption tracking-wide-caps text-electric/70">
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
