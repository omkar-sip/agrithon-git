// src/pages/fields/AddCrop.tsx — matching reference screenshot
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Search, Mic, MoreHorizontal, Edit3 } from 'lucide-react'

const CATEGORIES = ['Popular Crops', '🌻 Oilseed', '🌾 Cereal']

const CROPS = [
  { name: 'Groundnuts', emoji: '🥜', category: 'Popular Crops' },
  { name: 'Sugarcane', emoji: '🎋', category: 'Popular Crops' },
  { name: 'Rice', emoji: '🌾', category: 'Cereal' },
  { name: 'Cotton', emoji: '🌿', category: 'Popular Crops' },
  { name: 'Maize', emoji: '🌽', category: 'Cereal' },
  { name: 'Mango', emoji: '🥭', category: 'Popular Crops' },
  { name: 'Soybean', emoji: '🫘', category: 'Oilseed' },
  { name: 'Chili', emoji: '🌶️', category: 'Popular Crops' },
  { name: 'Potato', emoji: '🥔', category: 'Popular Crops' },
]

export default function AddCrop() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Popular Crops')
  const [selected, setSelected] = useState<string[]>([])

  const filtered = CROPS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'Popular Crops' || c.category.includes(activeCategory.replace(/[^a-zA-Z]/g, ''))
    return matchSearch && matchCategory
  })

  const toggleCrop = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  return (
    <div className="page-root bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200">
            <ChevronLeft size={20} className="text-neutral-600" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
            Add Crop
          </h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
          <MoreHorizontal size={18} className="text-neutral-500" />
        </button>
      </div>

      {/* Field info card */}
      <div className="mx-4 mt-4 flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
        <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-sm">🏔️</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-neutral-900">2.3 Acres — North West</p>
          <p className="text-xs text-neutral-500">Uma Nagar Bhuj</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <Edit3 size={14} className="text-neutral-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Crop"
            className="input pl-10 pr-10"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-neutral-200 rounded-full flex items-center justify-center min-h-fit">
            <Mic size={13} className="text-neutral-500" />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-neutral-600 border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section title */}
        <p className="text-sm font-bold text-neutral-900">Select the Crop You Grow Here</p>

        {/* Crop grid */}
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(crop => {
            const isSelected = selected.includes(crop.name)
            return (
              <motion.button
                key={crop.name}
                onClick={() => toggleCrop(crop.name)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all
                  ${isSelected
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'}
                `}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-brand-500 rounded-full border-2 border-white" />
                )}
                <span className="text-3xl select-none">{crop.emoji}</span>
                <span className={`text-xs font-semibold ${isSelected ? 'text-brand-700' : 'text-neutral-700'}`}>
                  {crop.name}
                </span>
                {!isSelected && (
                  <span className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-neutral-300" />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 border-t border-neutral-100 shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
        <button
          onClick={() => navigate(-1)}
          disabled={selected.length === 0}
          className="btn-brand"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
