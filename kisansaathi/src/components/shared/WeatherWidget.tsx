import { Calendar, CloudRain, Droplets, Thermometer, Volume2, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWeather } from '../../hooks/useWeather'

const ICONS: Record<string, string> = {
  Clear: '☀️',
  Clouds: '⛅',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
}

export default function WeatherWidget() {
  const { current, advisorySummary, isLoading, isAdvisoryLoading } = useWeather()
  const navigate = useNavigate()

  if (isLoading && !current) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-card p-5 space-y-3">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-6 w-48 rounded" />
        <div className="flex gap-4">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-card p-5 space-y-3">
        <p className="text-sm font-semibold text-neutral-800">Today&apos;s Forecast</p>
        <p className="text-xs text-neutral-500">Loading weather for your location...</p>
      </div>
    )
  }

  const condition = current.description || 'Clear'
  const isGoodForIrrigation =
    !['Rain', 'Thunderstorm', 'Drizzle'].includes(current.icon) && current.precipitationChance < 0.6

  const advisoryText = advisorySummary || (
    isGoodForIrrigation
      ? `${condition} Today - Good For Irrigation`
      : `${condition} Expected - Delay Irrigation`
  )

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center mt-0.5 shrink-0">
            <span className="text-[10px]">📍</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Today&apos;s Forecast</p>
            <p className="text-xs text-neutral-500">
              {current.location || 'Your Location'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl select-none">{ICONS[current.icon] || '🌤️'}</span>
          <span className="text-sm font-semibold text-neutral-700 capitalize">
            {condition}
          </span>
        </div>
      </div>

      <div
        className={`
          rounded-full px-4 py-2 text-sm font-semibold text-center
          ${isGoodForIrrigation
            ? 'bg-success-50 text-success-700 border border-success-100'
            : 'bg-warning-50 text-warning-700 border border-warning-100'}
        `}
      >
        {advisoryText}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Thermometer, value: `${Math.round(current.temp)}°C`, label: 'Soil Temp' },
          { icon: Droplets, value: `${Math.round(current.humidity)}%`, label: 'Humidity' },
          { icon: Wind, value: `${current.windSpeed.toFixed(1)} M/s`, label: 'Wind' },
          { icon: CloudRain, value: `${Math.round(current.precipitationChance * 100)} %`, label: 'Precipitn' },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <stat.icon size={18} className="text-neutral-400" />
            <span className="text-sm font-bold text-neutral-900">{stat.value}</span>
            <span className="text-[10px] text-neutral-500">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors">
          <Volume2 size={14} />
          Hear Weather
        </button>
        <button
          onClick={() => navigate('/crop/weather')}
          className="flex-1 flex items-center justify-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <Calendar size={14} />
          {isAdvisoryLoading ? 'Updating...' : 'Weekly Forecast'}
        </button>
      </div>
    </div>
  )
}
