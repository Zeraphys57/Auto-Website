import { useEffect, useRef, useState } from 'react'

// Attach the returned ref to a wrapper element; `active` is true only while
// that element intersects the viewport. Used to pause R3F canvases offscreen.
export function useIntersectionPause(options = {}) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0, rootMargin: '120px', ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, active]
}
