import { motion } from 'framer-motion'

const SPEAKER_A_STYLE = {
  bubble: 'bg-purple-900/40 border border-purple-500/20',
  avatar: 'from-purple-600 to-purple-800',
  name: 'text-purple-300',
  label: 'A',
  emoji: '👨',
}

const SPEAKER_B_STYLE = {
  bubble: 'bg-orange-900/30 border border-orange-500/20',
  avatar: 'from-orange-500 to-orange-700',
  name: 'text-orange-300',
  label: 'B',
  emoji: '👩',
}

function BubbleLine({ item, index }) {
  const isA = item.speaker === 'A'
  const style = isA ? SPEAKER_A_STYLE : SPEAKER_B_STYLE

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: isA ? -20 : 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`flex gap-3 items-end ${isA ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${style.avatar} flex items-center justify-center text-sm shadow-lg`}
      >
        {style.emoji}
      </motion.div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isA ? '' : ''}`}>
        <p className={`text-xs font-mono mb-1 ${style.name} ${isA ? 'text-left' : 'text-right'}`}
          style={{ fontFamily: 'JetBrains Mono' }}>
          Speaker {style.label}
        </p>
        <motion.div
          className={`${style.bubble} rounded-2xl px-4 py-3 relative`}
          whileHover={{ scale: 1.01 }}
        >
          {/* Tail */}
          <div
            className={`absolute bottom-3 w-2.5 h-2.5 ${isA ? '-left-1.5' : '-right-1.5'} rotate-45 ${style.bubble}`}
            style={{ zIndex: -1 }}
          />
          <p className="text-white/80 text-sm leading-relaxed">
            {item.text}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Transcript({ dialogue }) {
    if (!Array.isArray(dialogue) || dialogue.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center justify-center py-12"
        >
          <div className="relative w-32 h-32 mb-6">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-purple-500 to-orange-400 opacity-30 blur-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-6 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-4xl shadow-lg"
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </motion.div>
          </div>
          <p className="text-red-300 font-bold text-lg mb-2" style={{ fontFamily: 'Syne' }}>
            No transcript available
          </p>
          <p className="text-red-400/80 text-base font-mono mb-2 text-center" style={{ fontFamily: 'JetBrains Mono' }}>
            The podcast could not be generated due to an error.
          </p>
        </motion.div>
      )
    }
    // ...existing code...
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/5" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-white/40 text-xs font-mono uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>
              Transcript
            </span>
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          </div>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Speaker legend */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-xs">👨</div>
            <span className="text-purple-300 text-xs font-mono" style={{ fontFamily: 'JetBrains Mono' }}>Host A</span>
          </div>
          <div className="text-white/10 text-xs self-center">×</div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-xs">👩</div>
            <span className="text-orange-300 text-xs font-mono" style={{ fontFamily: 'JetBrains Mono' }}>Host B</span>
          </div>
        </div>

        {/* Dialogue */}
        <div className="glass-strong rounded-3xl p-6 border border-white/8 max-h-[500px] overflow-y-auto space-y-4">
          {dialogue.map((item, i) => (
            <BubbleLine key={i} item={item} index={i} />
          ))}

          {/* End fade */}
          <div className="h-4 pointer-events-none" />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: dialogue.length * 0.12 + 0.3 }}
          className="mt-3 flex justify-center gap-6 text-xs text-white/20 font-mono"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span>{dialogue.length} exchanges</span>
          <span>·</span>
          <span>
            {dialogue.filter(d => d.speaker === 'A').length} from A ·{' '}
            {dialogue.filter(d => d.speaker === 'B').length} from B
          </span>
        </motion.div>
      </motion.div>
    )
}
