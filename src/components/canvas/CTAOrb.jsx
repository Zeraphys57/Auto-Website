import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import vertexShader from '../../shaders/orb.vert.glsl?raw'
import fragmentShader from '../../shaders/orb.frag.glsl?raw'
import { useIntersectionPause } from '../../hooks/useIntersectionPause'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

function Orb() {
  const meshRef = useRef(null)
  const matRef = useRef(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (matRef.current) matRef.current.uniforms.uTime.value = t
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
      const pulse = 1.0 + (Math.sin(t * 1.5) * 0.5 + 0.5) * 0.05 // 1.0 → 1.05
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default function CTAOrb() {
  const [ref, active] = useIntersectionPause()

  if (prefersReducedMotion) return <div ref={ref} aria-hidden="true" />

  return (
    <div ref={ref} aria-hidden="true" className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Orb />
        </Suspense>
      </Canvas>
    </div>
  )
}
