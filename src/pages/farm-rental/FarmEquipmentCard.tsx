import { useState } from 'react'
import { MapPin, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { WEEK_DAYS, type FarmEquipmentItem, type WeekDay } from './farmRentalData'

interface FarmEquipmentCardProps {
  equipment: FarmEquipmentItem
}

export default function FarmEquipmentCard({ equipment }: FarmEquipmentCardProps) {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState<WeekDay>(equipment.availability[0] ?? 'Mon')

  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-card h-full flex flex-col">
      <img
        src={equipment.images[0]}
        alt={equipment.name}
        className="w-full h-44 object-cover"
        loading="lazy"
      />

      <div className="p-4 space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-2">
          {equipment.images.slice(0, 3).map((image, index) => (
            <img
              key={`${equipment.id}-thumb-${index}`}
              src={image}
              alt={`${equipment.name} view ${index + 1}`}
              className="w-full h-16 rounded-lg object-cover border border-neutral-200"
              loading="lazy"
            />
          ))}
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-neutral-900">{equipment.name}</h3>
          <p className="text-sm text-neutral-600 mt-1 flex items-center gap-1.5">
            <MapPin size={14} className="text-neutral-400" />
            {equipment.location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2">
            <p className="text-[11px] text-neutral-500">Per day</p>
            <p className="text-base font-bold text-brand-700">Rs {equipment.pricePerDay}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
            <p className="text-[11px] text-neutral-500">Per hour</p>
            <p className="text-base font-bold text-neutral-800">Rs {equipment.pricePerHour}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Specifications</p>
          <p className="text-sm text-neutral-700"><span className="font-semibold text-neutral-900">Brand:</span> {equipment.specifications.brand}</p>
          <p className="text-sm text-neutral-700"><span className="font-semibold text-neutral-900">Model:</span> {equipment.specifications.model}</p>
          {equipment.specifications.power && (
            <p className="text-sm text-neutral-700"><span className="font-semibold text-neutral-900">Power:</span> {equipment.specifications.power}</p>
          )}
          {equipment.specifications.fuelType && (
            <p className="text-sm text-neutral-700"><span className="font-semibold text-neutral-900">Fuel type:</span> {equipment.specifications.fuelType}</p>
          )}
          <p className="text-sm text-neutral-700"><span className="font-semibold text-neutral-900">Year:</span> {equipment.specifications.year}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Availability (Mon-Sun)</p>
          <div className="grid grid-cols-7 gap-1">
            {WEEK_DAYS.map(day => (
              <button
                key={`${equipment.id}-${day}`}
                onClick={() => setSelectedDay(day)}
                className={`
                  min-h-fit py-1.5 rounded-lg text-[11px] font-semibold border transition-colors
                  ${selectedDay === day
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Owner details</p>
          <p className="text-sm text-neutral-800"><span className="font-semibold">Name:</span> {equipment.owner.name}</p>
          <p className="text-sm text-neutral-800"><span className="font-semibold">Phone:</span> {equipment.owner.phone}</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => navigate('/login')}
        >
          Login to Book
        </Button>

        <div className="border-t border-neutral-100 pt-3 space-y-3">
          <p className="text-sm font-bold text-neutral-900">Reviews</p>
          {equipment.reviews.map(review => (
            <div key={`${equipment.id}-${review.user}-${review.date}`} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-neutral-900">{review.user}</p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={12}
                      className={star <= Math.round(review.rating)
                        ? 'fill-warning-500 text-warning-500'
                        : 'text-neutral-300'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-neutral-700">{review.comment}</p>
              <p className="text-xs text-neutral-400 mt-1">{review.date}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
