import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Search, Mic, Star, ChevronRight, Tag, Info, ShoppingBag } from 'lucide-react'

const CATEGORIES = [
  { name: 'Seedling', emoji: '🌱', color: 'bg-green-50 text-green-600 border-green-100' },
  { name: 'Crop', emoji: '🌾', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Machinery', emoji: '🚜', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { name: 'Livestock', emoji: '🐄', color: 'bg-purple-50 text-purple-600 border-purple-100' },
]

const PRODUCTS = [
  { id: 'p1', name: 'Mustard Seeds (Premium)', brand: 'AgriGold', price: 450, originalPrice: 520, image: '/assets/images/market/mustard-seeds.png', rating: 4.8, reviews: 320, category: 'Seedling' },
  { id: 'p2', name: 'Bio Viricide Spray', brand: 'GloLife', price: 110, originalPrice: 200, image: '/assets/images/market/pesticide.png', rating: 4.5, reviews: 500, category: 'Crop' },
  { id: 'p3', name: 'Urea Fertilizer 50kg', brand: 'IFFCO', price: 800, originalPrice: 950, image: '/assets/images/market/urea.png', rating: 4.9, reviews: 1200, category: 'Crop' },
  { id: 'p4', name: 'Drip Irrigation Kit', brand: 'Jain', price: 2500, originalPrice: 3200, image: '/assets/images/market/irrigation.png', rating: 4.7, reviews: 180, category: 'Machinery' },
  { id: 'p6', name: 'Cattle Feed 30kg', brand: 'Amul', price: 680, originalPrice: 780, image: '/assets/images/market/cattle-feed.png', rating: 4.6, reviews: 210, category: 'Livestock' },
]

export default function Marketplace() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)

  const filtered = PRODUCTS
    .filter(p => !activeCategory || p.category === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleVoiceSearch = () => {
    setIsListening(true)
    setTimeout(() => setIsListening(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Premium Header */}
      <div className="bg-white px-5 pt-8 pb-6 border-b border-neutral-100 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Marketplace
              </h1>
              <p className="text-neutral-500 text-sm font-medium">Quality products for your farm.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-4 bg-neutral-100 rounded-2xl text-neutral-600 hover:bg-neutral-200 transition-all active:scale-95 text-red-500 relative">
                <Heart size={20} className={wishlist.length > 0 ? "fill-red-500" : ""} />
                {wishlist.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
                )}
              </button>
              <button className="p-4 bg-neutral-900 rounded-2xl text-white hover:bg-neutral-800 transition-all active:scale-95 relative">
                <ShoppingCart size={20} />
                <span className="absolute top-2 right-2 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-neutral-900">
                  2
                </span>
              </button>
            </div>
          </div>

          {/* Search with Voice Simulation */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-600 transition-colors" size={20} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search seeds, fertilizers, tools..."
              className="w-full pl-12 pr-12 py-4 bg-neutral-50 border-none rounded-2xl text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
            />
            <button 
              onClick={handleVoiceSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300'}`}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-8">
        
        {/* Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Categories</h2>
            <button className="text-sm font-bold text-brand-600">View All</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(prev => prev === cat.name ? null : cat.name)}
                className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-300 ${
                  activeCategory === cat.name
                    ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-100 scale-105'
                    : `bg-white border-neutral-100 hover:border-brand-200 shadow-sm`
                }`}
              >
                <span className={`text-2xl p-2 rounded-2xl ${activeCategory === cat.name ? 'bg-white/20' : 'bg-neutral-50'}`}>
                  {cat.emoji}
                </span>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${activeCategory === cat.name ? 'text-white' : 'text-neutral-500'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Promo Banner - Apple Style */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl shadow-brand-100 group">
          <div className="relative z-10 space-y-3">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Limited Offer
            </span>
            <h3 className="text-2xl font-extrabold text-white leading-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Grow Smart.<br />Save Big.
            </h3>
            <p className="text-brand-50 text-xs font-medium max-w-[180px] leading-relaxed opacity-90">
              Get up to 40% OFF on all IFFCO fertilizers this harvesting season.
            </p>
            <button className="mt-2 bg-white text-brand-600 px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-neutral-50 transition-colors active:scale-95 shadow-lg">
              Shop Now
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 text-9xl rotate-12 opacity-20 pointer-events-none transition-transform group-hover:scale-110 duration-700">
            🌾
          </div>
        </div>

        {/* Featured Products */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Featured Products</h2>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-brand-500" />
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{filtered.length} Items</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <AnimatePresence mode='popLayout'>
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-neutral-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative"
                >
                  {/* Image */}
                  <div className="aspect-square bg-neutral-50 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <button
                      onClick={e => { e.stopPropagation(); toggleWishlist(product.id) }}
                      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95 shadow-sm ${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-neutral-400 hover:text-red-500'}`}
                    >
                      <Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    {product.originalPrice > product.price && (
                      <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-brand-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest">{product.brand}</p>
                      <h4 className="font-bold text-neutral-900 leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded-lg">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-yellow-700">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">({product.reviews} reviews)</span>
                    </div>

                    <div className="flex items-end justify-between pt-2">
                      <div className="space-y-0.5">
                        <p className="text-xs text-neutral-400 line-through font-medium">₹{product.originalPrice}</p>
                        <p className="text-xl font-black text-neutral-900">₹{product.price}</p>
                      </div>
                      <button 
                        className="p-3 bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 transition-colors active:scale-95 shadow-lg group-hover:bg-brand-600"
                        title="Quick Buy"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Info Card */}
        <div className="bg-neutral-900 rounded-[2.5rem] p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-bold text-lg leading-tight">AgroSathi Verified</h4>
            <p className="text-neutral-400 text-xs">All products are tested for quality.</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Info size={24} />
          </div>
        </div>

      </div>

      {/* Quick Add To Cart Feedback */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-[100] flex items-center gap-4 border border-white/10 backdrop-blur-xl"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <p className="font-bold text-sm tracking-wide uppercase">Listening for search...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-5 right-5 max-w-2xl mx-auto z-50">
        <button className="w-full py-4 bg-brand-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-brand-200 active:scale-95 transition-all">
          <ShoppingBag size={24} />
          Go to Checkout
        </button>
      </div>

    </div>
  )
}
