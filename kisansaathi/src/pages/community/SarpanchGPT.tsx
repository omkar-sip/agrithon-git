// src/pages/community/SarpanchGPT.tsx — Premium Polish
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronLeft, Keyboard, MicOff, Star, Sparkles, MapPin, Quote } from 'lucide-react'
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
  'How do I remove aphids from wheat? 🌾',
  'When does PM-KISAN payment come? 💰',
  'Crops to sow in June in Karnataka? 🌱',
  'Signs of low soil nitrogen? 🧪',
]

export default function SarpanchGPT() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const farmer = useAuthStore(s => s.farmer)

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello${farmer?.name ? ', ' + farmer.name.split(' ')[0] : ''}! I'm Sarpanch AI — your premium agricultural advisor.\n\nI can help you with crop disease diagnosis, market trends, and maximizing your yield. Tap the mic to speak or type your query below.`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'text' | 'voice'>('voice')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const askAI = useCallback(async (question: string): Promise<string> => {
    const ctx = farmer
      ? `Farmer profile: Name=${farmer.name}, Location=${farmer.district || 'India'}, ${farmer.state || ''}, Category=${farmer.category}, Land=${farmer.landHolding} acres, Water=${farmer.waterSource}.`
      : 'Anonymous farmer from India'
    return chatWithSarpanch({ question, farmerContext: ctx, language })
  }, [farmer, language])

  const voiceAgent = useVoiceAgent(askAI, {
    onTranscript: (text) => setInput(text),
    onResponse: (text) => {
      setMessages(m => [
        ...m,
        { role: 'model', content: text, timestamp: new Date() }
      ])
    },
    onStateChange: (s) => {
      if (s === 'processing' && voiceAgent.transcript) {
        setMessages(m => [...m, { role: 'user', content: voiceAgent.transcript, timestamp: new Date() }])
        setInput('')
      }
    }
  })

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
    <div className="flex flex-col h-screen h-[100dvh] bg-[#FDFDFD] overflow-hidden relative">

      {/* ── Fixed Header ────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-neutral-100/50"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-4 px-6 h-16 max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all active:scale-90">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg border border-white/20">
               <Sparkles size={20} fill="white" />
            </div>
            <div>
               <p className="font-extrabold text-lg leading-none text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Sarpanch AI
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className={`w-1.5 h-1.5 rounded-full ${voiceAgent.isListening || voiceAgent.isSpeaking || voiceAgent.isProcessing ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                    {voiceAgent.isListening ? 'Listening...' : voiceAgent.isSpeaking ? 'Speaking...' : 'Ready to help'}
                 </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setMode(m => m === 'voice' ? 'text' : 'voice'); voiceAgent.stopAll() }}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all active:scale-95"
          >
            {mode === 'voice' ? <Keyboard size={20} /> : <MicOff size={20} />}
          </button>
        </div>
      </div>

      {/* ── Chat Canvas ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pt-24 pb-4 space-y-6 no-scrollbar max-w-3xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-5 py-4 rounded-[2rem] text-[15px] leading-relaxed shadow-sm border ${msg.role === 'user'
                    ? 'bg-neutral-900 text-white border-neutral-800 rounded-br-sm'
                    : 'bg-white text-neutral-800 border-neutral-100 rounded-bl-sm'
                  }`}>
                  <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3">
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                     {formatTime(msg.timestamp)}
                   </p>
                   {msg.role === 'model' && <Star size={10} className="text-orange-400 fill-orange-400" />}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {(loading || voiceAgent.isProcessing) && (
            <motion.div key="typing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
               <div className="bg-white border border-neutral-100 shadow-sm rounded-[2rem] rounded-bl-sm px-6 py-4">
                 <div className="flex gap-1.5 items-center h-4">
                   {[0, 1, 2].map(i => (
                     <motion.div key={i} className="w-2 h-2 bg-neutral-200 rounded-full" animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }} />
                   ))}
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-20" />
      </div>

      {/* ── Control Center ────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-t border-neutral-100 drop-shadow-2xl">
        
        {/* Quick Questions (Dynamic) */}
        {messages.length <= 1 && (
            <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-neutral-50 bg-neutral-50/50">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => handleSend(q)}
                  className="bg-white text-neutral-700 border border-neutral-100 rounded-2xl px-5 py-3 text-xs font-bold shrink-0 hover:bg-neutral-50 transition-all active:scale-95 shadow-sm">
                  {q}
                </button>
              ))}
            </div>
        )}

        {/* Action Area */}
        {mode === 'voice' ? (
          <div className="p-8 pb-10 flex flex-col items-center gap-6">
             {voiceAgent.transcript && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-3 bg-neutral-100 rounded-2xl text-sm text-neutral-500 font-bold italic border border-neutral-200/50 text-center">
                   "{voiceAgent.transcript}"
                </motion.div>
             )}
             <VoiceOrb state={voiceAgent.state} onPress={voiceAgent.startListening} size="lg" />
             <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                {voiceAgent.state === 'idle' ? 'Tap to speak' : voiceAgent.state === 'listening' ? 'Listening...' : 'Thinking...'}
             </p>
          </div>
        ) : (
          <div className="px-6 py-5 max-w-3xl mx-auto w-full flex gap-3 items-end">
            <div className="flex-1 bg-neutral-100 rounded-3xl border border-neutral-200/50 focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all p-2">
               <textarea
                  ref={inputRef as any}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && handleSend()}
                  placeholder="Ask about crops, weather, mandi..."
                  rows={2}
                  className="w-full bg-transparent border-none px-4 py-2 text-sm text-neutral-900 font-bold outline-none resize-none"
               />
            </div>
            <button
               onClick={() => handleSend()}
               disabled={loading || !input.trim()}
               className="w-14 h-14 bg-neutral-900 text-white rounded-3xl flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-90 transition-all shadow-xl"
            >
               <Send size={20} />
            </button>
          </div>
        )}

        {/* Global Motto Footer */}
        <div className="px-8 pb-4 pt-2 text-center opacity-40">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Quote size={8} /> Unified Agricultural advisor platform without boundaries <Quote size={8} className="rotate-180" />
           </p>
        </div>
      </div>

    </div>
  )
}
