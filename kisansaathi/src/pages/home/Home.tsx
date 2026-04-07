// src/pages/home/Home.tsx — Action-First v2
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, TrendingDown, Minus, ChevronRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { useCategoryStore, CATEGORY_META } from '../../store/useCategoryStore'
import { useAuthStore } from '../../store/useAuthStore'
import WeatherWidget from '../../components/shared/WeatherWidget'

// ── Mock data (will come from Gemini + Firebase) ────────────────────
const TASKS = [
  {
    id: 1,
    priority: 'high',
    action: 'Do NOT irrigate today',
    reason: 'Heavy rain expected in 2 hours',
    icon: AlertTriangle,
    iconColor: 'text-danger-500',
    bg: 'bg-danger-50 border-danger-100',
    badge: { color: 'bg-danger-100 text-danger-700', label: 'Urgent' },
    cta: 'See weather',
    path: '/crop/weather',
  },
  {
    id: 2,
    priority: 'medium',
    action: 'Spray fungicide today',
    reason: '87% humidity — fungal disease risk high',
    icon: Clock,
    iconColor: 'text-warning-600',
    bg: 'bg-warning-50 border-warning-100',
    badge: { color: 'bg-warning-100 text-warning-700', label: 'Do Today' },
    cta: 'Get advice',
    path: '/crop/advisory',
  },
  {
    id: 3,
    priority: 'low',
    action: 'Wait to sell tomatoes',
    reason: 'Nashik prices rising +8% — hold 1–2 days',
    icon: CheckCircle2,
    iconColor: 'text-success-600',
    bg: 'bg-success-50 border-success-100',
    badge: { color: 'bg-success-100 text-success-700', label: 'This Week' },
    cta: 'View prices',
    path: '/crop/market',
  },
]

const PRICES = [
  { id: '1', name: 'Tomato',  price: 1240, trend: 'up'     as const, delta: '+8%',  mandi: 'Nashik' },
  { id: '2', name: 'Onion',   price: 890,  trend: 'down'   as const, delta: '-5%',  mandi: 'Lasalgaon' },
  { id: '3', name: 'Wheat',   price: 2150, trend: 'stable' as const, delta: '0%',   mandi: 'Delhi' },
  { id: '4', name: 'Soybean', price: 4200, trend: 'up'     as const, delta: '+3%',  mandi: 'Indore' },
]

const QUICK_ACTIONS: Record<string, Array<{ label: string; icon: string; path: string }>> = {
  crop:      [
    { label: 'Crop Doctor',   icon: '🩺', path: '/crop/advisory' },
    { label: 'Market Prices', icon: '📈', path: '/crop/market' },
    { label: 'Soil Health',   icon: '🌱', path: '/crop/soil' },
    { label: 'Govt Schemes',  icon: '🏛', path: '/crop/schemes' },
  ],
  livestock: [
    { label: 'Animal Diary', icon: '📋', path: '/livestock' },
    { label: 'Vet Connect',  icon: '💉', path: '/livestock' },
    { label: 'Milk Log',     icon: '🥛', path: '/livestock' },
    { label: 'Market',       icon: '📈', path: '/livestock' },
  ],
  poultry:   [
    { label: 'Flock Diary', icon: '📋', path: '/poultry' },
    { label: 'Vaccination', icon: '💉', path: '/poultry' },
    { label: 'Egg Log',     icon: '📊', path: '/poultry' },
    { label: 'Find Buyers', icon: '🛒', path: '/poultry' },
  ],
  fishery:   [
    { label: 'Pond Monitor',  icon: '📊', path: '/fishery' },
    { label: 'Water Quality', icon: '💧', path: '/fishery' },
    { label: 'Sea Weather',   icon: '⛵', path: '/fishery' },
    { label: 'Harvest Plan',  icon: '📅', path: '/fishery' },
  ],
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } },
}

export default function Home() {
  const navigate  = useNavigate()
  const farmer    = useAuthStore(s => s.farmer)
  const category  = useCategoryStore(s => s.category) || 'crop'
  const actions   = QUICK_ACTIONS[category] || QUICK_ACTIONS.crop
  const firstName = farmer?.name?.split(' ')[0] || 'Farmer'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page-container space-y-5">

      {/* ── Greeting ──────────────────────────────────────────────── */}
      <motion.div {...stagger.item} className="space-y-0.5 pt-1">
        <p className="text-sm text-neutral-500">{greeting},</p>
        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
          {firstName}
        </h1>
        <p className="text-sm text-neutral-500">
          {CATEGORY_META[category]?.emoji}&nbsp;
          {CATEGORY_META[category]?.label}
        </p>
      </motion.div>

      {/* ── Weather ───────────────────────────────────────────────── */}
      <WeatherWidget />

      {/* ── Today's Tasks (action-first) ──────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">Today's Tasks</h2>
          <button
            onClick={() => navigate('/crop')}
            className="text-xs font-semibold text-forest-700 flex items-center gap-0.5 hover:text-forest-900"
          >
            Full plan <ChevronRight size={13} />
          </button>
        </div>

        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="space-y-2.5"
        >
          {TASKS.map(task => (
            <motion.div key={task.id} variants={stagger.item}>
              <button
                onClick={() => navigate(task.path)}
                className={`w-full text-left rounded-xl border p-4 ${task.bg} flex items-start gap-3 hover:shadow-card-md transition-shadow active:scale-[0.99]`}
              >
                <task.icon size={18} className={`${task.iconColor} shrink-0 mt-0.5`} strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-neutral-900 text-sm">{task.action}</p>
                    <span className={`badge text-[10px] px-2 py-0.5 ${task.badge.color}`}>
                      {task.badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{task.reason}</p>
                </div>
                <span className="text-xs font-semibold text-neutral-400 shrink-0 mt-0.5 flex items-center gap-0.5">
                  {task.cta} <ArrowRight size={11} />
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Quick Actions ─────────────────────────────────────────── */}
      <section>
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2">
          {actions.map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(a.path)}
              className="bg-white border border-neutral-200 rounded-xl p-3 flex flex-col items-center gap-2 shadow-card hover:shadow-card-md hover:border-neutral-300 transition-all active:scale-95"
            >
              <span className="text-2xl select-none leading-none">{a.icon}</span>
              <span className="text-[10px] font-semibold text-center text-neutral-600 leading-tight">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Market Prices ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">Market Prices</h2>
          <button
            onClick={() => navigate('/crop/market')}
            className="text-xs font-semibold text-forest-700 flex items-center gap-0.5 hover:text-forest-900"
          >
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl shadow-card overflow-hidden divide-y divide-neutral-100">
          {PRICES.map(p => (
            <button
              key={p.id}
              onClick={() => navigate('/crop/market')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                <p className="text-xs text-neutral-400">{p.mandi}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  ₹{p.price.toLocaleString('en-IN')}
                  <span className="text-xs text-neutral-400 font-normal">/qtl</span>
                </p>
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  p.trend === 'up'   ? 'text-success-700' :
                  p.trend === 'down' ? 'text-danger-600' :
                  'text-neutral-400'
                }`}>
                  {p.trend === 'up'     && <TrendingUp size={13} />}
                  {p.trend === 'down'   && <TrendingDown size={13} />}
                  {p.trend === 'stable' && <Minus size={13} />}
                  {p.delta}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Community alert ───────────────────────────────────────── */}
      <section>
        <h2 className="section-title">Community</h2>
        <button
          onClick={() => navigate('/forum')}
          className="w-full bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3 shadow-card hover:shadow-card-md transition-shadow"
        >
          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0 text-base select-none">
            👥
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-neutral-900">10 farmers nearby reported aphid attack</p>
            <p className="text-xs text-neutral-400">2 hours ago · Nashik district</p>
          </div>
          <ChevronRight size={16} className="text-neutral-300 shrink-0" />
        </button>
      </section>

    </div>
  )
}
