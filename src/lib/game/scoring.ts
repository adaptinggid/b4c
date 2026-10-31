import { ScoreConfig } from './types';

/**
 * Default score configuration for the Bitcoin Word Search game.
 */
export const DEFAULT_SCORE_CONFIG: ScoreConfig = {
  wordFound: 10,
  levelComplete: 50,
  noHintsBonus: 25,
  dailyChallengeBonus: 100,
  categoryCompleteBonus: 150,
};

/**
 * Calculates score earned for finding a single word.
 *
 * @param config Optional score configuration (defaults to DEFAULT_SCORE_CONFIG)
 * @returns Points awarded for finding a word
 */
export function calculateWordScore(config: ScoreConfig = DEFAULT_SCORE_CONFIG): number {
  return config.wordFound;
}

/**
 * Calculates the score awarded when completing a level, including the zero-hints bonus.
 *
 * @param hintsUsed Number of hints used during the level
 * @param config Optional score configuration (defaults to DEFAULT_SCORE_CONFIG)
 * @returns Total level completion points including hint bonus if applicable
 */
export function calculateLevelCompleteScore(
  hintsUsed: number,
  config: ScoreConfig = DEFAULT_SCORE_CONFIG
): number {
  const baseScore = config.levelComplete;
  const noHintsBonus = hintsUsed === 0 ? config.noHintsBonus : 0;
  return baseScore + noHintsBonus;
}

/**
 * Calculates a time bonus if the player completes the puzzle faster than the estimated time.
 * Awards 1 point for every 2 seconds saved under the estimated duration.
 *
 * @param elapsedSeconds Actual time taken in seconds
 * @param estimatedMinutes Estimated completion duration in minutes
 * @returns Bonus points earned (0 if elapsed time >= estimated time)
 */
export function calculateTimeBonus(elapsedSeconds: number, estimatedMinutes: number): number {
  const estimatedSeconds = estimatedMinutes * 60;
  if (estimatedSeconds <= 0 || elapsedSeconds <= 0 || elapsedSeconds >= estimatedSeconds) {
    return 0;
  }
  const secondsSaved = estimatedSeconds - elapsedSeconds;
  return Math.floor(secondsSaved / 2);
}

export interface CalculateTotalScoreOptions {
  wordsFoundCount: number;
  hintsUsed: number;
  elapsedSeconds: number;
  estimatedMinutes: number;
  isCompleted?: boolean;
  isDailyChallenge?: boolean;
  isCategoryComplete?: boolean;
  config?: ScoreConfig;
}

/**
 * Helper to calculate total cumulative game session score based on level state and bonuses.
 */
export function calculateTotalSessionScore(options: CalculateTotalScoreOptions): number {
  const cfg = options.config || DEFAULT_SCORE_CONFIG;
  let score = options.wordsFoundCount * calculateWordScore(cfg);

  if (options.isCompleted) {
    score += calculateLevelCompleteScore(options.hintsUsed, cfg);
    score += calculateTimeBonus(options.elapsedSeconds, options.estimatedMinutes);
  }

  if (options.isDailyChallenge) {
    score += cfg.dailyChallengeBonus;
  }

  if (options.isCategoryComplete) {
    score += cfg.categoryCompleteBonus;
  }

  return score;
}
