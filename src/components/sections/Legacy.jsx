import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const STATS = [
  { target: 48, suffix: '', label: 'Tahun' },
  { target: 1200, suffix: '+', label: 'Unit Terjual' },
  { target: 32, suffix: '', label: 'Penghargaan' },
]

export default function Legacy() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const titleRef = useRef(null)
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

      gsap.from(leftRef.current, {
        xPercent: -5,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })

      gsap.from(rightRef.current, {
        xPercent: 5,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })

      gsap.from(titleRef.current, {
        autoAlpha: 0,
        filter: 'blur(16px)',
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })

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
          className="relative h-[56vh] w-full border border-crimson/30 md:h-[70vh]"
          style={{
            background:
              'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 60%, #FF2D2D08 100%)',
          }}
        >
          <div className="absolute bottom-6 left-6 flex h-28 w-28 items-center justify-center rounded-full border border-silver/40 text-center">
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
            <span className="font-accent text-[0.62rem] font-extralight uppercase tracking-[0.3em] text-muted">
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

          <div className="mt-7 max-w-xl space-y-5 text-chrome/60" style={{ lineHeight: 1.9 }}>
            <p>
              Sejak 1987, setiap Velox lahir dari ruang gerah tempat para insinyur
              menolak kata "cukup". Bukan mobil yang dibuat untuk dijual — melainkan
              untuk membuktikan sesuatu.
            </p>
            <p>
              Empat dekade penyempurnaan. Ribuan jam di lintasan. Satu prinsip yang
              tak pernah berubah: kesempurnaan bukan tujuan, melainkan titik awal.
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
