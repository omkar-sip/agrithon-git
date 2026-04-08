// src/components/layout/TopBar.tsx — v2 clean professional
import { Bell, Globe, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useWeatherStore } from '../../store/useWeatherStore'
import { useAlertStore } from '../../store/useAlertStore'
import { useCategoryStore, CATEGORY_META } from '../../store/useCategoryStore'

const WEATHER_ICON: Record<string, string> = {
  Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Thunderstorm: '⛈️', Drizzle: '🌦️',
}

export default function TopBar() {
  const navigate  = useNavigate()
  const farmer    = useAuthStore(s => s.farmer)
  const weather   = useWeatherStore(s => s.current)
  const unread    = useAlertStore(s => s.unreadCount)
  const category  = useCategoryStore(s => s.category)

  const firstName = farmer?.name?.split(' ')[0] || 'Farmer'
  const catLabel  = category ? CATEGORY_META[category].label : 'Crop Farming'

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Left: Brand + context */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 select-none text-lg">
            🌾
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/category')}
                className="flex items-center gap-0.5 text-sm font-semibold text-forest-200 hover:text-white transition-colors min-h-fit"
              >
                {catLabel}
                <ChevronDown size={12} className="opacity-70" />
              </button>
            </div>
            <p className="text-white font-bold text-base leading-tight truncate" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              {firstName}
            </p>
          </div>
        </div>

        {/* Center: Weather pill */}
        {weather && (
          <button
            onClick={() => navigate('/crop/weather')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full px-3 py-1.5 mx-2 shrink-0 transition-colors"
          >
            <span className="text-sm select-none">{WEATHER_ICON[weather.icon] || '🌤️'}</span>
            <span className="text-sm font-semibold text-white">{Math.round(weather.temp)}°C</span>
          </button>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigate('/language')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Change language"
          >
            <Globe size={18} className="text-forest-200" />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-forest-200" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
