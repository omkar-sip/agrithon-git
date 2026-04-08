import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_META, SUPPORTED_LANGUAGES, useLanguageStore } from '../../store/useLanguageStore'

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  const handleSelect = async (lang: (typeof SUPPORTED_LANGUAGES)[number]) => {
    await setLanguage(lang, { persistToProfile: false })
  }

  return (
    <div className="page-root bg-neutral-50">
      <div className="bg-brand-600 pt-12 pb-6 px-6 text-white text-center shrink-0">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display font-bold text-2xl"
        >
          {t('language.selectTitle')}
        </motion.h1>
        <p className="text-brand-200 text-base mt-1">{t('language.selectSubtitle')}</p>
        <p className="text-brand-100/90 text-sm mt-3">
          {t('language.browserDetected', { language: LANGUAGE_META[language].nativeName })}
        </p>
      </div>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 gap-3"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const meta = LANGUAGE_META[lang]
            const isSelected = language === lang

            return (
              <motion.button
                key={lang}
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => void handleSelect(lang)}
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
                <span className={`text-lg font-bold leading-tight text-center ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
                  {meta.nativeName}
                </span>
                <span className={`text-xs mt-1 ${isSelected ? 'text-brand-200' : 'text-neutral-400'}`}>
                  {meta.englishName}
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      <div className="p-5 pb-10">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/category')}
          className="btn-brand"
        >
          {t('language.continue')}
        </motion.button>
      </div>
    </div>
  )
}
