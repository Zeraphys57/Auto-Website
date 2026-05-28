import { useEffect, useRef } from 'react'

// Tracks the pointer position in a ref (no re-renders). Consumers read
// `pos.current.x / pos.current.y`, typically inside a rAF loop.
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return pos
}
