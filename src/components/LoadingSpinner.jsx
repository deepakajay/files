import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOADING_FACTS = [
  { emoji: "🧠", title: "Did you know?", text: "LLMs predict the next word by learning patterns from 100s of billions of text tokens." },
  { emoji: "🎙️", title: "Voice synthesis", text: "Text-to-speech AI converts phonemes into waveforms using neural vocoders trained on hours of human speech." },
  { emoji: "🤖", title: "AI Agents", text: "Agents autonomously break down tasks into subtasks, execute tools, and chain reasoning steps together." },
  { emoji: "⚡", title: "Attention is all you need", text: "The Transformer architecture from 2017 revolutionized NLP by using self-attention instead of RNNs." },
  { emoji: "🎵", title: "Audio generation", text: "Your podcast's audio is generated in real-time using models like Bark or ElevenLabs, synthesizing distinct voices per speaker." },
  { emoji: "🌐", title: "Embeddings", text: "Words are converted to vectors in high-dimensional space where semantically similar concepts cluster together." },
]

const STEPS = [
  { label: "Analyzing topic", icon: "🔍", duration: 15 },
  { label: "Scripting debate", icon: "✍️", duration: 35 },
  { label: "Synthesizing voices", icon: "🎙️", duration: 75 },
  { label: "Encoding audio", icon: "🎵", duration: 90 },
  { label: "Finalizing podcast", icon: "✨", duration: 100 },
]

function WaveformVisualizer() {
  const bars = Array.from({ length: 40 })
  return (
    <div className="flex items-center justify-center gap-0.5 h-16">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: i % 3 === 0
              ? 'rgba(167,139,250,0.8)'
              : i % 3 === 1
              ? 'rgba(249,115,22,0.6)'
              : 'rgba(124,58,237,0.4)',
          }}
          animate={{
            scaleY: [0.2, Math.random() * 0.8 + 0.4, 0.2],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.8,
            repeat: Infinity,
            delay: i * 0.04,
            ease: 'easeInOut',
          }}
          initial={{ scaleY: 0.2 }}
        />
      ))}
    </div>
  )
}

function OrbitalSystem() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Center core */}
      <motion.div
        className="absolute inset-0 m-auto w-16 h-16 rounded-full"
        style={{ background: 'radial-gradient(circle, #a78bfa, #7C3AED)' }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(167,139,250,0.4)',
            '0 0 40px rgba(167,139,250,0.8)',
            '0 0 20px rgba(167,139,250,0.4)',
          ],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-full h-full flex items-center justify-center text-2xl">🎙️</div>
      </motion.div>

      {/* Orbit 1 */}
      <motion.div
        className="absolute inset-0 m-auto w-28 h-28 rounded-full border border-purple-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />
      </motion.div>

      {/* Orbit 2 */}
      <motion.div
        className="absolute inset-0 m-auto w-40 h-40 rounded-full border border-orange-500/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-400 shadow-lg shadow-orange-500/50" />
      </motion.div>

      {/* Orbit 3 */}
      <motion.div
        className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-pink-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50" />
      </motion.div>
    </div>
  )
}

export default function LoadingSpinner({ topic }) {
  const [factIndex, setFactIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  // Cycle facts every 4 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setFactIndex(i => (i + 1) % LOADING_FACTS.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  // Fake progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 1.2
        const cap = Math.min(next, 95)
        // Update current step
        const step = STEPS.findIndex(s => cap < s.duration)
        setCurrentStep(step === -1 ? STEPS.length - 1 : Math.max(0, step - 1))
        return cap
      })
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const fact = LOADING_FACTS[factIndex]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="glass-strong rounded-3xl p-8 border border-white/10 overflow-hidden relative">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />

        {/* Header */}
        <div className="text-center mb-6">
          <motion.p
            className="text-xs font-mono text-white/30 mb-2 uppercase tracking-widest"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Processing
          </motion.p>
          <h3 className="text-white font-display text-lg font-semibold" style={{ fontFamily: 'Syne' }}>
            Generating podcast on{' '}
            <span className="gradient-text">"{topic}"</span>
          </h3>
        </div>

        {/* Orbital animation */}
        <div className="mb-6">
          <OrbitalSystem />
        </div>

        {/* Waveform */}
        <div className="mb-6">
          <WaveformVisualizer />
        </div>

        {/* Steps */}
        <div className="flex justify-between mb-4 px-2">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  scale: i === currentStep ? 1.2 : 1,
                  opacity: i <= currentStep ? 1 : 0.3,
                }}
                className="text-lg"
              >
                {step.icon}
              </motion.div>
              <span className={`text-xs font-mono hidden sm:block ${i <= currentStep ? 'text-white/60' : 'text-white/20'}`}
                style={{ fontFamily: 'JetBrains Mono', fontSize: '9px' }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden mb-6">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7C3AED, #a78bfa, #f97316)',
              width: `${progress}%`,
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute top-0 h-full w-16 opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
            animate={{ left: ['-10%', '110%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <p className="text-center text-white/30 text-xs font-mono mb-6" style={{ fontFamily: 'JetBrains Mono' }}>
          {Math.round(progress)}% complete · {STEPS[currentStep]?.label}
        </p>

        {/* Fact card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-4 border border-white/5"
            style={{ background: 'rgba(124,58,237,0.08)' }}
          >
            <div className="flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">{fact.emoji}</span>
              <div>
                <p className="text-neon font-semibold text-sm mb-1" style={{ fontFamily: 'Syne' }}>
                  {fact.title}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {fact.text}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Fact counter dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {LOADING_FACTS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === factIndex ? 1.3 : 1,
                opacity: i === factIndex ? 1 : 0.3,
                background: i === factIndex ? '#a78bfa' : '#ffffff',
              }}
              className="w-1.5 h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
