import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import CTAOrb from '../canvas/CTAOrb'
import { useMagnetic } from '../../hooks/useMagnetic'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

export default function CTA() {
  const sectionRef  = useRef(null)
  const line1Ref    = useRef(null)
  const line2Ref    = useRef(null)
  const subRef      = useRef(null)
  const btnRef      = useRef(null)
  const primaryBtn  = useMagnetic(0.4)
  const secondaryBtn = useMagnetic(0.4)

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const split = new SplitText(line1Ref.current, { type: 'chars' })
      gsap.set(sectionRef.current, { perspective: 800 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })

      // Headline chars — velox entrance with rotateX overshoot
      tl.from(split.chars, {
        autoAlpha: 0,
        rotateX: 90,
        transformOrigin: '50% 50% -24px',
        stagger: 0.02,
        duration: 0.85,
        ease: 'velox',
      })
        .to(
          split.chars,
          { rotateX: -4, stagger: 0.008, duration: 0.18, ease: 'power2.out' },
          '-=0.25'
        )
        .to(
          split.chars,
          { rotateX: 0, stagger: 0.008, duration: 0.25, ease: 'power2.inOut' },
          '-=0.12'
        )
        .from(
          line2Ref.current,
          { autoAlpha: 0, filter: 'blur(16px)', duration: 1, ease: 'velox' },
          '-=0.5'
        )
        .from(
          [subRef.current, btnRef.current],
          { autoAlpha: 0, filter: 'blur(12px)', stagger: 0.12, duration: 0.9, ease: 'velox' },
          '-=0.7'
        )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="cta-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.10) 0%, transparent 65%)',
        }}
      />

      {/* Orb */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[80vh] w-[80vh] max-w-[90vw]">
          <CTAOrb />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-center gap-2 font-accent text-[0.62rem] font-extralight uppercase tracking-[0.3em] text-gold">
          <span className="text-base leading-none">·</span>
          Milik Anda Sekarang
        </div>

        <h2 className="font-display text-chrome" style={{ lineHeight: 0.9 }}>
          <span
            ref={line1Ref}
            className="block"
            style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          >
            KEMUDI ADA
          </span>
          <span
            ref={line2Ref}
            className="mt-2 block font-serif italic text-gold"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
          >
            di tangan anda
          </span>
        </h2>

        <p ref={subRef} className="mx-auto mt-8 max-w-md text-offwhite/60">
          Test drive tersedia setiap hari. Tanpa reservasi.
        </p>

        <div ref={btnRef} className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <a
            ref={primaryBtn}
            href="#cta"
            data-cursor="cta"
            className="group inline-block bg-electric px-9 py-4"
          >
            <span className="block font-accent text-[0.72rem] font-medium uppercase tracking-[0.22em] text-carbon transition-transform duration-300 group-hover:scale-[1.02]">
              Jadwalkan Test Drive
            </span>
          </a>
          <a
            ref={secondaryBtn}
            href="#cta"
            data-cursor="hover"
            className="group inline-block border border-gold/40 px-9 py-4"
          >
            <span className="block font-accent text-[0.72rem] font-light uppercase tracking-[0.22em] text-offwhite transition-transform duration-300 group-hover:scale-[1.02]">
              Hubungi Kami
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
