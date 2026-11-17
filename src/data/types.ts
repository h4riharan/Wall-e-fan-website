/** Shared data contracts. Data lives here; components stay presentational. */

export interface MovieFact {
  label: string
  value: string
}

export interface TriviaItem {
  question: string
  options: [string, string, string, string]
  answerIndex: 0 | 1 | 2 | 3
  /** One-line "did you know" shown after answering. */
  explanation: string
}

export interface UniverseChapter {
  id: string
  index: string
  title: string
  subtitle: string
  body: string
  /** Distinguishes real production facts from in-universe fiction. */
  kind: 'movie-fact' | 'in-universe'
  /** Palette key for the chapter's generative backdrop. */
  scene: 'earth' | 'city' | 'work' | 'plant' | 'axiom' | 'home'
  stats?: Array<{ label: string; value: string }>
}

export interface CharacterProfile {
  id: string
  name: string
  tagline: string
  role: string
  description: string
  quote: string
  /** Tailwind-ready palette for the SVG illustration. */
  accent: string
  body: string
  eye: string
}

export interface TimelineEvent {
  id: string
  era: string
  year: string
  title: string
  text: string
}

export interface EngineeringPart {
  id: string
  name: string
  short: string
  detail: string
  movieNote: string
  icon: string
}

export interface PlaygroundCommand {
  id: string
  label: string
  mood: import('../store/useInteractionStore').RobotMood
  icon: string
  sound: string
  caption: string
}

export interface QuizState {
  index: number
  selected: number | null
  score: number
  answered: boolean
  finished: boolean
}
