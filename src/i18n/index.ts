import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { defaultNS } from './schema'
import {
  DEFAULT_LANGUAGE,
  getLanguageLocale,
  normalizeSupportedLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './languages'

const setDocumentLanguage = (language: string) => {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
}

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    defaultNS,
    ns: [defaultNS],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
    returnNull: false,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
    parseMissingKeyHandler: (key) => key,
  })

i18n.on('languageChanged', (language) => {
  setDocumentLanguage(normalizeSupportedLanguage(language))
})

if (import.meta.env.DEV) {
  i18n.on('missingKey', (lngs, namespace, key) => {
    console.warn('[i18n] Missing translation key', {
      key,
      namespace,
      languages: lngs,
    })
  })
}

setDocumentLanguage(normalizeSupportedLanguage(i18n.resolvedLanguage || i18n.language))

export const changeAppLanguage = async (language: SupportedLanguage) => {
  const normalized = normalizeSupportedLanguage(language)
  await i18n.changeLanguage(normalized)
  return normalized
}

export const formatLocalizedDate = (
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  language = i18n.resolvedLanguage || i18n.language
) =>
  new Intl.DateTimeFormat(getLanguageLocale(language), options).format(new Date(value))

export const formatLocalizedNumber = (
  value: number,
  options?: Intl.NumberFormatOptions,
  language = i18n.resolvedLanguage || i18n.language
) =>
  new Intl.NumberFormat(getLanguageLocale(language), options).format(value)

export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, normalizeSupportedLanguage }
export type { SupportedLanguage }
export default i18n
