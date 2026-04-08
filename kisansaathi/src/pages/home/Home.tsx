// src/pages/home/Home.tsx — v3 Orange theme, matching reference screenshots
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bell, ChevronRight, MoreVertical, Clock, Droplets, CheckCircle2 } from 'lucide-react'
import { useCategoryStore } from '../../store/useCategoryStore'
import { useAuthStore } from '../../store/useAuthStore'
import WeatherWidget from '../../components/shared/WeatherWidget'

// ── Mock field data ─────────────────────────────────────────────────
const FIELDS = [
  {
    id: 'f1',
    name: 'North Fields',
    acres: 2.3,
    crops: [
      { name: 'Groundnuts', acres: 1.3, status: 'attention', badge: 'Irrigation Due 💧' },
      { name: 'Cottons', acres: 1.0, status: 'healthy', badge: 'Healthy ✅' },
    ],
  },
  {
    id: 'f2',
    name: 'South Fields',
    acres: 1.3,
    crops: [
      { name: 'Mango', acres: 1.3, status: 'healthy', badge: 'Healthy ✅' },
    ],
  },
]

const TASKS = [
  { id: 't1', title: 'Irrigation', field: 'North Fields', time: '9:00 AM', icon: Droplets, priority: 'high' },
  { id: 't2', title: 'Urea Fertilizer', field: 'South Fields', time: '12:00 PM', icon: Clock, priority: 'medium' },
]

const CROP_ICONS: Record<string, string> = {
  Groundnuts: '🥜', Cottons: '🌿', Mango: '🥭', Wheat: '🌾', Rice: '🌾',
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
}

export default function Home() {
  const navigate = useNavigate()
  const farmer   = useAuthStore(s => s.farmer)
  const category = useCategoryStore(s => s.category) || 'crop'
  const firstName = farmer?.name?.split(' ')[0] || 'Farmer'

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

      {/* ── Weather Forecast ──────────────────────────────────────────── */}
      <WeatherWidget />

      {/* ── My Fields ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">My Fields</h2>
          <button
            onClick={() => navigate('/fields')}
            className="text-xs font-semibold text-brand-600 flex items-center gap-0.5 hover:text-brand-700"
          >
            View All <ChevronRight size={13} />
          </button>
        </div>

        <motion.div variants={stagger.container} initial="initial" animate="animate" className="space-y-3">
          {FIELDS.map(field => (
            <motion.div key={field.id} variants={stagger.item}>
              <div className="bg-white border border-neutral-200 rounded-2xl shadow-card overflow-hidden">
                {/* Field header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                      <span className="text-base">🏔️</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{field.name}</p>
                      <p className="text-xs text-neutral-500">{field.acres} Acres</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
                    <MoreVertical size={16} className="text-neutral-400" />
                  </button>
                </div>

                {/* Crops */}
                {field.crops.map((crop, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-neutral-50 last:border-0"
                  >
                    <span className="text-lg select-none w-6 text-center">{CROP_ICONS[crop.name] || '🌱'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800">{crop.name}</p>
                      <p className="text-xs text-neutral-400">{crop.acres} Acres</p>
                    </div>
                    <span className={`
                      text-xs font-semibold rounded-full px-2.5 py-1
                      ${crop.status === 'attention'
                        ? 'bg-warning-50 text-warning-700 border border-warning-100'
                        : 'bg-success-50 text-success-700 border border-success-100'}
                    `}>
                      {crop.badge}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
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
