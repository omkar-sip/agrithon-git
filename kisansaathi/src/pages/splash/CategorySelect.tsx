// src/pages/splash/CategorySelect.tsx — redesigned clean 4-category picker (AgroSathi Apple-style)
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mic } from 'lucide-react'
import { useCategoryStore, CATEGORY_META, type FarmingCategory } from '../../store/useCategoryStore'

import { useVoiceInput } from '../../hooks/useVoiceInput'

const CATEGORIES: FarmingCategory[] = ['crop', 'livestock', 'poultry', 'fishery']

export default function CategorySelect() {
  const navigate = useNavigate()
  const { category, setCategory } = useCategoryStore()

  const { isListening, startListening, stopListening } = useVoiceInput({
    onResult: (transcript) => {
      const lower = transcript.toLowerCase()
      if (lower.includes('crop') || lower.includes('wheat') || lower.includes('rice')) {
        setCategory('crop')
      } else if (lower.includes('livestock') || lower.includes('cow') || lower.includes('cattle')) {
        setCategory('livestock')
      } else if (lower.includes('poultry') || lower.includes('chicken') || lower.includes('hen')) {
        setCategory('poultry')
      } else if (lower.includes('fish') || lower.includes('aquaculture') || lower.includes('pond')) {
        setCategory('fishery')
      }
    }
  })

  const handleVoice = () => {
    if (isListening) stopListening()
    else startListening('en-US') // Fallback to english for parsing simple words in demo
  }

  const handleContinue = () => {
    if (category) {
      navigate(`/login`) // Fixed: following the instruction plan: Category -> Login
    }
  }

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#F5F5F7] flex flex-col items-center">

      {/* Header Section */}
      <div className="w-full shrink-0 bg-gradient-to-b from-brand-700 to-brand-600 text-white rounded-b-3xl shadow-lg relative"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 40px)', paddingBottom: '40px' }}>

        {/* Voice Integration Button */}
        <button
          onClick={handleVoice}
          className={`absolute top-6 right-6 p-3 rounded-full shadow-md transition-all duration-300 flex items-center justify-center
            ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'}`
          }
          aria-label="Voice input"
        >
          <Mic size={24} />
        </button>

        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="px-6 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            What kind of farming do you do?
          </h1>
          <p className="text-forest-100 text-lg md:text-xl font-medium">
            We’ll personalize your experience based on this.
          </p>
        </motion.div>
      </div>

      {/* Main Content Arena */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full max-w-3xl px-4 py-8 md:py-12 flex flex-col">

        {/* Category Cards (2x2 Grid Desktop, Stack Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
          {CATEGORIES.map((cat, i) => {
            const meta = CATEGORY_META[cat]
            const selected = category === cat

            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, ease: 'easeOut', duration: 0.4 }}
                onClick={() => setCategory(cat)}
                className={`
                  relative flex items-center gap-4 p-5 rounded-2xl text-left 
                  transition-all duration-300 ease-in-out border-2 overflow-hidden
                  ${selected
                    ? 'border-brand-500 bg-brand-50 shadow-md scale-[1.02]'
                    : 'border-transparent bg-white shadow-sm hover:shadow-md hover:scale-[1.01]'}
                `}
              >
                {/* Visual Indicator Line (Apple-style left edge accent) */}
                {selected && (
                  <motion.div layoutId="selection-edge" className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500" />
                )}

                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-4xl shadow-sm
                  transition-colors duration-300
                  ${selected ? 'bg-brand-100' : 'bg-neutral-100'}
                `}>
                  {meta.emoji}
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className={`font-bold text-lg leading-tight mb-1 ${selected ? 'text-forest-800' : 'text-neutral-900'}`}>
                    {meta.label}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-snug font-medium">
                    {meta.description}
                  </p>
                </div>

                {/* Radio Circle */}
                <div className="shrink-0 flex items-center justify-center mr-1">
                  <div className={`
                    w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                    ${selected ? 'border-brand-500' : 'border-neutral-300'}
                  `}>
                    {selected && <div className="w-3 h-3 rounded-full bg-brand-500 shadow-sm" />}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Action Button - Sticky/Bottom aligned */}
        <div className="mt-auto md:w-2/3 mx-auto w-full pb-8">
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleContinue}
            disabled={!category}
            className={`
              w-full flex items-center justify-center gap-3 py-4 md:py-5 rounded-2xl font-bold text-lg
              transition-all duration-300 shadow-lg
              ${category
                ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'}
            `}
          >
            Continue
            <ArrowRight size={22} className={category ? "animate-pulse" : ""} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
