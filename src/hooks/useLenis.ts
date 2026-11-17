import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { getReducedMotion } from './useReducedMotion'
import { registerLenisInstance } from './registerLenisInstance'

/**
 * Boots Lenis smooth scrolling and syncs it with GSAP ScrollTrigger.
 * Disabled entirely for users who prefer reduced motion.
 */
export function useLenis(): void {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (getReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis
    registerLenisInstance(lenis)

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Keep ScrollTrigger in lockstep with Lenis' virtual scroll
    let cleanupGsap: (() => void) | undefined
    void import('gsap').then(({ gsap }) =>
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.lagSmoothing(0)
        cleanupGsap = () => {
          lenis.off('scroll', ScrollTrigger.update)
        }
      }),
    )

    return () => {
      cancelAnimationFrame(rafId)
      cleanupGsap?.()
      lenis.destroy()
      lenisRef.current = null
      ;(window as unknown as { __lenis?: Lenis }).__lenis = undefined
    }
  }, [])
}

/** Smooth-scrolls to an element id via Lenis (falls back to native). */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  if (getReducedMotion()) {
    el.scrollIntoView()
    return
  }
  // Lenis attaches to the window; find the running instance via the global
  // event it dispatches, else use native smooth scrolling.
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset: -24, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
