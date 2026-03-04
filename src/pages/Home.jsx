import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import TopicInput from '../components/TopicInput'
import LoadingSpinner from '../components/LoadingSpinner'
import AudioPlayer from '../components/AudioPlayer'
import Transcript from '../components/Transcript'

const API_URL = 'https://agentcast-backend.onrender.com'
// const API_URL = 'http://localhost:8000'
function StarField() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.1,
    duration: Math.random() * 3 + 2,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute', left: `${star.x}%`, top: `${star.y}%`,
            width: star.size, height: star.size, borderRadius: '50%', background: 'white',
          }}
          animate={{ opacity: [star.opacity, star.opacity * 0.2, star.opacity] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}
    </div>
  )
}

function HeroText() {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'AgentCast'
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) clearInterval(t)
    }, 100)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
      style={{ textAlign: 'center', marginBottom: '2rem', width: '100%', overflow: 'hidden' }}>
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '999px',
          border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.12)', marginBottom: '1.5rem',
        }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
        <span style={{ color: '#c4b5fd', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          AI-Powered Learning
        </span>
      </motion.div>
      <h1 style={{
        fontSize: 'clamp(2.6rem, 13vw, 6rem)', fontWeight: 900, fontFamily: 'Syne, sans-serif',
        letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '1rem',
        background: 'linear-gradient(135deg, #a78bfa 0%, #f97316 50%, #a78bfa 100%)',
        backgroundSize: '200% auto', WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        whiteSpace: 'nowrap', overflow: 'visible',
      }}>
        {displayText}<span style={{ WebkitTextFillColor: '#a78bfa', opacity: 0.8 }}>|</span>
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(0.875rem, 3.5vw, 1.05rem)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif', padding: '0 1rem' }}>
        Turn any topic into an AI-powered{' '}
        <span style={{ color: '#fb923c' }}>debate podcast</span> with two Indian voices
      </motion.p>
    </motion.div>
  )
}

function StatsBar() {
  const stats = [
    { label: 'Topics covered', value: '10K+' },
    { label: 'Podcasts generated', value: '50K+' },
    { label: 'Avg generation', value: '~45s' },
    { label: 'Voice quality', value: 'HD' },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem', padding: '0 1rem' }}>
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 + i * 0.1 }} style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', margin: 0 }}>{s.value}</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontFamily: 'DM Sans, sans-serif', margin: '2px 0 0' }}>{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

function ErrorCard({ error, onDismiss }) {
  const getErrorIcon = (msg) => {
    if (msg.includes('timed out')) return '⏱️'
    if (msg.includes('server') || msg.includes('Server')) return '🖥️'
    if (msg.includes('network') || msg.includes('reach')) return '📡'
    if (msg.includes('starting up') || msg.includes('cold')) return '🔄'
    if (msg.includes('requests') || msg.includes('many')) return '🚦'
    return '⚠️'
  }

  const getErrorTitle = (msg) => {
    if (msg.includes('timed out')) return 'Request timed out'
    if (msg.includes('starting up') || msg.includes('cold')) return 'Server waking up'
    if (msg.includes('network') || msg.includes('reach')) return 'Connection failed'
    if (msg.includes('requests') || msg.includes('many')) return 'Rate limited'
    if (msg.includes('500') || msg.includes('Server error') || msg.includes('agent')) return 'AI generation failed'
    return 'Something went wrong'
  }

  const getTip = (msg) => {
    if (msg.includes('timed out')) return 'The AI took too long. Try a shorter or simpler topic.'
    if (msg.includes('starting up') || msg.includes('cold')) return 'Render free tier servers sleep after inactivity. Wait 30 seconds and try again.'
    if (msg.includes('network') || msg.includes('reach')) return 'Check that your backend server is running.'
    if (msg.includes('requests') || msg.includes('many')) return 'Wait a few seconds before generating again.'
    if (msg.includes('agent') || msg.includes('AI')) return 'The AI agent returned an unexpected response. Try again or rephrase your topic.'
    return 'Please try again in a moment.'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%', maxWidth: '640px', borderRadius: '20px',
        border: '1px solid rgba(239,68,68,0.25)',
        background: 'rgba(13,5,5,0.9)', backdropFilter: 'blur(40px)',
        overflow: 'hidden',
      }}
    >
      {/* Red top stripe */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #dc2626, #f97316)' }} />

      <div style={{ padding: '20px 24px 24px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>{getErrorIcon(error)}</span>
            <p style={{ color: '#fca5a5', fontWeight: 700, fontSize: '15px', margin: 0, fontFamily: 'Syne, sans-serif' }}>
              {getErrorTitle(error)}
            </p>
          </div>
          <button onClick={onDismiss} style={{
            background: 'none', border: 'none', color: 'rgba(252,165,165,0.4)',
            cursor: 'pointer', fontSize: '18px', padding: '0 0 0 8px', lineHeight: 1,
            transition: 'color 0.2s',
          }}>×</button>
        </div>

        {/* Error message */}
        <p style={{
          color: 'rgba(252,165,165,0.75)', fontSize: '13px', margin: '0 0 14px',
          lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif',
          padding: '10px 14px', borderRadius: '10px',
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)',
        }}>
          {error}
        </p>

        {/* Tip */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span style={{ color: '#fbbf24', fontSize: '13px', flexShrink: 0 }}>💡</span>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0, lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
            {getTip(error)}
          </p>
        </div>

        {/* Retry button */}
        <motion.button
          onClick={onDismiss}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: '16px', width: '100%', padding: '10px',
            borderRadius: '10px', border: '1px solid rgba(239,68,68,0.25)',
            background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
            fontSize: '13px', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
          }}
        >
          Dismiss & try again
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [currentTopic, setCurrentTopic] = useState('')
  const resultsRef = useRef()
  const loadingRef = useRef()
  const errorRef = useRef()

  const handleGenerate = async (inputTopic) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setCurrentTopic(inputTopic)

    // Scroll to loading section immediately when generation starts
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)

    try {
      const res = await axios.post(
        `${API_URL}/generate`,
        { topic: inputTopic },
        { timeout: 300000 }
      )
      setResult(res.data)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } catch (err) {
      let message = 'Something went wrong. Please try again.'

      if (err.code === 'ECONNABORTED') {
        message = 'Generation timed out after 5 minutes. Try a simpler topic or try again.'
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        message = 'Cannot reach the server. Make sure the backend is running at ' + API_URL
      } else if (err.response) {
        const status = err.response.status
        const detail = err.response.data?.detail || err.response.data?.message
        if (status === 422) {
          message = 'Invalid request — ' + (detail || 'please check your input.')
        } else if (status === 500) {
          message = detail || 'Server error. The AI agent failed to generate a response. Please try again.'
        } else if (status === 503) {
          message = 'Server is starting up (Render cold start). Please wait 30 seconds and try again.'
        } else if (status === 429) {
          message = 'Too many requests. Please wait a moment and try again.'
        } else if (status === 404) {
          message = 'API endpoint not found. Check your backend URL.'
        } else {
          message = detail || `Unexpected error (${status}). Please try again.`
        }
      }

      setError(message)
      // Scroll to error
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 150)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050508 0%, #0a0818 50%, #050508 100%)', position: 'relative', overflowX: 'hidden', width: '100%' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(124,58,237,0.15) 0%, transparent 60%)' }} />
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', pointerEvents: 'none', zIndex: 0, filter: 'blur(60px)' }} />
      <div style={{ position: 'fixed', bottom: '-200px', left: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent)', pointerEvents: 'none', zIndex: 0, filter: 'blur(60px)' }} />
      <StarField />

      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(3rem, 8vw, 5rem) 1rem clamp(3rem, 6vw, 4rem)', width: '100%' }}>
          <HeroText />
          <StatsBar />
          <div style={{ width: '100%', maxWidth: '640px', padding: '0 0.5rem' }}>
            <TopicInput onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.15)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
            Press ↵ Enter to generate
          </motion.p>
        </div>

        {/* Loading — ref attached here for auto-scroll */}
        <div ref={loadingRef}>
          <AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: '0 1.5rem 4rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '640px' }}>
                  <LoadingSpinner topic={currentTopic} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error — ref attached here for auto-scroll */}
        <div ref={errorRef}>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: '0 1.5rem 2rem', display: 'flex', justifyContent: 'center' }}>
                <ErrorCard error={error} onDismiss={() => setError(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div ref={resultsRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }} style={{ padding: '0 1.5rem 5rem' }}>
              <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Ready badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.3), transparent)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.1)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    <span style={{ color: '#86efac', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>Ready to play</span>
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(124,58,237,0.3), transparent)' }} />
                </div>

                {/* Topic pill */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'DM Sans, sans-serif' }}>
                    🎙️ "{currentTopic}"
                  </span>
                </div>

                <AudioPlayer audioUrl={result.audio_url} />
                <Transcript dialogue={result.dialogue} />

                {/* Generate again */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                  <motion.button
                    onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '999px', fontSize: '14px', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    ↺ Generate another
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', paddingBottom: '1rem', zIndex: 20, pointerEvents: 'none' }}>
          <div style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)', color: 'rgba(255,255,255,0.15)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
            Powered by AI · AgentCast
          </div>
        </div>
      </div>
    </div>
  )
}
