import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Attach to any element to make it magnetise toward the cursor.
// Skip on coarse-pointer (touch) devices — magnetic feels wrong on mobile.
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current
    if (!el) return

    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'velox' })
    }
    const leave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })

    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength])

  return ref
}
