// src/pages/splash/LanguageSelect.tsx — English UI, native script labels for each language
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLanguageStore, LANGUAGE_META, type SupportedLanguage } from '../../store/useLanguageStore'
import { useTranslation } from 'react-i18next'

const LANGUAGES: SupportedLanguage[] = ['hi', 'en', 'kn', 'bn', 'ta', 'pa']

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const handleSelect = (lang: SupportedLanguage) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-forest-500 pt-12 pb-6 px-6 text-white text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display font-bold text-2xl"
        >
          🌐 Choose Your Language
        </motion.h1>
        <p className="text-harvest-200 text-base mt-1">Select your preferred language</p>
      </div>

      {/* Language grid */}
      <div className="flex-1 p-5">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 gap-3"
        >
          {LANGUAGES.map(lang => {
            const meta = LANGUAGE_META[lang]
            const isSelected = language === lang
            return (
              <motion.button
                key={lang}
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => handleSelect(lang)}
                className={`
                  relative flex flex-col items-center justify-center p-5 rounded-2xl
                  min-h-[110px] border-2 transition-all duration-200
                  ${isSelected
                    ? 'bg-forest-500 border-forest-600 text-white shadow-card-hover scale-[1.02]'
                    : 'bg-white border-parchment text-soil-700 shadow-card active:scale-[0.97]'}
                `}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 bg-harvest-400 rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </span>
                )}
                <span className="text-3xl mb-2 select-none">{meta.flag}</span>
                {/* Show native name as label (only for the script indicator, not content) */}
                <span className={`text-lg font-bold leading-tight text-center ${isSelected ? 'text-white' : 'text-forest-800'}`}>
                  {meta.nativeName}
                </span>
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-harvest-200' : 'text-soil-400'}`}>
                  {meta.englishName}
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="p-5 pb-10">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/category')}
          className="btn-primary"
        >
          Continue →
        </motion.button>
      </div>
    </div>
  )
}
