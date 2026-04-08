import { create } from 'zustand'
import { getWeatherAction } from '../services/gemini/geminiClient'
import { fetchCurrentWeather, fetchForecast, getMockForecast, getMockWeather } from '../services/weatherService'
import { useAuthStore } from './useAuthStore'
import { useLanguageStore } from './useLanguageStore'
import type { SupportedLanguage } from '../store/useLanguageStore'

export interface WeatherData {
  temp: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  location: string
  precipitationChance: number
  rainfallMm: number
}

export interface ForecastDay {
  date: string
  tempMax: number
  tempMin: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  precipitationChance: number
  rainfallMm: number
  farmAction: string
  actionColor: 'green' | 'yellow' | 'red'
}

export interface WeatherAlert {
  id: string
  type: string
  severity: 'green' | 'yellow' | 'red'
  title: string
  body: string
  farmAction: string
}

type AdvisoryPayload = {
  summary?: string
  days?: Array<{
    date: string
    farmAction: string
    actionColor: 'green' | 'yellow' | 'red'
  }>
  alerts?: WeatherAlert[]
}

interface WeatherState {
  current: WeatherData | null
  forecast: ForecastDay[]
  alerts: WeatherAlert[]
  advisorySummary: string
  advisoryLanguage: SupportedLanguage | null
  lastFetched: number | null
  lastCoords: { lat: number; lon: number } | null
  isLoading: boolean
  isAdvisoryLoading: boolean
  error: string | null
  setCurrent: (data: WeatherData) => void
  setWeather: (data: WeatherData) => void
  setForecast: (days: ForecastDay[]) => void
  setAlerts: (alerts: WeatherAlert[]) => void
  isStale: () => boolean
  fetchAndSetWeather: (lat: number, lon: number, options?: { force?: boolean }) => Promise<void>
}

const WEATHER_CACHE_MS = 60 * 60 * 1000
const ADVISORY_CACHE_MS = 6 * 60 * 60 * 1000

let lastAdvisoryFetchedAt: number | null = null
let pendingWeatherRequest: Promise<void> | null = null
let pendingWeatherCoords: { lat: number; lon: number } | null = null

const isSameCoords = (a: { lat: number; lon: number } | null, b: { lat: number; lon: number }) => {
  if (!a) return false
  return Math.abs(a.lat - b.lat) < 0.0005 && Math.abs(a.lon - b.lon) < 0.0005
}

const fallbackAlertsFromForecast = (forecast: ForecastDay[]): WeatherAlert[] => {
  const riskyDays = forecast.filter(day => day.actionColor !== 'green').slice(0, 3)

  if (!riskyDays.length) {
    return [{
      id: 'weather-safe-window',
      type: 'weather',
      severity: 'green',
      title: 'Mostly stable farm conditions',
      body: 'Use this weather window for irrigation and field scouting.',
      farmAction: 'Continue routine field work and monitor soil moisture once daily.',
    }]
  }

  return riskyDays.map(day => ({
    id: `weather-${day.date}`,
    type: 'weather',
    severity: day.actionColor,
    title: day.actionColor === 'red' ? 'High weather risk expected' : 'Weather caution expected',
    body: `${day.description} with ${Math.round(day.precipitationChance * 100)}% rain chance on ${day.date}.`,
    farmAction: day.farmAction,
  }))
}

const parseAdvisoryPayload = (raw: string): AdvisoryPayload | null => {
  try {
    const cleaned = raw.trim().replace(/```json/g, '').replace(/```/g, '')
    return JSON.parse(cleaned) as AdvisoryPayload
  } catch {
    return null
  }
}

const mergeForecastWithAdvisory = (forecast: ForecastDay[], advisory: AdvisoryPayload | null) => {
  if (!advisory?.days?.length) return forecast

  return forecast.map(day => {
    const matched = advisory.days?.find(item => item.date === day.date)
    if (!matched) return day
    return {
      ...day,
      farmAction: matched.farmAction || day.farmAction,
      actionColor: matched.actionColor || day.actionColor,
    }
  })
}

export const useWeatherStore = create<WeatherState>()((set, get) => ({
  current: null,
  forecast: [],
  alerts: [],
  advisorySummary: '',
  advisoryLanguage: null,
  lastFetched: null,
  lastCoords: null,
  isLoading: false,
  isAdvisoryLoading: false,
  error: null,

  setCurrent: current => set({ current, lastFetched: Date.now() }),
  setWeather: current => set({ current, lastFetched: Date.now() }),
  setForecast: forecast => set({ forecast }),
  setAlerts: alerts => set({ alerts }),

  isStale: () => {
    const { lastFetched } = get()
    if (!lastFetched) return true
    return Date.now() - lastFetched > WEATHER_CACHE_MS
  },

  fetchAndSetWeather: async (lat, lon, options) => {
    const { lastCoords, lastFetched, forecast } = get()
    const force = options?.force ?? false
    const coords = { lat, lon }
    const alreadyFresh =
      !force &&
      isSameCoords(lastCoords, coords) &&
      !!lastFetched &&
      Date.now() - lastFetched < WEATHER_CACHE_MS &&
      forecast.length > 0

    if (alreadyFresh) return
    if (!force && pendingWeatherRequest && isSameCoords(pendingWeatherCoords, coords)) {
      return pendingWeatherRequest
    }

    const request = (async () => {
      set({ isLoading: true, error: null })

      try {
        const language = useLanguageStore.getState().language

        const [current, nextForecast] = await Promise.all([
          fetchCurrentWeather(lat, lon, language),
          fetchForecast(lat, lon, language),
        ])

        const fallbackAlerts = fallbackAlertsFromForecast(nextForecast)
        set({
          current,
          forecast: nextForecast,
          alerts: fallbackAlerts,
          advisorySummary: nextForecast[0]?.farmAction || '',
          advisoryLanguage: language,
          lastFetched: Date.now(),
          lastCoords: coords,
          isLoading: false,
        })

        const farmer = useAuthStore.getState().farmer
        const shouldRefreshAdvisory =
          force ||
          !lastAdvisoryFetchedAt ||
          Date.now() - lastAdvisoryFetchedAt > ADVISORY_CACHE_MS ||
          !isSameCoords(lastCoords, coords)

        if (!shouldRefreshAdvisory) return

        set({ isAdvisoryLoading: true })

        try {
          const advisoryText = await getWeatherAction({
            category: farmer?.category || 'crop',
            crops: farmer?.crops || [],
            waterSource: farmer?.waterSource,
            location: current.location,
            currentWeather: JSON.stringify(current),
            forecast: JSON.stringify(nextForecast),
            language,
          })

          const advisory = parseAdvisoryPayload(advisoryText)
          const mergedForecast = mergeForecastWithAdvisory(nextForecast, advisory)
          const mergedAlerts = advisory?.alerts?.length ? advisory.alerts : fallbackAlertsFromForecast(mergedForecast)

          lastAdvisoryFetchedAt = Date.now()

          set({
            forecast: mergedForecast,
            alerts: mergedAlerts,
            advisorySummary: advisory?.summary || mergedForecast[0]?.farmAction || '',
            advisoryLanguage: language,
            isAdvisoryLoading: false,
          })
        } catch {
          lastAdvisoryFetchedAt = Date.now()
          set({
            alerts: fallbackAlertsFromForecast(nextForecast),
            advisorySummary: nextForecast[0]?.farmAction || '',
            advisoryLanguage: language,
            isAdvisoryLoading: false,
          })
        }
      } catch (error) {
        const language = useLanguageStore.getState().language
        const fallbackCurrent = getMockWeather(language)
        const fallbackForecast = getMockForecast(language)
        set({
          current: fallbackCurrent,
          forecast: fallbackForecast,
          alerts: fallbackAlertsFromForecast(fallbackForecast),
          advisorySummary: fallbackForecast[0]?.farmAction || '',
          advisoryLanguage: language,
          lastFetched: Date.now(),
          lastCoords: coords,
          isLoading: false,
          isAdvisoryLoading: false,
          error: error instanceof Error ? error.message : 'Unable to fetch weather right now.',
        })
      }
    })()

    pendingWeatherRequest = request
    pendingWeatherCoords = coords

    try {
      await request
    } finally {
      if (pendingWeatherRequest === request) {
        pendingWeatherRequest = null
        pendingWeatherCoords = null
      }
    }
  },
}))
