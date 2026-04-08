import 'i18next'
import { defaultNS, translationSchema } from './schema'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: {
      translation: typeof translationSchema
    }
  }
}
