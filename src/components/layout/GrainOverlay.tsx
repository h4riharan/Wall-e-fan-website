/** Full-viewport film-grain + vignette overlay. Purely decorative. */
export function GrainOverlay() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <div
        className="cinematic-vignette pointer-events-none fixed inset-0 z-50"
        aria-hidden="true"
      />
    </>
  )
}
