export type Direction =
  | 'horizontal'
  | 'vertical'
  | 'diagonal-down'
  | 'diagonal-up'
  | 'horizontal-reverse'
  | 'vertical-reverse'
  | 'diagonal-down-reverse'
  | 'diagonal-up-reverse';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GameWord {
  term: string;        // The word as placed in grid (no spaces, uppercase)
  displayTerm: string; // Human-readable version (e.g. 'Self Custody')
  definition: string;
  category: string;
  resourceUrl?: string;
}

export interface GameLevel {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  gridSize: number;
  words: GameWord[];
  learningObjective: string;
  allowedDirections: Direction[];
  maxHints: number;
  estimatedMinutes: number;
}

export interface PlacedWord {
  word: string;
  displayTerm: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  cells: Array<{ row: number; col: number }>;
}

export interface GeneratedPuzzle {
  grid: string[][];
  placedWords: PlacedWord[];
  gridSize: number;
  seed: number;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface SelectionResult {
  isValid: boolean;
  word?: string;
  displayTerm?: string;
  placedWord?: PlacedWord;
  alreadyFound?: boolean;
}

export interface ScoreConfig {
  wordFound: number;
  levelComplete: number;
  noHintsBonus: number;
  dailyChallengeBonus: number;
  categoryCompleteBonus: number;
}

export interface GameSessionState {
  levelId: number;
  foundWords: string[];
  score: number;
  hintsUsed: number;
  startTime: number;
  elapsedSeconds: number;
  status: 'playing' | 'paused' | 'completed';
}
