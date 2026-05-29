import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const CARDS = [
  {
    name: 'VELOX GT',
    tag: 'Grand Tourer',
    specs: ['580 HP', '320 KM/H', '3.2s'],
    price: 'Rp 7,4 M',
    grad: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 40%, #00D4FF15 100%)',
    rim: 'rgba(0,212,255,0.2)',
    edge: '#00D4FF',
  },
  {
    name: 'VELOX RS',
    tag: 'Track Weapon',
    specs: ['720 HP', '340 KM/H', '2.8s'],
    price: 'Rp 9,1 M',
    grad: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 40%, #FF2D2D15 100%)',
    rim: 'rgba(255,45,45,0.2)',
    edge: '#FF2D2D',
  },
  {
    name: 'VELOX S',
    tag: 'Signature',
    specs: ['620 HP', '330 KM/H', '3.0s'],
    price: 'Rp 8,2 M',
    grad: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 40%, #C9A96E15 100%)',
    rim: 'rgba(201,169,110,0.2)',
    edge: '#C9A96E',
  },
]

export default function Models() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const loudRef = useRef(null)
  const titleRef = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) return
      const track = trackRef.current
      const end = () => `+=${track.scrollWidth}`

      // Horizontal scroll pin
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 96),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end,
          invalidateOnRefresh: true,
        },
      })

      // Loud background word — slow scale parallax across the pin
      gsap.fromTo(
        loudRef.current,
        { scale: 1, xPercent: 0 },
        {
          scale: 1.08,
          xPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      )

      // Title — blur fade on enter
      gsap.from(titleRef.current, {
        autoAlpha: 0,
        filter: 'blur(16px)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      // Cards — clip-path mask reveal, staggered
      gsap.fromTo(
        '.model-card',
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          stagger: 0.12,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      )
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section
      ref={sectionRef}
      id="models"
      className={`models-section relative h-screen ${
        rm ? 'overflow-x-auto' : 'overflow-hidden'
      }`}
    >
      {/* Loud background word */}
      <div
        ref={loudRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="font-display leading-none text-carbon3"
          style={{ fontSize: 'clamp(8rem, 20vw, 18rem)', opacity: 0.12 }}
        >
          PERFORMA
        </span>
      </div>

      {/* Eyebrow — vertical "02" */}
      <div
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 md:left-6"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-accent text-xs font-extralight tracking-[0.5em] text-muted">
          02
        </span>
      </div>

      {/* Section title */}
      <h2
        ref={titleRef}
        className="absolute left-12 top-[14%] z-10 font-serif italic text-chrome"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        Koleksi Kami
      </h2>

      {/* Track */}
      <div
        ref={trackRef}
        data-cursor="drag"
        className="absolute top-1/2 flex h-[70vh] -translate-y-1/2 items-stretch gap-8 pl-12 pr-12 will-change-transform"
      >
        {CARDS.map((card) => (
          <article
            key={card.name}
            data-cursor="cta"
            className="model-card group relative flex shrink-0 flex-col justify-end overflow-hidden"
            style={{
              width: 'clamp(480px, 55vw, 720px)',
              background: card.grad,
              boxShadow: `inset 3px 0 20px ${card.rim}`,
            }}
          >
            {/* left edge accent */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px"
              style={{ background: card.edge, opacity: 0.5 }}
            />

            {/* tag top-left */}
            <span className="absolute left-7 top-7 font-accent text-[0.62rem] font-extralight uppercase tracking-[0.3em] text-silver/70">
              {card.tag}
            </span>

            {/* bottom content */}
            <div className="relative z-10 p-7">
              <h3 className="font-display text-[3rem] leading-none text-chrome">
                {card.name}
              </h3>
              <div className="mt-3 flex gap-5 font-mono text-xs text-silver/80">
                {card.specs.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <p className="mt-4 font-serif text-2xl italic text-gold">{card.price}</p>
            </div>

            {/* hover overlay — clip reveal from bottom (driven by card hover) */}
            <div
              className="absolute inset-0 z-20 flex items-end justify-center pb-10 transition-[clip-path] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0%_0_0_0)]"
              style={{
                background:
                  'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
              }}
            >
              <span className="font-accent text-sm font-light uppercase tracking-[0.3em] text-chrome">
                Konfigurasi →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
