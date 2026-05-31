import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color } from 'three'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { useIntersectionPause } from '../../hooks/useIntersectionPause'
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

function ParticleField() {
  const ref = useRef(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.16
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[POSITIONS, 3]} />
        <bufferAttribute attach="attributes-color" args={[COLORS, 3]} />
      </bufferGeometry>
      <pointsMaterial
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

export default function EngineParticles() {
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
          <ParticleField />
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
