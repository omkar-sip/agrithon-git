import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useLanguageStore } from '../store/useLanguageStore'
import { useWeatherStore } from '../store/useWeatherStore'
import { useGeolocation } from './useGeolocation'
import { DEFAULT_LOCATION_COORDS } from '../services/weatherService'

export function useWeather() {
  const farmer = useAuthStore(s => s.farmer)
  const language = useLanguageStore(s => s.language)
  const {
    current,
    forecast,
    alerts,
    advisorySummary,
    advisoryLanguage,
    isLoading,
    isAdvisoryLoading,
    error,
    fetchAndSetWeather,
  } = useWeatherStore()
  const { coords: liveCoords } = useGeolocation(!farmer?.coords)

  const coords = farmer?.coords ?? liveCoords ?? DEFAULT_LOCATION_COORDS

  useEffect(() => {
    void fetchAndSetWeather(coords.lat, coords.lon, { force: true })
  }, [coords.lat, coords.lon, language, fetchAndSetWeather])

  return {
    current,
    forecast,
    alerts,
    advisorySummary,
    advisoryLanguage,
    isLoading,
    isAdvisoryLoading,
    error,
  }
}
