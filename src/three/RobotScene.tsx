import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { RobotModel } from './RobotModel'
import { useInteractionStore } from '../store/useInteractionStore'

/* ------------------------------------------------------------------ */
/* Cinematic dust field                                                */
/* ------------------------------------------------------------------ */

function DustField({ count = 240 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)
  const reduced = useInteractionStore((s) => s.reducedMotion)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 7
      arr[i * 3 + 1] = Math.random() * 4
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    if (reduced || !points.current) return
    const geo = points.current.geometry
    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const speeds = geo.userData.speeds as Float32Array | undefined
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + (speeds?.[i] ?? 0.1) * delta
      pos.setY(i, y > 4 ? 0 : y)
      // slow sideways drift
      pos.setX(i, pos.getX(i) + Math.sin(y * 0.7 + i) * 0.0006)
    }
    pos.needsUpdate = true
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.04
  })

  const speeds = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = 0.04 + Math.random() * 0.12
    return arr
  }, [count])

  // stash speeds on the geometry for the frame loop
  const geoRef = (g: THREE.BufferGeometry | null) => {
    if (g) g.userData.speeds = speeds
  }

  return (
    <points ref={points}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#e8c877"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Lighting                                                            */
/* ------------------------------------------------------------------ */

function Lights() {
  return (
    <>
      {/* warm key light - late-afternoon sun */}
      <directionalLight position={[3, 5, 4]} intensity={2.4} color="#ffe3a3" />
      {/* cool rim from behind - evening sky */}
      <directionalLight position={[-4, 3, -5]} intensity={1.1} color="#8fb8d8" />
      {/* soft fill */}
      <hemisphereLight args={['#5a4a30', '#1a140c', 0.9]} />
      {/* bounce from the ground */}
      <pointLight position={[0, 0.4, 2.2]} intensity={0.6} color="#f0b310" distance={6} />
      {/* subtle green accent - the plant motif */}
      <pointLight position={[-2.5, 1.2, -2]} intensity={0.35} color="#7fb069" distance={8} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Camera controls                                                     */
/* ------------------------------------------------------------------ */

/**
 * Pulls the camera back on narrow (portrait) canvases so the robot's
 * outstretched arms and claws stay inside the frame. Wide screens keep the
 * original cinematic distance.
 */
function Framing() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  useEffect(() => {
    const aspect = size.width / size.height
    const dist = Math.max(3.6, 3.55 / aspect)
    camera.position.set(0, 1.5, dist)
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

function CameraControls() {
  return (
    <OrbitControls
      makeDefault
      target={[0, 1.0, 0]}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.45}
      minPolarAngle={Math.PI * 0.28}
      maxPolarAngle={Math.PI * 0.52}
      minAzimuthAngle={-Math.PI * 0.28}
      maxAzimuthAngle={Math.PI * 0.28}
    />
  )
}

/* ------------------------------------------------------------------ */
/* The full robot scene                                                */
/* ------------------------------------------------------------------ */

export function RobotScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 3.6], fov: 35 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'none' }}
      aria-label="Interactive 3D WALL-E robot - use mouse to look around, click his head, chest or treads"
      role="img"
    >
      <Lights />
      <RobotModel />
      <Framing />
      <DustField />
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.62}
        scale={7}
        blur={2.6}
        far={2.2}
        resolution={512}
        color="#0b0803"
      />
      <CameraControls />
    </Canvas>
  )
}
