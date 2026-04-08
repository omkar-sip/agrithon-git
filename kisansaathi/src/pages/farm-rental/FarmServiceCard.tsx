import { useNavigate } from 'react-router-dom'
import type { FarmEquipmentItem } from './farmRentalData'
import { MapPin, Clock, ShieldCheck, ChevronRight, Heart, Phone, MessageCircle } from 'lucide-react'

interface FarmServiceCardProps {
  item: FarmEquipmentItem
  onBook: (item: FarmEquipmentItem) => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export default function FarmServiceCard({ item, onBook, isFavorite, onToggleFavorite }: FarmServiceCardProps) {
  const navigate = useNavigate()
  
  // Randomly assign availability for demo purposes
  const statusColors = {
    Available: 'bg-green-500',
    Limited: 'bg-yellow-500',
    'Not Available': 'bg-red-500',
  }
  
  const statuses = ['Available', 'Limited', 'Not Available'] as const
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const message = `Hi ${item.owner.name}, I found your ${item.name} on AgroSathi and would like to chat.`
    window.open(`https://wa.me/${item.owner.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`tel:${item.owner.phone}`, '_self')
  }

  return (
    <div 
      onClick={() => navigate(`/farm-rental/service/${item.id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 group relative cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Floating Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
           <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95 ${isFavorite ? 'bg-red-500 text-white shadow-lg' : 'bg-black/20 text-white hover:bg-black/40'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
           <div className={`px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 backdrop-blur-md ${statusColors[status]}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {status.toUpperCase()}
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-neutral-900 leading-tight truncate">{item.name}</h3>
            <div className="flex items-center gap-1 text-neutral-500 mt-1">
              <MapPin size={14} />
              <span className="text-xs">{item.location} • 5.2 km away</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-brand-600 font-bold text-lg">₹{item.pricePerDay}</p>
            <p className="text-[10px] text-neutral-400">per day</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-1 px-1">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-neutral-600">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs font-semibold">₹{item.pricePerHour}/hr</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-xs font-semibold">Verified</span>
            </div>
          </div>

          {/* Social Actions - WHATSAPP INTEGRATED */}
          <div className="flex gap-2">
            <button 
              onClick={handleCall}
              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Phone size={14} />
            </button>
            <button 
              onClick={handleWhatsApp}
              className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle size={14} fill="currentColor" />
            </button>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onBook(item); }}
          className="w-full py-3.5 bg-neutral-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors active:scale-95 shadow-sm"
        >
          Book Now
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
