import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color } from 'three'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { useIntersectionPause } from '../../hooks/useIntersectionPause'
import { pointer } from '../../lib/pointer'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const COUNT = 300

// Static cylinder of particles — built once at module load, not during render
// (random placement is a one-time layout, never recomputed per frame/mount).
const { positions: POSITIONS, colors: COLORS } = (() => {
  const positions = new Float32Array(COUNT * 3)
  const colors = new Float32Array(COUNT * 3)
  const crimson = new Color('#FF2D2D')
  const electric = new Color('#00D4FF')

  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 1.15 + (Math.random() - 0.5) * 0.45
    const y = (Math.random() - 0.5) * 3.0

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const c = Math.random() > 0.5 ? crimson : electric
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  return { positions, colors }
})()

const WHITE = new Color('#ffffff')

function ParticleField({ excite, accent }) {
  const ref = useRef(null)
  const matRef = useRef(null)
  const drift = useRef({ x: 0, z: 0 })
  const target = useMemo(() => (accent ? new Color(accent) : WHITE.clone()), [accent])

  useFrame((state, delta) => {
    if (!ref.current) return
    // Base spin, faster when excited by a hovered spec.
    ref.current.rotation.y += delta * (0.16 + (excite ? 0.34 : 0))
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.08

    // Drift toward the cursor — the field leans where you point.
    drift.current.x += (pointer.ny * 0.35 - drift.current.x) * 0.04
    drift.current.z += (pointer.nx * 0.35 - drift.current.z) * 0.04
    ref.current.rotation.x = drift.current.x
    ref.current.position.x = drift.current.z

    // Tint + intensify toward the active spec's accent.
    if (matRef.current) {
      const dest = excite ? target : WHITE
      matRef.current.color.lerp(dest, 0.08)
      const sizeDest = excite ? 0.07 : 0.045
      matRef.current.size += (sizeDest - matRef.current.size) * 0.1
      const opDest = excite ? 1 : 0.9
      matRef.current.opacity += (opDest - matRef.current.opacity) * 0.1
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[POSITIONS, 3]} />
        <bufferAttribute attach="attributes-color" args={[COLORS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.045}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        sizeAttenuation
        blending={AdditiveBlending}
      />
    </points>
  )
}

export default function EngineParticles({ excite = false, accent = null }) {
  const [ref, active] = useIntersectionPause()

  // Reduced motion: render nothing — the section reads fine without it.
  if (prefersReducedMotion) return <div ref={ref} aria-hidden="true" />

  return (
    <div ref={ref} aria-hidden="true" className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleField excite={excite} accent={accent} />
          <EffectComposer>
            <Bloom luminanceThreshold={0.15} intensity={0.9} mipmapBlur radius={0.7} />
            <ChromaticAberration offset={[0.0008, 0.0008]} />
            <Vignette offset={0.3} darkness={0.6} />
            <Noise opacity={0.025} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
