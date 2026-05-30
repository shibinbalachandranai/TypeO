import { CHARS, LEVELS, CIRCLE_COLORS, LevelConfig } from './constants';

export interface FallingCircle {
  id: string;
  char: string;
  x: number;        // % from left
  colorIdx: number;
  spawnedAt: number;
  fallDuration: number;
  size: number;
  state: 'falling' | 'blasting' | 'missing';
}

export interface MissEvent {
  timestamp: number;
}

export interface GameState {
  phase: 'idle' | 'countdown' | 'playing' | 'gameover';
  score: number;
  hits: number;
  misses: number;
  level: number;
  hitsThisLevel: number;
  circles: FallingCircle[];
  missEvents: MissEvent[];
  charStats: Record<string, { hit: number; missed: number }>;
  startedAt: number;
  playerName: string;
}

export type GameAction =
  | { type: 'START'; playerName: string }
  | { type: 'SPAWN_CIRCLE'; circle: FallingCircle }
  | { type: 'KEY_PRESSED'; key: string; now: number }
  | { type: 'CIRCLE_ESCAPED'; id: string; now: number }
  | { type: 'CIRCLE_ANIM_DONE'; id: string }
  | { type: 'TICK_CLEANUP'; now: number }
  | { type: 'COUNTDOWN_DONE' };

export function initialState(): GameState {
  return {
    phase: 'idle',
    score: 0,
    hits: 0,
    misses: 0,
    level: 1,
    hitsThisLevel: 0,
    circles: [],
    missEvents: [],
    charStats: {},
    startedAt: 0,
    playerName: '',
  };
}

export function getCurrentLevel(state: GameState): LevelConfig {
  return LEVELS[Math.min(state.level - 1, LEVELS.length - 1)];
}

function updateCharStat(
  stats: Record<string, { hit: number; missed: number }>,
  char: string,
  which: 'hit' | 'missed'
): Record<string, { hit: number; missed: number }> {
  const prev = stats[char] ?? { hit: 0, missed: 0 };
  return { ...stats, [char]: { ...prev, [which]: prev[which] + 1 } };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return {
        ...initialState(),
        phase: 'countdown',
        playerName: action.playerName,
        startedAt: Date.now(),
      };

    case 'COUNTDOWN_DONE':
      return { ...state, phase: 'playing', startedAt: Date.now() };

    case 'SPAWN_CIRCLE':
      return { ...state, circles: [...state.circles, action.circle] };

    case 'KEY_PRESSED': {
      const key = action.key.toUpperCase();
      const idx = state.circles.findIndex(
        (c) => c.char === key && c.state === 'falling'
      );
      if (idx === -1) return state; // no matching circle

      const levelCfg = getCurrentLevel(state);
      const circle = state.circles[idx];
      const updated = [...state.circles];
      updated[idx] = { ...circle, state: 'blasting' };

      const newHits = state.hits + 1;
      const newHitsThisLevel = state.hitsThisLevel + 1;
      let newLevel = state.level;
      let finalHitsThisLevel = newHitsThisLevel;

      if (newHitsThisLevel >= 15 && state.level < LEVELS.length) {
        newLevel = state.level + 1;
        finalHitsThisLevel = 0;
      }

      return {
        ...state,
        score: state.score + levelCfg.pointsPerHit,
        hits: newHits,
        hitsThisLevel: finalHitsThisLevel,
        level: newLevel,
        circles: updated,
        charStats: updateCharStat(state.charStats, circle.char, 'hit'),
      };
    }

    case 'CIRCLE_ESCAPED': {
      const idx = state.circles.findIndex(
        (c) => c.id === action.id && c.state === 'falling'
      );
      if (idx === -1) return state;

      const circle = state.circles[idx];
      const updated = [...state.circles];
      updated[idx] = { ...circle, state: 'missing' };

      const newMissEvents = [
        ...state.missEvents.filter((e) => action.now - e.timestamp < 60000),
        { timestamp: action.now },
      ];
      const levelCfg = getCurrentLevel(state);
      const windowMisses = newMissEvents.filter(
        (e) => action.now - e.timestamp < levelCfg.missWindow
      ).length;

      const isGameOver = windowMisses >= levelCfg.maxMissesInWindow;

      return {
        ...state,
        score: Math.max(0, state.score - 1),
        misses: state.misses + 1,
        missEvents: newMissEvents,
        circles: updated,
        charStats: updateCharStat(state.charStats, circle.char, 'missed'),
        phase: isGameOver ? 'gameover' : state.phase,
      };
    }

    case 'CIRCLE_ANIM_DONE':
      return {
        ...state,
        circles: state.circles.filter((c) => c.id !== action.id),
      };

    case 'TICK_CLEANUP': {
      const levelCfg = getCurrentLevel(state);
      const windowMisses = state.missEvents.filter(
        (e) => action.now - e.timestamp < levelCfg.missWindow
      ).length;
      const isGameOver = windowMisses >= levelCfg.maxMissesInWindow;
      return {
        ...state,
        phase: isGameOver ? 'gameover' : state.phase,
      };
    }

    default:
      return state;
  }
}

export function makeCircle(levelCfg: LevelConfig): FallingCircle {
  const chars = levelCfg.numbersEnabled ? CHARS : CHARS.slice(0, 26);
  const char = chars[Math.floor(Math.random() * chars.length)];
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    char,
    x: 5 + Math.random() * 88, // % from left, keep away from edges
    colorIdx: Math.floor(Math.random() * CIRCLE_COLORS.length),
    spawnedAt: Date.now(),
    fallDuration: levelCfg.fallDuration,
    size: levelCfg.circleSize,
    state: 'falling',
  };
}
