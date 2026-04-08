// src/pages/market/Marketplace.tsx — matching reference screenshot
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Search, Mic } from 'lucide-react'

const CATEGORIES = [
  { name: 'Seedling', emoji: '🌱' },
  { name: 'Crop', emoji: '🌾' },
  { name: 'Machinery', emoji: '🚜' },
  { name: 'Livestock', emoji: '🐄' },
]

const PRODUCTS = [
  { id: 'p1', name: 'Mustard Seeds (Premium)', brand: 'AgriGold', price: 450, originalPrice: 520, image: '🌻', rating: 4.5, reviews: 320, category: 'Seedling' },
  { id: 'p2', name: 'Bio Viricide Spray', brand: 'GloLife Agritech', price: 110, originalPrice: 200, image: '🧴', rating: 4.5, reviews: 500, category: 'Crop' },
  { id: 'p3', name: 'Urea Fertilizer 50kg', brand: 'IFFCO', price: 800, originalPrice: 950, image: '🧪', rating: 4.3, reviews: 1200, category: 'Crop' },
  { id: 'p4', name: 'Drip Irrigation Kit', brand: 'Jain Irrigation', price: 2500, originalPrice: 3200, image: '💧', rating: 4.7, reviews: 180, category: 'Machinery' },
  { id: 'p5', name: 'Organic Neem Cake', brand: 'Nature\'s Best', price: 320, originalPrice: 400, image: '🌿', rating: 4.2, reviews: 95, category: 'Crop' },
  { id: 'p6', name: 'Cattle Feed 30kg', brand: 'Amul Feeds', price: 680, originalPrice: 780, image: '🐄', rating: 4.4, reviews: 210, category: 'Livestock' },
]

export default function Marketplace() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])

  const filtered = PRODUCTS
    .filter(p => !activeCategory || p.category === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="px-4 py-5 space-y-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
          Marketplace
        </h1>
        <div className="flex gap-1">
          <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200">
            <Heart size={18} className="text-neutral-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 relative">
            <ShoppingCart size={18} className="text-neutral-600" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Products"
          className="input pl-10 pr-10"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-neutral-200 rounded-full flex items-center justify-center min-h-fit">
          <Mic size={13} className="text-neutral-500" />
        </button>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-bold text-neutral-900 mb-3">Category</p>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(prev => prev === cat.name ? null : cat.name)}
              className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                activeCategory === cat.name
                  ? 'bg-brand-50 border-brand-200'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span className="text-2xl select-none">{cat.emoji}</span>
              <span className="text-[10px] font-semibold text-neutral-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 rounded-2xl p-4 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-lg font-bold text-neutral-900 italic" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
            Grow Smart. Save More.
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            🌿 Up to 40% OFF on Agro Products — This Week Only!
          </p>
          <div className="flex gap-2 mt-3">
            <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">Free Delivery</span>
            <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">50% OFF</span>
          </div>
        </div>
        <span className="absolute right-2 bottom-0 text-6xl opacity-20 select-none">🥬</span>
      </div>

      {/* Feature Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-neutral-900">Featured Items</p>
          <button className="text-xs font-semibold text-brand-600">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product, i) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/marketplace/${product.id}`)}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-card text-left hover:shadow-card-md transition-all active:scale-[0.98]"
            >
              {/* Product image */}
              <div className="bg-neutral-50 h-28 flex items-center justify-center relative">
                <span className="text-5xl select-none">{product.image}</span>
                <button
                  onClick={e => { e.stopPropagation(); toggleWishlist(product.id) }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center min-h-fit shadow-card"
                >
                  <Heart size={13} className={wishlist.includes(product.id) ? 'text-danger-500 fill-danger-500' : 'text-neutral-400'} />
                </button>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-semibold text-neutral-900 leading-tight line-clamp-2">{product.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-sm font-bold text-brand-600">₹{product.price}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
