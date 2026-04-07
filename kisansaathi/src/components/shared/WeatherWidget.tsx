// src/components/shared/WeatherWidget.tsx — v2 clean design
import { Wind, Droplets } from 'lucide-react'
import { useWeather } from '../../hooks/useWeather'

const ICONS: Record<string, string> = {
  Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️',
}

export default function WeatherWidget() {
  const { current, isLoading } = useWeather()

  if (isLoading) return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-card p-4 space-y-3">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-8 w-20 rounded" />
      <div className="flex gap-4">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  )

  if (!current) return null

  return (
    <div className="bg-gradient-to-br from-[#1a6b8a] to-[#0d4a6b] rounded-xl p-4 text-white shadow-card-md overflow-hidden relative">
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-white/5" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-blue-200 text-xs font-medium mb-1">{current.location || 'Your Location'}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold leading-none" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              {Math.round(current.temp)}°
            </span>
            <span className="text-blue-300 text-sm mb-1">/ {Math.round(current.feelsLike || current.temp)}° feels like</span>
          </div>
          <p className="text-blue-200 text-sm mt-1 capitalize">{current.description}</p>
        </div>
        <span className="text-5xl select-none leading-none mt-1">{ICONS[current.icon] || '🌤️'}</span>
      </div>

      <div className="flex gap-4 mt-3 pt-3 border-t border-white/15 relative">
        <div className="flex items-center gap-1.5 text-blue-200 text-xs">
          <Droplets size={13} />
          <span>{current.humidity}% humidity</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-200 text-xs">
          <Wind size={13} />
          <span>{current.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}
