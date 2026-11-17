import Lenis from 'lenis'

/** Expose the active Lenis instance for programmatic scrolling helpers. */
export function registerLenisInstance(lenis: Lenis): void {
  ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
}
