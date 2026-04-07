// src/store/useWeatherStore.ts
import { create } from 'zustand'

export interface WeatherData {
  temp: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  location: string
}

export interface ForecastDay {
  date: string
  tempMax: number
  tempMin: number
  description: string
  icon: string
  farmAction: string        // AI-translated farm action
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

interface WeatherState {
  current: WeatherData | null
  forecast: ForecastDay[]
  alerts: WeatherAlert[]
  lastFetched: number | null
  setCurrent: (data: WeatherData) => void
  setWeather: (data: WeatherData) => void  // alias
  setForecast: (days: ForecastDay[]) => void
  setAlerts: (alerts: WeatherAlert[]) => void
  isStale: () => boolean
}

export const useWeatherStore = create<WeatherState>()((set, get) => ({
  current: null,
  forecast: [],
  alerts: [],
  lastFetched: null,

  setCurrent:  (current)  => set({ current, lastFetched: Date.now() }),
  setWeather:  (current)  => set({ current, lastFetched: Date.now() }),
  setForecast: (forecast) => set({ forecast }),
  setAlerts:   (alerts)   => set({ alerts }),

  isStale: () => {
    const { lastFetched } = get()
    if (!lastFetched) return true
    return Date.now() - lastFetched > 60 * 60 * 1000 // 1 hour
  },
}))
