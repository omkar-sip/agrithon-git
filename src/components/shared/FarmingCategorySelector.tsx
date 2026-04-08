import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import clsx from 'clsx'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { CATEGORY_META, type FarmingCategory } from '../../store/useCategoryStore'

const CATEGORIES: FarmingCategory[] = ['crop', 'livestock', 'poultry', 'fishery']

interface FarmingCategorySelectorProps {
  category: FarmingCategory | null
  onSelectCategory: (category: FarmingCategory) => void
}

export default function FarmingCategorySelector({
  category,
  onSelectCategory,
}: FarmingCategorySelectorProps) {
  const { isListening, startListening, stopListening } = useVoiceInput({
    onResult: (transcript) => {
      const lower = transcript.toLowerCase()

      if (lower.includes('crop') || lower.includes('wheat') || lower.includes('rice')) {
        onSelectCategory('crop')
      } else if (lower.includes('livestock') || lower.includes('cow') || lower.includes('cattle')) {
        onSelectCategory('livestock')
      } else if (lower.includes('poultry') || lower.includes('chicken') || lower.includes('hen')) {
        onSelectCategory('poultry')
      } else if (lower.includes('fish') || lower.includes('aquaculture') || lower.includes('pond')) {
        onSelectCategory('fishery')
      }
    },
  })

  const handleVoice = () => {
    if (isListening) stopListening()
    else startListening('en-US')
  }

  return (
    <div className="space-y-5">
      <div
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-orange-500 px-7 py-10 text-white shadow-[0_18px_50px_rgba(234,88,12,0.18)]"
      >
        <button
          type="button"
          onClick={handleVoice}
          aria-label="Voice input for farming type"
          className={clsx(
            'absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300',
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
          )}
        >
          <Mic size={24} />
        </button>

        <div className="pr-16">
          <h2
            className="text-balance text-3xl font-extrabold leading-tight md:text-4xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            What kind of farming do you do?
          </h2>
          <p className="mt-4 max-w-md text-lg font-medium text-white/90">
            We&apos;ll personalize your experience based on this.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((nextCategory, index) => {
          const meta = CATEGORY_META[nextCategory]
          const isSelected = category === nextCategory

          return (
            <motion.button
              key={nextCategory}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.26 }}
              onClick={() => onSelectCategory(nextCategory)}
              className={clsx(
                'w-full rounded-[1.8rem] border-2 bg-white p-5 text-left shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-all duration-200 active:scale-[0.99]',
                isSelected
                  ? 'border-brand-500 bg-brand-50/40 shadow-[0_16px_36px_rgba(249,115,22,0.14)]'
                  : 'border-white hover:border-neutral-200 hover:bg-neutral-50'
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    'flex h-[74px] w-[74px] items-center justify-center rounded-3xl text-[42px] shadow-sm',
                    isSelected ? 'bg-brand-100' : 'bg-neutral-100'
                  )}
                >
                  {meta.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={clsx(
                      'text-xl font-bold leading-tight',
                      isSelected ? meta.colorClass : 'text-neutral-900'
                    )}
                  >
                    {meta.label}
                  </p>
                  <p className="mt-1 text-base text-neutral-500">{meta.description}</p>
                </div>

                <div
                  className={clsx(
                    'flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all',
                    isSelected ? 'border-brand-500' : 'border-neutral-300'
                  )}
                >
                  {isSelected && <div className="h-3.5 w-3.5 rounded-full bg-brand-500" />}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
