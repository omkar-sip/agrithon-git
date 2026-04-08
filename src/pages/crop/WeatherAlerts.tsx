import { useState } from 'react'
import {
  Bell,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Snowflake,
  SunMedium,
  Wind,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import { useWeather } from '../../hooks/useWeather'
import { initFCM, requestNotificationPermission } from '../../services/notificationService'
import { getRelativeDay } from '../../utils/dateHelper'
import type { LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Clear: SunMedium,
  Clouds: CloudSun,
  Rain: CloudRain,
  Drizzle: CloudDrizzle,
  Thunderstorm: CloudLightning,
  Snow: Snowflake,
  Mist: CloudFog,
}

export default function WeatherAlerts() {
  const { current, forecast, alerts, isLoading, isAdvisoryLoading } = useWeather()
  const [isAlertSetupLoading, setIsAlertSetupLoading] = useState(false)

  const handleSetAlert = async () => {
    setIsAlertSetupLoading(true)
    try {
      const hasPermission = await requestNotificationPermission()
      if (!hasPermission) {
        toast.error('Notification permission is required for weather alerts.')
        return
      }

      const token = await initFCM()
      if (token) {
        toast.success('Push notifications enabled for severe weather alerts.')
        return
      }

      toast.error('FCM is not fully configured. Please check Firebase + VAPID keys.')
    } catch (error) {
      console.error(error)
      toast.error('Could not enable weather alerts right now.')
    } finally {
      setIsAlertSetupLoading(false)
    }
  }

  const rainfallTotal = forecast.reduce((sum, day) => sum + day.rainfallMm, 0)
  const title = forecast.length >= 7 ? '7-Day Action Forecast' : `${forecast.length}-Day Action Forecast`
  const CurrentIcon = ICONS[current?.icon || 'Clouds'] || CloudSun

  return (
    <div className="page-container bg-gradient-to-b from-sky-50 via-cyan-50/40 to-white">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20 relative">
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-sky-200/35 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-10 w-32 h-32 rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />

        <div className="relative flex justify-between items-start gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-sky-800">Weather to Actions</h1>
            <p className="text-soil-500 text-sm flex items-center gap-1 mt-0.5">
              <MapPin size={12} />
              {current?.location || 'Your farm location'}
            </p>
          </div>
          <button
            onClick={() => void handleSetAlert()}
            disabled={isAlertSetupLoading}
            className="bg-white/80 backdrop-blur border border-sky-100 text-sky-700 p-2.5 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            <Bell size={20} className={isAlertSetupLoading ? 'animate-pulse' : ''} />
          </button>
        </div>

        <section className="relative rounded-[28px] p-5 text-white overflow-hidden border border-sky-200/60 shadow-[0_14px_35px_rgba(14,116,204,0.24)] bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-500">
          <div className="absolute -top-20 -right-10 w-44 h-44 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-cyan-200/30 blur-2xl" />

          <div className="relative flex justify-between items-start gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">Today</p>
              <p className="text-5xl font-black leading-none mt-2">{Math.round(current?.temp || 0)}°</p>
              <p className="text-lg font-semibold mt-2 capitalize">{current?.description || 'Weather loading'}</p>
              <p className="text-sm text-white/85 mt-0.5">{isAdvisoryLoading ? 'Updating advisory...' : 'Hyper-local advisory active'}</p>
            </div>

            <div className="flex flex-col items-center text-white/95 mt-1">
              <CurrentIcon size={68} strokeWidth={1.8} />
              <span className="text-xs font-semibold mt-2 uppercase tracking-[0.16em]">
                {current?.icon || 'Weather'}
              </span>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: Wind, value: `${(current?.windSpeed || 0).toFixed(1)} m/s`, label: 'Wind' },
              { icon: Droplets, value: `${Math.round(current?.humidity || 0)}%`, label: 'Humidity' },
              { icon: CloudRain, value: `${Math.round((current?.precipitationChance || 0) * 100)}%`, label: 'Rain Chance' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl bg-white/20 backdrop-blur px-3 py-2 border border-white/25">
                <div className="flex items-center gap-1.5">
                  <stat.icon size={14} />
                  <span className="text-[10px] uppercase tracking-wide text-white/85">{stat.label}</span>
                </div>
                <p className="text-sm font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 relative">
          <h2 className="section-title text-sky-900">{title}</h2>
          {isLoading && !forecast.length ? (
            <Card className="shadow-sm border border-neutral-200 rounded-2xl">
              <p className="text-sm text-neutral-500">Loading forecast for your farm...</p>
            </Card>
          ) : (
            forecast.map(day => {
              const DayIcon = ICONS[day.icon] || CloudSun
              const tone =
                day.actionColor === 'red'
                  ? 'border-red-200 bg-red-50/65'
                  : day.actionColor === 'yellow'
                    ? 'border-amber-200 bg-amber-50/70'
                    : 'border-emerald-200 bg-emerald-50/65'

              return (
                <div
                  key={day.date}
                  className={`rounded-3xl border ${tone} shadow-sm p-4 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white flex items-center justify-center shrink-0">
                      <DayIcon size={24} className="text-sky-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-3">
                        <p className="font-display font-bold text-lg text-sky-950">{getRelativeDay(day.date)}</p>
                        <p className="font-mono font-bold text-lg text-sky-700 whitespace-nowrap">
                          {Math.round(day.tempMax)} / {Math.round(day.tempMin)} C
                        </p>
                      </div>
                      <p className="text-soil-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                        {day.description} | Rain {Math.round(day.precipitationChance * 100)}%
                      </p>
                      <p className="font-bold text-sm text-slate-800 leading-snug mt-1">{day.farmAction}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </section>

        <section className="rounded-3xl p-4 border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-cyan-50 shadow-card-md">
          <p className="font-display font-bold text-lg text-sky-800">Weekly rainfall advisory</p>
          <p className="text-sm text-sky-700 mt-1 leading-relaxed">
            Expected rainfall for the visible forecast window is <span className="font-bold">{rainfallTotal.toFixed(1)} mm</span>.
            {rainfallTotal > 20
              ? ' Reduce manual irrigation and keep drainage channels clear.'
              : ' Keep irrigation on schedule, but review soil moisture each morning.'}
          </p>
          {isAdvisoryLoading && <p className="text-xs text-sky-600 mt-2">Refreshing AI measures for this forecast...</p>}
        </section>

        {!!alerts.length && (
          <section className="space-y-3 pb-1">
            <h2 className="section-title text-sky-900">Priority Alerts</h2>
            {alerts.map(alert => (
              <div key={alert.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span
                    className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${
                      alert.severity === 'red'
                        ? 'bg-red-500'
                        : alert.severity === 'yellow'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-900">{alert.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{alert.body}</p>
                    <p className="text-xs font-semibold text-slate-700 mt-2">{alert.farmAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
