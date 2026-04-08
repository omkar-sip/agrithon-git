import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import i18n, {
  changeAppLanguage,
  DEFAULT_LANGUAGE,
  normalizeSupportedLanguage,
} from '../i18n'
import {
  LANGUAGE_META,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../i18n/languages'
import { createUserProfilePayload, saveFarmerProfile } from '../services/firebase/firestoreService'
import { useAuthStore } from './useAuthStore'

export { DEFAULT_LANGUAGE, LANGUAGE_META, SUPPORTED_LANGUAGES }
export type { SupportedLanguage }

type SetLanguageOptions = {
  persistToProfile?: boolean
}

interface LanguageState {
  language: SupportedLanguage
  isChangingLanguage: boolean
  setLanguage: (lang: SupportedLanguage, options?: SetLanguageOptions) => Promise<void>
  hydrateLanguage: (lang: string) => void
}

const syncLanguageToProfile = async (language: SupportedLanguage) => {
  const { farmer, authProvider, isAuthenticated, isProfileComplete, setFarmer } = useAuthStore.getState()
  if (!isAuthenticated || !farmer?.uid || farmer.uid === 'local') return

  await saveFarmerProfile(
    farmer.uid,
    createUserProfilePayload(
      {
        ...farmer,
        language,
      },
      {
        provider: authProvider,
        isProfileComplete,
      }
    )
  )

  if (isProfileComplete) {
    setFarmer({ language })
  }
}

const getInitialLanguage = (): SupportedLanguage =>
  normalizeSupportedLanguage(i18n.resolvedLanguage || i18n.language || DEFAULT_LANGUAGE)

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      isChangingLanguage: false,
      setLanguage: async (language, options) => {
        const nextLanguage = normalizeSupportedLanguage(language)
        set((state) =>
          state.language === nextLanguage
            ? { isChangingLanguage: false }
            : { isChangingLanguage: true }
        )

        try {
          await changeAppLanguage(nextLanguage)
          set({ language: nextLanguage, isChangingLanguage: false })

          if (options?.persistToProfile !== false) {
            await syncLanguageToProfile(nextLanguage)
          }
        } catch (error) {
          set({ isChangingLanguage: false })
          throw error
        }
      },
      hydrateLanguage: (language) => {
        const nextLanguage = normalizeSupportedLanguage(language)
        void changeAppLanguage(nextLanguage)
        set({ language: nextLanguage, isChangingLanguage: false })
      },
    }),
    {
      name: 'sarpanch-language',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (!state?.language) return
        state.hydrateLanguage(state.language)
      },
    }
  )
)
