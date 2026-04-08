import { useNavigate } from 'react-router-dom'
import { farmRentalCategoryList } from './farmRentalData'
import FarmRentalCategoryCard from './FarmRentalCategoryCard'

export default function FarmRentalHome() {
  const navigate = useNavigate()

  return (
    <div className="px-4 py-5 max-w-6xl mx-auto w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
          Farm Equipment Rental
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Choose a category and rent trusted farm equipment from nearby owners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {farmRentalCategoryList.map(category => (
          <FarmRentalCategoryCard
            key={category.id}
            category={category}
            onOpen={() => navigate(`/farm-rental/${category.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

