// src/pages/splash/CategorySelect.tsx — redesigned clean 4-category picker
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useCategoryStore, CATEGORY_META, type FarmingCategory } from '../../store/useCategoryStore'

const CATEGORIES: FarmingCategory[] = ['crop', 'livestock', 'poultry', 'fishery']

const CATEGORY_ACCENT: Record<FarmingCategory, { selected: string; dot: string; border: string }> = {
  crop:      { selected: 'bg-forest-900',  dot: 'bg-forest-900', border: 'border-forest-900' },
  livestock: { selected: 'bg-amber-700',   dot: 'bg-amber-700',  border: 'border-amber-700' },
  poultry:   { selected: 'bg-orange-600',  dot: 'bg-orange-600', border: 'border-orange-600' },
  fishery:   { selected: 'bg-sky-700',     dot: 'bg-sky-700',    border: 'border-sky-700' },
}

export default function CategorySelect() {
  const navigate = useNavigate()
  const { category, setCategory } = useCategoryStore()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* Header */}
      <div className="bg-forest-900 text-white px-6 pb-8 pt-14 text-center"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)' }}>
        <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <p className="text-forest-300 text-sm font-medium mb-2">Step 2 of 3</p>
          <h1 className="text-2xl font-bold text-white leading-snug"
            style={{ fontFamily: 'Baloo 2, sans-serif' }}>
            What kind of farming do you do?
          </h1>
          <p className="text-forest-300 text-sm mt-2">
            We'll personalize your experience based on this
          </p>
        </motion.div>
      </div>

      {/* Category cards */}
      <div className="flex-1 px-4 py-6 space-y-3 max-w-lg mx-auto w-full">
        {CATEGORIES.map((cat, i) => {
          const meta    = CATEGORY_META[cat]
          const accent  = CATEGORY_ACCENT[cat]
          const selected = category === cat

          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: 'easeOut' }}
              onClick={() => setCategory(cat)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left
                transition-all duration-200 active:scale-[0.99]
                ${selected
                  ? `${accent.border} bg-white shadow-card-md`
                  : 'border-neutral-200 bg-white shadow-card hover:border-neutral-300 hover:shadow-card-md'}
              `}
            >
              {/* Category icon */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-3xl select-none
                transition-colors duration-200
                ${selected ? accent.selected + ' text-white' : 'bg-neutral-100'}
              `}>
                {meta.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-base leading-tight ${selected ? 'text-neutral-900' : 'text-neutral-800'}`}
                  style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                  {meta.label}
                </p>
                <p className="text-neutral-500 text-sm mt-0.5 leading-snug">
                  {meta.description}
                </p>
              </div>

              {/* Check */}
              {selected
                ? <CheckCircle2 size={22} className={`shrink-0 ${accent.dot.replace('bg-', 'text-')}`} />
                : <div className="w-5 h-5 rounded-full border-2 border-neutral-300 shrink-0" />
              }
            </motion.button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="px-4 pb-10 max-w-lg mx-auto w-full"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => { if (category) navigate('/login') }}
          disabled={!category}
          className={`
            w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base
            transition-all duration-200
            ${category
              ? 'bg-forest-900 text-white shadow-card-md hover:bg-forest-800 active:scale-[0.98]'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}
          `}
        >
          Continue
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  )
}
