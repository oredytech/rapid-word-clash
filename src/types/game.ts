
export interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  isBeingTyped: boolean;
  typedText: string;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  level: number;
  lives: number;
  words: Word[];
  currentInput: string;
  wordsTyped: number;
  gameSpeed: number;
  spawnRate: number;
}

export interface GameStats {
  totalWordsTyped: number;
  accuracy: number;
  wpm: number;
  timeElapsed: number;
  highScore: number;
}
