// src/store/useAuthStore.ts — v2 with Google/Email/Phone support
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FarmerProfile {
  uid: string
  name: string
  email?: string
  phone?: string
  photoURL?: string
  coords: { lat: number; lon: number } | null
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

type AuthIdentity = {
  uid: string
  name: string
  email?: string
  phone?: string
  photoURL?: string
}

export const createDefaultFarmerProfile = ({
  uid,
  name,
  email,
  phone,
  photoURL,
}: AuthIdentity): FarmerProfile => ({
  uid,
  name,
  email,
  phone,
  photoURL,
  coords: null,
  state: '',
  district: '',
  village: '',
  landHolding: '<1',
  crops: [],
  waterSource: 'rain-fed',
  language: 'en',
  category: 'crop',
})

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
    profile?: Partial<FarmerProfile>
    isProfileComplete?: boolean
  }) => void
  setFarmer: (profile: Partial<FarmerProfile>) => void
  setGuest: () => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      authProvider: null,
      phone: null,
      farmer: null,
      isProfileComplete: false,

      setAuthenticated: ({
        uid,
        name,
        email,
        phone,
        photoURL,
        provider,
        profile,
        isProfileComplete,
      }) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          authProvider: provider,
          phone: phone || null,
          farmer: {
            ...createDefaultFarmerProfile({ uid, name, email, phone, photoURL }),
            ...profile,
            uid,
            name: profile?.name || name,
            email: profile?.email ?? email,
            phone: profile?.phone ?? phone,
            photoURL: profile?.photoURL ?? photoURL,
          },
          isProfileComplete: isProfileComplete ?? false,
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
