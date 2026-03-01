import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const SUGGESTIONS = [
  "How does Docker work?",
  "Explain quantum computing",
  "What are AI Agents?",
  "How does the internet work?",
  "What is blockchain?",
  "Explain machine learning",
]

export default function TopicInput({ onGenerate, isLoading }) {
  const [topic, setTopic] = useState('')
  const [focused, setFocused] = useState(false)
  const [suggIndex, setSuggIndex] = useState(0)
  const inputRef = useRef()

  const handleSubmit = () => {
    if (topic.trim() && !isLoading) {
      onGenerate(topic.trim())
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const useSuggestion = (s) => {
    setTopic(s)
    inputRef.current?.focus()
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Input container */}
      <div className="relative">
        {/* Glow border */}
        <motion.div
          className="absolute -inset-0.5 rounded-2xl"
          animate={{
            background: focused
              ? 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(249,115,22,0.8))'
              : 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(249,115,22,0.2))',
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative glass-strong rounded-2xl flex items-center gap-3 p-2 pl-5">
          {/* Microphone icon */}
          <motion.div
            animate={{ opacity: focused ? 1 : 0.4 }}
            className="text-neon flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </motion.div>

          <input
            ref={inputRef}
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="What do you want to learn today?"
            disabled={isLoading}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/25 font-body text-base py-3 disabled:opacity-50"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px' }}
          />

          <motion.button
            onClick={handleSubmit}
            disabled={!topic.trim() || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex-shrink-0 px-6 py-3 rounded-xl font-display font-semibold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #f97316)',
              fontFamily: 'Syne, sans-serif',
            }}
          >
            <motion.span
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #f97316, #7C3AED)' }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Suggestion pills */}
      <motion.div
        className="mt-4 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-white/25 text-xs self-center font-mono" style={{ fontFamily: 'JetBrains Mono' }}>
          try:
        </span>
        {SUGGESTIONS.slice(0, 4).map((s, i) => (
          <motion.button
            key={s}
            onClick={() => useSuggestion(s)}
            disabled={isLoading}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.1 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(167,139,250,0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 rounded-full text-xs text-white/40 border border-white/10 hover:text-white/70 transition-colors duration-200"
          >
            {s}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}
