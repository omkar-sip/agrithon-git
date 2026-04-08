// src/App.tsx
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Router from './router'
import { apiAvailability } from './config/env'
import { onAuthChange } from './services/firebase/authService'
import {
  getFarmerProfile,
  isStoredProfileComplete,
  normalizeFarmerProfile,
  saveFarmerProfile,
  createUserProfilePayload,
} from './services/firebase/firestoreService'
import { useAppStore } from './store/useAppStore'
import { useAuthStore } from './store/useAuthStore'
import { useCategoryStore } from './store/useCategoryStore'
import { useLanguageStore } from './store/useLanguageStore'
import { useLocationStore } from './store/useLocationStore'
import { useWeatherStore } from './store/useWeatherStore'
import { initFCM } from './services/notificationService'

const resolveAuthProvider = (providerId?: string | null) => {
  if (providerId === 'google.com') return 'google' as const
  if (providerId === 'phone') return 'phone' as const
  return 'email' as const
}

export default function App() {
  const { setOnline } = useAppStore()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const farmer = useAuthStore(s => s.farmer)
  const fetchAndSetWeather = useWeatherStore(s => s.fetchAndSetWeather)
  const hydrateLanguage = useLanguageStore(s => s.hydrateLanguage)
  const hydrateLocationFromProfile = useLocationStore(s => s.hydrateFromProfile)

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<{ online: boolean }>
      setOnline(evt.detail.online)
    }
    window.addEventListener('network-change', handler)
    return () => window.removeEventListener('network-change', handler)
  }, [setOnline])

  useEffect(() => {
    if (!isAuthenticated || !farmer?.coords) return
    void fetchAndSetWeather(farmer.coords.lat, farmer.coords.lon)
  }, [farmer?.coords, fetchAndSetWeather, isAuthenticated])

  useEffect(() => {
    if (!farmer) return

    hydrateLocationFromProfile({
      state: farmer.state,
      district: farmer.district,
      village: farmer.village,
      coords: farmer.coords,
    })
  }, [farmer, hydrateLocationFromProfile])

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    void initFCM()
  }, [])

  useEffect(() => {
    hydrateLanguage(window.localStorage.getItem('i18nextLng') || navigator.language)
  }, [hydrateLanguage])

  useEffect(() => {
    if (!apiAvailability.hasFirebaseConfig) return

    let isActive = true

    const unsubscribe = onAuthChange(async (user) => {
      if (!isActive) return

      if (!user) {
        if (useAuthStore.getState().isAuthenticated) {
          useAuthStore.getState().signOut()
        }
        return
      }

      const provider = resolveAuthProvider(user.providerData?.[0]?.providerId)
      const baseIdentity = {
        uid: user.uid,
        name: user.displayName || 'Farmer',
        email: user.email || undefined,
        phone: user.phoneNumber?.replace(/^\+91/, '') || undefined,
        photoURL: user.photoURL || undefined,
      }

      try {
        const storedProfile = await getFarmerProfile(user.uid)
        const normalizedProfile = normalizeFarmerProfile(user.uid, storedProfile, baseIdentity)

        useAuthStore.getState().setAuthenticated({
          ...baseIdentity,
          provider,
          profile: normalizedProfile || undefined,
          isProfileComplete: isStoredProfileComplete(storedProfile),
        })

        if (normalizedProfile?.category) {
          useCategoryStore.getState().setCategory(normalizedProfile.category)
        }

        if (normalizedProfile?.language) {
          useLanguageStore.getState().hydrateLanguage(normalizedProfile.language)
        }

        if (!storedProfile) {
          await saveFarmerProfile(
            user.uid,
            createUserProfilePayload(
              {
                ...baseIdentity,
                uid: user.uid,
                language: useLanguageStore.getState().language,
              },
              { provider, isProfileComplete: false }
            )
          )
        }
      } catch (error) {
        console.error('[Firestore] Failed to sync farmer profile.', error)
        useAuthStore.getState().setAuthenticated({ ...baseIdentity, provider })
      }
    })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [])

  return (
    <>
      <Router />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '15px',
            borderRadius: '16px',
            background: '#1c451c',
            color: '#fff',
            minWidth: '280px',
          },
        }}
      />
    </>
  )
}
