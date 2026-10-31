import { Direction, GameLevel, GeneratedPuzzle, PlacedWord } from './types';

/**
 * Direction vectors for grid navigation: (dRow, dCol)
 */
export const DIRECTION_VECTORS: Record<Direction, { dRow: number; dCol: number }> = {
  'horizontal': { dRow: 0, dCol: 1 },
  'vertical': { dRow: 1, dCol: 0 },
  'diagonal-down': { dRow: 1, dCol: 1 },
  'diagonal-up': { dRow: -1, dCol: 1 },
  'horizontal-reverse': { dRow: 0, dCol: -1 },
  'vertical-reverse': { dRow: -1, dCol: 0 },
  'diagonal-down-reverse': { dRow: -1, dCol: -1 },
  'diagonal-up-reverse': { dRow: 1, dCol: -1 },
};

/**
 * 32-bit Mulberry32 seeded pseudo-random number generator.
 * Produces deterministic numbers in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function (): number {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAX_WORD_ATTEMPTS = 100;
const MAX_FULL_RETRIES = 50;

/**
 * Generate a complete, verified word search puzzle from a GameLevel specification.
 *
 * @param level The GameLevel configuration (words, allowed directions, grid size, etc.)
 * @param seed Optional seed for deterministic generation
 * @returns GeneratedPuzzle containing the character grid, placed word metadata, grid size, and seed
 */
export function generatePuzzle(level: GameLevel, seed?: number): GeneratedPuzzle {
  const actualSeed = seed !== undefined ? seed >>> 0 : Math.floor(Math.random() * 0x7FFFFFFF) >>> 0;
  const rng = mulberry32(actualSeed);

  // Determine starting grid size (must be at least the level's gridSize and able to contain the longest word)
  const longestWordLen = Math.max(...level.words.map((w) => w.term.length), 0);
  let currentGridSize = Math.max(level.gridSize, longestWordLen);

  // Sort words descending by length so longer words are placed first
  const sortedWords = [...level.words].sort((a, b) => b.term.length - a.term.length);

  while (true) {
    for (let retry = 0; retry < MAX_FULL_RETRIES; retry++) {
      // Step a: Initialize empty grid
      const grid: string[][] = Array.from({ length: currentGridSize }, () =>
        Array(currentGridSize).fill('')
      );
      const placedWords: PlacedWord[] = [];
      let allWordsPlaced = true;

      // Step c: Place each word
      for (const word of sortedWords) {
        const cleanTerm = word.term.toUpperCase().replace(/[^A-Z]/g, '');
        const wordLen = cleanTerm.length;
        let wordPlaced = false;

        for (let attempt = 0; attempt < MAX_WORD_ATTEMPTS; attempt++) {
          // Select a random allowed direction
          const dirIndex = Math.floor(rng() * level.allowedDirections.length);
          const direction = level.allowedDirections[dirIndex];
          const { dRow, dCol } = DIRECTION_VECTORS[direction];

          // Determine coordinate bounds for this direction
          const minRow = dRow === 1 ? 0 : dRow === -1 ? wordLen - 1 : 0;
          const maxRow = dRow === 1 ? currentGridSize - wordLen : dRow === -1 ? currentGridSize - 1 : currentGridSize - 1;

          const minCol = dCol === 1 ? 0 : dCol === -1 ? wordLen - 1 : 0;
          const maxCol = dCol === 1 ? currentGridSize - wordLen : dCol === -1 ? currentGridSize - 1 : currentGridSize - 1;

          if (minRow > maxRow || minCol > maxCol) {
            continue;
          }

          const startRow = minRow + Math.floor(rng() * (maxRow - minRow + 1));
          const startCol = minCol + Math.floor(rng() * (maxCol - minCol + 1));

          // Step d: Check placement validity (only allow overlapping if matching)
          let canPlace = true;
          const cells: Array<{ row: number; col: number }> = [];

          for (let i = 0; i < wordLen; i++) {
            const r = startRow + i * dRow;
            const c = startCol + i * dCol;
            const existing = grid[r][c];

            if (existing !== '' && existing !== cleanTerm[i]) {
              canPlace = false;
              break;
            }
            cells.push({ row: r, col: c });
          }

          if (canPlace) {
            // Apply word to grid
            for (let i = 0; i < wordLen; i++) {
              grid[cells[i].row][cells[i].col] = cleanTerm[i];
            }

            placedWords.push({
              word: cleanTerm,
              displayTerm: word.displayTerm,
              startRow,
              startCol,
              direction,
              cells,
            });

            wordPlaced = true;
            break;
          }
        }

        // Step e: If placement fails after 100 attempts, abort this generation attempt
        if (!wordPlaced) {
          allWordsPlaced = false;
          break;
        }
      }

      // If all words were placed, finalize the grid
      if (allWordsPlaced) {
        // Step g: Fill remaining empty cells with random uppercase letters
        for (let r = 0; r < currentGridSize; r++) {
          for (let c = 0; c < currentGridSize; c++) {
            if (grid[r][c] === '') {
              const charIdx = Math.floor(rng() * UPPERCASE_LETTERS.length);
              grid[r][c] = UPPERCASE_LETTERS[charIdx];
            }
          }
        }

        // Step h: Verify ALL words exist in the final grid
        let verified = placedWords.length === sortedWords.length;
        if (verified) {
          for (const pw of placedWords) {
            const extracted = pw.cells.map((cell) => grid[cell.row][cell.col]).join('');
            if (extracted !== pw.word) {
              verified = false;
              break;
            }
          }
        }

        if (verified) {
          // Restore original level word order if desirable, or return placed words
          return {
            grid,
            placedWords,
            gridSize: currentGridSize,
            seed: actualSeed,
          };
        }
      }
    }

    // Step f: If MAX_FULL_RETRIES reached without success, expand grid size by 1 and try again
    currentGridSize += 1;
  }
}
