'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  gameReducer,
  initialState,
  makeCircle,
  getCurrentLevel,
  GameState,
} from '@/lib/gameEngine';
import { sounds } from '@/lib/sounds';
import { saveGame } from '@/lib/storage';
import FallingCircle from '@/components/FallingCircle';
import HUD from '@/components/HUD';
import Countdown from '@/components/Countdown';
import GameSummaryModal from '@/components/GameSummaryModal';
import LevelUpBanner from '@/components/LevelUpBanner';
import { LEVELS } from '@/lib/constants';

function GameInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player') ?? 'Player';

  const [state, dispatch] = useReducer(gameReducer, initialState());
  const [muted, setMuted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [gameDuration, setGameDuration] = useState(0);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; label: string } | null>(null);
  const prevLevel = useRef(1);
  const spawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const mutableStateRef = useRef<GameState>(state);
  mutableStateRef.current = state;

  const mutableMutedRef = useRef(muted);
  mutableMutedRef.current = muted;

  // Auto-start for returning player
  useEffect(() => {
    dispatch({ type: 'START', playerName });
  }, [playerName]);

  // Detect level up
  useEffect(() => {
    if (state.level > prevLevel.current && state.phase === 'playing') {
      const cfg = LEVELS[Math.min(state.level - 1, LEVELS.length - 1)];
      setLevelUpInfo({ level: state.level, label: cfg.label });
      if (!muted) sounds.levelUp();
      prevLevel.current = state.level;
      const t = setTimeout(() => setLevelUpInfo(null), 2200);
      return () => clearTimeout(t);
    }
  }, [state.level, state.phase, muted]);

  // Spawn circles
  useEffect(() => {
    if (state.phase !== 'playing') {
      if (spawnRef.current) clearTimeout(spawnRef.current);
      return;
    }

    const scheduleSpawn = () => {
      const s = mutableStateRef.current;
      if (s.phase !== 'playing') return;
      const cfg = getCurrentLevel(s);
      const activeFalling = s.circles.filter((c) => c.state === 'falling').length;
      if (activeFalling < cfg.maxOnScreen) {
        const circle = makeCircle(cfg);
        dispatch({ type: 'SPAWN_CIRCLE', circle });
        if (!mutableMutedRef.current) sounds.spawn();
      }
      spawnRef.current = setTimeout(scheduleSpawn, cfg.spawnInterval);
    };

    spawnRef.current = setTimeout(scheduleSpawn, 300);
    return () => { if (spawnRef.current) clearTimeout(spawnRef.current); };
  }, [state.phase]);

  // Keydown handler
  useEffect(() => {
    if (state.phase !== 'playing') return;

    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      if (!/^[A-Z0-9]$/.test(key)) return;

      const s = mutableStateRef.current;
      const match = s.circles.find((c) => c.char === key && c.state === 'falling');
      if (match) {
        dispatch({ type: 'KEY_PRESSED', key, now: Date.now() });
        if (!mutableMutedRef.current) sounds.hit();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.phase]);

  // Game over
  useEffect(() => {
    if (state.phase === 'gameover' && !savedRef.current) {
      savedRef.current = true;
      const dur = Math.round((Date.now() - startTimeRef.current) / 1000);
      setGameDuration(dur);
      if (!muted) sounds.gameOver();
      setTimeout(() => setShowSummary(true), 600);

      const accuracy = state.hits + state.misses > 0
        ? Math.round((state.hits / (state.hits + state.misses)) * 100)
        : 0;
      saveGame({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: new Date().toISOString(),
        playerName: state.playerName,
        score: state.score,
        level: state.level,
        hits: state.hits,
        misses: state.misses,
        accuracy,
        duration: dur,
        charStats: state.charStats,
      });
    }
  }, [state.phase, state, muted]);

  const handleCountdownDone = useCallback(() => {
    startTimeRef.current = Date.now();
    dispatch({ type: 'COUNTDOWN_DONE' });
  }, []);

  const handleEscaped = useCallback((id: string) => {
    dispatch({ type: 'CIRCLE_ESCAPED', id, now: Date.now() });
    if (!mutableMutedRef.current) sounds.miss();
  }, []);

  const handleAnimDone = useCallback((id: string) => {
    dispatch({ type: 'CIRCLE_ANIM_DONE', id });
  }, []);

  const handlePlayAgain = () => {
    savedRef.current = false;
    prevLevel.current = 1;
    setShowSummary(false);
    setLevelUpInfo(null);
    dispatch({ type: 'START', playerName });
  };

  const handleHome = () => router.push('/');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, #0d1f3c 0%, #060b14 70%)',
      }}
    >
      {/* Starfield background */}
      <Stars />

      {/* HUD */}
      <HUD state={state} muted={muted} onToggleMute={() => setMuted((m) => !m)} />

      {/* Falling circles */}
      {state.circles.map((circle) => (
        <FallingCircle
          key={circle.id}
          circle={circle}
          onEscaped={handleEscaped}
          onAnimDone={handleAnimDone}
        />
      ))}

      {/* Level up banner */}
      {levelUpInfo && (
        <LevelUpBanner key={levelUpInfo.level} level={levelUpInfo.level} label={levelUpInfo.label} />
      )}

      {/* Countdown */}
      {state.phase === 'countdown' && (
        <Countdown onDone={handleCountdownDone} muted={muted} />
      )}

      {/* Game summary */}
      {showSummary && (
        <GameSummaryModal
          state={state}
          duration={gameDuration}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      )}

      {/* Key hint footer */}
      {state.phase === 'playing' && (
        <div
          style={{
            position: 'fixed',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 12,
            color: 'rgba(90,112,150,0.6)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Type the letter shown in each circle to blast it!
        </div>
      )}
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    opacity: 0.2 + Math.random() * 0.4,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#fff',
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div style={{ color: '#5a7096', padding: 40 }}>Loading…</div>}>
      <GameInner />
    </Suspense>
  );
}
