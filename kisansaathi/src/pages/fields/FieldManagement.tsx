import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, MoreVertical, MapPin, Droplets, Info, ChevronRight, Activity, Sprout } from 'lucide-react'

const FIELDS = [
  {
    id: 'f1', name: 'North Fields', acres: 2.3, status: 'attention',
    location: 'Upper Plateau, Nashik',
    crops: [
      { id: 'c1', name: 'Groundnuts', acres: 1.3, status: 'attention', badge: 'Irrigation Due 💧', image: '/assets/images/crops/groundnuts.png', health: 65 },
      { id: 'c2', name: 'Cotton', acres: 1.0, status: 'healthy', badge: 'Healthy ✅', image: '/assets/images/crops/cotton.png', health: 92 },
    ],
  },
  {
    id: 'f2', name: 'South Orchard', acres: 1.3, status: 'healthy',
    location: 'River Bed East',
    crops: [
      { id: 'c3', name: 'Mango', acres: 1.3, status: 'healthy', badge: 'Healthy ✅', image: '/assets/images/crops/cotton.png', health: 88 },
    ],
  },
  {
    id: 'f3', name: 'East Plot', acres: 3.8, status: 'healthy',
    location: 'Main Highway Side',
    crops: [
      { id: 'c4', name: 'Wheat', acres: 2.0, status: 'healthy', badge: 'Healthy ✅', image: '/assets/images/market/mustard-seeds.png', health: 95 },
      { id: 'c5', name: 'Soybean', acres: 1.8, status: 'healthy', badge: 'Healthy ✅', image: '/assets/images/market/mustard-seeds.png', health: 90 },
    ],
  },
]

const FILTERS = ['All', 'Healthy', 'Need Attention']

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function FieldManagement() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const totalAcres = FIELDS.reduce((sum, f) => sum + f.acres, 0)
  const totalCrops = FIELDS.reduce((sum, f) => sum + f.crops.length, 0)

  const filteredFields = FIELDS.filter(f => {
    if (activeFilter === 'Healthy') return f.status === 'healthy'
    if (activeFilter === 'Need Attention') return f.status === 'attention'
    return true
  }).filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-32 border-b border-neutral-100 rounded-b-[3rem] relative z-10 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Field Tracking
              </h1>
              <p className="text-neutral-500 text-sm font-medium">Monitoring {totalCrops} crops across {totalAcres.toFixed(1)} acres.</p>
            </div>
            <button 
              onClick={() => navigate('/fields/add-crop')}
              className="p-4 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-100 animate-bounce transition-all active:scale-95"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-600 transition-colors" size={20} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fields or crops..."
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 -mt-20 relative z-20 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-neutral-100 border border-neutral-100 text-center space-y-1">
            <p className="text-2xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>{FIELDS.length}</p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Fields</p>
          </div>
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-neutral-100 border border-neutral-100 text-center space-y-1">
            <p className="text-2xl font-black text-brand-600" style={{ fontFamily: 'Baloo 2, sans-serif' }}>{totalAcres.toFixed(1)}</p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Acres</p>
          </div>
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-neutral-100 border border-neutral-100 text-center space-y-1">
            <p className="text-2xl font-black text-blue-600" style={{ fontFamily: 'Baloo 2, sans-serif' }}>{totalCrops}</p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Crops</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 pb-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all ${
                activeFilter === f 
                  ? 'bg-neutral-900 text-white shadow-lg' 
                  : 'bg-white text-neutral-400 border border-neutral-100 hover:border-neutral-300 shadow-sm'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Field Cards */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <AnimatePresence mode='popLayout'>
            {filteredFields.map(field => (
              <motion.div
                key={field.id}
                layout
                variants={item}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-neutral-100 transition-all duration-500"
              >
                {/* Field Header */}
                <div className="p-6 pb-2 flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${field.status === 'attention' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                      <h3 className="text-xl font-extrabold text-neutral-900">{field.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400 font-medium text-xs">
                      <MapPin size={12} />
                      <span>{field.location} • {field.acres} Acres</span>
                    </div>
                  </div>
                  <button className="p-2 bg-neutral-50 rounded-xl text-neutral-400 hover:text-neutral-900 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Sub-crops */}
                <div className="p-4 space-y-3">
                  {field.crops.map((crop) => (
                    <div key={crop.id} className="bg-neutral-50/50 rounded-[2rem] p-4 flex gap-4 items-center group/row hover:bg-white border border-transparent hover:border-neutral-100 transition-all duration-300">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0">
                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover/row:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-neutral-900">{crop.name}</p>
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                            crop.status === 'attention' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {crop.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${crop.health > 90 ? 'bg-green-500' : crop.health > 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${crop.health}%` }} 
                            />
                          </div>
                          <span className="text-[10px] font-black text-neutral-500 uppercase">{crop.health}% Health</span>
                        </div>
                      </div>
                      <button className="p-2 bg-white rounded-xl text-neutral-300 group-hover/row:text-neutral-900 transition-colors shadow-sm">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Analysis Row */}
                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <Activity size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-neutral-400">SAT MONITORING</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Droplets size={14} className="text-blue-400" />
                        <span className="text-[10px] font-bold text-neutral-400">SOIL SENSOR</span>
                      </div>
                   </div>
                   <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1">
                     View insights <ChevronRight size={12} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Advice Hub */}
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="bg-neutral-900 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Sprout size={24} className="text-brand-500" />
              <h4 className="text-xl font-bold tracking-tight">Need expert help?</h4>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-[200px]">
              Chat with our AI agronomist for personalized field advice.
            </p>
            <button className="bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:translate-x-1 transition-all flex items-center gap-2">
              Open SarpanchGPT <ChevronRight size={18} />
            </button>
          </div>
          <div className="absolute top-1/2 -right-16 -translate-y-1/2 text-[12rem] opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-1000">
            🌱
          </div>
        </div>
      </div>

    </div>
  )
}
