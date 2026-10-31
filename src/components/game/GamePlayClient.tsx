"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { GAME_LEVELS } from "@/lib/game/data";
import { generatePuzzle } from "@/lib/game/generator";
import { validateSelection } from "@/lib/game/validator";
import { DEFAULT_SCORE_CONFIG, calculateWordScore, calculateLevelCompleteScore, calculateTimeBonus } from "@/lib/game/scoring";
import { saveGuestSession, clearActiveSession, saveActiveSession, getActiveSession } from "@/lib/game/progress";
import type { GameLevel, GeneratedPuzzle, PlacedWord, CellPosition } from "@/lib/game/types";
import "../../app/play/word-search/game.css";

interface GamePlayClientProps {
  levelSlug: string;
}

interface DiscoveryData {
  displayTerm: string;
  definition: string;
  category: string;
  points: number;
}

export function GamePlayClient({ levelSlug }: GamePlayClientProps) {
  const router = useRouter();
  const level = GAME_LEVELS.find((l) => l.slug === levelSlug);

  const [puzzle, setPuzzle] = useState<GeneratedPuzzle | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [status, setStatus] = useState<"playing" | "paused" | "completed">("playing");
  const [seed, setSeed] = useState(0);

  // Selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<CellPosition | null>(null);
  const [selectionCurrent, setSelectionCurrent] = useState<CellPosition | null>(null);
  const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
  const [invalidCells, setInvalidCells] = useState<CellPosition[]>([]);
  const [recentlyFoundCells, setRecentlyFoundCells] = useState<CellPosition[]>([]);
  const [hintCells, setHintCells] = useState<CellPosition[]>([]);

  // Modals
  const [discovery, setDiscovery] = useState<DiscoveryData | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // All found cells (for permanent highlighting)
  const allFoundCells = useRef<Set<string>>(new Set());

  // Initialize puzzle
  useEffect(() => {
    if (!level) return;

    // Try to restore session
    const saved = getActiveSession(level.id);
    const newSeed = saved?.puzzleSeed ?? Math.floor(Math.random() * 1000000);
    setSeed(newSeed);

    const generated = generatePuzzle(level, newSeed);
    setPuzzle(generated);

    if (saved && saved.status !== "completed") {
      setFoundWords(saved.foundWords);
      setScore(saved.score);
      setHintsUsed(saved.hintsUsed);
      setElapsedSeconds(saved.elapsedSeconds);
      setStatus(saved.status === "paused" ? "paused" : "playing");

      // Rebuild found cells
      const cells = new Set<string>();
      saved.foundWords.forEach((word) => {
        const pw = generated.placedWords.find((p) => p.word === word);
        if (pw) {
          pw.cells.forEach((c) => cells.add(`${c.row},${c.col}`));
        }
      });
      allFoundCells.current = cells;
    }
  }, [level]);

  // Timer
  useEffect(() => {
    if (status === "playing" && puzzle) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, puzzle]);

  // Save session periodically
  useEffect(() => {
    if (!level || !puzzle) return;
    const interval = setInterval(() => {
      saveActiveSession({
        levelId: level.id,
        foundWords,
        score,
        hintsUsed,
        elapsedSeconds,
        startTime: 0,
        status,
        puzzleSeed: seed,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [level, puzzle, foundWords, score, hintsUsed, elapsedSeconds, status, seed]);

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Get cells in a straight line between two positions
  const getCellsInLine = useCallback(
    (start: CellPosition, end: CellPosition): CellPosition[] => {
      if (!puzzle) return [];
      const dr = Math.sign(end.row - start.row);
      const dc = Math.sign(end.col - start.col);
      const rowDist = Math.abs(end.row - start.row);
      const colDist = Math.abs(end.col - start.col);

      // Must be a straight line
      if (rowDist !== colDist && rowDist !== 0 && colDist !== 0) return [];

      const steps = Math.max(rowDist, colDist);
      const cells: CellPosition[] = [];

      for (let i = 0; i <= steps; i++) {
        const row = start.row + dr * i;
        const col = start.col + dc * i;
        if (row < 0 || row >= puzzle.gridSize || col < 0 || col >= puzzle.gridSize) return [];
        cells.push({ row, col });
      }
      return cells;
    },
    [puzzle]
  );

  // Handle cell position from mouse/touch event
  const getCellFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): CellPosition | null => {
      if (!gridRef.current || !puzzle) return null;
      const gridRect = gridRef.current.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // Calculate cell from position within grid
      const padding = 12; // match CSS padding
      const gap = 2; // match CSS gap
      const cellSize = (gridRect.width - padding * 2 - gap * (puzzle.gridSize - 1)) / puzzle.gridSize;
      const x = clientX - gridRect.left - padding;
      const y = clientY - gridRect.top - padding;

      const col = Math.floor(x / (cellSize + gap));
      const row = Math.floor(y / (cellSize + gap));

      if (row < 0 || row >= puzzle.gridSize || col < 0 || col >= puzzle.gridSize) return null;
      return { row, col };
    },
    [puzzle]
  );

  // Selection handlers
  const handleSelectionStart = useCallback(
    (row: number, col: number) => {
      if (status !== "playing") return;
      setIsSelecting(true);
      setSelectionStart({ row, col });
      setSelectionCurrent({ row, col });
      setSelectedCells([{ row, col }]);
      setInvalidCells([]);
    },
    [status]
  );

  const handleSelectionMove = useCallback(
    (row: number, col: number) => {
      if (!isSelecting || !selectionStart) return;
      setSelectionCurrent({ row, col });
      const cells = getCellsInLine(selectionStart, { row, col });
      setSelectedCells(cells.length > 0 ? cells : [selectionStart]);
    },
    [isSelecting, selectionStart, getCellsInLine]
  );

  const handleSelectionEnd = useCallback(() => {
    if (!isSelecting || !selectionStart || !selectionCurrent || !puzzle || !level) {
      setIsSelecting(false);
      setSelectedCells([]);
      return;
    }

    const result = validateSelection(
      selectionStart,
      selectionCurrent,
      puzzle.grid,
      puzzle.placedWords,
      foundWords
    );

    if (result.isValid && result.word && result.placedWord && !result.alreadyFound) {
      // Word found!
      const wordData = level.words.find((w) => w.term === result.word);
      const points = calculateWordScore();

      setFoundWords((prev) => [...prev, result.word!]);
      setScore((prev) => prev + points);

      // Highlight found cells
      result.placedWord.cells.forEach((c) => {
        allFoundCells.current.add(`${c.row},${c.col}`);
      });
      setRecentlyFoundCells(result.placedWord.cells);
      setTimeout(() => setRecentlyFoundCells([]), 600);

      // Show discovery
      setDiscovery({
        displayTerm: wordData?.displayTerm || result.word,
        definition: wordData?.definition || "",
        category: wordData?.category || "",
        points,
      });

      // Check completion
      const newFoundCount = foundWords.length + 1;
      if (newFoundCount >= level.words.length) {
        // Will show completion after discovery is dismissed
      }
    } else if (result.alreadyFound) {
      // Already found - brief flash
      setInvalidCells(selectedCells);
      setTimeout(() => setInvalidCells([]), 300);
    } else {
      // Invalid selection
      setInvalidCells(selectedCells);
      setTimeout(() => setInvalidCells([]), 300);
    }

    setIsSelecting(false);
    setSelectedCells([]);
    setSelectionStart(null);
    setSelectionCurrent(null);
  }, [isSelecting, selectionStart, selectionCurrent, puzzle, level, foundWords, selectedCells]);

  // Mouse handlers for the grid
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (cell) handleSelectionStart(cell.row, cell.col);
    },
    [getCellFromEvent, handleSelectionStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelecting) return;
      const cell = getCellFromEvent(e);
      if (cell) handleSelectionMove(cell.row, cell.col);
    },
    [isSelecting, getCellFromEvent, handleSelectionMove]
  );

  const handleMouseUp = useCallback(() => {
    handleSelectionEnd();
  }, [handleSelectionEnd]);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (cell) handleSelectionStart(cell.row, cell.col);
    },
    [getCellFromEvent, handleSelectionStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!isSelecting) return;
      const cell = getCellFromEvent(e);
      if (cell) handleSelectionMove(cell.row, cell.col);
    },
    [isSelecting, getCellFromEvent, handleSelectionMove]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handleSelectionEnd();
    },
    [handleSelectionEnd]
  );

  // Mouse up on window (in case mouse leaves grid)
  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isSelecting) handleSelectionEnd();
    };
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [isSelecting, handleSelectionEnd]);

  // Dismiss discovery
  const dismissDiscovery = useCallback(() => {
    setDiscovery(null);
    // Check completion after dismissing
    if (level && foundWords.length >= level.words.length) {
      const bonus = calculateLevelCompleteScore(hintsUsed);
      const timeBonus = calculateTimeBonus(elapsedSeconds, level.estimatedMinutes);
      const totalBonus = bonus + timeBonus;
      setScore((prev) => prev + totalBonus);
      setStatus("completed");
      setShowCompletion(true);

      // Save
      const finalScore = score + totalBonus;
      saveGuestSession({
        levelId: level.id,
        foundWords,
        score: finalScore,
        hintsUsed,
        elapsedSeconds,
        status: "completed",
        puzzleSeed: seed,
        completedAt: new Date().toISOString(),
      });
      clearActiveSession(level.id);
    }
  }, [level, foundWords, hintsUsed, elapsedSeconds, score, seed]);

  // Hint
  const handleHint = useCallback(() => {
    if (!puzzle || !level || status !== "playing") return;
    if (hintsUsed >= level.maxHints) return;

    // Find an unfound word
    const unfound = puzzle.placedWords.filter((pw) => !foundWords.includes(pw.word));
    if (unfound.length === 0) return;

    const targetWord = unfound[Math.floor(Math.random() * unfound.length)];
    const firstCell = targetWord.cells[0];

    setHintCells([firstCell]);
    setHintsUsed((prev) => prev + 1);

    setTimeout(() => setHintCells([]), 1500);
  }, [puzzle, level, status, hintsUsed, foundWords]);

  // Pause/Resume
  const handlePause = useCallback(() => {
    setStatus("paused");
  }, []);

  const handleResume = useCallback(() => {
    setStatus("playing");
  }, []);

  // Restart
  const handleRestart = useCallback(() => {
    if (foundWords.length > 0) {
      setConfirmAction({
        title: "Restart level?",
        message: "Your current progress will be lost.",
        onConfirm: () => {
          const newSeed = Math.floor(Math.random() * 1000000);
          setSeed(newSeed);
          const generated = generatePuzzle(level!, newSeed);
          setPuzzle(generated);
          setFoundWords([]);
          setScore(0);
          setHintsUsed(0);
          setElapsedSeconds(0);
          setStatus("playing");
          allFoundCells.current = new Set();
          setShowCompletion(false);
          clearActiveSession(level!.id);
          setConfirmAction(null);
        },
      });
    } else {
      const newSeed = Math.floor(Math.random() * 1000000);
      setSeed(newSeed);
      const generated = generatePuzzle(level!, newSeed);
      setPuzzle(generated);
      setElapsedSeconds(0);
    }
  }, [level, foundWords]);

  // Exit
  const handleExit = useCallback(() => {
    if (foundWords.length > 0 && status !== "completed") {
      setConfirmAction({
        title: "Exit level?",
        message: "Your progress will be saved. You can continue later.",
        onConfirm: () => {
          if (level) {
            saveActiveSession({
              levelId: level.id,
              foundWords,
              score,
              hintsUsed,
              elapsedSeconds,
              startTime: 0,
              status: "paused",
              puzzleSeed: seed,
            });
          }
          router.push("/play/word-search");
        },
      });
    } else {
      router.push("/play/word-search");
    }
  }, [foundWords, status, level, score, hintsUsed, elapsedSeconds, seed, router]);

  // Cell class name
  const getCellClassName = useCallback(
    (row: number, col: number) => {
      const classes = ["grid-cell"];
      const key = `${row},${col}`;

      if (selectedCells.some((c) => c.row === row && c.col === col)) {
        classes.push("selecting");
      }
      if (allFoundCells.current.has(key)) {
        classes.push("found");
      }
      if (recentlyFoundCells.some((c) => c.row === row && c.col === col)) {
        classes.push("highlight");
      }
      if (invalidCells.some((c) => c.row === row && c.col === col)) {
        classes.push("invalid-flash");
      }
      if (hintCells.some((c) => c.row === row && c.col === col)) {
        classes.push("hint-flash");
      }
      return classes.join(" ");
    },
    [selectedCells, recentlyFoundCells, invalidCells, hintCells]
  );

  // ====== RENDER ======

  if (!level) {
    return (
      <div className="game-container">
        <div className="game-loading">
          <p>Level not found.</p>
          <button className="btn btn-outline" onClick={() => router.push("/play/word-search")}>
            Back to levels
          </button>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="game-container">
        <div className="game-loading">
          <div className="game-loading-spinner" />
          <span className="game-loading-text">Generating puzzle…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Header */}
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={handleExit}>
            ← Back
          </button>
          <div>
            <span className="level-number">Level {String(level.id).padStart(2, "0")}</span>
            <span className="game-header-title"> {level.title}</span>
          </div>
        </div>
        <div className="game-header-right">
          <span className={`difficulty-badge difficulty-${level.difficulty}`}>{level.difficulty}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="game-stats">
        <div className="game-stat">
          <div className="game-stat-label">Found</div>
          <div className="game-stat-value accent">
            {String(foundWords.length).padStart(2, "0")}/{String(level.words.length).padStart(2, "0")}
          </div>
        </div>
        <div className="game-stat">
          <div className="game-stat-label">Time</div>
          <div className="game-stat-value">{formatTime(elapsedSeconds)}</div>
        </div>
        <div className="game-stat">
          <div className="game-stat-label">Points</div>
          <div className="game-stat-value accent">{score}</div>
        </div>
        <div className="game-stat">
          <div className="game-stat-label">Hints</div>
          <div className="game-stat-value">
            {hintsUsed}/{level.maxHints}
          </div>
        </div>
      </div>

      {/* Game Layout */}
      <div className="game-layout">
        {/* Grid */}
        <div className="grid-wrapper">
          <div
            ref={gridRef}
            className="word-grid"
            style={{
              gridTemplateColumns: `repeat(${puzzle.gridSize}, var(--game-cell-size))`,
              gridTemplateRows: `repeat(${puzzle.gridSize}, var(--game-cell-size))`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {puzzle.grid.map((row, r) =>
              row.map((letter, c) => (
                <div
                  key={`${r}-${c}`}
                  className={getCellClassName(r, c)}
                  data-row={r}
                  data-col={c}
                >
                  {status === "paused" ? "·" : letter}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="game-sidebar">
          {/* Word List */}
          <div className="word-list-card">
            <div className="word-list-title">
              Words to find ({foundWords.length}/{level.words.length})
            </div>
            <div className="word-list">
              {level.words.map((word) => {
                const isFound = foundWords.includes(word.term);
                return (
                  <div key={word.term} className={`word-item${isFound ? " found" : ""}`}>
                    <span>{word.displayTerm}</span>
                    <span className="word-check">✓</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="game-controls-card">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleHint}
              disabled={hintsUsed >= level.maxHints || status !== "playing"}
            >
              💡 Hint
            </button>
            <span className="hint-count">
              {level.maxHints - hintsUsed} hints remaining
            </span>
            {status === "playing" ? (
              <button className="btn btn-ghost btn-sm" onClick={handlePause}>
                ⏸ Pause
              </button>
            ) : status === "paused" ? (
              <button className="btn btn-primary btn-sm" onClick={handleResume}>
                ▶ Resume
              </button>
            ) : null}
            <button className="btn btn-ghost btn-sm" onClick={handleRestart}>
              ↻ Restart
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleExit}>
              ✕ Exit
            </button>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {status === "paused" && (
        <div className="discovery-overlay" onClick={handleResume}>
          <div className="discovery-modal" onClick={(e) => e.stopPropagation()}>
            <span className="discovery-label">Game Paused</span>
            <h3>Take a break</h3>
            <p className="discovery-def">
              The grid is hidden while paused. Your progress is saved.
            </p>
            <button className="btn btn-primary" onClick={handleResume}>
              ▶ Resume
            </button>
          </div>
        </div>
      )}

      {/* Word Discovery Modal */}
      {discovery && (
        <div className="discovery-overlay" onClick={dismissDiscovery}>
          <div className="discovery-modal" onClick={(e) => e.stopPropagation()}>
            <span className="discovery-label">Word Discovered!</span>
            <h3>{discovery.displayTerm}</h3>
            <p className="discovery-def">{discovery.definition}</p>
            <div className="discovery-points">+{discovery.points} game points</div>
            <button className="btn btn-primary" onClick={dismissDiscovery}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Level Completion */}
      {showCompletion && (
        <div className="completion-overlay">
          <div className="completion-modal">
            <span className="completion-label">Level Completed!</span>
            <h2>Well done!</h2>
            <p className="completion-desc">{level.learningObjective}</p>

            <div className="completion-stats">
              <div className="completion-stat">
                <div className="completion-stat-value">
                  {foundWords.length}/{level.words.length}
                </div>
                <div className="completion-stat-label">Words found</div>
              </div>
              <div className="completion-stat">
                <div className="completion-stat-value">{formatTime(elapsedSeconds)}</div>
                <div className="completion-stat-label">Time</div>
              </div>
              <div className="completion-stat">
                <div className="completion-stat-value">{score}</div>
                <div className="completion-stat-label">Points</div>
              </div>
              <div className="completion-stat">
                <div className="completion-stat-value">{hintsUsed}</div>
                <div className="completion-stat-label">Hints used</div>
              </div>
            </div>

            <div className="completion-takeaway">
              &ldquo;{level.learningObjective}&rdquo;
            </div>

            <div className="completion-actions">
              {GAME_LEVELS.find((l) => l.id === level.id + 1) && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const next = GAME_LEVELS.find((l) => l.id === level.id + 1);
                    if (next) router.push(`/play/word-search/${next.slug}`);
                  }}
                >
                  Next Level →
                </button>
              )}
              <button className="btn btn-outline" onClick={handleRestart}>
                Play Again
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => router.push("/play/word-search")}
              >
                All Levels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h4>{confirmAction.title}</h4>
            <p>{confirmAction.message}</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={confirmAction.onConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
