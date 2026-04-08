import { useState, useMemo } from 'react'
import type { FarmRentalCategoryId, FarmEquipmentItem } from '../pages/farm-rental/farmRentalData'
import { FARM_RENTAL_CATEGORIES } from '../pages/farm-rental/farmRentalData'

export type AvailabilityStatus = 'Available' | 'Limited' | 'Not Available'

export interface FilterOptions {
  category: FarmRentalCategoryId | 'all'
  searchQuery: string
  priceRange: [number, number]
  distance: number
  availability: AvailabilityStatus | 'all'
}

export interface BookingRecord {
  id: string
  itemId: string
  itemName: string
  date: string
  status: 'Booked' | 'In Progress' | 'Completed' | 'Cancelled'
  price: number
}

export function useFarmRental() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    searchQuery: '',
    priceRange: [0, 10000],
    distance: 20,
    availability: 'all',
  })

  const [activeTab, setActiveTab] = useState<FarmRentalCategoryId>('tractors')
  const [favorites, setFavorites] = useState<string[]>([])
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const addBooking = (item: FarmEquipmentItem, date: string, price: number) => {
    const newBooking: BookingRecord = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: item.id,
      itemName: item.name,
      date: date,
      status: 'Booked',
      price: price
    }
    setBookingHistory(prev => [newBooking, ...prev])
  }

  const allItems = useMemo(() => {
    return Object.values(FARM_RENTAL_CATEGORIES).flatMap(cat => cat.equipment)
  }, [])

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Filter by Active Tab Category (if not searching globally)
      const categoryMatch = filters.category === 'all' 
        ? Object.entries(FARM_RENTAL_CATEGORIES).find(([_, cat]) => cat.equipment.some(e => e.id === item.id))?.[0] === activeTab
        : Object.entries(FARM_RENTAL_CATEGORIES).find(([_, cat]) => cat.equipment.some(e => e.id === item.id))?.[0] === filters.category

      const searchMatch = item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(filters.searchQuery.toLowerCase())

      const priceMatch = item.pricePerDay >= filters.priceRange[0] && item.pricePerDay <= filters.priceRange[1]
      
      // Simulated distance (mocking distance for now)
      const simulatedDistance = Math.floor(Math.random() * 20) + 1
      const distanceMatch = simulatedDistance <= filters.distance

      return categoryMatch && searchMatch && priceMatch && distanceMatch
    })
  }, [allItems, filters, activeTab])

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
  }
}
