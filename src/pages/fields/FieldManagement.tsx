// src/pages/fields/FieldManagement.tsx — matching reference screenshot
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, MoreVertical } from 'lucide-react'

const FIELDS = [
  {
    id: 'f1', name: 'North Fields', acres: 2.3, status: 'attention',
    crops: [
      { name: 'Groundnuts', acres: 1.3, status: 'attention', badge: 'Irrigation Due 💧', emoji: '🥜' },
      { name: 'Cottons', acres: 1.0, status: 'healthy', badge: 'Healthy ✅', emoji: '🌿' },
    ],
  },
  {
    id: 'f2', name: 'South Fields', acres: 1.3, status: 'healthy',
    crops: [
      { name: 'Mango', acres: 1.3, status: 'healthy', badge: 'Healthy ✅', emoji: '🥭' },
    ],
  },
  {
    id: 'f3', name: 'East Plot', acres: 3.8, status: 'healthy',
    crops: [
      { name: 'Wheat', acres: 2.0, status: 'healthy', badge: 'Healthy ✅', emoji: '🌾' },
      { name: 'Soybean', acres: 1.8, status: 'healthy', badge: 'Healthy ✅', emoji: '🫘' },
    ],
  },
]

const FILTERS = ['All', 'Healthy (3)', 'Need Attention (2)', 'Enrolled']

export default function FieldManagement() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const totalFields = FIELDS.length
  const totalAcres = FIELDS.reduce((sum, f) => sum + f.acres, 0)
  const totalCrops = FIELDS.reduce((sum, f) => sum + f.crops.length, 0)

  const filteredFields = FIELDS.filter(f => {
    if (activeFilter.startsWith('Healthy')) return f.status === 'healthy'
    if (activeFilter.startsWith('Need')) return f.status === 'attention'
    return true
  }).filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="px-4 py-5 space-y-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
        Field Management
      </h1>

      {/* Search + Add */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Fields"
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => navigate('/fields/add-crop')}
          className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors shrink-0"
        >
          <Plus size={20} className="text-neutral-700" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: totalFields, label: 'Total Fields', color: 'bg-success-50 border-success-100 text-success-700' },
          { value: totalAcres.toFixed(1), label: 'Acres', color: 'bg-brand-50 border-brand-100 text-brand-700' },
          { value: totalCrops, label: 'Total Crop', color: 'bg-info-50 border-info-100 text-info-700' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border px-3 py-2.5 text-center ${stat.color}`}>
            <p className="text-lg font-bold" style={{ fontFamily: 'Baloo 2, sans-serif' }}>{stat.value}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all
              ${activeFilter === filter
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Field cards */}
      <div className="space-y-3">
        {filteredFields.map(field => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 rounded-2xl shadow-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🏔️</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{field.name}</p>
                  <p className="text-xs text-neutral-500">{field.acres} Acres</p>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100">
                <MoreVertical size={16} className="text-neutral-400" />
              </button>
            </div>
            {field.crops.map((crop, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-neutral-50 last:border-0">
                <span className="text-lg w-6 text-center select-none">{crop.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-800">{crop.name}</p>
                  <p className="text-xs text-neutral-400">{crop.acres} Acres</p>
                </div>
                <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                  crop.status === 'attention'
                    ? 'bg-warning-50 text-warning-700 border border-warning-100'
                    : 'bg-success-50 text-success-700 border border-success-100'
                }`}>
                  {crop.badge}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
