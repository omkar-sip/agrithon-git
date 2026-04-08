import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import FarmingCategorySelector from '../../components/shared/FarmingCategorySelector'
import { useCategoryStore } from '../../store/useCategoryStore'

export default function CategorySelect() {
  const navigate = useNavigate()
  const { category, setCategory } = useCategoryStore()

  const handleContinue = () => {
    if (!category) return
    navigate('/login')
  }

  return (
    <div className="page-root bg-[#F5F5F7]">
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
          <FarmingCategorySelector
            category={category}
            onSelectCategory={setCategory}
          />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="pb-8"
          >
            <button
              type="button"
              onClick={handleContinue}
              disabled={!category}
              className={
                category
                  ? 'btn-brand'
                  : 'w-full rounded-2xl bg-neutral-300 py-4 text-lg font-bold text-neutral-500 shadow-none cursor-not-allowed'
              }
            >
              <span className="inline-flex items-center gap-3">
                Continue
                <ArrowRight size={20} />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
