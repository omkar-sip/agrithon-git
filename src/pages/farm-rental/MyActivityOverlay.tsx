import { X, Heart, History, Trash2, ChevronRight, MessageCircle, Phone } from 'lucide-react'
import type { BookingRecord } from '../../store/useFarmRentalStore'
import { FARM_RENTAL_CATEGORIES, getFarmRentalItemById } from './farmRentalData'

interface MyActivityOverlayProps {
  onClose: () => void
  favorites: string[]
  bookingHistory: BookingRecord[]
  onRemoveFavorite: (id: string) => void
  onSelectFavorite: (id: string, categoryId: string) => void
}

const statusColors: Record<BookingRecord['status'], string> = {
  Booked: 'bg-blue-100 text-blue-600',
  'In Progress': 'bg-amber-100 text-amber-600',
  Completed: 'bg-green-100 text-green-600',
  Cancelled: 'bg-red-100 text-red-600',
}

const formatPhone = (phone: string) => phone.replace(/\D+/g, '')

export default function MyActivityOverlay({
  onClose,
  favorites,
  bookingHistory,
  onRemoveFavorite,
  onSelectFavorite,
}: MyActivityOverlayProps) {
  const favoriteItems = Object.entries(FARM_RENTAL_CATEGORIES).flatMap(([categoryId, category]) =>
    category.equipment
      .filter((item) => favorites.includes(item.id))
      .map((item) => ({ ...item, categoryId }))
  )

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-black/40 backdrop-blur-md">
      <div className="flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white p-6">
          <div>
            <h2 className="text-2xl font-extrabold leading-tight text-neutral-900">My Activity</h2>
            <p className="text-sm text-neutral-500">History and favorites</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-neutral-100 p-3 transition-colors hover:bg-neutral-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-4 pb-32">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-neutral-900">
              <Heart className="fill-red-500 text-red-500" size={20} />
              <h3 className="text-lg font-bold">Saved for Later ({favorites.length})</h3>
            </div>

            {favoriteItems.length > 0 ? (
              <div className="space-y-3">
                {favoriteItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-3xl border border-transparent bg-neutral-50 p-4 transition-all hover:border-neutral-200"
                  >
                    <img src={item.images[0]} className="h-20 w-20 rounded-2xl object-cover shadow-sm" alt={item.name} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-neutral-900">{item.name}</p>
                      <p className="text-xs font-medium text-neutral-500">Rs {item.pricePerDay}/day</p>
                      <button
                        type="button"
                        onClick={() => onSelectFavorite(item.id, item.categoryId)}
                        className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(item.id)}
                      className="p-2 text-neutral-300 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-neutral-200 bg-neutral-50 py-10 text-center">
                <p className="text-sm font-medium text-neutral-400">No items saved yet</p>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-neutral-900">
              <History className="text-blue-500" size={20} />
              <h3 className="text-lg font-bold">Booking History</h3>
            </div>

            {bookingHistory.length > 0 ? (
              <div className="space-y-3">
                {bookingHistory.map((booking) => {
                  const item = getFarmRentalItemById(booking.itemId)
                  const contactPhone = formatPhone(item?.owner.phone || booking.providerPhone)

                  return (
                    <div
                      key={booking.id}
                      className="space-y-3 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-neutral-900">{booking.itemName}</p>
                          <p className="text-xs text-neutral-500">Booked for: {booking.date}</p>
                        </div>

                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-50 pt-2">
                        <span className="text-sm font-bold text-neutral-900">Rs {booking.price}</span>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(`tel:${contactPhone}`, '_self')}
                            className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
                          >
                            <Phone size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const message = `Hi ${booking.providerName}, I am following up on my AgroSathi booking for ${booking.itemName}.`
                              window.open(
                                `https://wa.me/${contactPhone}?text=${encodeURIComponent(message)}`,
                                '_blank'
                              )
                            }}
                            className="rounded-xl bg-green-50 p-2 text-green-600 transition-colors hover:bg-green-100"
                          >
                            <MessageCircle size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-neutral-200 bg-neutral-50 py-10 text-center">
                <p className="text-sm font-medium text-neutral-400">No active or past bookings</p>
              </div>
            )}
          </section>
        </div>

        <div className="border-t border-neutral-100 bg-neutral-50 p-6">
          <p className="text-center text-sm font-medium text-neutral-500">
            Need help with a booking? Use the call or chat actions above to reach the provider quickly.
          </p>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
