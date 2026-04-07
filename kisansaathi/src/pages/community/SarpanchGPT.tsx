// src/pages/community/SarpanchGPT.tsx — with full voice agent integration
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronLeft, Keyboard, MicOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { chatWithSarpanch } from '../../services/gemini/geminiClient'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useVoiceAgent } from '../../hooks/useVoiceAgent'
import VoiceOrb from '../../components/ui/VoiceOrb'

interface Message {
  role: 'user' | 'model'
  content: string
  timestamp: Date
}

const QUICK_QUESTIONS = [
  'How do I remove aphids from wheat?',
  'When does PM-KISAN payment come?',
  'Crops to sow in June in Maharashtra?',
  'Signs of low soil nitrogen?',
]

export default function SarpanchGPT() {
  const navigate  = useNavigate()
  const { language } = useLanguageStore()
  const farmer    = useAuthStore(s => s.farmer)

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello${farmer?.name ? ', ' + farmer.name.split(' ')[0] : ''}! I'm Sarpanch AI — your personal farming advisor.\n\nAsk me anything about crops, weather, market prices, or government schemes. You can also tap the mic button and speak your question.`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode]       = useState<'text' | 'voice'>('voice')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── AI function ────────────────────────────────────────────────────
  const askAI = useCallback(async (question: string): Promise<string> => {
    const ctx = farmer
      ? `Farmer profile: Name=${farmer.name}, Location=${farmer.district || 'India'}, ${farmer.state || ''}, Category=${farmer.category}, Land=${farmer.landHolding} acres, Water=${farmer.waterSource}.`
      : 'Anonymous farmer from India'
    return chatWithSarpanch({ question, farmerContext: ctx, language })
  }, [farmer, language])

  // ── Voice agent ────────────────────────────────────────────────────
  const voiceAgent = useVoiceAgent(askAI, {
    onTranscript: (text) => setInput(text),
    onResponse: (text) => {
      setMessages(m => [
        ...m,
        { role: 'model', content: text, timestamp: new Date() }
      ])
    },
    onStateChange: (s) => {
      // When voice picks up transcript → show as user message
      if (s === 'processing' && voiceAgent.transcript) {
        setMessages(m => [...m, { role: 'user', content: voiceAgent.transcript, timestamp: new Date() }])
        setInput('')
      }
    }
  })

  // ── Text send ──────────────────────────────────────────────────────
  const handleSend = async (text?: string) => {
    const q = (text || input).trim()
    if (!q) return
    setInput('')
    setMessages(m => [...m, { role: 'user', content: q, timestamp: new Date() }])
    setLoading(true)
    try {
      const resp = await askAI(q)
      setMessages(m => [...m, { role: 'model', content: resp, timestamp: new Date() }])
    } catch {
      setMessages(m => [...m, { role: 'model', content: 'Sorry — connection issue. Please try again.', timestamp: new Date() }])
    } finally { setLoading(false) }
  }

  const formatTime = (d: Date) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col h-screen bg-neutral-50">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="bg-forest-900 text-white flex-shrink-0"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-3 px-4 h-14 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="font-bold text-base leading-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Sarpanch AI
            </p>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                voiceAgent.isListening ? 'bg-danger-400' :
                voiceAgent.isProcessing ? 'bg-gold-400 animate-pulse' :
                voiceAgent.isSpeaking ? 'bg-info-400 animate-pulse' :
                'bg-success-400'
              }`} />
              <p className="text-forest-300 text-xs">
                {voiceAgent.isListening  ? 'Listening...' :
                 voiceAgent.isProcessing ? 'Thinking...' :
                 voiceAgent.isSpeaking   ? 'Speaking...' :
                 'Online · AI Advisor'}
              </p>
            </div>
          </div>
          {/* Mode toggle */}
          <button
            onClick={() => { setMode(m => m === 'voice' ? 'text' : 'voice'); voiceAgent.stopAll() }}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            title={mode === 'voice' ? 'Switch to text mode' : 'Switch to voice mode'}
          >
            {mode === 'voice' ? <Keyboard size={18} /> : <MicOff size={18} />}
          </button>
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4 no-scrollbar max-w-2xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center text-sm shrink-0 mt-1 select-none">
                  🌾
                </div>
              )}
              <div className="max-w-[82%]">
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-forest-900 text-white rounded-br-sm'
                    : 'bg-white text-neutral-800 border border-neutral-200 shadow-card rounded-bl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {(loading || voiceAgent.isProcessing) && (
            <motion.div key="typing"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center text-sm select-none shrink-0 mt-1">🌾</div>
              <div className="bg-white border border-neutral-200 shadow-card rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  {[0,1,2].map(i => (
                    <motion.div key={i}
                      className="w-2 h-2 bg-neutral-300 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ── Voice mode ───────────────────────────────────────────── */}
      {mode === 'voice' && (
        <div className="flex-shrink-0 bg-white border-t border-neutral-200 pb-safe-bottom"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>

          {/* Quick questions (shown when idle) */}
          {voiceAgent.state === 'idle' && messages.length <= 1 && (
            <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => handleSend(q)}
                  className="bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-full px-3 py-2 text-xs font-medium shrink-0 hover:bg-neutral-200 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Transcript preview */}
          {voiceAgent.transcript && (
            <div className="mx-4 mt-3 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-600 italic">
              "{voiceAgent.transcript}"
            </div>
          )}

          {/* Voice orb centered */}
          <div className="flex justify-center py-5">
            <VoiceOrb
              state={voiceAgent.state}
              onPress={voiceAgent.startListening}
              size="lg"
            />
          </div>

          {/* Text fallback link */}
          <p className="text-center text-xs text-neutral-400 pb-2">
            Or{' '}
            <button onClick={() => setMode('text')} className="text-forest-700 font-medium underline underline-offset-2">
              type your question
            </button>
          </p>
        </div>
      )}

      {/* ── Text mode ────────────────────────────────────────────── */}
      {mode === 'text' && (
        <div className="flex-shrink-0 bg-white border-t border-neutral-200 px-4 py-3 max-w-2xl mx-auto w-full"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => handleSend(q)}
                  className="bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-full px-3 py-1.5 text-xs font-medium shrink-0 hover:bg-neutral-200 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-end">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && handleSend()}
              placeholder="Ask about crops, weather, market..."
              className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-900/10 transition-all resize-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-11 h-11 bg-forest-900 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-95 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
