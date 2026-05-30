'use client';

import { useEffect, useRef } from 'react';
import { FallingCircle as FallingCircleType } from '@/lib/gameEngine';
import { CIRCLE_COLORS } from '@/lib/constants';

interface Props {
  circle: FallingCircleType;
  onEscaped: (id: string) => void;
  onAnimDone: (id: string) => void;
}

export default function FallingCircle({ circle, onEscaped, onAnimDone }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const escapedRef = useRef(false);
  const color = CIRCLE_COLORS[circle.colorIdx];

  useEffect(() => {
    if (circle.state !== 'falling') return;
    const el = ref.current;
    if (!el) return;

    const timer = setTimeout(() => {
      if (!escapedRef.current && circle.state === 'falling') {
        escapedRef.current = true;
        onEscaped(circle.id);
      }
    }, circle.fallDuration);

    return () => clearTimeout(timer);
  }, [circle.id, circle.state, circle.fallDuration, onEscaped]);

  useEffect(() => {
    if (circle.state === 'blasting' || circle.state === 'missing') {
      const timer = setTimeout(() => onAnimDone(circle.id), 420);
      return () => clearTimeout(timer);
    }
  }, [circle.state, circle.id, onAnimDone]);

  const size = circle.size;
  const fontSize = size * 0.42;

  const stateClass =
    circle.state === 'blasting' ? 'circle-blast' :
    circle.state === 'missing'  ? 'circle-miss'  :
    'circle-falling';

  const animStyle =
    circle.state === 'falling'
      ? {
          animationDuration: `${circle.fallDuration}ms`,
          animationTimingFunction: 'linear',
        }
      : {};

  return (
    <div
      ref={ref}
      className={`circle-falling ${stateClass}`}
      style={{
        left: `${circle.x}%`,
        top: 0,
        width: size,
        height: size,
        fontSize,
        color: color.text,
        backgroundColor: color.bg,
        borderColor: color.border,
        boxShadow: `0 0 18px ${color.border}88, inset 0 2px 6px rgba(255,255,255,0.15)`,
        zIndex: 10,
        ...animStyle,
      }}
    >
      {/* Inner glow ring */}
      <span
        style={{
          position: 'absolute',
          inset: 4,
          borderRadius: '50%',
          border: `1.5px solid ${color.border}55`,
          pointerEvents: 'none',
        }}
      />
      {circle.char}
    </div>
  );
}
