# 🎙️ AgentCast — AI Debate Podcast Generator

A stunning, production-ready React frontend for generating AI-powered debate podcasts on any topic.

---

## ✨ Features

- **3D Interactive Background** — Three.js spheres + particle field + orbital rings
- **Custom Cursor** — Smooth trailing cursor effect
- **Animated Loading State** — Orbital system, waveform visualizer, rotating AI facts
- **Custom Audio Player** — Vinyl disc animation, seek, skip ±10s, volume control, download
- **Animated Transcript** — Speech bubbles with slide-in framer-motion stagger
- **Dark theme** — Deep space aesthetic with purple/orange gradient palette
- **Fully responsive** — Mobile-first design

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Opens at: http://localhost:5173

---

## ⚙️ Stack

| Tool | Version |
|------|---------|
| React | 18 |
| Vite | 5 |
| Tailwind CSS | 3.4 |
| Framer Motion | 11 |
| Three.js | 0.160 |
| @react-three/fiber | 8 |
| @react-three/drei | 9 |
| Axios | 1.6 |

---

## 📁 Folder Structure

```
src/
  components/
    Scene3D.jsx        # Three.js 3D background (orbs, particles, rings)
    TopicInput.jsx     # Input field with suggestion pills
    LoadingSpinner.jsx # Fun loading UI with orbital animation + facts
    AudioPlayer.jsx    # Custom HTML5 audio player
    Transcript.jsx     # Animated speech bubble transcript
  pages/
    Home.jsx           # Main page layout
  App.jsx              # Root + custom cursor
  main.jsx             # Entry point
  index.css            # Global styles + animations
```

---

## 🔌 Backend Connection

The frontend connects to:
```
POST http://localhost:8000/generate
```

Make sure your FastAPI backend has CORS enabled:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🎨 Design System

- **Font Display**: Syne (headings)
- **Font Body**: DM Sans
- **Font Mono**: JetBrains Mono
- **Primary**: `#7C3AED` (deep purple)
- **Accent**: `#a78bfa` (neon purple)
- **Hot**: `#f97316` (orange)
- **Background**: `#050508` (void black)
