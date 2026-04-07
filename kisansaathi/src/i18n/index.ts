// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import hi from './locales/hi.json'
import kn from './locales/kn.json'
import bn from './locales/bn.json'
import ta from './locales/ta.json'
import pa from './locales/pa.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    kn: { translation: kn },
    bn: { translation: bn },
    ta: { translation: ta },
    pa: { translation: pa },
  },
  lng: 'hi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
