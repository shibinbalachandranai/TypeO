import { STORAGE_KEY, MAX_RECORDS } from './constants';

export interface GameRecord {
  id: string;
  date: string;
  playerName: string;
  score: number;
  level: number;
  hits: number;
  misses: number;
  accuracy: number;
  duration: number; // seconds
  charStats: Record<string, { hit: number; missed: number }>;
}

export function saveGame(record: GameRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadGames();
    const updated = [record, ...existing].slice(0, MAX_RECORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* storage full — ignore */ }
}

export function loadGames(): GameRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameRecord[]) : [];
  } catch { return []; }
}

export function clearGames(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportGames(): string {
  return JSON.stringify(loadGames(), null, 2);
}

export interface LeaderboardEntry {
  playerName: string;
  bestScore: number;
  totalGames: number;
  totalHits: number;
  totalMisses: number;
  avgAccuracy: number;
  bestLevel: number;
}

export function computeLeaderboard(): LeaderboardEntry[] {
  const games = loadGames();
  const map = new Map<string, LeaderboardEntry>();

  for (const g of games) {
    const key = g.playerName.toLowerCase();
    const prev = map.get(key);
    if (!prev) {
      map.set(key, {
        playerName: g.playerName,
        bestScore: g.score,
        totalGames: 1,
        totalHits: g.hits,
        totalMisses: g.misses,
        avgAccuracy: g.accuracy,
        bestLevel: g.level,
      });
    } else {
      prev.bestScore = Math.max(prev.bestScore, g.score);
      prev.totalGames += 1;
      prev.totalHits += g.hits;
      prev.totalMisses += g.misses;
      prev.avgAccuracy = Math.round(
        (prev.avgAccuracy * (prev.totalGames - 1) + g.accuracy) / prev.totalGames
      );
      prev.bestLevel = Math.max(prev.bestLevel, g.level);
    }
  }

  return [...map.values()].sort((a, b) => b.bestScore - a.bestScore);
}
