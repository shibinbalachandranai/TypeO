'use client';

import { useEffect, useRef, useState } from 'react';
import { GameState, getCurrentLevel } from '@/lib/gameEngine';
import { LEVELS } from '@/lib/constants';

interface Props {
  state: GameState;
  muted: boolean;
  onToggleMute: () => void;
}

export default function HUD({ state, muted, onToggleMute }: Props) {
  const prevScore = useRef(state.score);
  const [scorePop, setScorePop] = useState(false);
  const levelCfg = getCurrentLevel(state);
  const progress = Math.min((state.hitsThisLevel / 15) * 100, 100);

  // recent misses in window
  const now = Date.now();
  const recentMisses = state.missEvents.filter(
    (e) => now - e.timestamp < levelCfg.missWindow
  ).length;
  const dangerPct = Math.min((recentMisses / levelCfg.maxMissesInWindow) * 100, 100);

  useEffect(() => {
    if (state.score !== prevScore.current) {
      prevScore.current = state.score;
      setScorePop(true);
      const t = setTimeout(() => setScorePop(false), 300);
      return () => clearTimeout(t);
    }
  }, [state.score]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(6,11,20,0.98) 0%, rgba(6,11,20,0.0) 100%)',
        padding: '10px 20px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        pointerEvents: 'none',
      }}
    >
      {/* Score */}
      <div
        className={scorePop ? 'score-pop' : ''}
        style={{
          background: 'rgba(13,21,38,0.9)',
          border: '1px solid rgba(56,189,248,0.3)',
          borderRadius: 12,
          padding: '6px 18px',
          textAlign: 'center',
          minWidth: 110,
        }}
      >
        <div style={{ fontSize: 11, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase' }}>Score</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
          {state.score}
        </div>
      </div>

      {/* Level */}
      <div
        style={{
          background: 'rgba(13,21,38,0.9)',
          border: '1px solid rgba(129,140,248,0.3)',
          borderRadius: 12,
          padding: '6px 18px',
          minWidth: 110,
        }}
      >
        <div style={{ fontSize: 11, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase' }}>Level</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#818cf8' }}>
          {state.level} <span style={{ fontSize: 12, fontWeight: 400, color: '#5a7096' }}>{levelCfg.label}</span>
        </div>
        {/* level progress bar */}
        <div style={{ marginTop: 4, height: 4, background: 'rgba(129,140,248,0.15)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6366f1, #818cf8)',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        {state.level < LEVELS.length && (
          <div style={{ fontSize: 10, color: '#5a7096', marginTop: 2 }}>
            {15 - state.hitsThisLevel} hits to next level
          </div>
        )}
      </div>

      {/* Hits / Misses */}
      <div
        style={{
          background: 'rgba(13,21,38,0.9)',
          border: '1px solid rgba(30,45,74,0.8)',
          borderRadius: 12,
          padding: '6px 18px',
          display: 'flex',
          gap: 18,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#5a7096', letterSpacing: 1 }}>HITS</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#4ade80' }}>{state.hits}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#5a7096', letterSpacing: 1 }}>MISSED</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f87171' }}>{state.misses}</div>
        </div>
      </div>

      {/* Danger meter */}
      <div
        style={{
          background: 'rgba(13,21,38,0.9)',
          border: `1px solid ${dangerPct > 60 ? 'rgba(248,113,113,0.5)' : 'rgba(30,45,74,0.8)'}`,
          borderRadius: 12,
          padding: '6px 14px',
          minWidth: 120,
          transition: 'border-color 0.3s',
        }}
      >
        <div style={{ fontSize: 11, color: '#5a7096', letterSpacing: 1 }}>DANGER</div>
        <div style={{ fontSize: 12, color: dangerPct > 60 ? '#f87171' : '#5a7096', marginBottom: 4 }}>
          {recentMisses} / {levelCfg.maxMissesInWindow} misses
        </div>
        <div style={{ height: 6, background: 'rgba(248,113,113,0.15)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${dangerPct}%`,
              background: dangerPct > 75
                ? '#f87171'
                : dangerPct > 50
                ? '#fbbf24'
                : '#4ade80',
              borderRadius: 3,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Mute button */}
      <button
        onClick={onToggleMute}
        style={{
          background: 'rgba(13,21,38,0.9)',
          border: '1px solid rgba(30,45,74,0.8)',
          borderRadius: 10,
          padding: '8px 14px',
          color: muted ? '#5a7096' : '#38bdf8',
          fontSize: 20,
          cursor: 'pointer',
          pointerEvents: 'all',
          transition: 'color 0.2s',
        }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
