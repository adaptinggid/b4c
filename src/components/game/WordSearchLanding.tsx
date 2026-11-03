"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GAME_TIERS } from "@/lib/game/data";
import { getGuestProgress, type GuestProgress } from "@/lib/game/progress";
import { formatSats } from "@/lib/game/scoring";
import "@/app/play/word-search/game.css";

const TIER_ICONS: Record<string, string> = {
  beginner: "🟠",
  intermediate: "⚡",
  advanced: "₿",
};

const TIER_COLORS: Record<string, string> = {
  beginner: "tier-beginner",
  intermediate: "tier-intermediate",
  advanced: "tier-advanced",
};

const BTC_CHARS = [
  { emoji: "₿", label: "Satoshi", pos: "char-1" },
  { emoji: "⚡", label: "Lightning Node", pos: "char-2" },
  { emoji: "🔑", label: "Key Holder", pos: "char-3" },
  { emoji: "🛡️", label: "Validator", pos: "char-4" },
];

export function WordSearchLanding() {
  const [progress, setProgress] = useState<GuestProgress | null>(null);
  const [activeTier, setActiveTier] = useState<string>("beginner");

  useEffect(() => {
    setProgress(getGuestProgress());
  }, []);

  const completedSets = progress?.completedSets ?? [];
  const totalSats = progress?.totalSats ?? 0;
  const totalWords = progress?.totalWordsFound ?? 0;

  const currentTier = GAME_TIERS.find((t) => t.slug === activeTier)!;

  const tierStats = GAME_TIERS.map((tier) => {
    const completed = tier.sets.filter((s) => completedSets.includes(s.id)).length;
    return { slug: tier.slug, completed, total: tier.sets.length };
  });

  return (
    <>
      {/* ── Floating Bitcoin Characters ── */}
      <div className="btc-chars-bg" aria-hidden="true">
        {BTC_CHARS.map((c) => (
          <span key={c.label} className={`btc-char ${c.pos}`} title={c.label}>
            {c.emoji}
          </span>
        ))}
      </div>

      {/* ── Hero ── */}
      <section className="game-hero">
        <div className="wrap">
          <div className="game-hero-inner">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              BitEdu Network · Word Search
            </div>
            <h1>
              <span className="hero-btc">₿</span>itcoin
              <br />
              Word Search
            </h1>
            <p className="game-sub">Find the words. Stack the sats.</p>
            <p className="game-desc">
              An interactive Bitcoin word-search game across three difficulty tiers — each packed
              with multiple puzzle sets. Earn sats as you discover terms, master concepts, and
              climb the leaderboard.
            </p>

            {/* Sats Balance */}
            <div className="hero-sats-card">
              <div className="hero-sats-icon">⚡</div>
              <div className="hero-sats-info">
                <div className="hero-sats-label">Your Sats Balance</div>
                <div className="hero-sats-value">
                  {totalSats.toLocaleString()}
                  <span className="hero-sats-unit"> sats</span>
                </div>
              </div>
              <div className="hero-sats-divider" />
              <div className="hero-sats-info">
                <div className="hero-sats-label">Words Found</div>
                <div className="hero-sats-value">{totalWords}</div>
              </div>
            </div>

            <div className="cta-row">
              <Link href={`/play/word-search/${GAME_TIERS[0].sets[0].id}`} className="btn btn-primary btn-lg">
                ⚡ Play Now
              </Link>
              <a href="#tiers" className="btn btn-outline">
                Choose Level
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tier Tabs + Set Grid ── */}
      <section className="game-levels-section section-border-t" id="tiers">
        <div className="wrap">
          <div className="game-section-header">
            <div>
              <span className="eyebrow">Choose your challenge</span>
              <h2>Difficulty Tiers</h2>
            </div>
            <div className="tier-tab-row">
              {GAME_TIERS.map((tier) => {
                const stat = tierStats.find((s) => s.slug === tier.slug)!;
                return (
                  <button
                    key={tier.slug}
                    className={`tier-tab ${activeTier === tier.slug ? "active" : ""} tier-tab-${tier.slug}`}
                    onClick={() => setActiveTier(tier.slug)}
                  >
                    <span className="tier-tab-icon">{TIER_ICONS[tier.slug]}</span>
                    <span className="tier-tab-label">{tier.label}</span>
                    <span className="tier-tab-count">
                      {stat.completed}/{stat.total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier Info Banner */}
          <div className={`tier-banner ${TIER_COLORS[activeTier]}`}>
            <div className="tier-banner-left">
              <span className="tier-banner-icon">{TIER_ICONS[activeTier]}</span>
              <div>
                <div className="tier-banner-title">{currentTier.label}</div>
                <div className="tier-banner-tagline">{currentTier.tagline}</div>
              </div>
            </div>
            <div className="tier-banner-right">
              <div className="tier-banner-stat">
                <span className="tier-banner-stat-val">
                  {tierStats.find((s) => s.slug === activeTier)!.completed}
                </span>
                <span className="tier-banner-stat-label">Completed</span>
              </div>
              <div className="tier-banner-stat">
                <span className="tier-banner-stat-val">{currentTier.sets.length}</span>
                <span className="tier-banner-stat-label">Sets</span>
              </div>
            </div>
          </div>

          {/* Set Cards Grid */}
          <div className="level-grid">
            {currentTier.sets.map((set) => {
              const isCompleted = completedSets.includes(set.id);
              return (
                <Link
                  key={set.id}
                  href={`/play/word-search/${set.id}`}
                  className={`level-card${isCompleted ? " completed" : ""}`}
                >
                  {isCompleted && <span className="card-completed-ribbon">✓</span>}
                  <div className="level-card-header">
                    <div>
                      <span className="level-number">Set {String(set.setNumber).padStart(2, "0")}</span>
                      <h3>{set.title}</h3>
                    </div>
                    <span className={`difficulty-badge difficulty-${activeTier}`}>
                      {TIER_ICONS[activeTier]}
                    </span>
                  </div>
                  <p>{set.description}</p>
                  <div className="level-meta">
                    <span className="level-meta-item">🔤 {set.words.length} words</span>
                    <span className="level-meta-item">📐 {set.gridSize}×{set.gridSize}</span>
                    <span className="level-meta-item">⏱ ~{set.estimatedMinutes}m</span>
                    <span className="level-meta-item sats-badge">
                      ⚡ {(set.satsPerWord * set.words.length + set.completionSats + set.noHintsBonus).toLocaleString()} sats max
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Sats Reward Structure ── */}
      <section className="rewards-section">
        <div className="wrap">
          <div className="game-section-header">
            <div>
              <span className="eyebrow">Earn while you learn</span>
              <h2>Sats Reward System</h2>
            </div>
          </div>
          <div className="rewards-grid">
            <div className="reward-card">
              <div className="reward-icon">🔤</div>
              <div className="reward-label">Per Word Found</div>
              <div className="reward-range">210 – 2,100 sats</div>
              <div className="reward-desc">Higher tiers earn more per word discovered</div>
            </div>
            <div className="reward-card">
              <div className="reward-icon">🏁</div>
              <div className="reward-label">Set Completion</div>
              <div className="reward-range">2,100 – 21,000 sats</div>
              <div className="reward-desc">Bonus sats for completing every word in a set</div>
            </div>
            <div className="reward-card reward-card-highlight">
              <div className="reward-icon">🎯</div>
              <div className="reward-label">No Hints Bonus</div>
              <div className="reward-range">1,000 – 10,000 sats</div>
              <div className="reward-desc">Solve without hints and stack extra sats</div>
            </div>
            <div className="reward-card">
              <div className="reward-icon">⚡</div>
              <div className="reward-label">Speed Bonus</div>
              <div className="reward-range">+21 sats/sec saved</div>
              <div className="reward-desc">Beat the estimated time for lightning bonuses</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Play ── */}
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
              <h4>Choose a tier</h4>
              <p>Pick Beginner, Intermediate, or Advanced. Each tier has multiple sets — you can play any set in any order.</p>
            </div>
            <div className="how-step">
              <span className="how-step-num">02</span>
              <h4>Find the words</h4>
              <p>Scan the letter grid for hidden Bitcoin terms. They can be placed horizontally, vertically, or diagonally depending on difficulty.</p>
            </div>
            <div className="how-step">
              <span className="how-step-num">03</span>
              <h4>Select letters</h4>
              <p>Click and drag across letters to select a word. On mobile, touch and drag. Release to submit your selection.</p>
            </div>
            <div className="how-step">
              <span className="how-step-num">04</span>
              <h4>Stack sats</h4>
              <p>Every word found earns sats. Complete a set for a bonus. Finish without hints for an extra reward.</p>
            </div>
            <div className="how-step">
              <span className="how-step-num">05</span>
              <h4>Learn Bitcoin</h4>
              <p>Each word reveals its definition — building your Bitcoin knowledge one term at a time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Progress ── */}
      <section className="progress-section">
        <div className="wrap">
          <div className="game-section-header">
            <div>
              <span className="eyebrow">Your progress</span>
              <h2>Sats Dashboard</h2>
            </div>
          </div>

          {progress && completedSets.length > 0 ? (
            <>
              <div className="progress-sats-hero">
                <div className="progress-sats-glow" aria-hidden="true" />
                <div className="progress-sats-lightning">⚡</div>
                <div className="progress-sats-amount">{totalSats.toLocaleString()}</div>
                <div className="progress-sats-unit">sats earned</div>
              </div>

              <div className="progress-stats">
                <div className="progress-stat">
                  <div className="progress-stat-value">{completedSets.length}</div>
                  <div className="progress-stat-label">Sets completed</div>
                </div>
                <div className="progress-stat">
                  <div className="progress-stat-value">{totalWords}</div>
                  <div className="progress-stat-label">Words discovered</div>
                </div>
                {GAME_TIERS.map((tier) => {
                  const stat = tierStats.find((s) => s.slug === tier.slug)!;
                  return (
                    <div key={tier.slug} className="progress-stat">
                      <div className="progress-stat-value">
                        {stat.completed}/{stat.total}
                      </div>
                      <div className="progress-stat-label">{tier.label} sets</div>
                    </div>
                  );
                })}
              </div>

              {/* Tier Progress Bars */}
              <div className="tier-progress-bars">
                {GAME_TIERS.map((tier) => {
                  const stat = tierStats.find((s) => s.slug === tier.slug)!;
                  const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
                  return (
                    <div key={tier.slug} className="tier-progress-row">
                      <div className="tier-progress-label">
                        <span>{TIER_ICONS[tier.slug]} {tier.label}</span>
                        <span>{stat.completed}/{stat.total} sets</span>
                      </div>
                      <div className="tier-progress-track">
                        <div
                          className={`tier-progress-fill ${TIER_COLORS[tier.slug]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty">
              <div className="empty-icon">₿</div>
              <h4>No sats yet</h4>
              <p>Start playing to earn sats and track your Bitcoin knowledge progress. Everything is saved in this browser.</p>
              <Link
                href={`/play/word-search/${GAME_TIERS[0].sets[0].id}`}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 16 }}
              >
                ⚡ Start Stacking Sats
              </Link>
            </div>
          )}

          <p className="progress-note">
            Sats are game points — not real bitcoin (yet 😉). Progress is saved locally. Sign in to sync across devices.
          </p>
        </div>
      </section>
    </>
  );
}
