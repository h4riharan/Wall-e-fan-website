import { useEffect, useState } from 'react'

export interface WebGLStatus {
  /** null = still checking, true/false = result. */
  supported: null | boolean
}

/**
 * Checks that the browser can create a WebGL2 (or WebGL1) context with a
 * reasonable attribute set, without actually booting three.js.
 */
export function useWebGLSupport(): WebGLStatus {
  const [supported, setSupported] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    const check = () => {
      try {
        const canvas = document.createElement('canvas')
        const attrs: WebGLContextAttributes = {
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'low-power',
        }
        const gl2 = canvas.getContext('webgl2', attrs)
        const gl1 = gl2 ? null : canvas.getContext('webgl', attrs)
        const ok = Boolean(gl2 ?? gl1)
        // release immediately
        if (gl2) gl2.getExtension('WEBGL_lose_context')?.loseContext()
        if (gl1) gl1.getExtension('WEBGL_lose_context')?.loseContext()
        if (!cancelled) setSupported(ok)
      } catch {
        if (!cancelled) setSupported(false)
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [])

  return { supported }
}
