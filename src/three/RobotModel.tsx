import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
  computePose,
  computeBlink,
  damp,
  ONE_SHOT_MOODS,
  MOOD_DURATION,
  REST_POSE,
  type RobotPose,
} from './RobotAnimations'
import { useInteractionStore } from '../store/useInteractionStore'
import { playSfx } from '../hooks/useSoundBus'

/* ------------------------------------------------------------------ */
/* Procedural textures - no external assets                            */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Weathered yellow paint with grime, rust flecks and scratches. */
function makeBodyTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = mulberry32(20080627)

  // base industrial yellow
  ctx.fillStyle = '#e7ae0c'
  ctx.fillRect(0, 0, size, size)

  // subtle tonal variation
  for (let i = 0; i < 26; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 40 + rand() * 130
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(${rand() > 0.5 ? '255,205,60' : '168,120,8'}, ${0.08 + rand() * 0.1})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }

  // rust blotches
  for (let i = 0; i < 34; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 3 + rand() * 22
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    const c = rand() > 0.5 ? '148,74,16' : '122,54,10'
    g.addColorStop(0, `rgba(${c}, ${0.35 + rand() * 0.35})`)
    g.addColorStop(0.7, `rgba(${c}, 0.12)`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // scratches & scuffs
  ctx.lineCap = 'round'
  for (let i = 0; i < 42; i++) {
    ctx.strokeStyle = `rgba(255,230,150,${0.05 + rand() * 0.12})`
    ctx.lineWidth = 0.6 + rand() * 1.6
    ctx.beginPath()
    const x = rand() * size
    const y = rand() * size
    const len = 12 + rand() * 70
    const ang = rand() * Math.PI
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len)
    ctx.stroke()
  }
  for (let i = 0; i < 26; i++) {
    ctx.strokeStyle = `rgba(60,40,10,${0.08 + rand() * 0.15})`
    ctx.lineWidth = 0.5 + rand() * 1.4
    ctx.beginPath()
    const x = rand() * size
    const y = rand() * size
    const len = 8 + rand() * 44
    const ang = rand() * Math.PI
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len)
    ctx.stroke()
  }

  // edge grime
  const edge = ctx.createLinearGradient(0, size, 0, size - 110)
  edge.addColorStop(0, 'rgba(70,45,12,0.5)')
  edge.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = edge
  ctx.fillRect(0, size - 110, size, 110)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Roughness variation so worn areas read as scuffed, painted metal. */
function makeRoughnessTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = mulberry32(42)
  ctx.fillStyle = '#c8c8c8'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 60; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 6 + rand() * 40
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(${rand() > 0.5 ? '255,255,255' : '70,70,70'}, ${0.15 + rand() * 0.3})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  return new THREE.CanvasTexture(canvas)
}

/** "WALL·E" stencil decal for the front dump door (transparent background). */
function makeLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 256, 128)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  // plain stencil letters, centered
  ctx.fillStyle = '#2b2720'
  ctx.font = 'bold 52px "Arial Black", Arial, sans-serif'
  ctx.fillText('WALL·E', 128, 66)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/* ------------------------------------------------------------------ */
/* The robot                                                           */
/* ------------------------------------------------------------------ */

const HOTSPOT_MOODS = {
  head: { mood: 'happy' as const, sound: 'happy', caption: 'Rubbed the optics - WALL·E approves!' },
  chest: { mood: 'curious' as const, sound: 'curious', caption: 'Chest panel opened… so many buttons.' },
  door: { mood: 'curious' as const, sound: 'servo', caption: 'Front dump door - treasure check!' },
  tracks: { mood: 'explore' as const, sound: 'explore', caption: 'Treads engaged. Rolling out!' },
  lid: { mood: 'greet' as const, sound: 'greet', caption: 'Solar panels out - good morning, WALL·E!' },
}

export function RobotModel() {
  const mood = useInteractionStore((s) => s.mood)
  const moodTick = useInteractionStore((s) => s.moodTick)
  const look = useInteractionStore((s) => s.look)
  const mouseTracking = useInteractionStore((s) => s.mouseTracking)
  const setMood = useInteractionStore((s) => s.setMood)

  const bodyTexture = useMemo(makeBodyTexture, [])
  const roughnessTexture = useMemo(makeRoughnessTexture, [])
  const logoTexture = useMemo(makeLogoTexture, [])

  // ---- refs
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const headGroup = useRef<THREE.Group>(null)
  const neck = useRef<THREE.Mesh>(null)
  const eyeL = useRef<THREE.Group>(null)
  const eyeR = useRef<THREE.Group>(null)
  const pupilL = useRef<THREE.Mesh>(null)
  const pupilR = useRef<THREE.Mesh>(null)
  const eyeBallL = useRef<THREE.Group>(null)
  const eyeBallR = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const door = useRef<THREE.Group>(null)
  const doorOpen = useRef(false)
  const plateRefs = useRef<(THREE.Mesh | null)[]>([])

  // ---- mood bookkeeping
  const state = useRef({
    moodStart: 0,
    lastTick: moodTick,
    effectiveMood: mood as string,
    ended: false,
    pose: { ...REST_POSE } as RobotPose,
    trackAngle: 0,
    blinkSeed: Math.random(),
  })

  useEffect(() => {
    const s = state.current
    if (s.lastTick !== moodTick) {
      s.lastTick = moodTick
      s.moodStart = -1 // set on next frame with real clock
      s.ended = false
      s.effectiveMood = mood
    }
  }, [mood, moodTick])

  useFrame((frameState, delta) => {
    const s = state.current
    const t = frameState.clock.elapsedTime
    const dt = Math.min(delta, 0.05)

    if (s.moodStart < 0) s.moodStart = t

    // one-shot moods fall back to idle
    if (!s.ended && ONE_SHOT_MOODS.includes(s.effectiveMood as never)) {
      const dur = MOOD_DURATION[s.effectiveMood as keyof typeof MOOD_DURATION] ?? 2
      if (t - s.moodStart > dur) {
        s.ended = true
        s.effectiveMood = 'idle'
        useInteractionStore.setState({ mood: 'idle' })
      }
    }

    const phase = t - s.moodStart
    const target = computePose(s.effectiveMood as never, phase, t, look, mouseTracking)
    const blink = computeBlink(t, s.blinkSeed, s.effectiveMood === 'sleep')
    const lid = Math.max(target.eyeLid, blink)

    // smooth toward the target pose
    const cur = s.pose
    const L = 8 // damping rate
    cur.headYaw = damp(cur.headYaw, target.headYaw, L, dt)
    cur.headPitch = damp(cur.headPitch, target.headPitch, L, dt)
    cur.headRoll = damp(cur.headRoll, target.headRoll, L, dt)
    cur.headForward = damp(cur.headForward, target.headForward, L, dt)
    cur.neckStretch = damp(cur.neckStretch, target.neckStretch, L, dt)
    cur.eyeSquint = damp(cur.eyeSquint, target.eyeSquint, 10, dt)
    cur.pupilScale = damp(cur.pupilScale, target.pupilScale, 10, dt)
    cur.bodyBob = damp(cur.bodyBob, target.bodyBob, 10, dt)
    cur.bodyTilt = damp(cur.bodyTilt, target.bodyTilt, 6, dt)
    cur.armLeft = damp(cur.armLeft, target.armLeft, 7, dt)
    cur.armRight = damp(cur.armRight, target.armRight, 7, dt)
    cur.trackSpin = damp(cur.trackSpin, target.trackSpin, 5, dt)

    // apply
    if (root.current) root.current.position.y = cur.bodyBob
    if (body.current) body.current.rotation.z = cur.bodyTilt
    if (headGroup.current) {
      headGroup.current.rotation.y = cur.headYaw
      headGroup.current.rotation.x = cur.headPitch
      headGroup.current.rotation.z = cur.headRoll
      headGroup.current.position.z = -0.04 + cur.headForward
    }
    if (neck.current) {
      neck.current.scale.y = cur.neckStretch
      // anchor the neck base at the top of the body; stretch lifts the head
      neck.current.position.y = 1.38 + 0.13 * cur.neckStretch
    }

    // pupils track within the lens
    const px = THREE.MathUtils.clamp(look.x * 0.035, -0.035, 0.035)
    const py = THREE.MathUtils.clamp(-look.y * 0.03, -0.03, 0.03)
    const eyeScaleY = Math.max(0.04, 1 - lid * 0.96 - cur.eyeSquint * 0.45)
    for (const pupil of [pupilL.current, pupilR.current]) {
      if (pupil) {
        pupil.position.x = px
        pupil.position.y = py
        pupil.scale.set(cur.pupilScale, eyeScaleY, 1)
      }
    }
    for (const ball of [eyeBallL.current, eyeBallR.current]) {
      if (ball) ball.scale.y = eyeScaleY
    }
    // eyelids squeeze the whole lens slightly for expression
    for (const eye of [eyeL.current, eyeR.current]) {
      if (eye) eye.scale.y = 1 - lid * 0.12
    }

    // arms: raise + wave wiggle while greeting.
    // Positive Z-rotation swings a downward arm to the RIGHT, so the right arm
    // raises outward with + and the left arm with - (mirrored). This keeps the
    // claws clear of the torso instead of sweeping through it. The +/-0.2 base
    // tilt splays the arms slightly outward like the movie robot.
    const wave = s.effectiveMood === 'greet' ? Math.sin(t * 9.5) * 0.4 * cur.armRight : 0
    if (armR.current) armR.current.rotation.z = 0.2 + cur.armRight * 1.75 + wave
    if (armL.current) armL.current.rotation.z = -0.2 - cur.armLeft * 1.75

    // treads roll: chain plates advance along the oval track path
    s.trackAngle += cur.trackSpin * dt
    for (let k = 0; k < plateRefs.current.length; k++) {
      const plate = plateRefs.current[k]
      if (!plate) continue
      const tt = s.trackAngle + (k % TRACK_PLATES) * ((Math.PI * 2) / TRACK_PLATES)
      plate.position.set(0, TRACK_RY * Math.cos(tt), TRACK_RZ * Math.sin(tt))
      plate.rotation.x = Math.atan2(TRACK_RY * Math.sin(tt), TRACK_RZ * Math.cos(tt))
    }

    // front dump door swings open around its bottom hinge (folds forward-down)
    if (door.current) {
      const target = doorOpen.current ? 1.05 : 0
      door.current.rotation.x = damp(door.current.rotation.x, target, 6, dt)
    }
  })

  /* ---------- hotspot handlers ---------- */
  const hover = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = 'auto'
    },
  }
  const hotspot = (key: keyof typeof HOTSPOT_MOODS) => ({
    ...hover,
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      const h = HOTSPOT_MOODS[key]
      playSfx(h.sound)
      setMood(h.mood, h.caption)
    },
  })
  /** The front dump door toggles open/closed like in the movie. */
  const doorHotspot = {
    ...hover,
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      doorOpen.current = !doorOpen.current
      playSfx('servo')
      setMood(
        'curious',
        doorOpen.current ? 'Front door open - peeking inside!' : 'Front door closed - all sealed!',
      )
    },
  }

  /* ---------- materials ---------- */
  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        map: bodyTexture,
        roughnessMap: roughnessTexture,
        roughness: 0.72,
        metalness: 0.25,
      }),
      dark: new THREE.MeshStandardMaterial({ color: '#241f17', roughness: 0.85, metalness: 0.35 }),
      gunmetal: new THREE.MeshStandardMaterial({ color: '#464035', roughness: 0.55, metalness: 0.6 }),
      steel: new THREE.MeshStandardMaterial({ color: '#6e6353', roughness: 0.45, metalness: 0.65 }),
      rust: new THREE.MeshStandardMaterial({ color: '#8a3c07', roughness: 0.95, metalness: 0.1 }),
      rustLight: new THREE.MeshStandardMaterial({ color: '#a4531b', roughness: 0.9, metalness: 0.1 }),
      track: new THREE.MeshStandardMaterial({ color: '#2b2720', roughness: 0.95, metalness: 0.2 }),
      eyeHousing: new THREE.MeshStandardMaterial({ color: '#38332a', roughness: 0.5, metalness: 0.65 }),
      eyeBall: new THREE.MeshStandardMaterial({
        color: '#fdf6e3',
        emissive: '#ffedc2',
        emissiveIntensity: 0.35,
        roughness: 0.4,
      }),
      pupil: new THREE.MeshStandardMaterial({ color: '#17130d', roughness: 0.3 }),
      buttonA: new THREE.MeshStandardMaterial({ color: '#e04f39', emissive: '#e04f39', emissiveIntensity: 0.55 }),
      buttonB: new THREE.MeshStandardMaterial({ color: '#63c7e8', emissive: '#63c7e8', emissiveIntensity: 0.5 }),
      plantGreen: new THREE.MeshStandardMaterial({ color: '#7fb069', roughness: 0.7 }),
      // movie-look additions
      cream: new THREE.MeshStandardMaterial({ color: '#f6ead8', roughness: 0.55, metalness: 0.15 }),
      lcd: new THREE.MeshStandardMaterial({ color: '#0d2018', emissive: '#1a4a34', emissiveIntensity: 0.5, roughness: 0.3 }),
      lcdGlow: new THREE.MeshStandardMaterial({ color: '#39d97f', emissive: '#39d97f', emissiveIntensity: 1.4 }),
      lens: new THREE.MeshStandardMaterial({ color: '#181410', roughness: 0.2, metalness: 0.35 }),
      logo: new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true }),
    }),
    [bodyTexture, roughnessTexture],
  )

  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials])

  /* ---------- excavator track chain constants ---------- */
  const TRACK_PLATES = 24
  const TRACK_RY = 0.15
  const TRACK_RZ = 0.26

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* ================= TRACKS (excavator chain, steel - movie look) ================= */}
      {[-1, 1].map((side, sideIdx) => (
        <group
          key={side}
          position={[side * 0.52, 0.21, 0]}
          rotation={[0, 0, side * 0.12]}
          {...hotspot('tracks')}
        >
          {/* chain of overlapping steel plates driven around an oval path */}
          {Array.from({ length: TRACK_PLATES }, (_, i) => (
            <mesh
              key={i}
              ref={(m) => {
                if (m) plateRefs.current[sideIdx * TRACK_PLATES + i] = m
              }}
              material={materials.steel}
            >
              <boxGeometry args={[0.3, 0.055, 0.1]} />
            </mesh>
          ))}
          {/* steel road wheels visible inside the chain loop */}
          {[
            [0.05, -0.13],
            [-0.03, 0.14],
            [-0.03, -0.14],
          ].map(([wy, wz], wi) => (
            <group key={wi} position={[side * 0.08, wy, wz]}>
              <mesh material={materials.steel} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
              </mesh>
              <mesh
                material={materials.gunmetal}
                rotation={[0, 0, Math.PI / 2]}
                position={[side * 0.028, 0, 0]}
              >
                <cylinderGeometry args={[0.038, 0.038, 0.02, 12]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ================= BODY (extends down over the tracks) ================= */}
      <group ref={body}>
        <RoundedBox
          args={[1.0, 1.14, 0.78]}
          radius={0.055}
          smoothness={4}
          position={[0, 0.95, 0]}
          material={materials.body}
          {...hotspot('chest')}
        />

        {/* chest control panel: green LCD waveform + red button (movie look),
            tucked up on the upper chest so the door owns the middle */}
        <group position={[0, 1.31, 0.4]}>
          {/* bezel */}
          <mesh material={materials.gunmetal}>
            <boxGeometry args={[0.4, 0.3, 0.03]} />
          </mesh>
          {/* LCD screen */}
          <mesh material={materials.lcd} position={[-0.075, 0.05, 0.02]}>
            <boxGeometry args={[0.24, 0.2, 0.02]} />
          </mesh>
          {/* waveform bars on the screen */}
          {[
            [-0.15, 0.04],
            [-0.125, 0.09],
            [-0.1, 0.14],
            [-0.075, 0.07],
            [-0.05, 0.11],
            [-0.03, 0.05],
          ].map(([bx, bh], i) => (
            <mesh key={i} material={materials.lcdGlow} position={[bx, 0.05, 0.035]}>
              <boxGeometry args={[0.014, bh, 0.012]} />
            </mesh>
          ))}
          {/* red activation button (clickable easter egg) */}
          <mesh
            material={materials.buttonA}
            position={[0.125, 0.05, 0.03]}
            rotation={[Math.PI / 2, 0, 0]}
            {...hotspot('chest')}
          >
            <cylinderGeometry args={[0.042, 0.042, 0.022, 16]} />
          </mesh>
        </group>

        {/* full-width front dump door in weathered body metal - sits flush
            with the body front, right in the middle of the body */}
        <group position={[0, 0.78, 0.356]} ref={door} {...doorHotspot}>
          <mesh material={materials.body} position={[0, 0.17, 0.02]} castShadow>
            <boxGeometry args={[0.96, 0.36, 0.05]} />
          </mesh>
          {/* WALL·E stencil, centered on the body front */}
          <mesh material={materials.logo} position={[0, 0.17, 0.0465]}>
            <planeGeometry args={[0.46, 0.23]} />
          </mesh>
          {/* latch tabs on the top edge */}
          {[-1, 1].map((sx) => (
            <mesh key={sx} material={materials.gunmetal} position={[sx * 0.4, 0.315, 0.045]}>
              <boxGeometry args={[0.09, 0.03, 0.035]} />
            </mesh>
          ))}
          {/* corner bolts */}
          {[
            [-0.44, 0.04],
            [0.44, 0.04],
            [-0.44, 0.3],
            [0.44, 0.3],
          ].map(([bx, by], i) => (
            <mesh key={i} material={materials.gunmetal} position={[bx, by, 0.04]}>
              <sphereGeometry args={[0.014, 8, 8]} />
            </mesh>
          ))}
        </group>
        {/* dark door cavity - hidden behind the closed door,
            reads as the interior when the door swings open */}
        <mesh material={materials.dark} position={[0, 0.95, 0.385]}>
          <boxGeometry args={[0.9, 0.34, 0.03]} />
        </mesh>

        {/* solar panel, mounted flat on the back so it never shows
            in the neck gap */}
        <group position={[0, 1.3, -0.395]} {...hotspot('lid')}>
          <mesh material={materials.dark}>
            <boxGeometry args={[0.62, 0.42, 0.03]} />
          </mesh>
          {/* panel cells */}
          {[-1, 1].map((sx) => (
            <mesh
              key={sx}
              material={materials.gunmetal}
              position={[sx * 0.15, 0, -0.022]}
            >
              <boxGeometry args={[0.27, 0.36, 0.012]} />
            </mesh>
          ))}
        </group>
        <mesh material={materials.plantGreen} position={[0, 1.35, -0.42]}>
          <sphereGeometry args={[0.018, 8, 8]} />
        </mesh>

        {/* ================= ARMS (top corners, movie look) ================= */}
        {[-1, 1].map((side) => (
          <group
            key={side}
            position={[side * 0.56, 1.42, 0.08]}
            ref={side === -1 ? armL : armR}
          >
            {/* shoulder */}
            <mesh material={materials.gunmetal} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.075, 0.075, 0.09, 14]} />
            </mesh>
            {/* upper arm */}
            <mesh material={materials.rustLight} position={[0, -0.19, 0]}>
              <cylinderGeometry args={[0.044, 0.052, 0.34, 12]} />
            </mesh>

            {/* elbow bend: forearm angles forward */}
            <group position={[0, -0.38, 0]} rotation={[-0.55, 0, 0]}>
              <mesh material={materials.gunmetal}>
                <sphereGeometry args={[0.055, 12, 12]} />
              </mesh>
              {/* forearm */}
              <mesh material={materials.rustLight} position={[0, -0.17, 0]}>
                <cylinderGeometry args={[0.038, 0.048, 0.32, 12]} />
              </mesh>

              {/* ---- plate-fork gripper (matches the physical prototype) ---- */}
              <group position={[0, -0.36, 0]} rotation={[-2.35, -side * 0.28, 0]}>
                {/* wrist disc - its axis lies along the forearm */}
                <mesh material={materials.gunmetal}>
                  <cylinderGeometry args={[0.06, 0.06, 0.055, 16]} />
                </mesh>

                {/* vertical back plate joining the prongs */}
                <mesh material={materials.gunmetal} position={[0, 0, 0.05]}>
                  <boxGeometry args={[0.3, 0.2, 0.026]} />
                </mesh>

                {/* top prong */}
                <mesh material={materials.steel} position={[0, 0.072, -0.15]}>
                  <boxGeometry args={[0.3, 0.034, 0.28]} />
                </mesh>
                {/* bottom prong */}
                <mesh material={materials.steel} position={[0, -0.072, -0.15]}>
                  <boxGeometry args={[0.3, 0.034, 0.28]} />
                </mesh>

                {/* top tip, bending down toward the gap */}
                <mesh
                  material={materials.steel}
                  position={[0, 0.031, -0.31]}
                  rotation={[-0.7, 0, 0]}
                >
                  <boxGeometry args={[0.3, 0.03, 0.085]} />
                </mesh>
                {/* bottom tip, bending up toward the gap */}
                <mesh
                  material={materials.steel}
                  position={[0, -0.031, -0.31]}
                  rotation={[0.7, 0, 0]}
                >
                  <boxGeometry args={[0.3, 0.03, 0.085]} />
                </mesh>

                {/* thumb plate on the inner side, opposing the fork */}
                <mesh
                  material={materials.rust}
                  position={[-side * 0.168, -0.02, -0.1]}
                  rotation={[0, 0, side * 0.18]}
                >
                  <boxGeometry args={[0.024, 0.115, 0.18]} />
                </mesh>
              </group>
            </group>
          </group>
        ))}
      </group>

      {/* ================= NECK + HEAD (short rusty stalk, eyes sit just above the body) ================= */}
      <mesh ref={neck} material={materials.rustLight} position={[0, 1.38, -0.06]}>
        <cylinderGeometry args={[0.055, 0.075, 0.28, 12]} />
      </mesh>

      <group ref={headGroup} position={[0, 1.74, -0.04]}>
        <group {...hotspot('head')}>
          {/* rounded boxy head in the same weathered body metal */}
          <RoundedBox
            args={[0.56, 0.35, 0.42]}
            radius={0.09}
            smoothness={4}
            position={[0, 0.02, 0.01]}
            material={materials.body}
          />
        </group>

        {/* dark slot bar across the face the eyes ride in */}
        <mesh material={materials.dark} position={[0, 0.05, 0.255]}>
          <boxGeometry args={[0.54, 0.03, 0.07]} />
        </mesh>

        {/* googly eyeballs: white balls with dark outline rings, gaze-tracked pupils */}
        {[-1, 1].map((side) => (
          <group
            key={side}
            position={[side * 0.14, 0.05, 0.235]}
            ref={side === -1 ? eyeL : eyeR}
            {...hotspot('head')}
          >
            <group ref={side === -1 ? eyeBallL : eyeBallR}>
              {/* eyeball */}
              <mesh material={materials.eyeBall} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.045, 24]} />
              </mesh>
              {/* outline ring */}
              <mesh material={materials.dark} position={[0, 0, 0.023]}>
                <torusGeometry args={[0.1, 0.016, 10, 28]} />
              </mesh>
              {/* pupil (gaze-tracked) */}
              <mesh
                ref={side === -1 ? pupilL : pupilR}
                material={materials.pupil}
                position={[0, 0, 0.026]}
              >
                <circleGeometry args={[0.06, 22]} />
              </mesh>
              {/* glint */}
              <mesh
                material={materials.eyeBall}
                position={[0.018, 0.058, 0.03]}
                scale={0.42}
              >
                <circleGeometry args={[0.045, 10]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}
