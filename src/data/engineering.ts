import type { EngineeringPart, PlaygroundCommand } from './types'

/**
 * Real robotics concepts explained in the engineering section.
 * `movieNote` explicitly marks where fiction is referenced - never presented
 * as a specification of the movie robot.
 */
export const ENGINEERING_PARTS: EngineeringPart[] = [
  {
    id: 'tracks',
    name: 'Tracked Movement',
    short: 'Treads grip loose, rough ground where wheels slip.',
    detail:
      'Continuous tracks spread the robot’s weight over a large contact area, letting it climb over rubble and loose soil. Each tread loop is driven by a sprocket wheel and tensioned against idler wheels - exactly the layout we prototype with 3D-printed track links.',
    movieNote: 'Movie link: WALL·E’s treads let him climb trash piles in the film - an inspired design choice, not a spec sheet.',
    icon: 'tracks',
  },
  {
    id: 'dc-motors',
    name: 'DC Motors',
    short: 'Brushed DC motors convert current into rotation.',
    detail:
      'A brushed DC motor spins when current flows through its coil inside a magnetic field. Speed tracks voltage; direction flips with polarity. Gear motors - DC motors with a built-in gearbox - trade raw speed for torque, which is what small robots actually need to push, lift and climb.',
    movieNote: 'Movie link: the whir of WALL·E’s drive treads is what makes him feel alive.',
    icon: 'motor',
  },
  {
    id: 'motor-drivers',
    name: 'Motor Drivers',
    short: 'The amplifier between the brain and the brawn.',
    detail:
      'Microcontroller pins are too weak to power motors directly. Motor driver boards (like H-bridge chips) act as switches and amplifiers: they take tiny logic signals and deliver the high current a motor needs, and they reverse polarity so one signal line can make a motor spin forward or backward.',
    movieNote: 'Movie link: every smooth stop-and-turn you see in the film implies a driver stage like this.',
    icon: 'driver',
  },
  {
    id: 'microcontroller',
    name: 'Microcontroller',
    short: 'The brain running the robot’s behavior loop.',
    detail:
      'A microcontroller is a small computer on one chip: processor, memory and I/O pins. Our build runs a simple loop - read sensors, decide behavior, command motors - thousands of times per second. All of WALL·E’s “personality” is code: timers, state machines and thresholds, not magic.',
    movieNote: 'Movie link: the character’s quirks feel scripted - because, technically, they are.',
    icon: 'brain',
  },
  {
    id: 'ultrasonic',
    name: 'Ultrasonic Sensors',
    short: 'Sonar for avoiding obstacles.',
    detail:
      'The sensor emits an ultrasonic pulse and times the echo. Distance = speed of sound × round-trip time ÷ 2. Two or three of these give a cheap 360° “ hearing” that lets a robot dodge trash piles, furniture and feet without a camera.',
    movieNote: 'Movie link: think of WALL·E navigating a cluttered street without bumping into a single pile.',
    icon: 'sonar',
  },
  {
    id: 'servos',
    name: 'Servo Motors',
    short: 'Motors that move to an angle and hold it.',
    detail:
      'A servo is a motor + gearbox + position sensor + control circuit in one package. You send a pulse-width signal (usually 500-2500 µs) and the servo rotates to the matching angle and resists being pushed off it - perfect for arms, heads and grippers.',
    movieNote: 'Movie link: WALL·E’s arm reaching out to touch a hand is a servo holding a commanded angle.',
    icon: 'servo',
  },
  {
    id: 'vision',
    name: 'Cameras & Vision',
    short: 'Giving the robot something to “see” with.',
    detail:
      'A small camera module streams frames to the microcontroller, which can detect edges, faces or colors with lightweight computer vision. Even simple routines - “follow the brightest blob” - create surprisingly lifelike behavior, like eyes that track you across the room.',
    movieNote: 'Movie link: WALL·E’s binocular eyes could zoom and squint - expression through optics.',
    icon: 'camera',
  },
  {
    id: 'power',
    name: 'Battery & Power',
    short: 'An energy budget decides everything.',
    detail:
      'Every design choice is downstream of the battery: motor stall currents, sensor draw, processor load. Our build uses rechargeable Li-ion cells through a regulator, with solar charging as a nod to the film - WALL·E wakes up each morning by folding out his solar panels.',
    movieNote: 'Movie link: the sunrise charging scene is fiction, but the engineering behind it is real.',
    icon: 'battery',
  },
]

/** Buttons in the Play With WALL·E section. */
export const PLAYGROUND_COMMANDS: PlaygroundCommand[] = [
  { id: 'hello', label: 'Say Hello', mood: 'greet', icon: 'hand', sound: 'greet', caption: "WALL·E raises an arm - 'Hello!'" },
  { id: 'happy', label: 'Happy', mood: 'happy', icon: 'smile', sound: 'happy', caption: 'A delighted bounce and a bright chirp.' },
  { id: 'curious', label: 'Curious', mood: 'curious', icon: 'search', sound: 'curious', caption: 'Head tilts. Zoom in. What is this?' },
  { id: 'sleep', label: 'Sleep', mood: 'sleep', icon: 'moon', sound: 'sleep', caption: 'Eyes dim. Solar panels out. Zzz.' },
  { id: 'left', label: 'Look Left', mood: 'lookLeft', icon: 'arrowLeft', sound: 'servo', caption: 'Treads idle. Optics swing left.' },
  { id: 'right', label: 'Look Right', mood: 'lookRight', icon: 'arrowRight', sound: 'servo', caption: 'Treads idle. Optics swing right.' },
  { id: 'explore', label: 'Explore', mood: 'explore', icon: 'compass', sound: 'explore', caption: 'Wheels spin. New territory to scan.' },
  { id: 'dance', label: 'Dance', mood: 'dance', icon: 'music', sound: 'dance', caption: 'Put on your Sunday clothes…' },
]

/**
 * Everything WALL·E understands - both spoken phrases and quick-question
 * chips. `reply` is his (spoken) answer; specific questions are matched
 * before generic action words.
 */
export interface VoiceIntent {
  match: RegExp
  mood: import('../store/useInteractionStore').RobotMood
  label: string
  /** What WALL·E answers (shown as caption + spoken via TTS when sound is on). */
  reply: string
  /** Show as a quick-question chip under the command deck. */
  chip?: boolean
}

export const VOICE_INTENTS: VoiceIntent[] = [
  {
    match: /\bdo you love\b|\bin love\b/i,
    mood: 'happy',
    label: 'Do you love EVE?',
    reply: 'Yes. I do. I followed her across the whole galaxy just to hold her hand.',
  },
  {
    match: /\bwhere is eve\b|\bwhere('s| is) eve\b/i,
    mood: 'curious',
    label: 'Where is EVE?',
    reply: 'Up there somewhere, scanning the sky. She always comes back to me.',
  },
  {
    match: /\bwho are you\b|\byour name\b/i,
    mood: 'greet',
    label: 'Who are you?',
    reply: "I'm WALL·E - Waste Allocation Load Lifter, Earth-class. Seven hundred years on the job, and still curious.",
    chip: true,
  },
  {
    match: /\bindhu\b|\bindu\b|\bindo\b/i,
    mood: 'greet',
    label: 'Who is Indhu?',
    reply: 'She is a wonderful women who created this site out of curiosity, you can look around, she might be standing nearby',
  },
  {
    match: /\bjohn\b/i,
    mood: 'happy',
    label: 'Who is John?',
    reply: 'John - a passenger on the Axiom. He was floating through life on a hover chair until a small robot bumped into his deck. My first human friend!',
  },
  {
    match: /\bmarry\b|\bmary\b/i,
    mood: 'happy',
    label: 'Who is Mary?',
    reply: 'Mary - another Axiom passenger, big white sunglasses. One look at a sunset through my tape, and she saw the world for the first time.',
  },
  {
    match: /\bhow are you\b|\bhow('s| is) it going\b|\bhow do you feel\b/i,
    mood: 'greet',
    label: 'How are you?',
    reply: 'I am good! Treads a little dusty, optics a little cracked - but happy. Very happy.',
  },
  {
    match: /\bhow old\b/i,
    mood: 'curious',
    label: 'How old are you?',
    reply: 'Seven hundred years old. My treads creak, but my heart still works.',
  },
  {
    match: /\blonely\b|\balone\b/i,
    mood: 'sleep',
    label: 'Are you lonely?',
    reply: 'Sometimes. That is why I keep a tape playing and a roach nearby. And now - you.',
  },
  {
    match: /\bfav(ourite|orite) colou?r\b/i,
    mood: 'happy',
    label: 'Favorite color?',
    reply: 'Yellow! The color of a good sunset, and of one very good robot.',
  },
  {
    match: /\bb ?n ?l\b|\bbuy ?n ?large\b/i,
    mood: 'curious',
    label: 'What is BnL?',
    reply: 'Buy n Large. They made everything - the starliners, the robots, and the giant mess I get to clean up.',
  },
  {
    match: /\baxiom\b/i,
    mood: 'curious',
    label: 'What is the Axiom?',
    reply: 'The Axiom - a luxury starliner where humanity drifted for seven centuries while I cleaned up below.',
  },
  {
    match: /\bwhat happened to earth\b|\bwhy did (people|humans|everyone) leave\b|\bearth abandoned\b/i,
    mood: 'sleep',
    label: 'What happened to Earth?',
    reply: 'People bought too much and moved too little. Earth drowned in trash, so everyone left. Somebody had to stay and tidy up.',
  },
  {
    match: /\bcollect\b|\bhobbies?\b|\btreasure\b/i,
    mood: 'curious',
    label: 'What do you collect?',
    reply: 'Lighters, sporks, bubble wrap, a Rubik cube I cannot solve. Every trash cube gets a treasure hidden inside.',
  },
  {
    match: /\bjoke\b|\bfunny\b|\bmake me laugh\b/i,
    mood: 'happy',
    label: 'Tell me a joke',
    reply: 'Why did the robot go on vacation? He needed to recharge! ...I will keep my day job. Compacting.',
  },
  {
    match: /\beve\b/i,
    mood: 'happy',
    label: 'Who is EVE?',
    reply: 'EVE. Extraterrestrial Vegetation Evaluator. Fast, bright, and the best thing that ever landed on my street.',
    chip: true,
  },
  {
    match: /\bm-?o\b/i,
    mood: 'curious',
    label: 'Who is M-O?',
    reply: 'M-O - Microbe Observer. He truly cannot stand dirt. Especially mine.',
    chip: true,
  },
  {
    match: /\bauto\b/i,
    mood: 'curious',
    label: 'Who is AUTO?',
    reply: 'AUTO runs the Axiom. A wheel with one red eye, carrying orders nobody questioned for seven hundred years.',
    chip: true,
  },
  {
    match: /\bcaptain\b|\bmccrea\b/i,
    mood: 'happy',
    label: 'Who is the Captain?',
    reply: 'Captain McCrea - commander of the Axiom, and the first human in centuries to stand up and walk.',
    chip: true,
  },
  {
    match: /\bdirective\b|\byour job\b|\bwhat do you do\b/i,
    mood: 'greet',
    label: "What's your directive?",
    reply: 'Directive? Compacting trash into neat cubes. But collecting curiosities - that is the fun part.',
    chip: true,
  },
  {
    match: /\bplant\b|\bseedling\b/i,
    mood: 'curious',
    label: 'What about the plant?',
    reply: 'One small seedling, growing in an old boot. Proof that Earth could grow again.',
  },
  {
    match: /\bcockroach\b|\broach\b|\bfriend\b/i,
    mood: 'happy',
    label: 'Who is your friend?',
    reply: 'My best friend? A cockroach. Great listener. Very hard to squash.',
  },
  {
    match: /\bhello,? dolly\b|\bsing\b|\bsong\b/i,
    mood: 'dance',
    label: 'Sing!',
    reply: 'Put on your Sunday clothes - there is lots of world out there!',
  },
  {
    match: /\bthank(s| you)\b/i,
    mood: 'happy',
    label: 'Thank you',
    reply: 'Brrring! You are welcome!',
  },
  {
    match: /\b(bye|goodbye|see you)\b/i,
    mood: 'greet',
    label: 'Goodbye',
    reply: 'Buh-bye! Come back soon - I will keep the tape running.',
  },
  {
    match: /\b(hello|hi|hey|greetings)\b/i,
    mood: 'greet',
    label: 'Say Hello',
    reply: 'Waaall-E? Hello!',
  },
  { match: /\b(happy|smile|great|good robot)\b/i, mood: 'happy', label: 'Happy', reply: 'Woo-hoo!' },
  { match: /\b(curious|what('?s| is) (this|that))\b/i, mood: 'curious', label: 'Curious', reply: 'Huh? What is that?' },
  { match: /\b(sleep|nap|good ?night|tired)\b/i, mood: 'sleep', label: 'Sleep', reply: 'Zzz… solar charging.' },
  { match: /\b(look ?left|turn left|left)\b/i, mood: 'lookLeft', label: 'Look Left', reply: 'Scanning left…' },
  { match: /\b(look ?right|turn right|right)\b/i, mood: 'lookRight', label: 'Look Right', reply: 'Scanning right…' },
  { match: /\b(explore|go|search|roll out)\b/i, mood: 'explore', label: 'Explore', reply: 'Directive: explore. Searching…' },
  { match: /\b(dance|music|jig)\b/i, mood: 'dance', label: 'Dance', reply: 'Put on your Sunday clothes…' },
]
