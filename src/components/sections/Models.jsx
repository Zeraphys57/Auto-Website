import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const BASE = 'https://images.unsplash.com'

const CARDS = [
  {
    name: 'VELOX GT',
    tag: 'Grand Tourer',
    descriptor: 'Menaklukkan jarak.',
    specs: ['580 HP', '320 KM/H', '3.2s'],
    price: 'Mulai dari Rp 7,4 Miliar',
    story:
      'Benua menyusut menjadi perjalanan akhir pekan. Setiap kilometer lintas negara terasa seperti milik Anda sendiri.',
    // Blue sports car parked in the dark — photo by Valeriia Neganova (Unsplash)
    img: `${BASE}/photo-1681167816651-65c6c00264c4?w=1920&q=80&auto=format&fit=crop`,
    grad: 'linear-gradient(135deg, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.35) 50%, rgba(0,212,255,0.07) 100%)',
    floor: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)',
    rim: 'rgba(0,212,255,0.25)',
    edge: '#00D4FF',
  },
  {
    name: 'VELOX RS',
    tag: 'Track Weapon',
    descriptor: 'Lahir di sirkuit.',
    specs: ['720 HP', '340 KM/H', '2.8s'],
    price: 'Mulai dari Rp 9,1 Miliar',
    story:
      'Tidak ada yang ditambahkan demi kenyamanan. Semua yang tersisa, ada untuk satu hal — kecepatan.',
    // Red Ferrari in a dark studio — photo by Branislav Rodman (Unsplash)
    img: `${BASE}/photo-1751467928515-14a3515b99a8?w=1920&q=80&auto=format&fit=crop`,
    grad: 'linear-gradient(135deg, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.35) 50%, rgba(255,45,45,0.07) 100%)',
    floor: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)',
    rim: 'rgba(255,45,45,0.25)',
    edge: '#FF2D2D',
  },
  {
    name: 'VELOX S',
    tag: 'Signature',
    descriptor: 'Kemewahan setiap hari.',
    specs: ['620 HP', '330 KM/H', '3.0s'],
    price: 'Mulai dari Rp 8,2 Miliar',
    story:
      'Eksotis yang tak pernah melelahkan. Mobil yang Anda kemudikan setiap pagi, dan tak pernah berhenti mengagumi.',
    // Gold Lamborghini Sian — photo by David von Diemar (Unsplash)
    img: `${BASE}/photo-1570294646112-27ce4f174e38?w=1920&q=80&auto=format&fit=crop`,
    grad: 'linear-gradient(135deg, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.35) 50%, rgba(201,169,110,0.07) 100%)',
    floor: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)',
    rim: 'rgba(201,169,110,0.25)',
    edge: '#C9A96E',
  },
]

export default function Models() {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)
  const loudRef    = useRef(null)
  const titleRef   = useRef(null)
  const bleedRef   = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) return
      const track = trackRef.current
      const end = () => `+=${track.scrollWidth}`

      // Horizontal scroll pin — NOT in skew-wrap
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

      // PERFORMA text — slow scale + drift across the pinned scroll
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
        ease: 'velox',
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
          ease: 'velox',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      )

      // SIGNATURE MOMENT: color bleed — each card bleeds its accent color into
      // the entire section background and PERFORMA text on hover, returning to
      // neutral carbon2 on leave.
      if (typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches) {
        const cardEls = Array.from(sectionRef.current.querySelectorAll('.model-card'))
        const handlers = cardEls.map((cardEl, i) => {
          const { edge } = CARDS[i]
          const enter = () => {
            bleedRef.current.style.backgroundColor = edge
            gsap.to(bleedRef.current, { opacity: 0.07, duration: 0.8, ease: 'velox' })
            gsap.to(loudRef.current, { color: edge, duration: 0.8, ease: 'velox' })
          }
          const leave = () => {
            gsap.to(bleedRef.current, { opacity: 0, duration: 0.9, ease: 'velox' })
            gsap.to(loudRef.current, { color: '#1A1A1A', duration: 0.9, ease: 'velox' })
          }
          cardEl.addEventListener('mouseenter', enter)
          cardEl.addEventListener('mouseleave', leave)
          return { cardEl, enter, leave }
        })
        return () => {
          handlers.forEach(({ cardEl, enter, leave }) => {
            cardEl.removeEventListener('mouseenter', enter)
            cardEl.removeEventListener('mouseleave', leave)
          })
        }
      }
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
      {/* Color-bleed overlay — fills with card accent on hover */}
      <div
        ref={bleedRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ opacity: 0, mixBlendMode: 'screen' }}
      />

      {/* Loud background word — slow parallax via data-speed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          ref={loudRef}
          className="font-display leading-none"
          style={{ fontSize: 'clamp(8rem, 20vw, 18rem)', opacity: 0.12, color: '#1A1A1A' }}
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
        Tiga watak, satu obsesi.
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
            className="model-card group relative flex shrink-0 flex-col justify-end overflow-hidden bg-carbon2"
            style={{
              width: 'clamp(480px, 55vw, 720px)',
              boxShadow: `inset 3px 0 20px ${card.rim}`,
            }}
          >
            {/* Car photography layer */}
            <img
              src={card.img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 0.55 }}
            />
            {/* Accent colour grade overlay */}
            <div aria-hidden="true" className="absolute inset-0" style={{ background: card.grad }} />
            {/* Bottom darkening floor for text legibility */}
            <div aria-hidden="true" className="absolute inset-0" style={{ background: card.floor }} />

            {/* left edge accent */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px"
              style={{ background: card.edge, opacity: 0.6 }}
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
              <p className="mt-2 font-serif text-xl italic text-silver/80">
                {card.descriptor}
              </p>
              <div className="mt-4 flex gap-5 font-mono text-xs text-silver/80">
                {card.specs.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <p className="mt-4 font-accent text-[0.78rem] font-light tracking-[0.12em] text-gold">
                {card.price}
              </p>
            </div>

            {/* hover overlay — clip reveal from bottom, reveals the car's story */}
            <div
              className="absolute inset-0 z-20 flex flex-col justify-end p-7 transition-[clip-path] duration-500 [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0%_0_0_0)]"
              style={{
                background:
                  'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span className="font-accent text-[0.6rem] font-extralight uppercase tracking-[0.3em] text-silver/70">
                {card.tag}
              </span>
              <h3 className="mt-2 font-display text-[2.6rem] leading-none text-chrome">
                {card.name}
              </h3>
              <p
                className="mt-4 max-w-sm font-serif italic text-chrome/75"
                style={{ fontSize: '1.05rem', lineHeight: 1.5 }}
              >
                {card.story}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-accent text-sm font-light uppercase tracking-[0.3em] text-chrome">
                Konfigurasi
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
