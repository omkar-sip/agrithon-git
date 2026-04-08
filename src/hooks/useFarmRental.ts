import { useMemo, useState } from 'react'
import {
  FARM_RENTAL_CATEGORIES,
  getAvailabilityStatus,
  getEstimatedDistanceKm,
  type AvailabilityStatus,
  type FarmRentalCategoryId,
} from '../pages/farm-rental/farmRentalData'
import { useFarmRentalStore } from '../store/useFarmRentalStore'

export interface FilterOptions {
  category: FarmRentalCategoryId | 'all'
  searchQuery: string
  priceRange: [number, number]
  distance: number
  availability: AvailabilityStatus | 'all'
}

export function useFarmRental() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    searchQuery: '',
    priceRange: [0, 10000],
    distance: 25,
    availability: 'all',
  })
  const [activeTab, setActiveTab] = useState<FarmRentalCategoryId>('tractors')

  const favorites = useFarmRentalStore((state) => state.favorites)
  const bookingHistory = useFarmRentalStore((state) => state.bookingHistory)
  const toggleFavorite = useFarmRentalStore((state) => state.toggleFavorite)
  const addBooking = useFarmRentalStore((state) => state.addBooking)

  const filteredItems = useMemo(() => {
    const scopedCategoryId = filters.category === 'all' ? activeTab : filters.category
    const activeCategory = FARM_RENTAL_CATEGORIES[scopedCategoryId]
    const query = filters.searchQuery.trim().toLowerCase()

    return activeCategory.equipment.filter((item) => {
      const searchMatch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.owner.name.toLowerCase().includes(query)

      const priceMatch =
        item.pricePerDay >= filters.priceRange[0] &&
        item.pricePerDay <= filters.priceRange[1]

      const distanceMatch = getEstimatedDistanceKm(item.id) <= filters.distance

      const availabilityMatch =
        filters.availability === 'all' ||
        getAvailabilityStatus(item.id) === filters.availability

      return searchMatch && priceMatch && distanceMatch && availabilityMatch
    })
  }, [activeTab, filters])

  return {
    filters,
    setFilters,
    filteredItems,
    activeTab,
    setActiveTab,
    favorites,
    toggleFavorite,
    bookingHistory,
    addBooking,
    getAvailabilityStatus,
    getEstimatedDistanceKm,
  }
}
