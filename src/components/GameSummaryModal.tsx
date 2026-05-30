'use client';

import { useEffect, useState } from 'react';
import { GameState } from '@/lib/gameEngine';

interface Props {
  state: GameState;
  duration: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    color: ['#38bdf8','#818cf8','#4ade80','#fbbf24','#f87171','#c084fc'][i % 6],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 200 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : 2,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

function BarChart({ data }: { data: { label: string; hit: number; missed: number }[] }) {
  const max = Math.max(...data.map((d) => d.hit + d.missed), 1);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80, overflowX: 'auto', padding: '0 2px' }}>
      {data.map((d) => (
        <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: 22, height: 64 }}>
            <div
              style={{
                width: '100%',
                height: `${(d.missed / max) * 64}px`,
                background: '#f87171',
                borderRadius: '3px 3px 0 0',
                minHeight: d.missed > 0 ? 3 : 0,
              }}
            />
            <div
              style={{
                width: '100%',
                height: `${(d.hit / max) * 64}px`,
                background: '#4ade80',
                borderRadius: d.missed > 0 ? '0' : '3px 3px 0 0',
                minHeight: d.hit > 0 ? 3 : 0,
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#5a7096' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function GameSummaryModal({ state, duration, onPlayAgain, onHome }: Props) {
  const [visible, setVisible] = useState(false);
  const accuracy = state.hits + state.misses > 0
    ? Math.round((state.hits / (state.hits + state.misses)) * 100)
    : 0;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const mins = Math.floor(duration / 60);
  const secs = duration % 60;

  // top 10 most-seen chars
  const chartData = Object.entries(state.charStats)
    .map(([label, v]) => ({ label, hit: v.hit, missed: v.missed }))
    .sort((a, b) => (b.hit + b.missed) - (a.hit + a.missed))
    .slice(0, 20);

  // missed chars sorted by miss count
  const mostMissed = Object.entries(state.charStats)
    .filter(([, v]) => v.missed > 0)
    .sort((a, b) => b[1].missed - a[1].missed)
    .slice(0, 8);

  // best chars
  const bestChars = Object.entries(state.charStats)
    .filter(([, v]) => v.hit > 0)
    .sort((a, b) => b[1].hit - a[1].hit)
    .slice(0, 5);

  if (!visible) return null;

  return (
    <>
      <Confetti />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(6,11,20,0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          overflowY: 'auto',
        }}
      >
        <div
          className="slide-in"
          style={{
            background: 'linear-gradient(135deg, #0d1526 0%, #0a1020 100%)',
            border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 20,
            padding: 32,
            maxWidth: 680,
            width: '100%',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,189,248,0.08)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎮</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#38bdf8', marginBottom: 4 }}>Game Over!</h2>
            <p style={{ color: '#5a7096', fontSize: 14 }}>{state.playerName} — well played!</p>
          </div>

          {/* Score highlight */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(129,140,248,0.1))',
              border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: 14,
              padding: '16px 24px',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 12, color: '#5a7096', letterSpacing: 2, textTransform: 'uppercase' }}>Final Score</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#38bdf8', lineHeight: 1.1 }}>{state.score}</div>
            <div style={{ fontSize: 14, color: '#818cf8' }}>Level {state.level} reached</div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Hits', value: state.hits, color: '#4ade80' },
              { label: 'Missed', value: state.misses, color: '#f87171' },
              { label: 'Accuracy', value: `${accuracy}%`, color: accuracy > 75 ? '#4ade80' : accuracy > 50 ? '#fbbf24' : '#f87171' },
              { label: 'Time', value: `${mins}:${secs.toString().padStart(2, '0')}`, color: '#fbbf24' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(30,45,74,0.8)',
                  borderRadius: 10,
                  padding: '10px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 11, color: '#5a7096', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: '#5a7096', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
                Character Breakdown
              </div>
              <BarChart data={chartData} />
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#5a7096' }}>
                <span><span style={{ color: '#4ade80' }}>■</span> Hit</span>
                <span><span style={{ color: '#f87171' }}>■</span> Missed</span>
              </div>
            </div>
          )}

          {/* Missed chars */}
          {mostMissed.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#5a7096', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
                Practice These Keys
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {mostMissed.map(([char, v]) => (
                  <div
                    key={char}
                    style={{
                      background: 'rgba(248,113,113,0.1)',
                      border: '1px solid rgba(248,113,113,0.3)',
                      borderRadius: 8,
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#f87171', fontFamily: 'monospace' }}>{char}</span>
                    <span style={{ fontSize: 11, color: '#5a7096' }}>{v.missed}× missed</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best chars */}
          {bestChars.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: '#5a7096', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
                Your Best Keys
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {bestChars.map(([char, v]) => (
                  <div
                    key={char}
                    style={{
                      background: 'rgba(74,222,128,0.1)',
                      border: '1px solid rgba(74,222,128,0.3)',
                      borderRadius: 8,
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{char}</span>
                    <span style={{ fontSize: 11, color: '#5a7096' }}>{v.hit}× hit</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onPlayAgain}
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(56,189,248,0.3)',
              }}
            >
              Play Again
            </button>
            <button
              onClick={onHome}
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(30,45,74,0.8)',
                borderRadius: 12,
                color: '#5a7096',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
