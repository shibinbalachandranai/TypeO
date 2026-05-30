'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { loadGames, computeLeaderboard, clearGames, exportGames } from '@/lib/storage';
import type { GameRecord, LeaderboardEntry } from '@/lib/storage';
import { ADMIN_PIN } from '@/lib/constants';

const PAGE_SIZE = 20;

function SVGBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: 12, color: '#5a7096', minWidth: 30, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [games, setGames] = useState<GameRecord[]>([]);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [page, setPage] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);

  const reload = useCallback(() => {
    setGames(loadGames());
    setBoard(computeLeaderboard());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ok = sessionStorage.getItem('typeo_admin_ok') === '1';
      if (ok) { setUnlocked(true); reload(); }
    }
  }, [reload]);

  const handleUnlock = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('typeo_admin_ok', '1');
      setUnlocked(true);
      reload();
    } else {
      setPinError('Incorrect PIN');
      setPin('');
    }
  };

  const handleExport = () => {
    const blob = new Blob([exportGames()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typeo-games-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearGames();
    setConfirmClear(false);
    reload();
  };

  if (!unlocked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at 50% 0%, #0d1f3c 0%, #060b14 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            background: 'rgba(13,21,38,0.9)',
            border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 20,
            padding: '40px 48px',
            maxWidth: 380,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: '#5a7096', marginBottom: 28 }}>Enter your PIN to continue</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="PIN"
            maxLength={8}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${pinError ? 'rgba(248,113,113,0.5)' : 'rgba(56,189,248,0.2)'}`,
              borderRadius: 10, color: '#e8f0ff', fontSize: 16,
              outline: 'none', textAlign: 'center', letterSpacing: 4, fontFamily: 'inherit',
            }}
          />
          {pinError && <div style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{pinError}</div>}
          <button
            onClick={handleUnlock}
            style={{
              width: '100%', marginTop: 16, padding: '13px 0',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Unlock
          </button>
          <Link href="/" style={{ display: 'block', marginTop: 14, fontSize: 12, color: '#5a7096', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Stats
  const totalGames = games.length;
  const totalHits = games.reduce((s, g) => s + g.hits, 0);
  const totalMisses = games.reduce((s, g) => s + g.misses, 0);
  const avgScore = totalGames > 0 ? Math.round(games.reduce((s, g) => s + g.score, 0) / totalGames) : 0;
  const avgAccuracy = totalGames > 0 ? Math.round(games.reduce((s, g) => s + g.accuracy, 0) / totalGames) : 0;
  const maxLevel = totalGames > 0 ? Math.max(...games.map((g) => g.level)) : 0;

  // Char frequency across all games
  const charFreq: Record<string, { hit: number; missed: number }> = {};
  for (const g of games) {
    for (const [ch, v] of Object.entries(g.charStats)) {
      if (!charFreq[ch]) charFreq[ch] = { hit: 0, missed: 0 };
      charFreq[ch].hit += v.hit;
      charFreq[ch].missed += v.missed;
    }
  }
  const charList = Object.entries(charFreq)
    .sort((a, b) => (b[1].hit + b[1].missed) - (a[1].hit + a[1].missed))
    .slice(0, 26);
  const maxCharTotal = charList.length > 0 ? Math.max(...charList.map(([, v]) => v.hit + v.missed)) : 1;

  const pagedGames = games.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(games.length / PAGE_SIZE);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #0d1f3c 0%, #060b14 70%)',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: 960, width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#5a7096', textDecoration: 'none', fontSize: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(30,45,74,0.8)', borderRadius: 8, padding: '6px 14px' }}>
            ← Home
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#38bdf8', flex: 1 }}>⚙️ Admin Dashboard</h1>
          <button
            onClick={handleExport}
            style={{ padding: '8px 16px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: '#38bdf8', fontSize: 13, cursor: 'pointer' }}
          >
            Export JSON
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: '8px 16px',
              background: confirmClear ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${confirmClear ? 'rgba(248,113,113,0.5)' : 'rgba(30,45,74,0.8)'}`,
              borderRadius: 8, color: confirmClear ? '#f87171' : '#5a7096', fontSize: 13, cursor: 'pointer',
            }}
          >
            {confirmClear ? 'Confirm Clear All?' : 'Clear All Data'}
          </button>
          {confirmClear && (
            <button
              onClick={() => setConfirmClear(false)}
              style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(30,45,74,0.8)', borderRadius: 8, color: '#5a7096', fontSize: 13, cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Overview cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Games', value: totalGames, color: '#38bdf8' },
            { label: 'Avg Score', value: avgScore, color: '#818cf8' },
            { label: 'Total Hits', value: totalHits, color: '#4ade80' },
            { label: 'Total Misses', value: totalMisses, color: '#f87171' },
            { label: 'Avg Accuracy', value: `${avgAccuracy}%`, color: '#fbbf24' },
            { label: 'Highest Level', value: maxLevel, color: '#c084fc' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: 'rgba(13,21,38,0.8)',
                border: '1px solid rgba(30,45,74,0.8)',
                borderRadius: 12, padding: '14px 16px',
              }}
            >
              <div style={{ fontSize: 11, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Char frequency */}
          <div style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(30,45,74,0.8)', borderRadius: 14, padding: '20px 20px' }}>
            <h3 style={{ fontSize: 13, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Character Frequency</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {charList.slice(0, 12).map(([ch, v]) => (
                <div key={ch} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#e8f0ff', fontFamily: 'monospace' }}>{ch}</span>
                  <SVGBar value={v.hit + v.missed} max={maxCharTotal} color="#38bdf8" />
                </div>
              ))}
            </div>
          </div>

          {/* Top players */}
          <div style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(30,45,74,0.8)', borderRadius: 14, padding: '20px 20px' }}>
            <h3 style={{ fontSize: 13, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Top Players</h3>
            {board.length === 0 ? (
              <div style={{ color: '#5a7096', fontSize: 13 }}>No data yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {board.slice(0, 8).map((entry, i) => (
                  <div key={entry.playerName} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: i < 3 ? 18 : 13, minWidth: 28, textAlign: 'center', color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#5a7096' }}>
                      {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                    </span>
                    <span style={{ flex: 1, fontSize: 13, color: '#e8f0ff' }}>{entry.playerName}</span>
                    <span style={{ fontSize: 12, color: '#5a7096' }}>{entry.totalGames}G</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8' }}>{entry.bestScore}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Games table */}
        <div style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(30,45,74,0.8)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(30,45,74,0.8)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3 style={{ fontSize: 13, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase', flex: 1 }}>
              All Sessions ({totalGames})
            </h3>
            <span style={{ fontSize: 12, color: '#5a7096' }}>Page {page + 1} / {Math.max(totalPages, 1)}</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(30,45,74,0.8)' }}>
                  {['Player','Score','Level','Hits','Misses','Accuracy','Duration','Date'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', color: '#5a7096', fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedGames.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#5a7096' }}>No games recorded yet</td>
                  </tr>
                ) : pagedGames.map((g, i) => (
                  <tr key={g.id} style={{ borderBottom: i < pagedGames.length - 1 ? '1px solid rgba(30,45,74,0.3)' : 'none' }}>
                    <td style={{ padding: '10px 16px', color: '#e8f0ff', fontWeight: 600 }}>{g.playerName}</td>
                    <td style={{ padding: '10px 16px', color: '#38bdf8', fontWeight: 800 }}>{g.score}</td>
                    <td style={{ padding: '10px 16px', color: '#818cf8' }}>{g.level}</td>
                    <td style={{ padding: '10px 16px', color: '#4ade80' }}>{g.hits}</td>
                    <td style={{ padding: '10px 16px', color: '#f87171' }}>{g.misses}</td>
                    <td style={{ padding: '10px 16px', color: g.accuracy > 75 ? '#4ade80' : g.accuracy > 50 ? '#fbbf24' : '#f87171' }}>{g.accuracy}%</td>
                    <td style={{ padding: '10px 16px', color: '#5a7096' }}>
                      {Math.floor(g.duration / 60)}:{(g.duration % 60).toString().padStart(2, '0')}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#5a7096', whiteSpace: 'nowrap' }}>
                      {new Date(g.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '14px 0', borderTop: '1px solid rgba(30,45,74,0.8)' }}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(30,45,74,0.8)', borderRadius: 7, color: page === 0 ? '#2a3a55' : '#5a7096', cursor: page === 0 ? 'default' : 'pointer', fontSize: 13 }}
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(30,45,74,0.8)', borderRadius: 7, color: page >= totalPages - 1 ? '#2a3a55' : '#5a7096', cursor: page >= totalPages - 1 ? 'default' : 'pointer', fontSize: 13 }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(90,112,150,0.5)' }}>
          Built by{' '}
          <a
            href="https://shibinbalachandran.in/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#38bdf8', textDecoration: 'none' }}
          >
            Shibin Balachandran
          </a>
          {' '}· {new Date().getFullYear()} · Powered by Next.js
        </div>
      </div>
    </div>
  );
}
