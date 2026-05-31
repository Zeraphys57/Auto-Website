import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const DATA = [
  {
    quote: [
      'Orang bertanya mengapa, padahal sudah punya tiga.',
      'Mereka memang tak akan mengerti.',
      'Dan saya tak perlu menjelaskan.',
    ],
    name: 'Setiawan Halim',
    role: 'Pendiri & Investor',
    owned: 'VELOX RS · Pemilik sejak 2019',
  },
  {
    quote: [
      'Dua belas mobil di garasi saya.',
      'Hanya satu yang kuncinya selalu di saku.',
      'Anda bisa menebak yang mana.',
    ],
    name: 'Maria Tjandra',
    role: 'Kolektor Privat',
    owned: 'VELOX S · Garasi pribadi, Jakarta',
  },
  {
    quote: [
      'Di atas 250, mesin tidak bisa berbohong.',
      'VELOX mengatakan kebenaran,',
      'dan saya percaya setiap katanya.',
    ],
    name: 'Reza Mahendra',
    role: 'Pembalap & Pengusaha',
    owned: 'VELOX GT · 40.000 km dalam dua tahun',
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => setIndex((i) => (i + 1) % DATA.length), 5000)
    return () => clearInterval(id)
  }, [])

  const active = DATA[index]

  return (
    <section className="testimonials-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      {/* Eyebrow */}
      <span
        data-speed="0.85"
        className="absolute top-[14%] left-1/2 -translate-x-1/2 font-accent text-[0.62rem] font-extralight uppercase tracking-[0.7em] text-muted"
      >
        Testimonial
      </span>

      {/* Decorative quote mark — slight faster parallax */}
      <span
        aria-hidden="true"
        data-speed="0.6"
        className="pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 font-display leading-none text-crimson"
        style={{ fontSize: '12rem', opacity: 0.15 }}
      >
        &rdquo;
      </span>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={prefersReducedMotion ? false : { opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="font-serif italic text-offwhite"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', lineHeight: 1.5 }}
            >
              {active.quote.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <footer className="mt-10">
              <div className="font-accent text-sm font-light tracking-[0.1em] text-gold">
                — {active.name}
              </div>
              <div className="mt-1 font-accent text-[0.7rem] font-extralight uppercase tracking-[0.2em] text-muted">
                {active.role}
              </div>
              <div className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-gold/70">
                {active.owned}
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        {/* Dot navigation — magnetic on each dot */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {DATA.map((_, i) => (
            <button
              key={i}
              type="button"
              data-cursor="hover"
              data-magnetic
              data-magnetic-strength="0.6"
              aria-label={`Tampilkan testimoni ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === index ? 28 : 8,
                backgroundColor:
                  i === index ? '#C9A96E' : 'rgba(201,169,110,0.3)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
