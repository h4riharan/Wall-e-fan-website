import type { MovieFact, TriviaItem } from './types'

/** Verifiable production facts about WALL·E (2008). */
export const MOVIE_FACTS: MovieFact[] = [
  { label: 'Release Year', value: '2008' },
  { label: 'Director', value: 'Andrew Stanton' },
  { label: 'Production', value: 'Pixar Animation Studios' },
  { label: 'Distribution', value: 'Walt Disney Pictures' },
  { label: 'Genre', value: 'Animated Sci-Fi Romance / Adventure' },
  { label: 'Sound Design', value: 'Ben Burtt' },
  { label: 'Music', value: 'Thomas Newman' },
]

/** Light trivia used in the overview editorial strip. */
export const MOVIE_TRIVIA: Array<{ title: string; text: string }> = [
  {
    title: 'Nearly silent opening',
    text: "The film's first act plays out with almost no spoken dialogue - the storytelling is carried entirely by sound design, movement and expression.",
  },
  {
    title: 'The voice of WALL·E',
    text: 'Ben Burtt - the legendary sound designer behind R2-D2 - crafted WALL·E’s beeps, servos and binocular-eye whirs from thousands of synthesized and recorded sounds.',
  },
  {
    title: 'Award recognition',
    text: 'WALL·E won the Academy Award for Best Animated Feature and was praised for its environmental themes and visual restraint.',
  },
]

/** Multiple-choice quiz. Score and restart handled in the Trivia section. */
export const TRIVIA_QUESTIONS: TriviaItem[] = [
  {
    question: 'What does the name W.ALL·E stand for?',
    options: [
      'Waste Allocation Load Lifter, Earth-class',
      'Wide-Area Land Excavator, Earth-class',
      'Waste Analysis & Loading Engine, Earth-class',
      'Workplace Assistant for Loading & Emptying',
    ],
    answerIndex: 0,
    explanation: 'His full designation is Waste Allocation Load Lifter, Earth-class - a trash-compacting robot left behind to clean the planet.',
  },
  {
    question: 'Which robot is sent to Earth to scan for plant life?',
    options: ['M-O', 'GO-4', 'EVE', 'PR-T'],
    answerIndex: 2,
    explanation: 'EVE - the Extraterrestrial Vegetation Evaluator - arrives aboard a probe ship to search for signs of photosynthetic life.',
  },
  {
    question: 'What is the name of the massive starliner humanity lives aboard?',
    options: ['The Odyssey', 'The Axiom', 'The Infinity', 'The Meridian'],
    answerIndex: 1,
    explanation: 'The Axiom - a BnL luxury starliner where humans drift on hover chairs while robots take care of everything.',
  },
  {
    question: 'Who is the autopilot piloting the Axiom?',
    options: ['AUTO', 'GO-4', 'SECUR-T', 'COLT'],
    answerIndex: 0,
    explanation: 'AUTO - a red-eyed wheel resembling a certain HAL from 2001: A Space Odyssey - follows a decades-old directive to never return to Earth.',
  },
  {
    question: 'What precious item does WALL·E treasure most from his collection?',
    options: [
      'A rubber duck',
      'A spork collection',
      'An old videotape of Hello, Dolly!',
      'A Zippo lighter',
    ],
    answerIndex: 2,
    explanation: 'WALL·E watches Hello, Dolly! over and over - the musical numbers become the emotional heart of the film.',
  },
  {
    question: 'Who designed the voice and sounds of WALL·E?',
    options: [
      'Hans Zimmer',
      'Ben Burtt',
      'Randy Newman',
      'Walter Murch',
    ],
    answerIndex: 1,
    explanation: 'Ben Burtt, famed for Star Wars sound design, gave WALL·E his expressive beeps and mechanical voice.',
  },
  {
    question: 'Which tiny robot follows WALL·E around, obsessed with cleanliness?',
    options: ['M-O', 'BRL-A', 'VN-GO', 'SPR-A'],
    answerIndex: 0,
    explanation: 'M-O - the Microbe Observer - scrubs anything "foreign contaminant", including a certain dusty trash compactor.',
  },
  {
    question: 'In which year does the story of WALL·E take place?',
    options: ['2505', '2705', '2805', '3005'],
    answerIndex: 2,
    explanation: 'The story is set in 2805 - seven centuries after Earth was covered in trash and abandoned.',
  },
  {
    question: 'Who directed WALL·E?',
    options: [
      'Pete Docter',
      'John Lasseter',
      'Andrew Stanton',
      'Brad Bird',
    ],
    answerIndex: 2,
    explanation: 'Andrew Stanton wrote and directed WALL·E, years after directing Finding Nemo.',
  },
  {
    question: 'What makes the Captain finally stand up and walk?',
    options: [
      'An exercise program',
      'The discovery of the plant and fight for it',
      'A malfunction in his chair',
      'AUTO’s orders',
    ],
    answerIndex: 1,
    explanation: 'The struggle over the plant pulls the Captain out of his hover chair - his first true steps in a lifetime.',
  },
]
