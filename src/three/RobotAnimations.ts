import type { RobotMood, LookTarget } from '../store/useInteractionStore'

/**
 * Pose evaluated every frame for the virtual robot. Both the 3D model and the
 * SVG fallback derive their motion from this one state machine.
 */
export interface RobotPose {
  headYaw: number
  headPitch: number
  headRoll: number
  headForward: number
  neckStretch: number
  /** 0 = eyes open, 1 = fully closed */
  eyeLid: number
  /** squint amount 0..1 (happy) */
  eyeSquint: number
  pupilScale: number
  bodyBob: number
  bodyTilt: number
  armLeft: number
  armRight: number
  /** radians per second the treads spin */
  trackSpin: number
}

export const REST_POSE: RobotPose = {
  headYaw: 0,
  headPitch: 0,
  headRoll: 0,
  headForward: 0,
  neckStretch: 1,
  eyeLid: 0,
  eyeSquint: 0,
  pupilScale: 1,
  bodyBob: 0,
  bodyTilt: 0,
  armLeft: 0,
  armRight: 0,
  trackSpin: 0,
}

/** How long one-shot moods play before returning to idle (seconds). */
export const MOOD_DURATION: Partial<Record<RobotMood, number>> = {
  greet: 2.2,
  happy: 2.4,
  curious: 3.0,
  lookLeft: 1.6,
  lookRight: 1.6,
  explore: 3.4,
}

export const ONE_SHOT_MOODS = Object.keys(MOOD_DURATION) as RobotMood[]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3)

/**
 * @param mood    current mood
 * @param phase   seconds since the mood started
 * @param t       absolute clock (for idle breathing)
 * @param look    normalized gaze target (-1..1)
 */
export function computePose(
  mood: RobotMood,
  phase: number,
  t: number,
  look: LookTarget,
  mouseTracking: boolean,
): RobotPose {
  const p: RobotPose = { ...REST_POSE }

  // Shared idle life: gentle bob + slow sway of attention
  p.bodyBob = Math.sin(t * 1.7) * 0.008
  p.headYaw += Math.sin(t * 0.4) * 0.04
  p.headPitch += Math.sin(t * 0.53 + 1.2) * 0.02

  // Gaze blend (used by idle & one-shots unless overridden below)
  const gazeYaw = mouseTracking ? look.x * 0.42 : 0
  const gazePitch = mouseTracking ? look.y * 0.2 : 0

  switch (mood) {
    case 'idle': {
      p.headYaw += gazeYaw
      p.headPitch += gazePitch
      break
    }

    case 'greet': {
      const k = easeOut(phase / 0.5) * easeOut((2.2 - phase) / 0.6)
      p.armRight = k
      // wave
      p.headRoll += Math.sin(phase * 7) * 0.06 * k
      p.headYaw += gazeYaw * 0.4
      p.headPitch += gazePitch * 0.4
      p.eyeSquint = 0.25 * k
      p.headPitch += 0.04 * k
      break
    }

    case 'happy': {
      const decay = clamp(1 - phase / 2.4, 0, 1)
      p.bodyBob += Math.abs(Math.sin(phase * 7.5)) * 0.055 * decay
      p.eyeSquint = 0.55
      p.pupilScale = 1.15
      p.headRoll += 0.1 * decay
      p.armLeft = 0.5 * decay
      p.armRight = 0.5 * decay
      p.headYaw += gazeYaw * 0.3
      p.headPitch += 0.05
      break
    }

    case 'curious': {
      const k = easeOut(phase / 0.6)
      p.headForward = 0.09 * k
      p.neckStretch = 1 + 0.05 * k
      p.headPitch -= 0.12 * k
      p.headYaw += Math.sin(phase * 1.1) * 0.28 * k
      p.pupilScale = 1.25
      p.eyeSquint = 0.1
      break
    }

    case 'sleep': {
      p.eyeLid = 1
      p.bodyBob += Math.sin(t * 1.1) * 0.012
      p.headPitch += 0.16
      p.headYaw = Math.sin(t * 0.25) * 0.05
      p.armLeft = -0.06
      p.armRight = -0.06
      break
    }

    case 'dance': {
      const beat = phase * 3.4
      p.bodyTilt = Math.sin(beat) * 0.13
      p.bodyBob += Math.abs(Math.sin(beat * 2)) * 0.03
      p.headRoll += Math.sin(beat) * 0.12
      p.headYaw += Math.sin(beat * 0.5) * 0.2
      p.armLeft = 0.55 + Math.sin(beat * 2) * 0.35
      p.armRight = 0.55 + Math.sin(beat * 2 + Math.PI) * 0.35
      p.eyeSquint = 0.35
      p.trackSpin = Math.sin(beat) * 1.2
      break
    }

    case 'lookLeft': {
      const k = easeOut(phase / 0.7)
      p.headYaw = -0.55 * k
      p.headRoll += -0.05 * k
      break
    }

    case 'lookRight': {
      const k = easeOut(phase / 0.7)
      p.headYaw = 0.55 * k
      p.headRoll += 0.05 * k
      break
    }

    case 'explore': {
      // treads drive, head scans the horizon
      const leg = Math.floor(phase / 1.2) % 2 === 0 ? 1 : -1
      p.trackSpin = 2.6 * leg
      p.headYaw += Math.sin(phase * 1.6) * 0.4
      p.headPitch += Math.sin(phase * 2.3) * 0.06
      p.bodyBob += Math.sin(phase * 9) * 0.006
      break
    }
  }

  return p
}

/** Schedules natural blinking. Returns lid override 0..1 for this frame. */
export function computeBlink(t: number, blinkSeed: number, sleeping: boolean): number {
  if (sleeping) return 0 // pose already forces eyes closed
  const cycle = 3.1 + blinkSeed * 0.7
  const phaseT = t % cycle
  const blinkAt = cycle * 0.82
  const dt = phaseT - blinkAt
  if (dt > 0 && dt < 0.22) {
    // quick close-open envelope
    const k = Math.sin((dt / 0.22) * Math.PI)
    return k
  }
  return 0
}

/** Spring-free exponential smoothing helper. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}
