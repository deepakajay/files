import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function formatTime(s) {
  if (isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function WaveformBars({ isPlaying }) {
  const bars = Array.from({ length: 20 })
  return (
    <div className="flex items-center gap-0.5 h-8">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{
            background: i % 2 === 0 ? '#a78bfa' : '#f97316',
          }}
          animate={isPlaying ? {
            scaleY: [0.3, Math.random() * 0.7 + 0.3, 0.3],
          } : { scaleY: 0.3 }}
          transition={isPlaying ? {
            duration: 0.4 + Math.random() * 0.5,
            repeat: Infinity,
            delay: i * 0.05,
          } : {}}
        />
      ))}
    </div>
  )
}

export default function AudioPlayer({ audioUrl }) {
  const audioRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showVolume, setShowVolume] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => {
      setDuration(audio.duration)
      setIsLoaded(true)
    }
    const onEnded = () => setIsPlaying(false)
    const onCanPlay = () => setIsLoaded(true)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('canplay', onCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('canplay', onCanPlay)
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const seek = (e) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    audio.currentTime = pct * duration
  }

  const skipBy = (secs) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + secs), duration)
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      <div className="glass-strong rounded-3xl p-6 border border-white/10 relative overflow-hidden">
        {/* BG glow when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Vinyl disc */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
              className="w-12 h-12 rounded-full border-2 border-purple-500/50 flex items-center justify-center relative"
              style={{ background: 'radial-gradient(circle, #2d1a6e, #0d0d1a)' }}
            >
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <div className="absolute inset-2 rounded-full border border-purple-700/20" />
            </motion.div>
            <div>
              <p className="text-white font-display text-sm font-semibold" style={{ fontFamily: 'Syne' }}>
                AgentCast Podcast
              </p>
              <p className="text-white/30 text-xs font-mono" style={{ fontFamily: 'JetBrains Mono' }}>
                AI-generated · 2 speakers
              </p>
            </div>
          </div>
          {/* Waveform */}
          <WaveformBars isPlaying={isPlaying} />
        </div>

        {/* Progress bar */}
        <div
          className="relative h-2 rounded-full mb-3 cursor-pointer group"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onClick={seek}
        >
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7C3AED, #a78bfa, #f97316)',
            }}
            animate={{ width: `${progress}%` }}
          />
          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-purple-300 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              left: `calc(${progress}% - 8px)`,
              background: '#a78bfa',
              boxShadow: '0 0 10px rgba(167,139,250,0.8)',
            }}
          />
        </div>

        {/* Time */}
        <div className="flex justify-between text-xs text-white/25 font-mono mb-5" style={{ fontFamily: 'JetBrains Mono' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left: volume */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowVolume(v => !v)}
              className="text-white/30 hover:text-white/70 transition-colors"
            >
              {volume === 0 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </button>
            <AnimatePresence>
              {showVolume && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 80 }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                    className="w-full"
                    style={{ accentColor: '#a78bfa' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center: playback controls */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => skipBy(-10)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white/40 hover:text-white/80 transition-colors text-xs flex flex-col items-center gap-0.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.29"/>
              </svg>
              <span style={{ fontSize: '8px', fontFamily: 'JetBrains Mono' }}>10s</span>
            </motion.button>

            {/* Main play button */}
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              disabled={!isLoaded}
              className="relative w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={isPlaying ? {
                  boxShadow: ['0 0 15px rgba(167,139,250,0.4)', '0 0 30px rgba(167,139,250,0.7)', '0 0 15px rgba(167,139,250,0.4)'],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.svg key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </motion.svg>
                ) : (
                  <motion.svg key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={() => skipBy(10)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white/40 hover:text-white/80 transition-colors text-xs flex flex-col items-center gap-0.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-.49-3.29"/>
              </svg>
              <span style={{ fontSize: '8px', fontFamily: 'JetBrains Mono' }}>10s</span>
            </motion.button>
          </div>

          {/* Right: download */}
          <motion.a
            href={audioUrl}
            download
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
