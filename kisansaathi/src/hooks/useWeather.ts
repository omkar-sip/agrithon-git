import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useWeatherStore } from '../store/useWeatherStore'
import { useGeolocation } from './useGeolocation'
import { DEFAULT_LOCATION_COORDS } from '../services/weatherService'

export function useWeather() {
  const farmer = useAuthStore(s => s.farmer)
  const {
    current,
    forecast,
    alerts,
    advisorySummary,
    isLoading,
    isAdvisoryLoading,
    error,
    fetchAndSetWeather,
  } = useWeatherStore()
  const { coords: liveCoords } = useGeolocation(!farmer?.coords)

  const coords = farmer?.coords ?? liveCoords ?? DEFAULT_LOCATION_COORDS

  useEffect(() => {
    void fetchAndSetWeather(coords.lat, coords.lon)
  }, [coords.lat, coords.lon, fetchAndSetWeather])

  return {
    current,
    forecast,
    alerts,
    advisorySummary,
    isLoading,
    isAdvisoryLoading,
    error,
  }
}
