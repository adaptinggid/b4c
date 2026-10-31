import { CellPosition, PlacedWord, SelectionResult } from './types';

/**
 * Validates whether two cell positions form a valid straight line
 * (horizontal, vertical, or 45-degree diagonal) with a length of at least 2 cells.
 */
export function isValidStraightLine(startCell: CellPosition, endCell: CellPosition): boolean {
  const deltaRow = endCell.row - startCell.row;
  const deltaCol = endCell.col - startCell.col;

  // Single cell selection is not a valid line
  if (deltaRow === 0 && deltaCol === 0) {
    return false;
  }

  const isHorizontal = deltaRow === 0 && deltaCol !== 0;
  const isVertical = deltaCol === 0 && deltaRow !== 0;
  const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol) && deltaRow !== 0;

  return isHorizontal || isVertical || isDiagonal;
}

/**
 * Returns all cell positions along the straight line from startCell to endCell inclusive.
 * Returns an empty array if the line is not straight.
 */
export function getSelectionCells(startCell: CellPosition, endCell: CellPosition): CellPosition[] {
  if (!isValidStraightLine(startCell, endCell)) {
    return [];
  }

  const deltaRow = endCell.row - startCell.row;
  const deltaCol = endCell.col - startCell.col;
  const stepRow = Math.sign(deltaRow);
  const stepCol = Math.sign(deltaCol);
  const length = Math.max(Math.abs(deltaRow), Math.abs(deltaCol)) + 1;

  const cells: CellPosition[] = [];
  for (let i = 0; i < length; i++) {
    cells.push({
      row: startCell.row + i * stepRow,
      col: startCell.col + i * stepCol,
    });
  }

  return cells;
}

/**
 * Extracts the string of letters along a straight line selection in the grid.
 */
export function extractWordFromSelection(
  startCell: CellPosition,
  endCell: CellPosition,
  grid: string[][]
): string | null {
  const cells = getSelectionCells(startCell, endCell);
  if (cells.length === 0) return null;

  const rowCount = grid.length;
  const colCount = grid[0]?.length || 0;

  let letters = '';
  for (const cell of cells) {
    if (cell.row < 0 || cell.row >= rowCount || cell.col < 0 || cell.col >= colCount) {
      return null;
    }
    letters += grid[cell.row][cell.col] || '';
  }

  return letters;
}

/**
 * Validates a user selection on the word search grid against the list of placed words.
 *
 * @param startCell The starting cell coordinate of the drag selection
 * @param endCell The ending cell coordinate of the drag selection
 * @param grid The 2D character matrix of the puzzle
 * @param placedWords The list of placed words in this puzzle
 * @param foundWords The list of word terms already successfully found
 * @returns SelectionResult containing isValid, word, displayTerm, placedWord, and alreadyFound
 */
export function validateSelection(
  startCell: CellPosition,
  endCell: CellPosition,
  grid: string[][],
  placedWords: PlacedWord[],
  foundWords: string[]
): SelectionResult {
  // 1. Check straight line validity
  if (!isValidStraightLine(startCell, endCell)) {
    return { isValid: false };
  }

  // 2. Extract cells and letters along the line
  const selectedCells = getSelectionCells(startCell, endCell);
  const extractedWord = extractWordFromSelection(startCell, endCell, grid);

  if (!extractedWord || selectedCells.length === 0) {
    return { isValid: false };
  }

  // 3. Match against placed words
  // A match occurs if:
  // - Forward drag: Selection cells and extracted word match placedWord forward
  // - Backward drag: Selection cells and extracted word match placedWord in reverse
  let matchedPlacedWord: PlacedWord | undefined;

  for (const pw of placedWords) {
    if (pw.cells.length !== selectedCells.length) {
      continue;
    }

    // Forward check
    const matchesForward = pw.cells.every(
      (c, i) => c.row === selectedCells[i].row && c.col === selectedCells[i].col
    );

    if (matchesForward && extractedWord === pw.word) {
      matchedPlacedWord = pw;
      break;
    }

    // Reverse check (player dragged from the end of the word to the beginning)
    const matchesReverse = pw.cells.every(
      (c, i) =>
        c.row === selectedCells[selectedCells.length - 1 - i].row &&
        c.col === selectedCells[selectedCells.length - 1 - i].col
    );

    const reversedExtracted = extractedWord.split('').reverse().join('');
    if (matchesReverse && reversedExtracted === pw.word) {
      matchedPlacedWord = pw;
      break;
    }
  }

  // If no placed word matched this line
  if (!matchedPlacedWord) {
    return { isValid: false };
  }

  // 4. Check if already found
  const alreadyFound = foundWords.some(
    (fw) => fw.toUpperCase() === matchedPlacedWord!.word.toUpperCase()
  );

  return {
    isValid: true,
    word: matchedPlacedWord.word,
    displayTerm: matchedPlacedWord.displayTerm,
    placedWord: matchedPlacedWord,
    alreadyFound,
  };
}
