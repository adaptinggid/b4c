/**
 * Game progress management
 * - Guest players: localStorage
 * - Registered users: API + localStorage cache
 */

import type { Difficulty } from './types';

const STORAGE_KEY = 'b4c_word_search_progress_v2';
const SESSION_KEY = 'b4c_word_search_session_v2';

// ---------- Guest (localStorage) ----------

export interface GuestProgress {
  /** Set IDs that have been completed */
  completedSets: string[];
  /** Total sats earned across all sessions */
  totalSats: number;
  /** Total words found across all sessions */
  totalWordsFound: number;
  lastPlayedAt: string;
  sessions: Record<string, SavedSession>;
}

export interface SavedSession {
  setId: string;
  tierId: Difficulty;
  foundWords: string[];
  satsEarned: number;
  hintsUsed: number;
  elapsedSeconds: number;
  status: 'playing' | 'paused' | 'completed';
  puzzleSeed: number;
  completedAt?: string;
}

function getStorage(): GuestProgress {
  if (typeof window === 'undefined') {
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
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

function defaultProgress(): GuestProgress {
  return {
    completedSets: [],
    totalSats: 0,
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
  progress.sessions[session.setId] = session;
  progress.lastPlayedAt = new Date().toISOString();

  if (session.status === 'completed') {
    if (!progress.completedSets.includes(session.setId)) {
      progress.completedSets.push(session.setId);
      progress.totalSats += session.satsEarned;
      progress.totalWordsFound += session.foundWords.length;
    }
  }

  setStorage(progress);
}

export function getGuestSession(setId: string): SavedSession | null {
  const progress = getStorage();
  return progress.sessions[setId] || null;
}

export function clearGuestSession(setId: string): void {
  const progress = getStorage();
  delete progress.sessions[setId];
  setStorage(progress);
}

// ---------- Active session (sessionStorage) ----------

export interface ActiveSessionState {
  setId: string;
  tierId: Difficulty;
  foundWords: string[];
  satsEarned: number;
  hintsUsed: number;
  startTime: number;
  elapsedSeconds: number;
  status: 'playing' | 'paused' | 'completed';
  puzzleSeed: number;
}

export function saveActiveSession(state: ActiveSessionState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_KEY + '_' + state.setId, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function getActiveSession(setId: string): ActiveSessionState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY + '_' + setId);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function clearActiveSession(setId: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_KEY + '_' + setId);
  } catch {
    // ignore
  }
}

// ---------- Legacy shim for old code referencing levelId numbers ----------

export function saveGuestSession_legacy(session: {
  levelId: number;
  foundWords: string[];
  score: number;
  hintsUsed: number;
  elapsedSeconds: number;
  status: 'playing' | 'paused' | 'completed';
  puzzleSeed: number;
  completedAt?: string;
}): void {
  saveGuestSession({
    setId: String(session.levelId),
    tierId: 'beginner',
    foundWords: session.foundWords,
    satsEarned: session.score,
    hintsUsed: session.hintsUsed,
    elapsedSeconds: session.elapsedSeconds,
    status: session.status,
    puzzleSeed: session.puzzleSeed,
    completedAt: session.completedAt,
  });
}
