# TypeO — Typing Game for Kids

> Blast falling letters and numbers before they escape! A fast-paced browser typing game built to help kids improve keyboard speed, accuracy, and reaction time.

**Live Demo:** [typeo.vercel.app](https://typeo.vercel.app) &nbsp;|&nbsp; **Creator:** [shibinbalachandran.in](https://shibinbalachandran.in)

---

## Overview

TypeO is a browser-based typing game where circles with letters and numbers fall from the top of the screen. Players must press the matching key to blast each circle before it escapes. Misses count against the player, and the game progressively speeds up through 8 difficulty levels — keeping kids engaged and challenged as their skills improve.

---

## Features

- **Falling Circle Gameplay** — Circles carrying A–Z letters (and 0–9 numbers from Level 3+) fall at increasing speeds
- **Real-time Scoring** — Points awarded per hit; misses deduct points and add danger strikes
- **8 Auto-levelling Stages** — From *Warm Up* (5s fall speed) to *God Mode* (1.4s fall speed), difficulty ramps automatically every 15 hits
- **Danger Meter** — Tracks misses within a rolling time window; too many triggers Game Over
- **Sound Effects** — All sounds synthesized via the Web Audio API (no audio files): hits, misses, level-ups, game over, countdown
- **Countdown Start** — 3-2-1-GO! countdown before each game
- **Level Up Banner** — Full-screen animated banner on each level transition
- **Post-Game Stats Screen** — Final score, accuracy, time played, character breakdown chart, keys to practice, best keys, and confetti burst on game over
- **Leaderboard** — Tracks all-time best scores, accuracy, and total games per player
- **Admin Dashboard** — PIN-protected dashboard with overview stats, character frequency chart, top players table, full session history with pagination, JSON export, and data clear

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Pure CSS keyframes |
| Sound | Web Audio API (zero audio files) |
| Storage | localStorage (up to 500 game records) |
| Hosting | Vercel |

---

## Routes

| Route | Description |
|---|---|
| `/` | Home — enter player name, view top 3, start game |
| `/game?player=NAME` | Main game screen |
| `/leaderboard` | Public leaderboard with all-time rankings |
| `/admin` | PIN-protected admin dashboard |

---

## Game Mechanics

### Levels

| Level | Name | Fall Speed | Spawn Rate | Miss Limit |
|---|---|---|---|---|
| 1 | Warm Up | 5.0s | 2.0s | 5 per 30s |
| 2 | Getting Hot | 4.2s | 1.7s | 5 per 30s |
| 3 | On Fire | 3.5s | 1.4s | 6 per 45s |
| 4 | Blazing | 2.9s | 1.2s | 5 per 45s |
| 5 | Turbo | 2.4s | 1.0s | 5 per 60s |
| 6 | Insane | 2.0s | 0.85s | 4 per 60s |
| 7 | Legendary | 1.7s | 0.7s | 4 per 60s |
| 8 | God Mode | 1.4s | 0.55s | 3 per 60s |

- Level advances every **15 successful hits**
- Numbers (0–9) are introduced from **Level 3** onwards
- Circle size shrinks slightly with each level

### Scoring

- **Hit** → +1 to +5 points (increases per level)
- **Miss** → −1 point + danger strike recorded
- **Game Over** → triggered when miss count within the rolling time window exceeds the level's limit

---

## Screenshots

> The game runs entirely in the browser — no downloads, no accounts, no ads.

- Dark space-themed UI with animated falling circles
- Glowing neon color palette with real-time HUD
- Responsive design — works on desktop and tablet

---

## Local Development

```bash
git clone https://github.com/shibinbalachandranai/typeo
cd typeo
npm install
npm run dev
# → http://localhost:3000
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_ADMIN_PIN` | `1234` | PIN to access the admin dashboard |

---

## Deployment

Deployed on **Vercel** with automatic production builds.

```bash
npx vercel --prod
```

---

## More Projects by Shibin Balachandran

A collection of browser-based hobby projects — all built with modern web tech, zero frameworks bloat, and deployed on Vercel.

---

### 🐍 Snake & Soul
> *Play Snake. Discover your mood.*

A classic Snake game with a psychological twist — it analyses your gameplay patterns (movement rhythm, reaction speed, consistency) to determine your concentration level and emotional state, then offers personalised tips and motivational quotes.

**Tech:** JavaScript · Canvas API · Mood Analysis · Psychology  
**Live:** [shibinbalachandran.in/hobby/snake](https://shibinbalachandran.in/hobby/snake)

---

### 🎲 Snake & Ladder
> *The classic board game, fully in the browser.*

Fully playable Snake & Ladder with PvP and CPU modes. Features an SVG-rendered animated board, synthesized sound effects, post-game analytics, leaderboard, and a PIN-protected admin dashboard.

**Tech:** Next.js 15 · TypeScript · Tailwind CSS · SVG · Web Audio API  
**Live:** [snakeladder-one.vercel.app](https://snakeladder-one.vercel.app/) &nbsp;|&nbsp; **Source:** [github.com/shibinbalachandranai/snakeLadder](https://github.com/shibinbalachandranai/snakeLadder)

---

### 🎯 Ludo
> *Classic Ludo with a neon cyberpunk soul.*

A comprehensive Ludo game supporting 2–4 players with PvP, CPU, and semi-auto modes. Built with a neon cyberpunk aesthetic using pure SVG graphics, synthesized audio, leaderboard, and admin dashboard.

**Tech:** Next.js · TypeScript · Tailwind CSS v4 · SVG · Web Audio API  
**Live:** [ludo-game-shibin.vercel.app](https://ludo-game-shibin.vercel.app) &nbsp;|&nbsp; **Source:** [github.com/shibinbalachandranai/ludo-game](https://github.com/shibinbalachandranai/ludo-game)

---

### ⌨️ TypeO *(this project)*
> *Type fast. Score big.*

Fast-paced typing game for kids. [See full details above.](#typeo--typing-game-for-kids)

**Live:** [typeo.vercel.app](https://typeo.vercel.app) &nbsp;|&nbsp; **Source:** [github.com/shibinbalachandranai/TypeO](https://github.com/shibinbalachandranai/TypeO)

---

> All projects are open source, built from scratch with no game engines or UI component libraries — just Next.js, TypeScript, SVG, and the Web Audio API.
>
> **Portfolio:** [shibinbalachandran.in](https://shibinbalachandran.in) &nbsp;|&nbsp; **Hobby Lab:** [shibinbalachandran.in/hobby](https://shibinbalachandran.in/hobby)

---

*Built by [Shibin Balachandran](https://shibinbalachandran.in) · 2025*
