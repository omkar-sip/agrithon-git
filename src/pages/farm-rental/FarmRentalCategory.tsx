import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import FarmEquipmentCard from './FarmEquipmentCard'
import { FARM_RENTAL_CATEGORIES, type FarmRentalCategoryId } from './farmRentalData'

export default function FarmRentalCategory() {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const category = categoryId ? FARM_RENTAL_CATEGORIES[categoryId as FarmRentalCategoryId] : undefined

  if (!category) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto w-full space-y-4">
        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
          Farm Equipment Rental
        </h1>
        <p className="text-neutral-600">Category not found.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/farm-rental')}>
          Back to Categories
        </Button>
      </div>
    )
  }

  return (
    <div className="px-4 py-5 max-w-6xl mx-auto w-full space-y-5">
      <button
        onClick={() => navigate('/farm-rental')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 min-h-fit"
      >
        <ArrowLeft size={15} />
        Back to Farm Equipment Rental
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
          {category.title}
        </h1>
        <p className="text-sm text-neutral-600">{category.subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {category.images.map((image, index) => (
          <img
            key={`${category.id}-${index}`}
            src={image}
            alt={`${category.title} showcase ${index + 1}`}
            className="w-full h-24 md:h-32 rounded-xl object-cover border border-neutral-200"
            loading="lazy"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.equipment.map(item => (
          <FarmEquipmentCard key={item.id} equipment={item} />
        ))}
      </div>
    </div>
  )
}
