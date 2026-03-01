import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Scene3D from '../components/Scene3D'
import TopicInput from '../components/TopicInput'
import LoadingSpinner from '../components/LoadingSpinner'
import AudioPlayer from '../components/AudioPlayer'
import Transcript from '../components/Transcript'

const API_URL = 'http://localhost:8000'

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-6"
    >
      {/* Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 mb-6"
        style={{ background: 'rgba(124,58,237,0.1)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span className="text-purple-300 text-xs font-mono uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>
          AI-Powered Learning
        </span>
      </motion.div>

      {/* Title */}
      <h1
        className="text-6xl sm:text-7xl md:text-8xl font-black mb-4 leading-none gradient-text"
        style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
      >
        {displayText}
        <span className="typewriter-cursor text-purple-400 ml-1">|</span>
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-white/40 text-base sm:text-lg max-w-md mx-auto leading-relaxed"
        style={{ fontFamily: 'DM Sans' }}
      >
        Turn any topic into an AI-powered{' '}
        <span className="text-orange-400">debate podcast</span>
        {' '}with two voices
      </motion.p>
    </motion.div>
  )
}

function StatsBar() {
  const stats = [
    { label: 'Topics covered', value: '10K+' },
    { label: 'Podcasts generated', value: '50K+' },
    { label: 'Avg generation time', value: '~45s' },
    { label: 'Voice quality', value: 'HD' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="flex flex-wrap justify-center gap-6 mt-10 mb-8"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 + i * 0.1 }}
          className="text-center"
        >
          <p className="text-white/70 text-lg font-bold" style={{ fontFamily: 'Syne' }}>{s.value}</p>
          <p className="text-white/20 text-xs" style={{ fontFamily: 'JetBrains Mono', fontFamily: 'DM Sans' }}>{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [currentTopic, setCurrentTopic] = useState('')
  const [jobId, setJobId] = useState(null)
  const [polling, setPolling] = useState(false)
  const [timeoutReached, setTimeoutReached] = useState(false)
  const resultsRef = useRef()
  const loadingRef = useRef()
  const pollingIntervalRef = useRef()
  const pollingTimeoutRef = useRef()

  const handleGenerate = async (inputTopic) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setCurrentTopic(inputTopic)
    setJobId(null)
    setPolling(false)
    setTimeoutReached(false)

    // Scroll to loading spinner immediately
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      const res = await axios.post(`${API_URL}/generate`, { topic: inputTopic })
      if (res.data && res.data.job_id) {
        setJobId(res.data.job_id)
        setPolling(true)
      } else {
        setError({ error: 'No job_id returned from API', details: '' })
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err)
      const apiError = err?.response?.data
      if (apiError && (apiError.error || apiError.details)) {
        setError({
          error: apiError.error || 'Error',
          details: apiError.details || '',
        })
      } else {
        setError({ error: 'Something went wrong. Please try again.', details: err?.response?.data?.detail || '' })
      }
      setIsLoading(false)
    }
  }

  // Polling logic
  useEffect(() => {
    if (!polling || !jobId) return

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const statusRes = await axios.get(`${API_URL}/status/${jobId}`)
        if (statusRes.data && statusRes.data.status) {
          if (statusRes.data.status === 'completed') {
            clearInterval(pollingIntervalRef.current)
            clearTimeout(pollingTimeoutRef.current)
            setPolling(false)
            setIsLoading(false)
            // Fetch result
            try {
              const resultRes = await axios.get(`${API_URL}/result/${jobId}`)
              setResult(resultRes.data)
              setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 300)
            } catch (err) {
              setError({ error: 'Failed to fetch result', details: err?.response?.data?.detail || '' })
            }
          } else if (statusRes.data.status === 'failed') {
            clearInterval(pollingIntervalRef.current)
            clearTimeout(pollingTimeoutRef.current)
            setPolling(false)
            setIsLoading(false)
            setError({ error: 'Podcast generation failed', details: statusRes.data.details || '' })
          }
        }
      } catch (err) {
        setError({ error: 'Polling error', details: err?.response?.data?.detail || '' })
        setPolling(false)
        setIsLoading(false)
        clearInterval(pollingIntervalRef.current)
        clearTimeout(pollingTimeoutRef.current)
      }
    }, 5000)

    // Timeout after 2 minutes
    pollingTimeoutRef.current = setTimeout(() => {
      setTimeoutReached(true)
      setPolling(false)
      setIsLoading(false)
      clearInterval(pollingIntervalRef.current)
    }, 500000)

    return () => {
      clearInterval(pollingIntervalRef.current)
      clearTimeout(pollingTimeoutRef.current)
    }
  }, [polling, jobId])

  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(135deg, #050508 0%, #0a0818 50%, #050508 100%)' }}>
      {/* 3D Background */}
      <Scene3D isGenerating={isLoading} />

      {/* Radial spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(124,58,237,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Hero section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-16">
          <HeroText />
          <StatsBar />

          <TopicInput onGenerate={handleGenerate} isLoading={isLoading || polling} />

          {/* Keyboard hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 text-white/15 text-xs font-mono"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Press ↵ Enter to generate
          </motion.p>
        </div>

        {/* Loading state */}
        <AnimatePresence>
          {(isLoading || polling) && (
            <motion.div
              ref={loadingRef}
              className="px-4 sm:px-6 pb-16 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full max-w-2xl">
                <LoadingSpinner topic={currentTopic} />
                <div className="text-center mt-6">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-white/70 font-bold"
                  >
                    Generating your AI podcast…
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="px-4 sm:px-6 pb-8 flex justify-center"
            >
              <div className="w-full max-w-2xl rounded-3xl p-7 border-2 border-red-500/30 glass-strong relative overflow-hidden">
                {/* Animated 3D error orb */}
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 blur-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, #ef4444, #7C3AED, transparent 70%)' }} />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, #f97316, #ef4444, transparent 70%)' }} />
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-1/2 top-0 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-purple-500 to-orange-400 flex items-center justify-center text-3xl shadow-lg"
                  style={{ zIndex: 2 }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </motion.div>
                <div className="relative z-10">
                  <p className="text-red-300 font-bold text-lg mb-2 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
                    <span>Generation failed</span>
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="inline-block w-3 h-3 rounded-full bg-red-400 animate-pulse"
                    />
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-red-400/80 text-base font-mono mb-2"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    {error.error}
                  </motion.p>
                  {error.details && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-red-900/20 border border-red-500/20 rounded-xl p-4 mb-2 text-white/80 text-sm font-mono shadow-lg"
                      style={{ fontFamily: 'JetBrains Mono', backdropFilter: 'blur(8px)' }}
                    >
                      <span className="text-red-300 font-semibold">Details:</span>
                      <br />
                      <span>{error.details}</span>
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08, backgroundColor: '#ef4444' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setError(null)}
                    className="mt-4 px-5 py-2 rounded-full text-xs font-bold text-white bg-red-500/70 hover:bg-red-500 transition-colors shadow-lg"
                  >
                    Dismiss
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="px-4 sm:px-6 pb-20"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Result header */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20"
                    style={{ background: 'rgba(124,58,237,0.1)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-300 text-xs font-mono" style={{ fontFamily: 'JetBrains Mono' }}>
                      Ready to play
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-500/30 to-transparent" />
                </motion.div>

                {/* Topic pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-mono text-white/50 border border-white/8"
                    style={{ fontFamily: 'DM Sans' }}>
                    🎙️ "{currentTopic}"
                  </span>
                </motion.div>

                {/* Audio Player */}
                <AudioPlayer audioUrl={result.audio_url} />

                {/* Transcript */}
                <Transcript dialogue={result.dialogue} />

                {/* Generate again */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex justify-center pt-4"
                >
                  <motion.button
                    onClick={() => {
                      setResult(null)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-white/40 border border-white/8 hover:text-white/70 hover:border-purple-500/30 transition-all duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 1 0 .49-3.29"/>
                    </svg>
                    Generate another
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-0 left-0 right-0 z-20 pb-4 pointer-events-none"
        >
          <div className="flex justify-center gap-4">
            <div
              className="px-4 py-2 rounded-full border border-white/5 text-white/15 text-xs flex items-center gap-2"
              style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(20px)', fontFamily: 'JetBrains Mono' }}
            >
              <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
              Powered by AI · AgentCast
            </div>
            <button
              className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-500 text-xs bg-white/5 hover:bg-purple-500/10 transition pointer-events-auto"
              onClick={() => window.location.href = '/library'}
            >
              Library
            </button>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
