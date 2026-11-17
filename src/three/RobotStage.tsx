import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { useInteractionStore } from '../store/useInteractionStore'
import { SVGRobot } from '../components/character/SVGRobot'
import { subscribeReducedMotion } from '../hooks/useReducedMotion'

/** Lazy-loaded 3D bundle - keeps three.js out of the initial payload. */
const RobotScene = lazy(() => import('./RobotScene').then((m) => ({ default: m.RobotScene })))

/** Catches any render/WebGL runtime error inside the Canvas tree. */
class RobotErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function LoadingBot() {
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden="true">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <span className="h-6 w-9 animate-bounce rounded-full border border-cream/25 bg-charcoal-raised [animation-delay:0ms]" />
          <span className="h-6 w-9 animate-bounce rounded-full border border-cream/25 bg-charcoal-raised [animation-delay:150ms]" />
        </div>
        <p className="text-label text-cream/40">Booting WALL·E…</p>
      </div>
    </div>
  )
}

interface RobotStageProps {
  /** Extra classes for the 3D viewport wrapper. */
  className?: string
  showCaption?: boolean
}

/**
 * The virtual WALL·E. Renders the 3D scene when WebGL is available and healthy,
 * otherwise falls back to the original SVG robot - same moods, same gaze.
 */
export function RobotStage({ className = '', showCaption = true }: RobotStageProps) {
  const { supported } = useWebGLSupport()
  const [use3D, setUse3D] = useState(false)
  const caption = useInteractionStore((s) => s.caption)
  const mood = useInteractionStore((s) => s.mood)

  // re-check support if the OS-level preference changes
  useEffect(() => subscribeReducedMotion(() => setUse3D((v) => v)), [])

  useEffect(() => {
    if (supported !== null) setUse3D(supported)
  }, [supported])

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className="relative flex-1">
        {use3D ? (
          <RobotErrorBoundary onError={() => setUse3D(false)}>
            <Suspense fallback={<LoadingBot />}>
              <RobotScene />
            </Suspense>
          </RobotErrorBoundary>
        ) : supported === null ? (
          <LoadingBot />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <SVGRobot className="h-full max-h-[560px] w-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]" />
          </div>
        )}

        {/* status readout */}
        {showCaption && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="glass-panel flex items-center gap-2.5 rounded-full px-4 py-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  mood === 'sleep' ? 'bg-cream/30' : 'bg-plant animate-pulse'
                }`}
                aria-hidden="true"
              />
              <span className="font-mono text-[0.62rem] tracking-[0.18em] text-cream/80 uppercase">
                {caption}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
