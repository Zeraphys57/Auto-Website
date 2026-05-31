import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const STATS = [
  { target: 39,   suffix: '',  label: 'Tahun Obsesi' },
  { target: 1200, suffix: '+', label: 'Unit, Tak Pernah Massal' },
  { target: 32,   suffix: '',  label: 'Gelar Juara' },
]

export default function Legacy() {
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const titleRef   = useRef(null)
  const bodyRef    = useRef(null)
  const rm = prefersReducedMotion

  useGSAP(
    () => {
      const setStat = (el, value) => {
        el.textContent =
          Math.round(value).toLocaleString('id-ID') + (el.dataset.suffix || '')
      }

      if (rm) {
        gsap.utils
          .toArray('.stat-num')
          .forEach((el) => setStat(el, parseFloat(el.dataset.target)))
        return
      }

      // Left image panel — slides from left (different from right's fade)
      gsap.from(leftRef.current, {
        xPercent: -5,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })

      // Right block — slides from right
      gsap.from(rightRef.current, {
        xPercent: 5,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })

      // Title — blur fade
      gsap.from(titleRef.current, {
        autoAlpha: 0,
        filter: 'blur(16px)',
        duration: 1.1,
        ease: 'velox',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })

      // Body text — SplitText line-mask: each line rises through an overflow:hidden
      // parent, giving a clean cinematic "curtain open" reveal per line.
      if (bodyRef.current) {
        const paras = Array.from(bodyRef.current.querySelectorAll('p'))
        paras.forEach((para) => {
          const split = new SplitText(para, { type: 'lines' })
          split.lines.forEach((line) => {
            const mask = document.createElement('div')
            mask.style.overflow = 'hidden'
            line.parentNode.insertBefore(mask, line)
            mask.appendChild(line)
          })
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: 'velox',
            stagger: 0.08,
            scrollTrigger: { trigger: para, start: 'top 78%' },
          })
        })
      }

      // Stats — count up
      gsap.utils.toArray('.stat-num').forEach((el) => {
        const target = parseFloat(el.dataset.target)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: rightRef.current, start: 'top 78%' },
          onUpdate: () => setStat(el, obj.v),
        })
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section
      ref={sectionRef}
      id="legacy"
      className="legacy-section relative flex min-h-screen items-center py-28"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-[55%_45%] md:px-12">
        {/* Left — visual */}
        <div
          ref={leftRef}
          className="relative h-[56vh] w-full overflow-hidden border border-crimson/30 md:h-[70vh]"
        >
          {/* Garage atmosphere photo — old car in workshop (Unsplash) */}
          <img
            src="https://images.unsplash.com/photo-1649615084630-431b70a6e89a?w=1600&q=80&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.45, filter: 'grayscale(0.25) contrast(1.05)' }}
          />
          {/* Dark overlay to maintain legibility and match section palette */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(26,26,26,0.55) 0%, rgba(13,13,13,0.65) 60%, rgba(255,45,45,0.04) 100%)',
            }}
          />
          <div
            data-speed="1.15"
            className="absolute bottom-6 left-6 flex h-28 w-28 items-center justify-center rounded-full border border-silver/40 text-center"
          >
            <span className="font-accent text-[0.6rem] font-extralight uppercase leading-tight tracking-[0.25em] text-silver">
              Since
              <br />
              1987
            </span>
          </div>
        </div>

        {/* Right — text */}
        <div ref={rightRef}>
          {/* Eyebrow */}
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-silver/50" />
            <span
              data-speed="0.85"
              className="font-accent text-[0.62rem] font-extralight uppercase tracking-[0.3em] text-muted"
            >
              Warisan Kami
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-serif italic text-chrome"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Dibangun dengan Obsesi
          </h2>

          <div
            ref={bodyRef}
            className="mt-7 max-w-xl space-y-5 text-chrome/60"
            style={{ lineHeight: 1.9 }}
          >
            <p>
              Tahun 1987, di sebuah bengkel sempit di pinggiran Bandung, Tan Wijaya
              membongkar mesin yang menurut semua orang sudah sempurna. Baginya,
              "cukup cepat" adalah sebuah penghinaan.
            </p>
            <p>
              Empat dekade kemudian, pertanyaannya tak pernah berubah. Bukan
              "seberapa cepat", melainkan "seberapa dekat dengan sempurna". Jarak
              di antara keduanya — itulah seluruh hidup kami.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="stat-num font-display leading-none text-chrome"
                  data-target={s.target}
                  data-suffix={s.suffix}
                  style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
                >
                  0
                </div>
                <div className="mt-2 font-accent text-[0.6rem] font-extralight uppercase tracking-[0.2em] text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
