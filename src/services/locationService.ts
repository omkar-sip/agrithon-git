import { apiClient } from './api'
import { env } from '../config/env'
import { DEFAULT_LOCATION_COORDS } from './weatherService'

const GEO_BASE = 'https://api.openweathermap.org/geo/1.0'

type DirectGeoEntry = {
  name?: string
  state?: string
  country?: string
  lat: number
  lon: number
}

type IpApiResponse = {
  city?: string
  region?: string
  region_code?: string
  country_name?: string
  latitude?: number
  longitude?: number
}

export interface ResolvedLocation {
  label: string
  district: string
  state: string
  coords: { lat: number; lon: number }
  source: 'device' | 'ip' | 'manual' | 'profile'
}

const hasWeatherKey = () => env.openWeatherApiKey.trim().length > 0

const buildLabel = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(', ')

export async function resolveLocationByIp(): Promise<ResolvedLocation> {
  const { data } = await apiClient.get<IpApiResponse>('https://ipapi.co/json/')
  const lat = data.latitude
  const lon = data.longitude

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('IP-based location could not be resolved.')
  }

  const district = data.city?.trim() || ''
  const state = data.region?.trim() || data.region_code?.trim() || ''

  return {
    label: buildLabel(district, state, data.country_name?.trim()) || 'Detected location',
    district,
    state,
    coords: { lat, lon },
    source: 'ip',
  }
}

export async function geocodeLocationQuery(query: string): Promise<ResolvedLocation> {
  const normalized = query.trim()
  if (!normalized) {
    throw new Error('Enter a city, district, or state to continue.')
  }

  if (!hasWeatherKey()) {
    const parts = normalized.split(',').map(part => part.trim()).filter(Boolean)
    return {
      label: normalized,
      district: parts[0] || normalized,
      state: parts[parts.length - 1] || '',
      coords: DEFAULT_LOCATION_COORDS,
      source: 'manual',
    }
  }

  const { data } = await apiClient.get<DirectGeoEntry[]>(`${GEO_BASE}/direct`, {
    params: {
      q: normalized,
      limit: 1,
      appid: env.openWeatherApiKey,
    },
  })

  const match = data[0]
  if (!match || typeof match.lat !== 'number' || typeof match.lon !== 'number') {
    throw new Error('Location not found. Try city, district, and state.')
  }

  const district = match.name?.trim() || normalized
  const state = match.state?.trim() || ''

  return {
    label: buildLabel(district, state, match.country?.trim()) || normalized,
    district,
    state,
    coords: { lat: match.lat, lon: match.lon },
    source: 'manual',
  }
}
