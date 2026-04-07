// src/hooks/useWeather.ts
import { useEffect } from 'react'
import { useWeatherStore } from '../store/useWeatherStore'
import { useGeolocation } from './useGeolocation'
import { fetchCurrentWeather, fetchForecast, getMockWeather } from '../services/weatherService'
import { isOlderThan } from '../utils/dateHelper'

export function useWeather() {
  const { current, forecast, lastFetched, setCurrent, setForecast } = useWeatherStore()
  const { coords } = useGeolocation()

  const needsRefresh = !lastFetched || isOlderThan(lastFetched, 1) // Refresh after 1 hour

  useEffect(() => {
    if (!needsRefresh) return

    if (!coords) {
      // Use mock weather in dev
      setCurrent(getMockWeather())
      return
    }

    fetchCurrentWeather(coords.lat, coords.lon)
      .then(setCurrent)
      .catch(() => setCurrent(getMockWeather()))

    fetchForecast(coords.lat, coords.lon)
      .then(setForecast)
      .catch(() => {})
  }, [coords, needsRefresh])

  return { current, forecast, isLoading: !current }
}
