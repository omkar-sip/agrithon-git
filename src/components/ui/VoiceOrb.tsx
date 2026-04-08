// src/components/ui/VoiceOrb.tsx — animated voice orb for voice agent
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Loader2, Volume2 } from 'lucide-react'
import type { VoiceAgentState } from '../../hooks/useVoiceAgent'

interface VoiceOrbProps {
  state: VoiceAgentState
  onPress: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE = {
  sm: { orb: 'w-12 h-12', icon: 14, bars: 'h-4', ring: '-inset-1' },
  md: { orb: 'w-20 h-20', icon: 22, bars: 'h-8', ring: '-inset-3' },
  lg: { orb: 'w-28 h-28', icon: 32, bars: 'h-12', ring: '-inset-4' },
}

const STATE_COLOR: Record<VoiceAgentState, string> = {
  idle:       'bg-forest-900 hover:bg-forest-700',
  listening:  'bg-danger-500',
  processing: 'bg-gold-500',
  speaking:   'bg-info-500',
  error:      'bg-neutral-400',
}

const STATE_LABEL: Record<VoiceAgentState, string> = {
  idle:       'Tap to speak',
  listening:  'Listening...',
  processing: 'Thinking...',
  speaking:   'Speaking...',
  error:      'Try again',
}

// Animated waveform bars
function WaveBars() {
  return (
    <div className="flex items-center gap-[3px]">
      {[0,1,2,3,4].map(i => (
        <motion.div
          key={i}
          className="w-1 bg-white rounded-full"
          style={{ height: 24, originY: 0.5 }}
          animate={{ scaleY: [0.4, 1.3, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function VoiceOrb({ state, onPress, size = 'md', className = '' }: VoiceOrbProps) {
  const s = SIZE[size]
  const isListening = state === 'listening'

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-danger-400"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-danger-400"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 2.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3, ease: 'easeOut' }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Main orb */}
        <motion.button
          onClick={onPress}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.05 }}
          className={`
            relative z-10 ${s.orb} rounded-full
            flex items-center justify-center
            ${STATE_COLOR[state]}
            shadow-fab transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-white/40
          `}
          aria-label={STATE_LABEL[state]}
        >
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div key="mic" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <Mic size={s.icon} strokeWidth={1.8} />
              </motion.div>
            )}
            {state === 'listening' && (
              <motion.div key="wave" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <WaveBars />
              </motion.div>
            )}
            {state === 'processing' && (
              <motion.div key="proc" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <Loader2 size={s.icon} className="animate-spin" />
              </motion.div>
            )}
            {state === 'speaking' && (
              <motion.div key="speak" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <Volume2 size={s.icon} />
              </motion.div>
            )}
            {state === 'error' && (
              <motion.div key="err" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <Mic size={s.icon} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status label */}
      <motion.p
        key={state}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium text-neutral-500 select-none"
      >
        {STATE_LABEL[state]}
      </motion.p>
    </div>
  )
}
