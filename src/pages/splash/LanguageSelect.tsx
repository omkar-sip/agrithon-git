// src/pages/splash/LanguageSelect.tsx — v3 Orange theme
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLanguageStore, LANGUAGE_META, type SupportedLanguage } from '../../store/useLanguageStore'
import { useTranslation } from 'react-i18next'

const LANGUAGES: SupportedLanguage[] = ['hi', 'en', 'kn', 'bn', 'ta', 'pa']

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const handleSelect = (lang: SupportedLanguage) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <div className="page-root bg-neutral-50">
      {/* Header */}
      <div className="bg-brand-600 pt-12 pb-6 px-6 text-white text-center shrink-0">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display font-bold text-2xl"
        >
          🌐 Select Language
        </motion.h1>
        <p className="text-brand-200 text-base mt-1">Choose your preferred language</p>
      </div>

      {/* Language grid */}
      <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
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
                    ? 'bg-brand-600 border-brand-700 text-white shadow-card-hover scale-[1.02]'
                    : 'bg-white border-neutral-200 text-neutral-700 shadow-card active:scale-[0.97]'}
                `}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} className="text-brand-600" />
                  </span>
                )}
                <span className="text-3xl mb-2 select-none">{meta.flag}</span>
                <span className={`text-lg font-bold leading-tight text-center ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
                  {meta.nativeName}
                </span>
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-brand-200' : 'text-neutral-400'}`}>
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
          className="btn-brand"
        >
          Continue →
        </motion.button>
      </div>
    </div>
  )
}
