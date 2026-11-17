import { useEffect, useRef } from 'react'
import { computePose, computeBlink, damp, ONE_SHOT_MOODS, MOOD_DURATION, REST_POSE } from '../../three/RobotAnimations'
import { useInteractionStore } from '../../store/useInteractionStore'

/**
 * Pure-SVG WALL·E fallback for machines without WebGL. Shares the exact same
 * pose state machine as the 3D robot so every mood works identically.
 */
export function SVGRobot({ className = '' }: { className?: string }) {
  const mood = useInteractionStore((s) => s.mood)
  const moodTick = useInteractionStore((s) => s.moodTick)
  const look = useInteractionStore((s) => s.look)
  const mouseTracking = useInteractionStore((s) => s.mouseTracking)

  const headRef = useRef<SVGGElement>(null)
  const pupilLRef = useRef<SVGCircleElement>(null)
  const pupilRRef = useRef<SVGCircleElement>(null)
  const eyeLRef = useRef<SVGEllipseElement>(null)
  const eyeRRef = useRef<SVGEllipseElement>(null)
  const bodyRef = useRef<SVGGElement>(null)
  const armRRef = useRef<SVGGElement>(null)
  const armLRef = useRef<SVGGElement>(null)

  const stateRef = useRef({
    moodStart: 0,
    lastTick: 0,
    effectiveMood: 'idle' as string,
    pose: { ...REST_POSE },
    blinkSeed: Math.random(),
  })

  useEffect(() => {
    const s = stateRef.current
    s.lastTick = -1 // force re-sync
  }, [])

  // keep refs in sync with store changes
  const latest = useRef({ mood, moodTick, look, mouseTracking })
  latest.current = { mood, moodTick, look, mouseTracking }

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now / 1000
      const s = stateRef.current
      const cur = latest.current

      if (s.lastTick !== cur.moodTick) {
        s.lastTick = cur.moodTick
        s.moodStart = t
        s.effectiveMood = cur.mood
      }
      if (ONE_SHOT_MOODS.includes(s.effectiveMood as never)) {
        const dur = MOOD_DURATION[s.effectiveMood as keyof typeof MOOD_DURATION] ?? 2
        if (t - s.moodStart > dur) {
          s.effectiveMood = 'idle'
          useInteractionStore.setState({ mood: 'idle' })
        }
      }

      const target = computePose(s.effectiveMood as never, t - s.moodStart, t, cur.look, cur.mouseTracking)
      const blink = computeBlink(t, s.blinkSeed, s.effectiveMood === 'sleep')
      const lid = Math.max(target.eyeLid, blink)
      const p = s.pose
      p.headYaw = damp(p.headYaw, target.headYaw, 8, dt)
      p.headPitch = damp(p.headPitch, target.headPitch, 8, dt)
      p.headRoll = damp(p.headRoll, target.headRoll, 8, dt)
      p.bodyBob = damp(p.bodyBob, target.bodyBob, 10, dt)
      p.bodyTilt = damp(p.bodyTilt, target.bodyTilt, 6, dt)
      p.armLeft = damp(p.armLeft, target.armLeft, 7, dt)
      p.armRight = damp(p.armRight, target.armRight, 7, dt)
      p.eyeSquint = damp(p.eyeSquint, target.eyeSquint, 10, dt)
      p.pupilScale = damp(p.pupilScale, target.pupilScale, 10, dt)

      const deg = (r: number) => (r * 180) / Math.PI
      headRef.current?.setAttribute(
        'transform',
        `rotate(${deg(-p.headYaw * 0.8)} 100 108) translate(${p.headForward * 20} ${p.headPitch * 14}) rotate(${deg(-p.headRoll)} 100 108)`,
      )
      const eyeOpen = Math.max(0.15, 1 - lid * 0.95 - p.eyeSquint * 0.4)
      const px = cur.look.x * 2.2
      const py = -cur.look.y * 1.8
      pupilLRef.current?.setAttribute('transform', `translate(${px} ${py}) scale(1 ${p.pupilScale})`)
      pupilRRef.current?.setAttribute('transform', `translate(${px} ${py}) scale(1 ${p.pupilScale})`)
      eyeLRef.current?.setAttribute('ry', String(5.2 * eyeOpen))
      eyeRRef.current?.setAttribute('ry', String(5.2 * eyeOpen))

      bodyRef.current?.setAttribute(
        'transform',
        `translate(0 ${p.bodyBob * 60}) rotate(${deg(-p.bodyTilt)} 100 150)`,
      )
      const wave = s.effectiveMood === 'greet' ? Math.sin(t * 9.5) * 18 * p.armRight : 0
      // SVG y-axis points down, so outward raises are mirrored vs. the 3D model
      armRRef.current?.setAttribute('transform', `rotate(${deg(-(p.armRight * 50 + wave))} 148 96)`)
      armLRef.current?.setAttribute('transform', `rotate(${deg(p.armLeft * 50)} 52 96)`)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      role="img"
      aria-label="Illustration of the WALL-E robot"
    >
      {/* ground shadow */}
      <ellipse cx="100" cy="222" rx="58" ry="7" fill="#000" opacity="0.45" />

      <g ref={bodyRef}>
        {/* tracks */}
        <g fill="#2b2720">
          <rect x="30" y="176" width="56" height="40" rx="20" />
          <rect x="114" y="176" width="56" height="40" rx="20" />
        </g>
        <g fill="#464035">
          <circle cx="58" cy="196" r="8" />
          <circle cx="86" cy="196" r="8" />
          <circle cx="142" cy="196" r="8" />
          <circle cx="170" cy="196" r="8" />
        </g>

        {/* chassis */}
        <rect x="58" y="166" width="84" height="22" rx="4" fill="#241f17" />

        {/* body */}
        <rect x="34" y="86" width="132" height="84" rx="10" fill="#e7ae0c" />
        <rect x="34" y="150" width="132" height="9" fill="#8a3c07" opacity="0.9" />
        {/* chest panel */}
        <rect x="78" y="102" width="44" height="34" rx="4" fill="#464035" />
        <circle cx="110" cy="112" r="4" fill="#e04f39" />
        <circle cx="110" cy="124" r="3" fill="#63c7e8" />
        {/* rust spots */}
        <rect x="118" y="140" width="16" height="7" rx="3" fill="#a4531b" opacity="0.8" transform="rotate(-8 126 143)" />
        <rect x="46" y="94" width="12" height="6" rx="3" fill="#8a3c07" opacity="0.7" transform="rotate(14 52 97)" />

        {/* arms with plate-fork grippers */}
        <g ref={armLRef}>
          <rect x="40" y="96" width="12" height="34" rx="6" fill="#a4531b" transform="rotate(6 46 96)" />
          <circle cx="44" cy="134" r="5" fill="#464035" />
          {/* fork: back plate, two prongs, thumb */}
          <rect x="30" y="128" width="16" height="14" rx="2" fill="#464035" />
          <rect x="16" y="127" width="15" height="4" rx="1.5" fill="#2b2720" />
          <rect x="16" y="137" width="15" height="4" rx="1.5" fill="#2b2720" />
          <rect x="32" y="140" width="4" height="12" rx="2" fill="#8a3c07" transform="rotate(10 34 146)" />
        </g>
        <g ref={armRRef}>
          <rect x="148" y="96" width="12" height="34" rx="6" fill="#a4531b" transform="rotate(-6 154 96)" />
          <circle cx="156" cy="134" r="5" fill="#464035" />
          <rect x="154" y="128" width="16" height="14" rx="2" fill="#464035" />
          <rect x="169" y="127" width="15" height="4" rx="1.5" fill="#2b2720" />
          <rect x="169" y="137" width="15" height="4" rx="1.5" fill="#2b2720" />
          <rect x="164" y="140" width="4" height="12" rx="2" fill="#8a3c07" transform="rotate(-10 166 146)" />
        </g>

        {/* neck */}
        <rect x="88" y="76" width="24" height="16" rx="3" fill="#464035" />

        {/* head */}
        <g ref={headRef}>
          <rect x="66" y="44" width="68" height="34" rx="8" fill="#e7ae0c" />
          <rect x="66" y="44" width="68" height="7" rx="3" fill="#464035" />
          {/* eyes */}
          <ellipse ref={eyeLRef} cx="84" cy="62" rx="7.5" ry="5.2" fill="#fdf6e3" />
          <ellipse ref={eyeRRef} cx="116" cy="62" rx="7.5" ry="5.2" fill="#fdf6e3" />
          <circle ref={pupilLRef} cx="84" cy="62" r="3.4" fill="#17130d" />
          <circle ref={pupilRRef} cx="116" cy="62" r="3.4" fill="#17130d" />
        </g>

        {/* solar lid */}
        <rect x="58" y="80" width="84" height="5" rx="2" fill="#241f17" />
      </g>
    </svg>
  )
}
