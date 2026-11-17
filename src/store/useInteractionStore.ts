import { create } from 'zustand'
import { getReducedMotion } from '../hooks/useReducedMotion'

/** Every expression / behavior the virtual WALL-E can perform. */
export type RobotMood =
  | 'idle'
  | 'greet'
  | 'happy'
  | 'curious'
  | 'sleep'
  | 'dance'
  | 'lookLeft'
  | 'lookRight'
  | 'explore'

/** How the 3D (or SVG fallback) robot should orient its gaze. Normalized -1..1. */
export interface LookTarget {
  x: number
  y: number
}

interface InteractionState {
  /** Current expression - drives 3D + fallback robot + caption text. */
  mood: RobotMood
  /** Monotonic counter so repeated clicks on the same mood re-trigger. */
  moodTick: number
  /** Pointer-driven gaze target (used by 3D robot eye tracking). */
  look: LookTarget
  /** Whether the robot should auto-track the mouse with its eyes/head. */
  mouseTracking: boolean
  /** Sound is OFF until the visitor explicitly enables it. */
  soundEnabled: boolean
  /** Honors prefers-reduced-motion; detected once at startup. */
  reducedMotion: boolean
  /** Latest human-readable status line shown near the robot ("WALL-E: ..."). */
  caption: string
  /** Bump when a 3D hotspot is clicked (used to flash UI). */
  hotspotTick: number

  setMood: (mood: RobotMood, caption?: string) => void
  setLook: (look: LookTarget) => void
  setMouseTracking: (on: boolean) => void
  toggleSound: () => void
  setSound: (on: boolean) => void
  setCaption: (caption: string) => void
  pingHotspot: () => void
}

const MOOD_CAPTIONS: Partial<Record<RobotMood, string>> = {
  greet: "WALL·E? Hello!",
  happy: "Waaall-E!",
  curious: "Huh? What's that?",
  sleep: 'Zzz… solar charging.',
  dance: "Put on your Sunday clothes…",
  lookLeft: 'Scanning left…',
  lookRight: 'Scanning right…',
  explore: 'Directive: explore. Searching…',
}

export const useInteractionStore = create<InteractionState>((set) => ({
  mood: 'idle',
  moodTick: 0,
  look: { x: 0, y: 0 },
  mouseTracking: true,
  soundEnabled: false,
  reducedMotion: getReducedMotion(),
  caption: 'Directive: keep exploring.',
  hotspotTick: 0,

  setMood: (mood, caption) =>
    set((s) => ({
      mood,
      moodTick: s.moodTick + 1,
      caption: caption ?? MOOD_CAPTIONS[mood] ?? s.caption,
    })),
  setLook: (look) => set({ look }),
  setMouseTracking: (on) => set({ mouseTracking: on }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setSound: (on) => set({ soundEnabled: on }),
  setCaption: (caption) => set({ caption }),
  pingHotspot: () => set((s) => ({ hotspotTick: s.hotspotTick + 1 })),
}))
