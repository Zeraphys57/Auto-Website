import { useEffect, useRef } from 'react'
import { registerParallax } from '../lib/pointer'

// Attach to any element to make it drift with the cursor (independent of
// scroll). Higher strength = more travel = reads as "closer" to the viewer.
// No-op on touch / reduced-motion. Returns a ref.
export function useMouseParallax(strength = 12, { strengthY, invert = false, lerp = 0.1 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    return registerParallax(ref.current, { strength, strengthY, invert, lerp })
  }, [strength, strengthY, invert, lerp])

  return ref
}
