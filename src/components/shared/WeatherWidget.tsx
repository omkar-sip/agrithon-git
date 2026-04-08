import { Calendar, CloudRain, Droplets, Thermometer, Volume2, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatLocalizedNumber } from '../../i18n'
import { useLanguageStore } from '../../store/useLanguageStore'
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

const getConditionKey = (icon: string) => {
  if (icon === 'Clouds') return 'weather.clouds'
  if (icon === 'Rain') return 'weather.rain'
  if (icon === 'Drizzle') return 'weather.drizzle'
  if (icon === 'Thunderstorm') return 'weather.thunderstorm'
  if (icon === 'Snow') return 'weather.snow'
  if (icon === 'Mist') return 'weather.mist'
  if (icon === 'Clear') return 'weather.clear'
  return 'weather.unknown'
}

export default function WeatherWidget() {
  const { t, i18n } = useTranslation()
  const { current, advisorySummary, advisoryLanguage, isLoading, isAdvisoryLoading } = useWeather()
  const language = useLanguageStore((state) => state.language)
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
        <p className="text-sm font-semibold text-neutral-800">{t('weather.todayForecast')}</p>
        <p className="text-xs text-neutral-500">{t('weather.loadingLocation')}</p>
      </div>
    )
  }

  const conditionLabel = t(getConditionKey(current.icon))
  const isGoodForIrrigation =
    !['Rain', 'Thunderstorm', 'Drizzle'].includes(current.icon) && current.precipitationChance < 0.6

  const fallbackAdvisory = isGoodForIrrigation
    ? t('weather.goodForIrrigation', { condition: conditionLabel })
    : t('weather.delayIrrigation', { condition: conditionLabel })

  const advisoryText =
    advisoryLanguage === language && advisorySummary
      ? advisorySummary
      : fallbackAdvisory

  const formatStat = (value: number, maximumFractionDigits = 0) =>
    formatLocalizedNumber(value, { maximumFractionDigits }, i18n.resolvedLanguage)

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center mt-0.5 shrink-0">
            <span className="text-[10px]">📍</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{t('weather.todayForecast')}</p>
            <p className="text-xs text-neutral-500">
              {current.location || t('weather.yourLocation')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl select-none">{ICONS[current.icon] || '🌤️'}</span>
          <span className="text-sm font-semibold text-neutral-700 capitalize">
            {conditionLabel}
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
          { icon: Thermometer, value: `${formatStat(Math.round(current.temp))}°C`, label: t('weather.soilTemp') },
          { icon: Droplets, value: `${formatStat(Math.round(current.humidity))}%`, label: t('weather.humidity') },
          { icon: Wind, value: `${formatStat(current.windSpeed, 1)} m/s`, label: t('weather.wind') },
          { icon: CloudRain, value: `${formatStat(Math.round(current.precipitationChance * 100))}%`, label: t('weather.precip') },
        ].map((stat) => (
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
          {t('weather.hearWeather')}
        </button>
        <button
          onClick={() => navigate('/crop/weather')}
          className="flex-1 flex items-center justify-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <Calendar size={14} />
          {isAdvisoryLoading ? t('weather.updating') : t('weather.weeklyForecast')}
        </button>
      </div>
    </div>
  )
}
