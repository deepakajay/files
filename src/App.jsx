import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PodcastLibrary from './pages/PodcastLibrary.jsx'

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [trail, setTrail] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setTrail(pos), 80)
    return () => clearTimeout(timer)
  }, [pos])

  return (
    <>
      <div className="cursor" style={{ left: pos.x - 6, top: pos.y - 6 }} />
      <div className="cursor-trail" style={{ left: trail.x - 20, top: trail.y - 20 }} />
    </>
  )
}

export default function App() {
  return (
    <div className="noise">
      <CustomCursor />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<PodcastLibrary />} />
        </Routes>
      </Router>
    </div>
  )
}
