import { ScoreConfig } from './types';

/**
 * Default score configuration — all values in sats (satoshis).
 */
export const DEFAULT_SCORE_CONFIG: ScoreConfig = {
  satsPerWord: 210,
  completionSats: 2100,
  noHintsBonus: 1000,
  dailyChallengeBonus: 21000,
  categoryCompleteBonus: 5000,
  timeBonusPerSecondSaved: 21,
};

/**
 * Calculates sats earned for finding a single word.
 */
export function calculateWordScore(satsPerWord = DEFAULT_SCORE_CONFIG.satsPerWord): number {
  return satsPerWord;
}

/**
 * Calculates sats earned for completing a level, including no-hints bonus.
 */
export function calculateLevelCompleteScore(
  hintsUsed: number,
  completionSats = DEFAULT_SCORE_CONFIG.completionSats,
  noHintsBonus = DEFAULT_SCORE_CONFIG.noHintsBonus
): number {
  const bonus = hintsUsed === 0 ? noHintsBonus : 0;
  return completionSats + bonus;
}

/**
 * Calculates a time bonus if the player beats the estimated time.
 * Awards satsPerSecondSaved sats for every second saved.
 */
export function calculateTimeBonus(
  elapsedSeconds: number,
  estimatedMinutes: number,
  satsPerSecondSaved = DEFAULT_SCORE_CONFIG.timeBonusPerSecondSaved
): number {
  const estimatedSeconds = estimatedMinutes * 60;
  if (estimatedSeconds <= 0 || elapsedSeconds <= 0 || elapsedSeconds >= estimatedSeconds) {
    return 0;
  }
  const secondsSaved = estimatedSeconds - elapsedSeconds;
  return Math.floor(secondsSaved * satsPerSecondSaved);
}

export interface CalculateTotalScoreOptions {
  wordsFoundCount: number;
  hintsUsed: number;
  elapsedSeconds: number;
  estimatedMinutes: number;
  isCompleted?: boolean;
  isDailyChallenge?: boolean;
  isCategoryComplete?: boolean;
  satsPerWord?: number;
  completionSats?: number;
  noHintsBonus?: number;
  config?: ScoreConfig;
}

/**
 * Helper to calculate total cumulative sats based on level state and bonuses.
 */
export function calculateTotalSessionScore(options: CalculateTotalScoreOptions): number {
  const cfg = options.config || DEFAULT_SCORE_CONFIG;
  const satsPerWord = options.satsPerWord ?? cfg.satsPerWord;
  const completionSats = options.completionSats ?? cfg.completionSats;
  const noHintsBonus = options.noHintsBonus ?? cfg.noHintsBonus;

  let score = options.wordsFoundCount * satsPerWord;

  if (options.isCompleted) {
    score += calculateLevelCompleteScore(options.hintsUsed, completionSats, noHintsBonus);
    score += calculateTimeBonus(options.elapsedSeconds, options.estimatedMinutes, cfg.timeBonusPerSecondSaved);
  }

  if (options.isDailyChallenge) {
    score += cfg.dailyChallengeBonus;
  }

  if (options.isCategoryComplete) {
    score += cfg.categoryCompleteBonus;
  }

  return score;
}

/**
 * Format a sats value nicely (e.g. 21,000 sats → "21,000 sats")
 */
export function formatSats(sats: number): string {
  if (sats >= 1_000_000) {
    return `${(sats / 1_000_000).toFixed(2)}M sats`;
  }
  return `${sats.toLocaleString()} sats`;
}
