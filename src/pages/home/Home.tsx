// src/pages/home/Home.tsx — v4 with AI Insights section
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Bell, ChevronRight, Clock, Droplets,
  CloudRain, TrendingUp, Sparkles,
  ThermometerSun, Bug, Leaf
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useWeather } from '../../hooks/useWeather'
import WeatherWidget from '../../components/shared/WeatherWidget'
import BannerCarousel from '../../components/shared/BannerCarousel'
import type { BannerSlide } from '../../components/shared/BannerCarousel'
import marketBanner from '../../assets/market-banner.png'
import weatherBanner from '../../assets/weather-banner.png'
import cropDiseaseBanner from '../../assets/crop-disease-banner.png'
import govtSchemesBanner from '../../assets/govt-schemes-banner.png'

// ── Banner slides (add more here easily) ─────────────────────────────
const BANNER_SLIDES: BannerSlide[] = [
  { id: 'b1', image: marketBanner, alt: 'Market Analysis using Blockchain', route: '/marketplace' },
  { id: 'b2', image: weatherBanner, alt: 'Smart Weather Alerts for your farm', route: '/crop/weather' },
  { id: 'b3', image: cropDiseaseBanner, alt: 'AI Crop Disease Scanner', route: '/scanner' },
  { id: 'b4', image: govtSchemesBanner, alt: 'Government Schemes & Benefits', route: '/crop/schemes' },
]

// ── AI Insights engine (mock — will be replaced by real API logic) ───
function generateInsights(weather: any) {
  const isRainy = weather && ['Rain', 'Thunderstorm', 'Drizzle'].includes(weather.icon)
  const isHot = weather && weather.temp > 35
  const isCloudy = weather && weather.icon === 'Clouds'
  const humidity = weather?.humidity || 72

  const insights: Array<{
    id: string
    type: 'weather' | 'market' | 'crop' | 'seasonal'
    icon: any
    title: string
    description: string
    action: string
    actionRoute: string
    priority: 'high' | 'medium' | 'low'
    colorScheme: 'blue' | 'green' | 'amber' | 'purple'
    timestamp: string
  }> = []

  // Weather-based irrigation insight
  if (isRainy) {
    insights.push({
      id: 'w1',
      type: 'weather',
      icon: CloudRain,
      title: '🌧️ Skip Irrigation Today',
      description: `Rain expected in the next 2 hours. Save water and electricity — no need to irrigate your Groundnuts field today.`,
      action: 'View Forecast',
      actionRoute: '/crop/weather',
      priority: 'high',
      colorScheme: 'blue',
      timestamp: '2 min ago',
    })
  } else if (isCloudy) {
    insights.push({
      id: 'w1',
      type: 'weather',
      icon: CloudRain,
      title: '⛅ Delay Irrigation — Possible Rain',
      description: `Partly cloudy with ${humidity}% humidity. There's a chance of rainfall later today. Consider delaying irrigation for Groundnuts by 3-4 hours.`,
      action: 'View Forecast',
      actionRoute: '/crop/weather',
      priority: 'medium',
      colorScheme: 'blue',
      timestamp: '5 min ago',
    })
  } else if (isHot) {
    insights.push({
      id: 'w1',
      type: 'weather',
      icon: ThermometerSun,
      title: '🌡️ Irrigate Early Morning',
      description: `Temperature is ${Math.round(weather.temp)}°C — too hot for daytime irrigation. Water will evaporate quickly. Irrigate before 7 AM or after 6 PM.`,
      action: 'Set Reminder',
      actionRoute: '/fields/tasks',
      priority: 'high',
      colorScheme: 'blue',
      timestamp: '1 min ago',
    })
  } else {
    insights.push({
      id: 'w1',
      type: 'weather',
      icon: Droplets,
      title: '💧 Good Time to Irrigate',
      description: `Clear skies and moderate temperature (${weather ? Math.round(weather.temp) : 32}°C). Ideal conditions for irrigating your fields. Groundnuts need water.`,
      action: 'View Schedule',
      actionRoute: '/fields/tasks',
      priority: 'medium',
      colorScheme: 'blue',
      timestamp: '3 min ago',
    })
  }

  // Market price insight
  insights.push({
    id: 'm1',
    type: 'market',
    icon: TrendingUp,
    title: '📈 Groundnut Prices Rising',
    description: `Groundnut prices up ₹120/quintal this week at Nashik Mandi (₹5,840/q). Consider selling within 3 days — analysts expect a correction after the rally.`,
    action: 'View Market',
    actionRoute: '/marketplace',
    priority: 'high',
    colorScheme: 'green',
    timestamp: '15 min ago',
  })

  // Crop health insight
  insights.push({
    id: 'c1',
    type: 'crop',
    icon: Bug,
    title: '🐛 Pest Alert — Cotton Fields',
    description: `High humidity (${humidity}%) increases risk of bollworm infestation in your Cotton crop. Apply neem-based bio-pesticide as a preventive measure.`,
    action: 'View Advisory',
    actionRoute: '/crop/advisory',
    priority: 'medium',
    colorScheme: 'amber',
    timestamp: '30 min ago',
  })

  // Seasonal tip
  insights.push({
    id: 's1',
    type: 'seasonal',
    icon: Leaf,
    title: '🌿 Best Time for Cover Crops',
    description: `April is ideal for planting cover crops like moong or cowpea between your Mango trees. This improves soil health and adds nitrogen naturally.`,
    action: 'Learn More',
    actionRoute: '/crop/advisory',
    priority: 'low',
    colorScheme: 'purple',
    timestamp: '1 hr ago',
  })

  return insights
}

const TASKS = [
  { id: 't1', title: 'Irrigation', field: 'North Fields', time: '9:00 AM', icon: Droplets, priority: 'high' },
  { id: 't2', title: 'Urea Fertilizer', field: 'South Fields', time: '12:00 PM', icon: Clock, priority: 'medium' },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
}

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    actionColor: 'text-blue-600 hover:text-blue-700',
    accentBar: 'bg-blue-500',
    priorityBg: 'bg-blue-100 text-blue-700',
  },
  green: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    actionColor: 'text-emerald-600 hover:text-emerald-700',
    accentBar: 'bg-emerald-500',
    priorityBg: 'bg-emerald-100 text-emerald-700',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    actionColor: 'text-amber-600 hover:text-amber-700',
    accentBar: 'bg-amber-500',
    priorityBg: 'bg-amber-100 text-amber-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    actionColor: 'text-purple-600 hover:text-purple-700',
    accentBar: 'bg-purple-500',
    priorityBg: 'bg-purple-100 text-purple-700',
  },
}

const PRIORITY_LABELS: Record<string, string> = {
  high: '⚡ Urgent',
  medium: '📋 Suggested',
  low: '💡 Tip',
}

export default function Home() {
  const navigate = useNavigate()
  const farmer   = useAuthStore(s => s.farmer)
  const firstName = farmer?.name?.split(' ')[0] || 'Farmer'
  const { current } = useWeather()
  const insights = generateInsights(current)

  return (
    <div className="px-4 py-5 space-y-5 max-w-2xl mx-auto w-full">

      {/* ── Greeting Header ──────────────────────────────────────────── */}
      <motion.div {...stagger.item} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {farmer?.photoURL ? (
            <img src={farmer.photoURL} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-200" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-xl select-none ring-2 ring-brand-200">
              👨‍🌾
            </div>
          )}
          <div>
            <p className="text-sm text-neutral-500 flex items-center gap-1">
              Hello 👋
            </p>
            <h1 className="text-xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              {firstName}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/marketplace')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
          >
            <Search size={18} className="text-neutral-600" />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors relative"
          >
            <Bell size={18} className="text-neutral-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full" />
          </button>
        </div>
      </motion.div>

      {/* ── Banner Slideshow ──────────────────────────────────────────── */}
      <motion.div {...stagger.item}>
        <BannerCarousel slides={BANNER_SLIDES} interval={4000} />
      </motion.div>

      {/* ── Weather Forecast ──────────────────────────────────────────── */}
      <WeatherWidget />

      {/* ── AI Insights ───────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <h2 className="section-title mb-0">AI Insights</h2>
          </div>
          <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
            Live • Auto-updated
          </span>
        </div>

        <motion.div variants={stagger.container} initial="initial" animate="animate" className="space-y-3">
          {insights.map(insight => {
            const colors = COLOR_MAP[insight.colorScheme]
            const Icon = insight.icon
            return (
              <motion.div key={insight.id} variants={stagger.item}>
                <button
                  onClick={() => navigate(insight.actionRoute)}
                  className={`
                    w-full text-left rounded-2xl border overflow-hidden
                    ${colors.bg} ${colors.border}
                    shadow-card hover:shadow-card-md transition-all duration-200
                    active:scale-[0.99] relative
                  `}
                >
                  {/* Accent side bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.accentBar} rounded-l-2xl`} />

                  <div className="pl-4 pr-4 py-3.5">
                    {/* Top row: icon + title + priority badge */}
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon size={18} className={colors.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-bold text-neutral-900 leading-tight">{insight.title}</p>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${colors.priorityBg}`}>
                            {PRIORITY_LABELS[insight.priority]}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{insight.description}</p>

                        {/* Bottom row: action link + timestamp */}
                        <div className="flex items-center justify-between mt-2.5">
                          <span className={`text-xs font-semibold flex items-center gap-1 ${colors.actionColor}`}>
                            {insight.action} <ChevronRight size={12} />
                          </span>
                          <span className="text-[10px] text-neutral-400">{insight.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ── Today's Tasks ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">Today's Tasks</h2>
          <button
            onClick={() => navigate('/fields/tasks')}
            className="text-xs font-semibold text-brand-600 flex items-center gap-0.5 hover:text-brand-700"
          >
            View All <ChevronRight size={13} />
          </button>
        </div>

        <div className="space-y-2">
          {TASKS.map(task => (
            <button
              key={task.id}
              onClick={() => navigate('/fields/tasks')}
              className="w-full bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3 shadow-card hover:shadow-card-md transition-all active:scale-[0.99]"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                task.priority === 'high' ? 'bg-brand-50' : 'bg-info-50'
              }`}>
                <task.icon size={18} className={
                  task.priority === 'high' ? 'text-brand-600' : 'text-info-600'
                } />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{task.title}</p>
                <p className="text-xs text-neutral-500">{task.field} · {task.time}</p>
              </div>
              <ChevronRight size={16} className="text-neutral-300 shrink-0" />
            </button>
          ))}
        </div>
      </section>

      <div className="h-4" />
    </div>
  )
}
