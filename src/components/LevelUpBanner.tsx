'use client';

import { useEffect, useState } from 'react';

interface Props {
  level: number;
  label: string;
}

export default function LevelUpBanner({ level, label }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 80,
        textAlign: 'center',
        pointerEvents: 'none',
        animation: 'score-pop 0.4s ease-out',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(56,189,248,0.9))',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(129,140,248,0.6)',
          borderRadius: 20,
          padding: '16px 40px',
          boxShadow: '0 0 60px rgba(99,102,241,0.5)',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: 3, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
          Level Up!
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
          {level}
        </div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginTop: 2 }}>
          {label}
        </div>
      </div>
    </div>
  );
}
