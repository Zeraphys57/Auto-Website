import { useEffect, useRef } from 'react'
import { applyTilt } from '../lib/tilt'

// Single-element convenience wrapper around applyTilt. Attach `ref` to the
// card, optionally `innerRef` to the content to lift, and `glareRef` to the
// glare layer.
export function useTilt(opts = {}) {
  const ref = useRef(null)
  const innerRef = useRef(null)
  const glareRef = useRef(null)

  useEffect(() => {
    return applyTilt(ref.current, {
      ...opts,
      inner: innerRef.current,
      glare: glareRef.current,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ref, innerRef, glareRef }
}
