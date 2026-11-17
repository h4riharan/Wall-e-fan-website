import { useEffect } from 'react'
import { useInteractionStore } from '../store/useInteractionStore'

/**
 * Streams normalized pointer position (-1..1 both axes) into the interaction
 * store so the 3D robot and fallback SVG robot can share one gaze target.
 * Listens on window so the robot follows the cursor anywhere on the page.
 */
export function useMouseGaze(): void {
  const setLook = useInteractionStore((s) => s.setLook)

  useEffect(() => {
    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setLook({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        })
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [setLook])
}
