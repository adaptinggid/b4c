"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GAME_LEVELS } from "@/lib/game/data";
import { getGuestProgress, type GuestProgress } from "@/lib/game/progress";
import "@/app/play/word-search/game.css";

export function WordSearchLanding() {
  const [progress, setProgress] = useState<GuestProgress | null>(null);

  useEffect(() => {
    setProgress(getGuestProgress());
  }, []);

  const completedLevels = progress?.completedLevels ?? [];

  return (
    <>
      {/* Hero */}
      <section className="game-hero">
        <div className="wrap">
          <div className="game-hero-inner">
            <span className="eyebrow">BitEdu Network presents</span>
            <h1>Bitcoin Word Search</h1>
            <p className="game-sub">Find the words. Discover Bitcoin.</p>
            <p className="game-desc">
              Explore Bitcoin through an interactive word-search experience. Discover the language,
              technology, and ideas behind the Bitcoin ecosystem, one puzzle at a time.
            </p>
            <div className="cta-row">
              <Link
                href={`/play/word-search/${GAME_LEVELS[0].slug}`}
                className="btn btn-primary"
              >
                Play Now
              </Link>
              <a href="#how-to-play" className="btn btn-outline">
                How to Play
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="game-levels-section section-border-t">
        <div className="wrap">
          <div className="game-section-header">
            <div>
              <span className="eyebrow">Explore the levels</span>
              <h2>Choose your challenge</h2>
            </div>
          </div>
          <div className="level-grid">
            {GAME_LEVELS.map((level) => {
              const isCompleted = completedLevels.includes(level.id);
              return (
                <Link
                  key={level.id}
                  href={`/play/word-search/${level.slug}`}
                  className={`level-card${isCompleted ? " completed" : ""}`}
                >
                  <div className="level-card-header">
                    <div>
                      <span className="level-number">Level {String(level.id).padStart(2, "0")}</span>
                      <h3>{level.title}</h3>
                    </div>
                    <span className={`difficulty-badge difficulty-${level.difficulty}`}>
                      {level.difficulty}
                    </span>
                  </div>
                  <p>{level.description}</p>
                  <div className="level-meta">
                    <span className="level-meta-item">
                      {level.words.length} words
                    </span>
                    <span className="level-meta-item">
                      {level.gridSize}×{level.gridSize} grid
                    </span>
                    <span className="level-meta-item">
                      ~{level.estimatedMinutes} min
                    </span>
                    {isCompleted && (
                      <span className="level-completed-badge">✓ Completed</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="how-to-play" id="how-to-play">
        <div className="wrap">
          <div className="game-section-header">
            <div>
              <span className="eyebrow">Getting started</span>
              <h2>How to Play</h2>
            </div>
          </div>
          <div className="how-steps">
            <div className="how-step">
              <span className="how-step-num">01</span>
              <h4>Find the words</h4>
              <p>
                Scan the letter grid for hidden Bitcoin-related words. They can be placed
                horizontally, vertically, or diagonally.
              </p>
            </div>
            <div className="how-step">
              <span className="how-step-num">02</span>
              <h4>Select letters</h4>
              <p>
                Click and drag across letters to select a word. On mobile, touch and drag. Release
                to submit your selection.
              </p>
            </div>
            <div className="how-step">
              <span className="how-step-num">03</span>
              <h4>Discover meanings</h4>
              <p>
                When you find a word, you&apos;ll see a short explanation of what it means in the
                Bitcoin ecosystem. Learn as you play.
              </p>
            </div>
            <div className="how-step">
              <span className="how-step-num">04</span>
              <h4>Level up</h4>
              <p>
                Complete all the words to finish a level. Progress through increasingly challenging
                puzzles and earn game points.
              </p>
            </div>
            <div className="how-step">
              <span className="how-step-num">05</span>
              <h4>Use hints wisely</h4>
              <p>
                Stuck? Use a hint to reveal the first letter of a word. Hints are limited and will
                reduce your bonus score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="progress-section">
        <div className="wrap">
          <div className="game-section-header">
            <div>
              <span className="eyebrow">Your progress</span>
              <h2>Keep exploring</h2>
            </div>
          </div>
          {progress && completedLevels.length > 0 ? (
            <div className="progress-stats">
              <div className="progress-stat">
                <div className="progress-stat-value">
                  {completedLevels.length}/{GAME_LEVELS.length}
                </div>
                <div className="progress-stat-label">Levels completed</div>
              </div>
              <div className="progress-stat">
                <div className="progress-stat-value">{progress.totalGamePoints}</div>
                <div className="progress-stat-label">Game points</div>
              </div>
              <div className="progress-stat">
                <div className="progress-stat-value">{progress.totalWordsFound}</div>
                <div className="progress-stat-label">Words discovered</div>
              </div>
            </div>
          ) : (
            <div className="empty">
              <h4>No progress yet</h4>
              <p>Start playing to track your progress. Your results are saved in this browser.</p>
              <Link
                href={`/play/word-search/${GAME_LEVELS[0].slug}`}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 12 }}
              >
                Start playing
              </Link>
            </div>
          )}
          <p
            style={{
              fontSize: ".82rem",
              color: "var(--game-muted)",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Progress is saved locally in your browser. Sign in to sync across devices.
          </p>
        </div>
      </section>
    </>
  );
}
