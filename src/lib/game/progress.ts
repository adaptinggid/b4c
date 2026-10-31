/**
 * Game progress management
 * - Guest players: localStorage
 * - Registered users: API + localStorage cache
 */

import type { GameSessionState } from "./types";

const STORAGE_KEY = "b4c_word_search_progress";
const SESSION_KEY = "b4c_word_search_session";

// ---------- Guest (localStorage) ----------

export interface GuestProgress {
  completedLevels: number[];
  totalGamePoints: number;
  totalWordsFound: number;
  lastPlayedAt: string;
  sessions: Record<number, SavedSession>;
}

export interface SavedSession {
  levelId: number;
  foundWords: string[];
  score: number;
  hintsUsed: number;
  elapsedSeconds: number;
  status: "playing" | "paused" | "completed";
  puzzleSeed: number;
  completedAt?: string;
}

function getStorage(): GuestProgress {
  if (typeof window === "undefined") {
    return defaultProgress();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data
  }
  return defaultProgress();
}

function setStorage(data: GuestProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

function defaultProgress(): GuestProgress {
  return {
    completedLevels: [],
    totalGamePoints: 0,
    totalWordsFound: 0,
    lastPlayedAt: new Date().toISOString(),
    sessions: {},
  };
}

export function getGuestProgress(): GuestProgress {
  return getStorage();
}

export function saveGuestSession(session: SavedSession): void {
  const progress = getStorage();
  progress.sessions[session.levelId] = session;
  progress.lastPlayedAt = new Date().toISOString();

  if (session.status === "completed") {
    if (!progress.completedLevels.includes(session.levelId)) {
      progress.completedLevels.push(session.levelId);
    }
    progress.totalGamePoints += session.score;
    progress.totalWordsFound += session.foundWords.length;
  }

  setStorage(progress);
}

export function getGuestSession(levelId: number): SavedSession | null {
  const progress = getStorage();
  return progress.sessions[levelId] || null;
}

export function clearGuestSession(levelId: number): void {
  const progress = getStorage();
  delete progress.sessions[levelId];
  setStorage(progress);
}

// ---------- Active session (in-memory backup to sessionStorage) ----------

export function saveActiveSession(state: GameSessionState & { puzzleSeed: number }): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY + "_" + state.levelId, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function getActiveSession(levelId: number): (GameSessionState & { puzzleSeed: number }) | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY + "_" + levelId);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function clearActiveSession(levelId: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY + "_" + levelId);
  } catch {
    // ignore
  }
}
