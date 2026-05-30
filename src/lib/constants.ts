export const STORAGE_KEY = 'typeo_games_v1';
export const MAX_RECORDS = 500;
export const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? '1234';

export const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export interface LevelConfig {
  level: number;
  label: string;
  fallDuration: number;   // ms for a circle to fall full screen
  spawnInterval: number;  // ms between new circle spawns
  maxOnScreen: number;    // max circles at once
  missWindow: number;     // ms window to count misses
  maxMissesInWindow: number; // misses in window = game over
  pointsPerHit: number;
  circleSize: number;     // px diameter
  numbersEnabled: boolean;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, label: 'Warm Up',    fallDuration: 5000, spawnInterval: 2000, maxOnScreen: 4,  missWindow: 30000, maxMissesInWindow: 5,  pointsPerHit: 1, circleSize: 80, numbersEnabled: false },
  { level: 2, label: 'Getting Hot', fallDuration: 4200, spawnInterval: 1700, maxOnScreen: 5,  missWindow: 30000, maxMissesInWindow: 5,  pointsPerHit: 1, circleSize: 76, numbersEnabled: false },
  { level: 3, label: 'On Fire',    fallDuration: 3500, spawnInterval: 1400, maxOnScreen: 6,  missWindow: 45000, maxMissesInWindow: 6,  pointsPerHit: 2, circleSize: 72, numbersEnabled: true  },
  { level: 4, label: 'Blazing',    fallDuration: 2900, spawnInterval: 1200, maxOnScreen: 7,  missWindow: 45000, maxMissesInWindow: 5,  pointsPerHit: 2, circleSize: 68, numbersEnabled: true  },
  { level: 5, label: 'Turbo',      fallDuration: 2400, spawnInterval: 1000, maxOnScreen: 8,  missWindow: 60000, maxMissesInWindow: 5,  pointsPerHit: 3, circleSize: 64, numbersEnabled: true  },
  { level: 6, label: 'Insane',     fallDuration: 2000, spawnInterval: 850,  maxOnScreen: 9,  missWindow: 60000, maxMissesInWindow: 4,  pointsPerHit: 3, circleSize: 60, numbersEnabled: true  },
  { level: 7, label: 'Legendary',  fallDuration: 1700, spawnInterval: 700,  maxOnScreen: 10, missWindow: 60000, maxMissesInWindow: 4,  pointsPerHit: 4, circleSize: 56, numbersEnabled: true  },
  { level: 8, label: 'God Mode',   fallDuration: 1400, spawnInterval: 550,  maxOnScreen: 12, missWindow: 60000, maxMissesInWindow: 3,  pointsPerHit: 5, circleSize: 52, numbersEnabled: true  },
];

export const LEVEL_UP_HITS = 15; // hits to advance a level

export const CIRCLE_COLORS = [
  { bg: '#1e40af', border: '#60a5fa', text: '#dbeafe' }, // blue
  { bg: '#065f46', border: '#34d399', text: '#d1fae5' }, // green
  { bg: '#7c2d12', border: '#fb923c', text: '#ffedd5' }, // orange
  { bg: '#581c87', border: '#c084fc', text: '#f3e8ff' }, // purple
  { bg: '#881337', border: '#fb7185', text: '#ffe4e6' }, // pink
  { bg: '#164e63', border: '#22d3ee', text: '#cffafe' }, // cyan
  { bg: '#713f12', border: '#fbbf24', text: '#fef9c3' }, // yellow
  { bg: '#134e4a', border: '#2dd4bf', text: '#ccfbf1' }, // teal
];
