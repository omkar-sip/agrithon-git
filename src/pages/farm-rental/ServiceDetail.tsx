import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  MessageCircle,
  Info,
} from 'lucide-react'
import BookingModal from './BookingModal'
import {
  getAvailabilityStatus,
  getEstimatedDistanceKm,
  getFarmRentalCategoryIdByItemId,
  getFarmRentalItemById,
} from './farmRentalData'
import { useFarmRental } from '../../hooks/useFarmRental'

const STATUS_STYLES = {
  Available: 'bg-green-500/85',
  Limited: 'bg-amber-500/85',
  'Not Available': 'bg-red-500/85',
}

const formatPhone = (phone: string) => phone.replace(/\D+/g, '')

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addBooking } = useFarmRental()
  const [showBooking, setShowBooking] = useState(false)

  const item = id ? getFarmRentalItemById(id) : undefined

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <Info size={40} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Service Not Found</h1>
          <p className="text-neutral-500">The service you are looking for does not exist or has been removed.</p>
          <button
            type="button"
            onClick={() => navigate('/farm-rental')}
            className="rounded-2xl bg-neutral-900 px-8 py-3 font-bold text-white"
          >
            Back to Rental
          </button>
        </div>
      </div>
    )
  }

  const categoryId = getFarmRentalCategoryIdByItemId(item.id)
  const availabilityStatus = getAvailabilityStatus(item.id)
  const distanceKm = getEstimatedDistanceKm(item.id)
  const isDrone = categoryId === 'drones'
  const reviewAverage = item.reviews.length
    ? (item.reviews.reduce((total, review) => total + review.rating, 0) / item.reviews.length).toFixed(1)
    : 'New'

  const handleWhatsApp = () => {
    const message = `Hi ${item.owner.name}, I am interested in renting your ${item.name} through AgroSathi.`
    window.open(
      `https://wa.me/${formatPhone(item.owner.phone)}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const handleCall = () => {
    window.open(`tel:${formatPhone(item.owner.phone)}`, '_self')
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-40">
      <div className="relative h-[45vh] overflow-hidden sm:h-[55vh]">
        <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-5 right-5 top-6 flex items-center justify-between text-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-2xl bg-white/20 p-3 backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          <div className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${STATUS_STYLES[availabilityStatus]}`}>
            {availabilityStatus}
          </div>
        </div>

        <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between text-white">
          <div className="space-y-2">
            <h1
              className="text-4xl font-black leading-tight"
              style={{ fontFamily: 'Baloo 2, sans-serif' }}
            >
              {item.name}
            </h1>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={18} className="text-brand-400" />
              <span className="font-bold">{item.location} • {distanceKm} km</span>
            </div>
          </div>

          <div className="min-w-[100px] rounded-3xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-xl">
            <p className="text-3xl font-black">Rs {item.pricePerDay}</p>
            <p className="text-[10px] font-bold text-white/60">per day</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-4xl space-y-10 px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3 rounded-[2.5rem] border border-blue-100 bg-blue-50 p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <h3
              className="text-xl font-black text-blue-900"
              style={{ fontFamily: 'Baloo 2, sans-serif' }}
            >
              Machine Condition
            </h3>
            <p className="font-medium leading-relaxed text-blue-700/80">{item.condition}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-3 rounded-[2.5rem] border border-orange-100 bg-orange-50 p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg">
              <Star size={24} />
            </div>
            <h3
              className="text-xl font-black text-orange-900"
              style={{ fontFamily: 'Baloo 2, sans-serif' }}
            >
              Operator Experience
            </h3>
            <p className="font-medium leading-relaxed text-orange-700/80">{item.experience}</p>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-2 rounded-full bg-brand-600" />
            <h2
              className="text-2xl font-black text-neutral-900"
              style={{ fontFamily: 'Baloo 2, sans-serif' }}
            >
              Key Specifications
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Object.entries(item.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col gap-2 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-bold text-neutral-900">{value}</p>
              </div>
            ))}

            <div className="flex flex-col gap-2 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Base Rate</p>
              <p className="font-bold text-neutral-900">Rs {item.pricePerHour}/hr</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 rounded-[3rem] bg-neutral-900 p-8 text-white md:flex-row">
          <div className="max-w-md space-y-4">
            <h3 className="text-2xl font-black" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Verified Provider
            </h3>
            <p className="text-sm leading-relaxed text-neutral-400">
              This machine belongs to {item.owner.name}. All AgroSathi providers are verified for reliability and technical knowledge.
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} className="fill-brand-400 text-brand-400" />
              ))}
              <span className="ml-2 text-xs font-bold text-neutral-500">
                {reviewAverage} ({item.reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="flex w-full gap-4 md:w-auto">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 rounded-[2rem] bg-green-500 p-5 text-white shadow-xl transition-all active:scale-95 hover:scale-105 md:flex-none"
            >
              <MessageCircle size={24} />
            </button>
            <button
              type="button"
              onClick={handleCall}
              className="flex-1 rounded-[2rem] border border-white/20 bg-white p-5 text-neutral-900 shadow-xl transition-all active:scale-95 hover:scale-105 md:flex-none"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between rounded-[2.5rem] border border-white/20 bg-white/80 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="px-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total to pay</p>
            <p className="mt-1 text-2xl font-black leading-none text-neutral-900">Rs {item.pricePerDay}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowBooking(true)}
            className="rounded-3xl bg-brand-600 px-10 py-4 text-lg font-black text-white shadow-xl transition-all active:scale-95"
          >
            Rent Now
          </button>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          item={item}
          onClose={() => setShowBooking(false)}
          isDrone={isDrone}
          onConfirm={(selectedItem, date, price) => addBooking(selectedItem, date, price)}
        />
      )}
    </div>
  )
}
