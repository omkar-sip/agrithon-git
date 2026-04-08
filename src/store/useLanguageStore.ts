// src/store/useLanguageStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'bn' | 'ta' | 'pa'

export const LANGUAGE_META: Record<SupportedLanguage, {
  nativeName: string
  englishName: string
  flag: string
  script: string
}> = {
  en: { nativeName: 'English',   englishName: 'English',  flag: '🇮🇳', script: 'latin' },
  hi: { nativeName: 'हिंदी',     englishName: 'Hindi',    flag: '🇮🇳', script: 'devanagari' },
  kn: { nativeName: 'ಕನ್ನಡ',    englishName: 'Kannada',  flag: '🇮🇳', script: 'kannada' },
  bn: { nativeName: 'বাংলা',     englishName: 'Bengali',  flag: '🇮🇳', script: 'bengali' },
  ta: { nativeName: 'தமிழ்',     englishName: 'Tamil',    flag: '🇮🇳', script: 'tamil' },
  pa: { nativeName: 'ਪੰਜਾਬੀ',   englishName: 'Punjabi',  flag: '🇮🇳', script: 'gurmukhi' },
}

interface LanguageState {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'hi', // default Hindi
      setLanguage: (language) => set({ language }),
    }),
    { name: 'sarpanch-language' }
  )
)
