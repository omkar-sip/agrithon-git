import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, MapPin, Star, ShieldCheck, 
  Clock, Calendar, Phone, MessageCircle, 
  CheckCircle2, Info, User
} from 'lucide-react'
import { FARM_RENTAL_CATEGORIES } from './farmRentalData'
import { useFarmRental } from '../../hooks/useFarmRental'
import { useState } from 'react'
import BookingModal from './BookingModal'

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addBooking } = useFarmRental()
  const [showBooking, setShowBooking] = useState(false)

  // Find the item from data
  const item = Object.values(FARM_RENTAL_CATEGORIES)
    .flatMap(cat => cat.equipment)
    .find(e => e.id === id)

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <Info size={40} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Service Not Found</h1>
          <p className="text-neutral-500">The service you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/farm-rental')}
            className="px-8 py-3 bg-neutral-900 text-white rounded-2xl font-bold"
          >
            Back to Rental
          </button>
        </div>
      </div>
    )
  }

  // Extract category for drone logic
  const isDrone = id?.includes('drone') || item.name.toLowerCase().includes('drone')

  const handleWhatsApp = () => {
    const message = `Hi ${item.owner.name}, I'm interested in renting your ${item.name} via AgroSathi.`
    window.open(`https://wa.me/${item.owner.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCall = () => {
    window.open(`tel:${item.owner.phone}`, '_self')
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Header / Hero */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Top Actions */}
        <div className="absolute top-6 left-5 right-5 flex justify-between items-center text-white">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/20 backdrop-blur-md rounded-2xl transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-green-500/80 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Available
             </div>
          </div>
        </div>

        {/* Floating Title Info */}
        <div className="absolute bottom-10 left-6 right-6 text-white flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-black leading-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              {item.name}
            </h1>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={18} className="text-brand-400" />
              <span className="font-bold">{item.location} • 5.2 km</span>
            </div>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-center min-w-[100px]">
             <p className="text-3xl font-black">₹{item.pricePerDay}</p>
             <p className="text-[10px] font-bold text-white/60">per day</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-10">
        
        {/* Condition & Experience - EXPLICIT REQUEST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="p-6 bg-blue-50 border border-blue-100 rounded-[2.5rem] space-y-3"
           >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-blue-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>Machine Condition</h3>
              <p className="text-blue-700/80 font-medium leading-relaxed">
                {item.condition}
              </p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="p-6 bg-orange-50 border border-orange-100 rounded-[2.5rem] space-y-3"
           >
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <Star size={24} />
              </div>
              <h3 className="text-xl font-black text-orange-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>Operator Experience</h3>
              <p className="text-orange-700/80 font-medium leading-relaxed">
                {item.experience}
              </p>
           </motion.div>
        </div>

        {/* Specifications */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-brand-600 rounded-full" />
              <h2 className="text-2xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>Key Specifications</h2>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(item.specifications).map(([key, value]) => (
                <div key={key} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-2">
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
                   <p className="font-bold text-neutral-900">{value}</p>
                </div>
              ))}
              <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-2">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Base Rate</p>
                 <p className="font-bold text-neutral-900">₹{item.pricePerHour}/hr</p>
              </div>
           </div>
        </div>

        {/* Details & Info */}
        <div className="p-8 bg-neutral-900 rounded-[3rem] text-white flex flex-col md:flex-row gap-8 items-center justify-between">
           <div className="space-y-4 max-w-md">
              <h3 className="text-2xl font-black" style={{ fontFamily: 'Baloo 2, sans-serif' }}>Verified Provider</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                This machine belongs to {item.owner.name}. All AgroSathi providers are verified for reliability and technical knowledge.
              </p>
              <div className="flex items-center gap-2">
                 {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-brand-400 text-brand-400" />)}
                 <span className="text-xs font-bold text-neutral-500 ml-2">4.9 (12 Reviews)</span>
              </div>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={handleWhatsApp}
                className="flex-1 md:flex-none p-5 bg-[#25D366] text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                 <MessageCircle size={24} fill="white" />
              </button>
              <button 
                onClick={handleCall}
                className="flex-1 md:flex-none p-5 bg-white text-neutral-900 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl border border-white/20"
              >
                 <Phone size={24} fill="currentColor" />
              </button>
           </div>
        </div>

      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
         <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-2xl border border-white/20 shadow-2xl p-4 rounded-[2.5rem] flex items-center justify-between">
            <div className="px-6">
               <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total to pay</p>
               <p className="text-2xl font-black text-neutral-900 leading-none mt-1">₹{item.pricePerDay}</p>
            </div>
            <button 
              onClick={() => setShowBooking(true)}
              className="px-10 py-4 bg-brand-600 text-white rounded-3xl font-black text-lg shadow-xl hover:shadow-brand-600/20 transition-all active:scale-95"
            >
               Rent Now
            </button>
         </div>
      </div>

      {/* Booking Modal Integration */}
      {showBooking && (
        <BookingModal 
          item={item} 
          onClose={() => setShowBooking(false)} 
          isDrone={isDrone}
          onConfirm={(item, date, price) => addBooking(item, date, price)}
        />
      )}

    </div>
  )
}
