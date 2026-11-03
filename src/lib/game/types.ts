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

/** A single puzzle set within a difficulty tier */
export interface GameSet {
  id: string;          // e.g. 'beginner-1'
  setNumber: number;   // 1, 2, 3, …
  title: string;
  description: string;
  gridSize: number;
  words: GameWord[];
  learningObjective: string;
  maxHints: number;
  estimatedMinutes: number;
  /** Sats awarded per word found */
  satsPerWord: number;
  /** Sats bonus for completing the set */
  completionSats: number;
  /** Sats bonus for finishing with no hints */
  noHintsBonus: number;
}

/** A difficulty tier containing multiple game sets */
export interface GameTier {
  difficulty: Difficulty;
  slug: string;           // e.g. 'beginner'
  label: string;          // e.g. 'Beginner'
  tagline: string;
  icon: string;           // emoji icon
  allowedDirections: Direction[];
  sets: GameSet[];
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
  satsPerWord: number;
  completionSats: number;
  noHintsBonus: number;
  dailyChallengeBonus: number;
  categoryCompleteBonus: number;
  timeBonusPerSecondSaved: number;
}

export interface GameSessionState {
  tierId: Difficulty;
  setId: string;
  foundWords: string[];
  satsEarned: number;
  hintsUsed: number;
  startTime: number;
  elapsedSeconds: number;
  status: 'playing' | 'paused' | 'completed';
}

/** Legacy support — individual level (maps to a GameSet) */
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
