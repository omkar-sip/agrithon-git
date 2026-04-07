// src/pages/splash/CategorySelect.tsx — English only
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCategoryStore, CATEGORY_META, type FarmingCategory } from '../../store/useCategoryStore'

const CATEGORIES: FarmingCategory[] = ['crop', 'livestock', 'poultry', 'fishery']

const CATEGORY_BG: Record<FarmingCategory, string> = {
  crop:      'from-forest-500 to-forest-700',
  livestock: 'from-harvest-400 to-harvest-600',
  poultry:   'from-mango-500 to-orange-600',
  fishery:   'from-sky-500 to-sky-700',
}

export default function CategorySelect() {
  const navigate = useNavigate()
  const { category, setCategory } = useCategoryStore()

  const handleSelect = (cat: FarmingCategory) => setCategory(cat)

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-forest-500 pt-12 pb-6 px-6 text-white text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display font-bold text-2xl"
        >
          🌱 What type of farming do you do?
        </motion.h1>
        <p className="text-harvest-200 text-base mt-1">Select your primary farming type</p>
      </div>

      {/* Category cards */}
      <div className="flex-1 p-5 space-y-3">
        {CATEGORIES.map((cat, i) => {
          const meta = CATEGORY_META[cat]
          const isSelected = category === cat
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.09 }}
              onClick={() => handleSelect(cat)}
              className={`
                w-full relative overflow-hidden rounded-2xl min-h-[90px]
                flex items-center gap-4 px-5 py-4 text-left
                transition-all duration-200 shadow-card
                ${isSelected
                  ? `bg-gradient-to-r ${CATEGORY_BG[cat]} text-white shadow-card-hover scale-[1.02]`
                  : 'bg-white border-2 border-parchment text-soil-800 active:scale-[0.98]'}
              `}
            >
              <span className="text-5xl shrink-0 select-none">{meta.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-display font-bold text-xl ${isSelected ? 'text-white' : 'text-forest-800'}`}>
                  {meta.label}
                </p>
                <p className={`text-sm mt-0.5 ${isSelected ? 'text-white/80' : 'text-soil-500'}`}>
                  {meta.description}
                </p>
              </div>
              {isSelected && (
                <div className="shrink-0 w-7 h-7 bg-white/25 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
              {/* Decorative ghost emoji */}
              <div className="absolute right-2 top-0 bottom-0 flex items-center opacity-10 text-7xl pointer-events-none select-none">
                {meta.emoji}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="p-5 pb-10">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={() => { if (category) navigate('/login') }}
          disabled={!category}
          className={`btn-primary ${!category ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          This is My Farming Type ✓
        </motion.button>
      </div>
    </div>
  )
}
