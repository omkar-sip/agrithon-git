import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  type DocumentData,
} from 'firebase/firestore'
import { db } from './firebaseConfig'
import type { AuthProvider, FarmerProfile } from '../../store/useAuthStore'
import { normalizeSupportedLanguage } from '../../i18n'

export const getFarmerProfile = async (userId: string) => {
  const ref = doc(db, 'users', userId)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export const saveFarmerProfile = async (userId: string, data: DocumentData) => {
  const ref = doc(db, 'users', userId)
  const snap = await getDoc(ref)

  await setDoc(
    ref,
    {
      ...data,
      ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

type UserProfileSeed = {
  uid: string
  name?: string | null
  email?: string | null
  phone?: string | null
  photoURL?: string | null
}

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const asOptionalString = (value: unknown, fallback?: string | null): string | undefined => {
  if (typeof value === 'string') return value
  return typeof fallback === 'string' ? fallback : undefined
}

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const asCoords = (value: unknown): FarmerProfile['coords'] => {
  if (!value || typeof value !== 'object') return null

  const lat = (value as { lat?: unknown }).lat
  const lon = (value as { lon?: unknown }).lon

  return typeof lat === 'number' && typeof lon === 'number' ? { lat, lon } : null
}

const asCategory = (value: unknown): FarmerProfile['category'] => {
  if (value === 'livestock' || value === 'poultry' || value === 'fishery') return value
  return 'crop'
}

const asLandHolding = (value: unknown): FarmerProfile['landHolding'] => {
  if (value === '1-5' || value === '5-10' || value === '10+') return value
  return '<1'
}

const asWaterSource = (value: unknown): FarmerProfile['waterSource'] => {
  if (value === 'irrigated' || value === 'pond') return value
  return 'rain-fed'
}

export const createUserProfilePayload = (
  profile: Partial<FarmerProfile>,
  options?: { provider?: AuthProvider | null; isProfileComplete?: boolean }
) => ({
  uid: profile.uid,
  name: profile.name,
  email: profile.email ?? null,
  phone: profile.phone ?? null,
  photoURL: profile.photoURL ?? null,
  coords: profile.coords ?? null,
  state: profile.state ?? '',
  district: profile.district ?? '',
  village: profile.village ?? '',
  landHolding: profile.landHolding ?? '<1',
  crops: profile.crops ?? [],
  waterSource: profile.waterSource ?? 'rain-fed',
  language: profile.language ?? 'en',
  category: profile.category ?? 'crop',
  authProvider: options?.provider ?? null,
  isProfileComplete: options?.isProfileComplete ?? false,
})

export const normalizeFarmerProfile = (
  userId: string,
  data: DocumentData | null,
  seed: UserProfileSeed
): FarmerProfile | null => {
  if (!data) return null

  return {
    uid: userId,
    name: asString(data.name, seed.name || 'Farmer'),
    email: asOptionalString(data.email, seed.email),
    phone: asOptionalString(data.phone, seed.phone),
    photoURL: asOptionalString(data.photoURL, seed.photoURL),
    coords: asCoords(data.coords),
    state: asString(data.state),
    district: asString(data.district),
    village: asString(data.village),
    landHolding: asLandHolding(data.landHolding),
    crops: asStringArray(data.crops),
    waterSource: asWaterSource(data.waterSource),
    language: normalizeSupportedLanguage(asString(data.language, 'en')),
    category: asCategory(data.category),
  }
}

export const isStoredProfileComplete = (data: DocumentData | null): boolean =>
  Boolean(data?.isProfileComplete)

export const syncDiaryEntry = async (farmerId: string, entry: DocumentData) => {
  const col = collection(db, 'diary')
  return addDoc(col, { farmerId, ...entry, syncedAt: serverTimestamp() })
}

export const addCommunityReport = async (report: DocumentData) => {
  return addDoc(collection(db, 'community'), { ...report, createdAt: serverTimestamp() })
}

export const subscribeToNearbyReports = (
  district: string,
  callback: (reports: DocumentData[]) => void
) => {
  const q = query(
    collection(db, 'community'),
    where('district', '==', district),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export const saveAlert = async (userId: string, alert: DocumentData) => {
  return addDoc(collection(db, 'alerts'), { userId, ...alert, createdAt: serverTimestamp() })
}

export const saveMandiListing = async (params: {
  farmerId: string
  crop: string
  quantity: number
  price: number
  mandiReferencePrice: number
  location: string
}) =>
  addDoc(collection(db, 'mandiListings'), {
    ...params,
    createdAt: serverTimestamp(),
  })

export const saveSoilReport = async (params: {
  userId: string
  input: DocumentData
  result: string
}) =>
  addDoc(collection(db, 'soilReports'), {
    ...params,
    createdAt: serverTimestamp(),
  })

export const saveBudget = async (params: {
  userId: string
  crop: string
  cost: number
  revenue: number
  profit: number
  breakdown: DocumentData
}) =>
  addDoc(collection(db, 'budgets'), {
    ...params,
    createdAt: serverTimestamp(),
  })

export const saveContractAnalysis = async (params: {
  userId: string
  fileUrl: string
  analysis: string
  fileName: string
}) =>
  addDoc(collection(db, 'contracts'), {
    ...params,
    createdAt: serverTimestamp(),
  })

export type YojanaRecord = {
  id: string
  title: string
  eligibility: string
  benefits: string
  state: string
  category?: string
  maxLandAcres?: number | null
  maxAnnualIncome?: number | null
}

const asOptionalNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export const listYojanas = async (state?: string): Promise<YojanaRecord[]> => {
  const baseQuery = state
    ? query(collection(db, 'yojanas'), where('state', 'in', [state, 'All India']))
    : query(collection(db, 'yojanas'))

  const snap = await getDocs(baseQuery)

  return snap.docs.map((item) => {
    const data = item.data()
    return {
      id: item.id,
      title: asString(data.title, 'Yojana'),
      eligibility: asString(data.eligibility),
      benefits: asString(data.benefits),
      state: asString(data.state, 'All India'),
      category: asString(data.category),
      maxLandAcres: asOptionalNumber(data.maxLandAcres),
      maxAnnualIncome: asOptionalNumber(data.maxAnnualIncome),
    }
  })
}

export { Timestamp }
