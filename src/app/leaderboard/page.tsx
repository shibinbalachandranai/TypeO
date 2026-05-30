'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { computeLeaderboard, loadGames } from '@/lib/storage';
import type { LeaderboardEntry, GameRecord } from '@/lib/storage';

export default function LeaderboardPage() {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [recent, setRecent] = useState<GameRecord[]>([]);

  useEffect(() => {
    setBoard(computeLeaderboard());
    setRecent(loadGames().slice(0, 10));
  }, []);

  const rankStyle = (i: number): React.CSSProperties => ({
    fontSize: i < 3 ? 20 : 14,
    minWidth: 32,
    textAlign: 'center',
    color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#5a7096',
  });

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
      <div style={{ maxWidth: 700, width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link
            href="/"
            style={{
              color: '#5a7096', textDecoration: 'none', fontSize: 13,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(30,45,74,0.8)',
              borderRadius: 8, padding: '6px 14px',
            }}
          >
            ← Home
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#38bdf8', flex: 1 }}>
            🏆 Leaderboard
          </h1>
        </div>

        {/* Top players */}
        <div
          style={{
            background: 'rgba(13,21,38,0.8)',
            border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 24,
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(30,45,74,0.8)' }}>
            <h2 style={{ fontSize: 14, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase' }}>
              All-Time Best Scores
            </h2>
          </div>

          {board.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#5a7096' }}>
              No games yet — be the first to play!
            </div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {board.slice(0, 20).map((entry, i) => (
                <div
                  key={entry.playerName}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 20px',
                    borderBottom: i < board.length - 1 ? '1px solid rgba(30,45,74,0.4)' : 'none',
                    background: i < 3 ? 'rgba(56,189,248,0.03)' : 'transparent',
                  }}
                >
                  <span style={rankStyle(i)}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, color: '#e8f0ff', fontSize: 15 }}>
                    {entry.playerName}
                  </span>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#5a7096' }}>
                      Best Lv.{entry.bestLevel}
                    </span>
                    <span style={{ fontSize: 11, color: '#5a7096' }}>
                      {entry.avgAccuracy}% acc
                    </span>
                    <span style={{ fontSize: 11, color: '#5a7096' }}>
                      {entry.totalGames}G
                    </span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8', fontVariantNumeric: 'tabular-nums', minWidth: 60, textAlign: 'right' }}>
                      {entry.bestScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent games */}
        {recent.length > 0 && (
          <div
            style={{
              background: 'rgba(13,21,38,0.8)',
              border: '1px solid rgba(30,45,74,0.8)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(30,45,74,0.8)' }}>
              <h2 style={{ fontSize: 14, color: '#5a7096', letterSpacing: 1, textTransform: 'uppercase' }}>
                Recent Games
              </h2>
            </div>
            <div style={{ padding: '8px 0' }}>
              {recent.map((g, i) => (
                <div
                  key={g.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 20px',
                    borderBottom: i < recent.length - 1 ? '1px solid rgba(30,45,74,0.3)' : 'none',
                  }}
                >
                  <span style={{ flex: 1, fontSize: 14, color: '#e8f0ff' }}>{g.playerName}</span>
                  <span style={{ fontSize: 12, color: '#5a7096' }}>Lv {g.level}</span>
                  <span style={{ fontSize: 12, color: '#4ade80' }}>{g.hits}✓</span>
                  <span style={{ fontSize: 12, color: '#f87171' }}>{g.misses}✗</span>
                  <span style={{ fontSize: 12, color: '#fbbf24' }}>{g.accuracy}%</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', minWidth: 50, textAlign: 'right' }}>
                    {g.score}
                  </span>
                  <span style={{ fontSize: 11, color: '#5a7096', minWidth: 80, textAlign: 'right' }}>
                    {new Date(g.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'rgba(90,112,150,0.5)' }}>
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
