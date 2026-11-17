import type { CharacterProfile, TimelineEvent } from './types'

/** Crew of the story. Illustrations are original SVG art, not studio assets. */
export const CHARACTERS: CharacterProfile[] = [
  {
    id: 'wall-e',
    name: 'WALL·E',
    tagline: 'The last one working',
    role: 'Waste Allocation Load Lifter, Earth-class',
    description:
      'A rust-flecked trash compactor with binocular eyes and a heart far bigger than his chassis. After 700 years alone he collects curiosities, hoards a lighter and a tape, and dreams of something like company.',
    quote: '“Waaall·E?”',
    accent: '#f0b310',
    body: '#d9a30c',
    eye: '#2b2b2b',
  },
  {
    id: 'eve',
    name: 'EVE',
    tagline: 'The probe with a temper',
    role: 'Extraterrestrial Vegetation Evaluator',
    description:
      'A gleaming white probe flown in to search for plant life. Fast, armed, and initially all business - until one seedling and one clumsy robot teach her what the data was for.',
    quote: '“Directive? Confirm!”',
    accent: '#63c7e8',
    body: '#f6f9ff',
    eye: '#63c7e8',
  },
  {
    id: 'm-o',
    name: 'M-O',
    tagline: 'Obsessive about clean',
    role: 'Microbe Observer',
    description:
      'A rolling scrubber who speaks in sanitizer foam and cannot tolerate a speck of dirt. His brief encounter with one filthy compactor robot becomes his life’s greatest detour.',
    quote: '“Foreign contaminant!”',
    accent: '#9de24f',
    body: '#eef3e4',
    eye: '#2b2b2b',
  },
  {
    id: 'auto',
    name: 'AUTO',
    tagline: 'The wheel that never blinked',
    role: 'Axiom Autopilot',
    description:
      'A single red lens on a steering wheel, executing an order written centuries ago: never return to Earth. Obedient to the point of sabotage - the film’s quiet, mechanical villain.',
    quote: '“On the Axiom, you shall survive.”',
    accent: '#e04f39',
    body: '#3a3a3a',
    eye: '#ff2b1f',
  },
  {
    id: 'captain',
    name: 'Captain McCrea',
    tagline: 'Born to steer, learning to walk',
    role: 'Commander of the Axiom',
    description:
      'A good-natured figurehead who has never touched the deck he commands. Chasing the mystery of “Earth” gives him his first steps - and a purpose older than his job title.',
    quote: '“I don’t want to survive. I want to live!”',
    accent: '#f2e4c0',
    body: '#8fb8d8',
    eye: '#2b2b2b',
  },
  {
    id: 'john',
    name: 'John',
    tagline: 'The guy on the hover chair',
    role: "Axiom passenger - WALL·E's first human friend",
    description:
      'One of billions drifting through the Axiom on a hover chair - until a small robot tumbles into his deck, shares a video game, and reminds him what friendship feels like.',
    quote: '“Hey, buddy!”',
    accent: '#7fb8d8',
    body: '#e8b88a',
    eye: '#2b2b2b',
  },
  {
    id: 'mary',
    name: 'Mary',
    tagline: 'She finally saw the sun',
    role: 'Axiom passenger - the first to look up',
    description:
      'Headphones on, sunglasses down, cushioned into her hover chair - until a falling robot and an old video of a sunset show her the sky she had never really seen.',
    quote: '“That was fun!”',
    accent: '#e07a5f',
    body: '#f2c9a0',
    eye: '#2b2b2b',
  },
]

/** Major beats of the film, told in full - visitors came for the whole story. */
export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'te-1',
    era: 'Earth',
    year: '2105',
    title: 'Humanity departs',
    text: 'Trash buries the planet. The last humans leave on starliners while an army of compactor robots stays behind to clean up.',
  },
  {
    id: 'te-2',
    era: 'Earth',
    year: '2700-2805',
    title: 'One robot left',
    text: 'Six hundred years of routine later, a single WALL·E unit is still operating - compacting towers, collecting trinkets, waiting for something.',
  },
  {
    id: 'te-3',
    era: 'Earth',
    year: '2805',
    title: 'A probe lands',
    text: 'A rocket delivers EVE, a scanner searching for plant life. Her arrival is loud, fast, and turns one robot’s quiet world upside down.',
  },
  {
    id: 'te-4',
    era: 'Earth',
    year: '2805',
    title: 'The seedling is found',
    text: 'EVE detects a living plant sprouting from an old boot. Her Directive is confirmed - and she shuts down, carrying the discovery inside her chest cavity.',
  },
  {
    id: 'te-5',
    era: 'Space',
    year: '2805',
    title: 'To the Axiom',
    text: 'The probe ship returns, with WALL·E clinging to its hull. He crosses the galaxy just to make sure the girl who stopped moving gets back up.',
  },
  {
    id: 'te-6',
    era: 'Axiom',
    year: '2805',
    title: 'AUTO resists',
    text: 'The autopilot, bound by a standing order to never return home, works against the crew to keep the plant from changing anything.',
  },
  {
    id: 'te-7',
    era: 'Axiom',
    year: '2805',
    title: 'Hyperjump home',
    text: 'The plant is placed in the scanner, the Captain fights his way upright, and the Axiom jumps one last time - back to Earth.',
  },
  {
    id: 'te-8',
    era: 'Earth',
    year: '2805+',
    title: 'A garden begins',
    text: 'Boot in the ground, seedling in the sun. Humanity’s first step off the ship is the planet’s first step back - and WALL·E is there for it.',
  },
]
