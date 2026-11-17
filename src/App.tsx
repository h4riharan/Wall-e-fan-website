import { useLenis } from './hooks/useLenis'
import { useMouseGaze } from './hooks/useMouseGaze'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { GrainOverlay } from './components/layout/GrainOverlay'
import { Hero } from './sections/Hero'
import { MovieOverview } from './sections/MovieOverview'
import { Universe } from './sections/Universe'
import { Characters } from './sections/Characters'
import { Timeline } from './sections/Timeline'
import { Engineering } from './sections/Engineering'
import { Playground } from './sections/Playground'
import { Trivia } from './sections/Trivia'

export default function App() {
  useLenis()
  useMouseGaze()

  return (
    <div className="relative min-h-screen bg-charcoal">
      <a
        href="#movie"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-yellow-walle focus:px-4 focus:py-2 focus:text-charcoal"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <MovieOverview />
        <Universe />
        <Characters />
        <Playground />
        <Timeline />
        <Engineering />
        <Trivia />
      </main>
      <Footer />
      <GrainOverlay />
    </div>
  )
}
