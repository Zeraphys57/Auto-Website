import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Environment, Lightformer, ContactShadows, Html, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Color } from 'three'
import { pointer } from '../../lib/pointer'

// Rim treatments per wheel option (Sport / Performance / Carbon).
const RIMS = [
  { color: '#C8C8C8', metalness: 0.95, roughness: 0.18 },
  { color: '#3A3D42', metalness: 0.8, roughness: 0.32 },
  { color: '#101012', metalness: 0.6, roughness: 0.22 },
]

function Wheel({ x, z, rim }) {
  return (
    <group position={[x, -0.22, z]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.34, 32]} />
        <meshStandardMaterial color="#0b0b0c" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.02, 24]} />
        <meshStandardMaterial color={rim.color} metalness={rim.metalness} roughness={rim.roughness} />
      </mesh>
    </group>
  )
}

function Car({ paintHex, wheelIdx, hasWing }) {
  const groupRef = useRef(null)
  const bodyMat = useRef(null)
  const headMat = useRef(null)
  const tailMat = useRef(null)
  const rotZ = useRef(0)
  const rotX = useRef(0)
  const rim = RIMS[wheelIdx] || RIMS[0]

  // Smoothly recolor the paint when the swatch changes — never re-mount.
  useEffect(() => {
    if (!bodyMat.current) return
    const c = new Color(paintHex)
    gsapColor(bodyMat.current.color, c)
    // Pearl-white reads better a touch rougher; deep colours stay glossy.
    const isLight = c.r + c.g + c.b > 2.1
    bodyMat.current.metalness = isLight ? 0.5 : 0.7
    bodyMat.current.roughness = isLight ? 0.3 : 0.22
  }, [paintHex])

  useFrame((state, delta) => {
    const g = groupRef.current
    if (!g) return
    g.rotation.y += delta * 0.32
    // Heavy springy "looks at cursor" lean.
    rotZ.current += (pointer.nx * 0.16 - rotZ.current) * 0.04
    rotX.current += (pointer.ny * 0.12 - rotX.current) * 0.04
    g.rotation.z = rotZ.current
    g.rotation.x = rotX.current
    
    // Pulse bloom intensity rhythmically
    const time = state.clock.getElapsedTime()
    if (headMat.current) {
      headMat.current.emissiveIntensity = 2.0 + Math.sin(time * 2.5) * 0.5
    }
    if (tailMat.current) {
      tailMat.current.emissiveIntensity = 2.2 + Math.sin(time * 2.5) * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lower body */}
      <RoundedBox args={[3.5, 0.6, 1.55]} radius={0.24} smoothness={5} castShadow>
        <meshStandardMaterial ref={bodyMat} color={paintHex} metalness={0.7} roughness={0.22} envMapIntensity={1.1} />
      </RoundedBox>

      {/* Front splitter */}
      <mesh position={[1.7, -0.3, 0]}>
        <boxGeometry args={[0.35, 0.08, 1.5]} />
        <meshStandardMaterial color="#0d0d0e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Cabin / glass canopy */}
      <RoundedBox args={[1.7, 0.52, 1.28]} radius={0.24} smoothness={5} position={[-0.15, 0.46, 0]}>
        <meshStandardMaterial color="#0a0c10" metalness={0.5} roughness={0.08} envMapIntensity={1.4} />
      </RoundedBox>

      {/* Rear wing (RS) */}
      {hasWing && (
        <group position={[-1.7, 0.28, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 0.04, 1.5]} />
            <meshStandardMaterial color="#0d0d0e" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.12, -0.18, 0.66]}>
            <boxGeometry args={[0.06, 0.34, 0.06]} />
            <meshStandardMaterial color="#0d0d0e" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.12, -0.18, -0.66]}>
            <boxGeometry args={[0.06, 0.34, 0.06]} />
            <meshStandardMaterial color="#0d0d0e" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* Headlight bar */}
      <mesh position={[1.74, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.12, 1.1]} />
        <meshStandardMaterial ref={headMat} color="#bfe9ff" emissive="#00D2FF" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      {/* Tail bar */}
      <mesh position={[-1.76, 0.04, 0]}>
        <boxGeometry args={[0.04, 0.1, 1.2]} />
        <meshStandardMaterial ref={tailMat} color="#ff6a6a" emissive="#FF2D2D" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>

      <Wheel x={1.15} z={0.66} rim={rim} />
      <Wheel x={1.15} z={-0.66} rim={rim} />
      <Wheel x={-1.2} z={0.66} rim={rim} />
      <Wheel x={-1.2} z={-0.66} rim={rim} />
    </group>
  )
}

// gsap is global via the app; tween a THREE.Color toward a target.
function gsapColor(target, dest) {
  // Lazy import avoids a hard dep cycle at module load.
  import('gsap').then(({ gsap }) => {
    gsap.to(target, { r: dest.r, g: dest.g, b: dest.b, duration: 0.8, ease: 'velox' })
  })
}

export default function ConfiguratorCar({ paintHex, wheelIdx, hasWing, active }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      performance={{ min: 0.5 }}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [4.6, 1.8, 5.2], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={<ConfiguratorLoader />}>
        <ambientLight intensity={0.35} />
        <spotLight position={[5, 8, 4]} angle={0.5} penumbra={0.8} intensity={2.2} castShadow />
        <Car paintHex={paintHex} wheelIdx={wheelIdx} hasWing={hasWing} />
        <ContactShadows position={[0, -0.62, 0]} opacity={0.55} scale={11} blur={2.6} far={3} />
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={2.2} position={[0, 5, -2]} scale={[10, 5, 1]} color="#ffffff" />
          <Lightformer intensity={1.3} position={[-5, 1.5, 1]} scale={[3, 6, 1]} color="#00D2FF" />
          <Lightformer intensity={1.1} position={[5, 1.5, 1]} scale={[3, 6, 1]} color="#D4AF37" />
          <Lightformer intensity={0.7} position={[0, -3, 2]} scale={[10, 3, 1]} color="#444444" />
        </Environment>
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom luminanceThreshold={0.4} intensity={1.2} mipmapBlur radius={0.8} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}

function ConfiguratorLoader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="mb-2 font-display text-2xl text-electric">
          {Math.round(progress)}%
        </div>
        <div className="h-px w-32 overflow-hidden bg-white/10">
          <div 
            className="h-full bg-electric transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="mt-3 font-accent text-micro uppercase tracking-macro text-muted">
          Mengunduh Model
        </div>
      </div>
    </Html>
  )
}
