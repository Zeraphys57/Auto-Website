import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { registerParallax } from '../../lib/pointer'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// The emotional anchor — pure typography, no 3D. Each line rises through a mask
// as it enters. ACT 1 palette (electric), the single most quotable moment.
const LINES = [
  { text: 'Kami tidak membuat mobil.', accent: false },
  { text: 'Kami membuat alasan untuk bangun lebih pagi.', accent: false },
  { text: 'Alasan untuk memilih jalan yang lebih jauh.', accent: false },
  { text: 'Untuk jatuh cinta pada perjalanan — bukan tujuannya.', accent: true },
]

export default function Manifesto() {
  const sectionRef = useRef(null)
  const linesRef   = useRef(null)
  const lineDrawRef = useRef(null)
  const eyebrowRef = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      if (rm) return

      // Thin electric line — draws in, then breathes
      gsap.from(lineDrawRef.current, {
        scaleX: 0,
        duration: 1.4,
        ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
      gsap.to(lineDrawRef.current, {
        opacity: 0.4,
        duration: 2.6,
        delay: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.from(eyebrowRef.current, {
        autoAlpha: 0,
        y: 18,
        duration: 1,
        ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      // Line-mask reveal — each declarative line rises from behind a clip edge
      const lineEls = Array.from(linesRef.current.querySelectorAll('.manifesto-line'))
      lineEls.forEach((el) => {
        const split = new SplitText(el, { type: 'lines' })
        split.lines.forEach((line) => {
          const mask = document.createElement('div')
          mask.style.overflow = 'hidden'
          line.parentNode.insertBefore(mask, line)
          mask.appendChild(line)
        })
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1,
          ease: 'velox',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  // Mouse-parallax — lines drift at increasing rates for layered depth; the
  // eyebrow moves horizontally only (its reveal owns the y axis).
  useEffect(() => {
    const lines = linesRef.current
      ? Array.from(linesRef.current.querySelectorAll('.manifesto-line'))
      : []
    const cleanups = [
      registerParallax(eyebrowRef.current, { strength: 22, strengthY: 0 }),
      registerParallax(lineDrawRef.current, { strength: 30, invert: true }),
      ...lines.map((el, i) => registerParallax(el, { strength: 8 + i * 5 })),
    ]
    return () => cleanups.forEach((c) => c())
  }, [])

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      aria-label="Manifesto VELOX"
      className="manifesto-section relative flex min-h-screen items-center overflow-hidden py-32"
    >
      {/* Thin animated accent line */}
      <span
        ref={lineDrawRef}
        aria-hidden="true"
        className="absolute left-6 top-[20%] h-px w-20 origin-left bg-electric md:left-12 md:w-28"
      />

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div ref={eyebrowRef} className="mb-10 md:mb-14">
          <span className="font-accent text-micro font-extralight uppercase tracking-macro text-electric">
            Manifesto
          </span>
        </div>

        <div ref={linesRef} className="max-w-5xl">
          {LINES.map((l, i) => (
            <p
              key={i}
              className={`manifesto-line font-serif ${
                l.accent ? 'italic text-gold' : 'text-chrome'
              }`}
              style={{
                fontSize: 'clamp(1.7rem, 4.4vw, 3.7rem)',
                lineHeight: 1.26,
                fontWeight: l.accent ? 400 : 300,
                marginTop: i === 0 ? 0 : '0.35em',
              }}
            >
              {l.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
