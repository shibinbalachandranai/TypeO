'use client';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function ramp(param: AudioParam, from: number, to: number, duration: number, start?: number) {
  const t = start ?? getCtx().currentTime;
  param.setValueAtTime(from, t);
  param.linearRampToValueAtTime(to, t + duration);
}

export const sounds = {
  hit: () => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, c.currentTime + 0.08);
      gain.gain.setValueAtTime(0.5, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.25);
    } catch { /* ignore */ }
  },

  miss: () => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.35);
      gain.gain.setValueAtTime(0.4, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.35);
    } catch { /* ignore */ }
  },

  levelUp: () => {
    try {
      const c = getCtx();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'triangle';
        const t = c.currentTime + i * 0.1;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    } catch { /* ignore */ }
  },

  gameOver: () => {
    try {
      const c = getCtx();
      const notes = [440, 370, 311, 220];
      notes.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sawtooth';
        const t = c.currentTime + i * 0.15;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch { /* ignore */ }
  },

  countdownBeep: (final: boolean) => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(final ? 1200 : 800, c.currentTime);
      gain.gain.setValueAtTime(0.5, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (final ? 0.4 : 0.15));
      osc.start(c.currentTime);
      osc.stop(c.currentTime + (final ? 0.4 : 0.15));
    } catch { /* ignore */ }
  },

  spawn: () => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = 'sine';
      ramp(osc.frequency, 400, 500, 0.05);
      gain.gain.setValueAtTime(0.08, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.08);
    } catch { /* ignore */ }
  },
};

// Keep ramp importable
export { ramp };
