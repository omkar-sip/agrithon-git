import { X, Heart, History, Trash2, ChevronRight, MessageSquare, Phone } from 'lucide-react'
import type { BookingRecord } from '../../hooks/useFarmRental'
import { FARM_RENTAL_CATEGORIES } from './farmRentalData'

interface MyActivityOverlayProps {
  onClose: () => void
  favorites: string[]
  bookingHistory: BookingRecord[]
  onRemoveFavorite: (id: string) => void
  onSelectFavorite: (id: string, categoryId: string) => void
}

export default function MyActivityOverlay({ 
  onClose, 
  favorites, 
  bookingHistory, 
  onRemoveFavorite,
  onSelectFavorite 
}: MyActivityOverlayProps) {
  
  const favoriteItems = Object.values(FARM_RENTAL_CATEGORIES).flatMap(cat => 
    cat.equipment.filter(item => favorites.includes(item.id)).map(item => ({ ...item, categoryId: cat.id }))
  )

  const statusColors = {
    Booked: 'bg-blue-100 text-blue-600',
    'In Progress': 'bg-yellow-100 text-yellow-600',
    Completed: 'bg-green-100 text-green-600',
    Cancelled: 'bg-red-100 text-red-600',
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-md flex justify-end animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-10 duration-500 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-900 leading-tight">My Activity</h2>
            <p className="text-sm text-neutral-500">History & Favorites</p>
          </div>
          <button onClick={onClose} className="p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pb-32">
          
          {/* Favorites Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-neutral-900">
              <Heart className="text-red-500 fill-red-500" size={20} />
              <h3 className="font-bold text-lg">Saved for Later ({favorites.length})</h3>
            </div>
            
            {favoriteItems.length > 0 ? (
              <div className="space-y-3">
                {favoriteItems.map(item => (
                  <div key={item.id} className="group relative bg-neutral-50 p-4 rounded-3xl border border-transparent hover:border-neutral-200 transition-all flex gap-4">
                    <img src={item.images[0]} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-neutral-900 truncate">{item.name}</p>
                      <p className="text-xs text-neutral-500 font-medium">₹{item.pricePerDay}/day</p>
                      <button 
                        onClick={() => onSelectFavorite(item.id, item.categoryId)}
                        className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemoveFavorite(item.id)}
                      className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200">
                <p className="text-neutral-400 text-sm font-medium">No items saved yet</p>
              </div>
            )}
          </section>

          {/* Booking History Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-neutral-900">
              <History className="text-blue-500" size={20} />
              <h3 className="font-bold text-lg">Booking History</h3>
            </div>

            {bookingHistory.length > 0 ? (
              <div className="space-y-3">
                {bookingHistory.map(booking => (
                  <div key={booking.id} className="bg-white border border-neutral-100 p-5 rounded-3xl shadow-sm space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-neutral-900">{booking.itemName}</p>
                        <p className="text-xs text-neutral-500">Booked for: {booking.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-50">
                      <span className="text-sm font-bold text-neutral-900">₹{booking.price}</span>
                      <div className="flex gap-2">
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                          <Phone size={16} />
                        </button>
                        <button className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200">
                <p className="text-neutral-400 text-sm font-medium">No active or past bookings</p>
              </div>
            )}
          </section>
        </div>

        {/* Support Footer */}
        <div className="p-6 bg-neutral-50 border-t border-neutral-100">
          <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-colors active:scale-95 flex items-center justify-center gap-2">
            <Phone size={20} />
            Contact AgroSathi Support
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
