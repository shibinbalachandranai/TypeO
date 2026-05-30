'use client';

import { useEffect, useState } from 'react';
import { sounds } from '@/lib/sounds';

interface Props {
  onDone: () => void;
  muted: boolean;
}

export default function Countdown({ onDone, muted }: Props) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!muted) sounds.countdownBeep(count === 1);
    if (count === 0) { onDone(); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onDone, muted]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        background: 'rgba(6,11,20,0.85)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ fontSize: 14, color: '#5a7096', letterSpacing: 3, marginBottom: 16, textTransform: 'uppercase' }}>
        Get Ready!
      </div>
      <div
        key={count}
        style={{
          fontSize: count === 0 ? 64 : 120,
          fontWeight: 900,
          color: count === 1 ? '#f87171' : count === 2 ? '#fbbf24' : '#38bdf8',
          textShadow: `0 0 40px currentColor`,
          animation: 'score-pop 0.5s ease-out',
          letterSpacing: -2,
        }}
      >
        {count === 0 ? 'GO!' : count}
      </div>
      <div style={{ fontSize: 14, color: '#5a7096', marginTop: 24 }}>
        Type the letters as they fall!
      </div>
    </div>
  );
}
