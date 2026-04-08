import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FarmEquipmentItem } from '../pages/farm-rental/farmRentalData'

export interface BookingRecord {
  id: string
  itemId: string
  itemName: string
  providerName: string
  providerPhone: string
  date: string
  status: 'Booked' | 'In Progress' | 'Completed' | 'Cancelled'
  price: number
}

interface FarmRentalState {
  favorites: string[]
  bookingHistory: BookingRecord[]
  toggleFavorite: (id: string) => void
  addBooking: (item: FarmEquipmentItem, date: string, price: number) => void
}

const createBookingId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useFarmRentalStore = create<FarmRentalState>()(
  persist(
    (set) => ({
      favorites: [],
      bookingHistory: [],

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favoriteId) => favoriteId !== id)
            : [...state.favorites, id],
        })),

      addBooking: (item, date, price) =>
        set((state) => ({
          bookingHistory: [
            {
              id: createBookingId(),
              itemId: item.id,
              itemName: item.name,
              providerName: item.owner.name,
              providerPhone: item.owner.phone,
              date,
              status: 'Booked',
              price,
            },
            ...state.bookingHistory,
          ],
        })),
    }),
    { name: 'sarpanch-farm-rental-v1' }
  )
)
