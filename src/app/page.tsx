'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { computeLeaderboard } from '@/lib/storage';
import type { LeaderboardEntry } from '@/lib/storage';

function FloatingPreviewCircle({ char, x, delay, duration, size, colorBg, colorBorder }: {
  char: string; x: number; delay: number; duration: number; size: number;
  colorBg: string; colorBorder: string;
}) {
  return (
    <div
      className="circle-falling"
      style={{
        left: `${x}%`,
        top: 0,
        width: size,
        height: size,
        fontSize: size * 0.42,
        color: '#e8f0ff',
        backgroundColor: colorBg,
        borderColor: colorBorder,
        boxShadow: `0 0 18px ${colorBorder}88`,
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        opacity: 0.5,
        pointerEvents: 'none',
      }}
    >
      {char}
    </div>
  );
}

const BG_CIRCLES = [
  { char: 'A', x: 8,  delay: 0,    duration: 7000, size: 60, colorBg: '#1e40af', colorBorder: '#60a5fa' },
  { char: '3', x: 22, delay: 1200, duration: 8500, size: 56, colorBg: '#065f46', colorBorder: '#34d399' },
  { char: 'K', x: 38, delay: 600,  duration: 6800, size: 68, colorBg: '#581c87', colorBorder: '#c084fc' },
  { char: 'Q', x: 55, delay: 2000, duration: 9000, size: 52, colorBg: '#7c2d12', colorBorder: '#fb923c' },
  { char: '7', x: 70, delay: 400,  duration: 7500, size: 64, colorBg: '#164e63', colorBorder: '#22d3ee' },
  { char: 'R', x: 85, delay: 1600, duration: 8000, size: 58, colorBg: '#881337', colorBorder: '#fb7185' },
];

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [top3, setTop3] = useState<LeaderboardEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTop3(computeLeaderboard().slice(0, 3));
    inputRef.current?.focus();
  }, []);

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your name'); return; }
    if (trimmed.length > 20) { setError('Name too long (max 20 chars)'); return; }
    router.push(`/game?player=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, #0d1f3c 0%, #060b14 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Animated background circles */}
      {BG_CIRCLES.map((c) => <FloatingPreviewCircle key={c.char} {...c} />)}

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Main card */}
      <div
        className="slide-in"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(13,21,38,0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: 24,
          padding: '40px 48px',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(56,189,248,0.06)',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: -3,
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              fontFamily: 'monospace',
            }}
          >
            TypeO
          </span>
        </div>
        <div style={{ fontSize: 14, color: '#5a7096', marginBottom: 36, letterSpacing: 0.5 }}>
          Blast the falling letters before they escape!
        </div>

        {/* Name input */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#5a7096', marginBottom: 8, letterSpacing: 1, textAlign: 'left', textTransform: 'uppercase' }}>
            Your Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Enter your name…"
            maxLength={20}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(56,189,248,0.2)'}`,
              borderRadius: 12,
              color: '#e8f0ff',
              fontSize: 16,
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'inherit',
            }}
          />
          {error && <div style={{ color: '#f87171', fontSize: 12, marginTop: 6, textAlign: 'left' }}>{error}</div>}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '15px 0',
            marginTop: 16,
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            border: 'none',
            borderRadius: 13,
            color: '#fff',
            fontSize: 17,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(56,189,248,0.35)',
            letterSpacing: 0.5,
            transition: 'transform 0.1s, box-shadow 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Start Game
        </button>

        {/* How to play */}
        <div
          style={{
            marginTop: 24,
            padding: '14px 16px',
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.1)',
            borderRadius: 10,
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
            How to Play
          </div>
          <ul style={{ fontSize: 13, color: '#5a7096', lineHeight: 1.7, listStyle: 'none', padding: 0 }}>
            <li>⌨️ Type the letter shown in each falling circle</li>
            <li>💥 Hit it before it reaches the bottom = +1 point</li>
            <li>❌ Miss it = −1 point &amp; a danger strike</li>
            <li>⚡ Speed increases as you level up</li>
            <li>☠️ Too many misses in a row = Game Over!</li>
          </ul>
        </div>

        {/* Top 3 mini-leaderboard */}
        {top3.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: '#5a7096', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
              Top Players
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {top3.map((entry, i) => (
                <div
                  key={entry.playerName}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{['🥇','🥈','🥉'][i]}</span>
                  <span style={{ flex: 1, fontSize: 13, color: '#e8f0ff', textAlign: 'left' }}>{entry.playerName}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
                    {entry.bestScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <a
            href="/leaderboard"
            style={{
              flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(30,45,74,0.8)', borderRadius: 10,
              color: '#5a7096', fontSize: 13, textDecoration: 'none', display: 'block', textAlign: 'center',
            }}
          >
            🏆 Leaderboard
          </a>
          <a
            href="/admin"
            style={{
              flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(30,45,74,0.8)', borderRadius: 10,
              color: '#5a7096', fontSize: 13, textDecoration: 'none', display: 'block', textAlign: 'center',
            }}
          >
            ⚙️ Admin
          </a>
        </div>
      </div>

      {/* Other Projects */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 480,
          width: '100%',
          marginTop: 20,
        }}
      >
        <div style={{ fontSize: 11, color: '#5a7096', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>
          More by Shibin Balachandran
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { emoji: '🐍', name: 'Snake & Soul', desc: 'Play Snake. Discover your mood.', href: 'https://shibinbalachandran.in/hobby/snake', color: '#34d399' },
            { emoji: '🎲', name: 'Snake & Ladder', desc: 'Classic board game with analytics', href: 'https://snakeladder-one.vercel.app/', color: '#60a5fa' },
            { emoji: '🎯', name: 'Ludo', desc: 'Neon cyberpunk 4-player Ludo', href: 'https://ludo-game-shibin.vercel.app', color: '#c084fc' },
          ].map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '12px 10px',
                background: 'rgba(13,21,38,0.7)',
                backdropFilter: 'blur(12px)',
                border: `1px solid rgba(30,45,74,0.8)`,
                borderRadius: 12,
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${p.color}55`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(30,45,74,0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{p.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.name}</div>
              <div style={{ fontSize: 10, color: '#5a7096', lineHeight: 1.4 }}>{p.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, marginTop: 24, fontSize: 12, color: 'rgba(90,112,150,0.5)' }}>
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
  );
}
