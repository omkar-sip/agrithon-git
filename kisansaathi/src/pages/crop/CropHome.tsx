// src/pages/crop/CropHome.tsx — English only, full Today's Plan with Gemini
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react'
import { useTodaysPlanStore } from '../../store/useTodaysPlanStore'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useAppStore } from '../../store/useAppStore'
import { getTodaysPlan } from '../../services/gemini/geminiClient'
import { offlinePlan } from '../../utils/offline'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { SkeletonCard } from '../../components/ui/Skeleton'
import type { StatusColor } from '../../utils/colorSystem'

const CROP_ACTIONS = [
  { label: 'Crop Doctor (AI)', emoji: '🩺', path: '/crop/advisory' },
  { label: 'Mandi Marketplace', emoji: '📊', path: '/crop/market' },
  { label: 'Equipment Renting', emoji: '🚜', path: '/crop' },
  { label: 'Govt Schemes', emoji: '🏛️', path: '/crop/schemes' },
  { label: 'AI Advisor', emoji: '✨', path: '/sarpanchgpt' },
  { label: 'Voice Assistant', emoji: '🎙️', path: '/crop' },
]

export default function CropHome() {
  const navigate = useNavigate()
  const { decisions, isLoading, isStale, setPlan, setLoading, toggleExpanded, generatedAt } = useTodaysPlanStore()
  const { language } = useLanguageStore()
  const isOnline = useAppStore(s => s.isOnline)

  const loadPlan = async (force = false) => {
    if (!force && !isStale() && decisions.length > 0) return
    setLoading(true)
    try {
      if (isOnline) {
        const planText = await getTodaysPlan({
          crop: 'Wheat',
          growthStage: 'Flowering stage — day 85',
          weather: 'Rain expected in 2 hours, humidity 87%',
          mandiPriceTrend: 'Wheat stable at ₹2150/qtl, tomato rising +8%',
          communityAlerts: '10 nearby farmers reported aphid attack this week',
          language,
        })
        const parsed = JSON.parse(planText.trim().replace(/```json/g, '').replace(/```/g, ''))
        setPlan(parsed, 'Wheat')
        await offlinePlan.save(parsed)
      } else {
        const cached = await offlinePlan.load()
        if (cached) setPlan(cached as any, 'Cached')
      }
    } catch {
      // Fallback mock plan
      setPlan([
        { icon: '🚫', action: 'Do NOT irrigate', reason: 'Rain expected within 2 hours', priority: 'high', color: 'red', source: 'weather' },
        { icon: '🌿', action: 'Apply fungicide today', reason: 'Humidity at 87% — high fungal risk', priority: 'medium', color: 'yellow', source: 'advisory' },
        { icon: '⏳', action: 'Wait 1–2 days to sell', reason: 'Market price for tomato rising in Nashik', priority: 'low', color: 'green', source: 'market' },
      ], 'Wheat (Demo)')
    } finally {
      setLoading(false) }
  }

  useEffect(() => { loadPlan() }, [])

  const lastUpdated = generatedAt
    ? new Date(generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-forest-800">🌅 Today's Farm Plan</h1>
            {lastUpdated && (
              <p className="text-soil-400 text-sm mt-0.5 flex items-center gap-1">
                {isOnline
                  ? <Wifi size={12} className="text-forest-500" />
                  : <WifiOff size={12} className="text-harvest-500" />}
                Last updated: {lastUpdated}
                {!isOnline && ' (offline cache)'}
              </p>
            )}
          </div>
          <button
            id="refresh-todays-plan"
            onClick={() => loadPlan(true)}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-forest-50 text-forest-700 rounded-full px-4 py-2 min-h-fit text-sm font-bold active:scale-95 transition-transform disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Plan cards */}
        <div className="space-y-3">
          <AnimatePresence>
            {isLoading ? (
              [1,2,3].map(i => <SkeletonCard key={i} />)
            ) : decisions.length > 0 ? (
              decisions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card color={item.color as StatusColor} onClick={() => toggleExpanded(i)} className="cursor-pointer select-none">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-display font-bold text-lg text-soil-800">{item.action}</p>
                            <Badge
                              color={item.color as StatusColor}
                              size="sm"
                              label={item.priority === 'high' ? '🔴 Urgent' : item.priority === 'medium' ? '🟡 Do Today' : '🟢 This Week'}
                            />
                          </div>
                          {item.expanded ? <ChevronUp size={18} className="text-soil-400 shrink-0" /> : <ChevronDown size={18} className="text-soil-400 shrink-0" />}
                        </div>
                        <p className="font-body text-sm text-soil-600">{item.reason}</p>
                        <AnimatePresence>
                          {item.expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-black/10">
                                <p className="text-xs text-soil-500">
                                  <span className="font-bold">Source:</span>{' '}
                                  {item.source === 'weather' ? '🌤️ Weather Data'
                                    : item.source === 'market' ? '📊 Market Data'
                                    : item.source === 'advisory' ? '🌾 Crop Advisory'
                                    : '👥 Community'}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card><p className="text-center text-soil-500 py-4">No plan available. Tap Refresh.</p></Card>
            )}
          </AnimatePresence>
        </div>

        {/* AI attribution */}
        <p className="text-center text-soil-400 text-xs">✨ Powered by Gemini AI · Offline-safe local cache</p>

        {/* Quick actions */}
        <section>
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {CROP_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="bg-white border-2 border-green-100 rounded-2xl p-3 flex flex-col items-center gap-2 min-h-[95px] justify-center shadow-sm hover:shadow-md hover:border-green-300 active:scale-95 transition-all"
              >
                <span className="text-3xl select-none">{action.emoji}</span>
                <span className="text-xs font-bold text-center text-forest-800 leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
