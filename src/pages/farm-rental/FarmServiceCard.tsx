import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Heart,
  Phone,
  MessageCircle,
} from 'lucide-react'
import type { AvailabilityStatus, FarmEquipmentItem } from './farmRentalData'

interface FarmServiceCardProps {
  item: FarmEquipmentItem
  availabilityStatus: AvailabilityStatus
  distanceKm: number
  onBook: (item: FarmEquipmentItem) => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

const STATUS_STYLES: Record<AvailabilityStatus, string> = {
  Available: 'bg-green-500',
  Limited: 'bg-amber-500',
  'Not Available': 'bg-red-500',
}

const formatPhone = (phone: string) => phone.replace(/\D+/g, '')

export default function FarmServiceCard({
  item,
  availabilityStatus,
  distanceKm,
  onBook,
  isFavorite,
  onToggleFavorite,
}: FarmServiceCardProps) {
  const navigate = useNavigate()

  const handleWhatsApp = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const message = `Hi ${item.owner.name}, I found your ${item.name} on AgroSathi and would like to know more.`
    window.open(
      `https://wa.me/${formatPhone(item.owner.phone)}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const handleCall = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    window.open(`tel:${formatPhone(item.owner.phone)}`, '_self')
  }

  return (
    <div
      onClick={() => navigate(`/farm-rental/service/${item.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggleFavorite(item.id)
            }}
            className={`rounded-full p-2.5 backdrop-blur-md transition-all active:scale-95 ${
              isFavorite
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-black/20 text-white hover:bg-black/40'
            }`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md ${STATUS_STYLES[availabilityStatus]}`}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            {availabilityStatus.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold leading-tight text-neutral-900">{item.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-neutral-500">
              <MapPin size={14} />
              <span className="text-xs">{item.location} • {distanceKm} km away</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-brand-600">Rs {item.pricePerDay}</p>
            <p className="text-[10px] text-neutral-400">per day</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-neutral-600">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs font-semibold">Rs {item.pricePerHour}/hr</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-xs font-semibold">Verified</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCall}
              className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Phone size={14} />
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="rounded-xl bg-green-50 p-2 text-green-600 transition-colors hover:bg-green-100"
            >
              <MessageCircle size={14} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onBook(item)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 font-bold text-white shadow-sm transition-colors active:scale-95 hover:bg-neutral-800"
        >
          Book Now
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
