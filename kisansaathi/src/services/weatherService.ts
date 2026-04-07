// src/services/weatherService.ts — OpenWeatherMap integration stub
import { apiClient } from './api'
import type { WeatherData, ForecastDay } from '../store/useWeatherStore'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ''
const BASE = 'https://api.openweathermap.org/data/2.5'

export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const { data } = await apiClient.get(`${BASE}/weather`, {
    params: { lat, lon, appid: API_KEY, units: 'metric' }
  })
  return {
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: data.weather[0].main,
    windSpeed: data.wind.speed,
    location: data.name,
  }
}

export const fetchForecast = async (lat: number, lon: number): Promise<ForecastDay[]> => {
  const { data } = await apiClient.get(`${BASE}/forecast`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 7 }
  })
  return data.list.slice(0, 7).map((day: any) => ({
    date: day.dt_txt,
    tempMax: day.main.temp_max,
    tempMin: day.main.temp_min,
    description: day.weather[0].description,
    icon: day.weather[0].main,
    farmAction: 'Check field conditions',
    actionColor: day.weather[0].main === 'Rain' ? 'red' : 'green',
  }))
}

// Mock weather for dev (when no API key)
export const getMockWeather = (): WeatherData => ({
  temp: 32,
  feelsLike: 35,
  humidity: 72,
  description: 'Partly Cloudy',
  icon: 'Clouds',
  windSpeed: 12,
  location: 'Your Village',
})
