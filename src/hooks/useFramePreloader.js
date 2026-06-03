import { useEffect, useRef, useState } from 'react'

// Preloads a numbered frame sequence (frame_0001.webp ...) in batches.
// If the first frame 404s, it drops straight into placeholder mode instead
// of hammering the network with `frameCount` doomed requests.
export function useFramePreloader(frameCount, basePath, onProgress) {
  const frames = useRef([])
  const [ready, setReady] = useState(false)
  const [placeholder, setPlaceholder] = useState(false)
  const onProgressRef = useRef(onProgress)
  
  useEffect(() => {
    onProgressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    let cancelled = false
    frames.current = new Array(frameCount).fill(null)

    const framePath = (i) =>
      `${basePath}/frame_${String(i + 1).padStart(4, '0')}.webp`

    const loadFrame = (i) =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          if (!cancelled) frames.current[i] = img
          resolve(true)
        }
        img.onerror = () => {
          if (!cancelled) frames.current[i] = null
          resolve(false)
        }
        img.src = framePath(i)
      })

    const run = async () => {
      // Probe the first frame to decide real vs. placeholder mode.
      const firstOk = await loadFrame(0)
      if (cancelled) return

      if (!firstOk) {
        setPlaceholder(true)
        onProgressRef.current?.(1)
        setReady(true)
        return
      }

      let loaded = 1
      onProgressRef.current?.(loaded / frameCount)

      for (let start = 1; start < frameCount; start += 10) {
        const batch = []
        for (let i = start; i < Math.min(start + 10, frameCount); i++) {
          batch.push(
            loadFrame(i).then((ok) => {
              loaded++
              onProgressRef.current?.(loaded / frameCount)
              return ok
            })
          )
        }
        await Promise.all(batch)
        if (cancelled) return
      }
      setReady(true)
    }

    run()

    return () => {
      cancelled = true
      frames.current = []
    }
  }, [frameCount, basePath])

  return { frames, ready, placeholder }
}
