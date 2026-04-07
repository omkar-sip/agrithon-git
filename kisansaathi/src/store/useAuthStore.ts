// src/store/useAuthStore.ts — v2 with Google/Email/Phone support
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FarmerProfile {
  uid: string
  name: string
  email?: string
  phone?: string
  photoURL?: string
  state: string
  district: string
  village: string
  landHolding: '<1' | '1-5' | '5-10' | '10+'
  crops: string[]
  waterSource: 'rain-fed' | 'irrigated' | 'pond'
  language: string
  category: 'crop' | 'livestock' | 'poultry' | 'fishery'
}

export type AuthProvider = 'google' | 'email' | 'phone' | 'guest'

interface AuthState {
  isAuthenticated: boolean
  isGuest: boolean
  authProvider: AuthProvider | null
  phone: string | null
  farmer: FarmerProfile | null
  isProfileComplete: boolean

  // Actions
  setAuthenticated: (params: {
    uid: string
    name: string
    email?: string
    phone?: string
    photoURL?: string
    provider: AuthProvider
  }) => void
  setFarmer: (profile: Partial<FarmerProfile>) => void
  setGuest: () => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isGuest: false,
      authProvider: null,
      phone: null,
      farmer: null,
      isProfileComplete: false,

      setAuthenticated: ({ uid, name, email, phone, photoURL, provider }) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          authProvider: provider,
          phone: phone || null,
          farmer: {
            uid,
            name,
            email,
            phone,
            photoURL,
            state: '',
            district: '',
            village: '',
            landHolding: '<1',
            crops: [],
            waterSource: 'rain-fed',
            language: 'en',
            category: 'crop',
          },
        }),

      setFarmer: (profile) =>
        set(s => ({
          farmer: s.farmer ? { ...s.farmer, ...profile } : null,
          isProfileComplete: true,
        })),

      setGuest: () =>
        set({
          isAuthenticated: false,
          isGuest: true,
          authProvider: 'guest',
          phone: null,
          farmer: null,
          isProfileComplete: false,
        }),

      signOut: () =>
        set({
          isAuthenticated: false,
          isGuest: false,
          authProvider: null,
          phone: null,
          farmer: null,
          isProfileComplete: false,
        }),
    }),
    { name: 'sarpanch-auth-v2' }
  )
)
