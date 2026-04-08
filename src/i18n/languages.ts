export const SUPPORTED_LANGUAGES = [
  'en',
  'hi',
  'kn',
  'mr',
  'te',
  'ta',
  'pa',
  'bn',
  'gu',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export const LANGUAGE_META: Record<SupportedLanguage, {
  nativeName: string
  englishName: string
  locale: string
  script: string
}> = {
  en: { nativeName: 'English', englishName: 'English', locale: 'en-IN', script: 'latin' },
  hi: { nativeName: 'हिंदी', englishName: 'Hindi', locale: 'hi-IN', script: 'devanagari' },
  kn: { nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', locale: 'kn-IN', script: 'kannada' },
  mr: { nativeName: 'मराठी', englishName: 'Marathi', locale: 'mr-IN', script: 'devanagari' },
  te: { nativeName: 'తెలుగు', englishName: 'Telugu', locale: 'te-IN', script: 'telugu' },
  ta: { nativeName: 'தமிழ்', englishName: 'Tamil', locale: 'ta-IN', script: 'tamil' },
  pa: { nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', locale: 'pa-IN', script: 'gurmukhi' },
  bn: { nativeName: 'বাংলা', englishName: 'Bengali', locale: 'bn-IN', script: 'bengali' },
  gu: { nativeName: 'ગુજરાતી', englishName: 'Gujarati', locale: 'gu-IN', script: 'gujarati' },
}

export const isSupportedLanguage = (value: unknown): value is SupportedLanguage =>
  typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)

export const normalizeSupportedLanguage = (value?: string | null): SupportedLanguage => {
  if (!value) return DEFAULT_LANGUAGE

  const normalized = value.toLowerCase()
  const directMatch = normalized.split('-')[0]

  return isSupportedLanguage(directMatch) ? directMatch : DEFAULT_LANGUAGE
}

export const getLanguageLocale = (language?: string | null): string =>
  LANGUAGE_META[normalizeSupportedLanguage(language)].locale
