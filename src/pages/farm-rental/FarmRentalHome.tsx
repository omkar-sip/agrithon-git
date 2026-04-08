import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Tractor,
  Users,
  Truck,
  Droplets,
  Plane,
  History,
} from 'lucide-react'
import { useFarmRental } from '../../hooks/useFarmRental'
import type { AvailabilityStatus, FarmRentalCategoryId, FarmEquipmentItem } from './farmRentalData'
import { FARM_RENTAL_CATEGORIES } from './farmRentalData'
import FarmServiceCard from './FarmServiceCard'
import BookingModal from './BookingModal'
import MyActivityOverlay from './MyActivityOverlay'

const availabilityOptions: Array<'all' | AvailabilityStatus> = ['all', 'Available', 'Limited', 'Not Available']

export default function FarmRentalHome() {
  const navigate = useNavigate()
  const {
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
  } = useFarmRental()

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FarmEquipmentItem | null>(null)

  const tabs = [
    { id: 'tractors', label: 'Equipment', icon: Tractor },
    { id: 'labor', label: 'Labor', icon: Users },
    { id: 'transport', label: 'Transport', icon: Truck },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'drones', label: 'Drones', icon: Plane },
  ] as const

  const handleFavoriteSelect = (id: string, categoryId: string) => {
    setActiveTab(categoryId as FarmRentalCategoryId)
    setIsActivityOpen(false)
    navigate(`/farm-rental/service/${id}`)
  }

  return (
    <div className="min-h-full bg-[#FDFDFD] pb-28">
      <div className="border-b border-neutral-100 bg-white px-5 pb-6 pt-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1
                className="text-3xl font-extrabold tracking-tight text-neutral-900"
                style={{ fontFamily: 'Baloo 2, sans-serif' }}
              >
                Farm Services
              </h1>
              <p className="text-sm font-medium text-neutral-500">
                Rent equipment and book professional services nearby.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsActivityOpen(true)}
              className="relative rounded-2xl bg-neutral-100 p-4 text-neutral-600 transition-all active:scale-95 hover:bg-neutral-200"
            >
              <History size={24} />
              {(bookingHistory.length > 0 || favorites.length > 0) && (
                <span className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-white bg-blue-600" />
              )}
            </button>
          </div>

          <div className="flex gap-3">
            <div className="group relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-blue-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tractors, labor, drones..."
                className="w-full rounded-2xl border-none bg-neutral-50 py-4 pl-12 pr-4 text-neutral-900 shadow-sm transition-all placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500"
                value={filters.searchQuery}
                onChange={(event) => setFilters({ ...filters, searchQuery: event.target.value })}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen((current) => !current)}
              className={`flex items-center justify-center rounded-2xl p-4 shadow-sm transition-all ${
                isFilterOpen ? 'bg-blue-600 text-white' : 'bg-neutral-50 text-neutral-600'
              }`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {isFilterOpen && (
            <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Price Range (Day)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      className="flex-1 accent-blue-600"
                      value={filters.priceRange[1]}
                      onChange={(event) =>
                        setFilters({
                          ...filters,
                          priceRange: [0, parseInt(event.target.value, 10)],
                        })
                      }
                    />
                    <span className="text-sm font-bold text-neutral-700">Rs {filters.priceRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Max Distance (km)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      className="flex-1 accent-blue-600"
                      value={filters.distance}
                      onChange={(event) =>
                        setFilters({
                          ...filters,
                          distance: parseInt(event.target.value, 10),
                        })
                      }
                    />
                    <span className="text-sm font-bold text-neutral-700">{filters.distance} km</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Availability
                  </label>
                  <div className="flex gap-2">
                    {availabilityOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setFilters({
                            ...filters,
                            availability: status,
                          })
                        }
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                          filters.availability === status
                            ? 'bg-blue-600 text-white'
                            : 'border border-neutral-100 bg-white text-neutral-500'
                        }`}
                      >
                        {status === 'all' ? 'ALL' : status.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-[100px] rounded-3xl border px-6 py-4 transition-all ${
                    isActive
                      ? 'scale-105 border-blue-100 bg-blue-50 text-blue-600 shadow-sm'
                      : 'border-transparent bg-white text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`rounded-2xl p-3 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-50 text-neutral-400'}`}>
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="whitespace-nowrap text-xs font-bold">{tab.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {FARM_RENTAL_CATEGORIES[activeTab].title}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Showing {filteredItems.length} verified services nearby
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/farm-rental/${activeTab}`)}
            className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <FarmServiceCard
                key={item.id}
                item={item}
                availabilityStatus={getAvailabilityStatus(item.id)}
                distanceKm={getEstimatedDistanceKm(item.id)}
                onBook={(nextItem) => setSelectedItem(nextItem)}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 rounded-[2.5rem] border border-dashed border-neutral-200 bg-white py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50 text-neutral-300">
              <Search size={40} />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">No services found</p>
              <p className="text-sm text-neutral-500">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <BookingModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isDrone={activeTab === 'drones'}
          onConfirm={(item, date, price) => addBooking(item, date, price)}
        />
      )}

      {isActivityOpen && (
        <MyActivityOverlay
          onClose={() => setIsActivityOpen(false)}
          bookingHistory={bookingHistory}
          favorites={favorites}
          onRemoveFavorite={toggleFavorite}
          onSelectFavorite={handleFavoriteSelect}
        />
      )}

      <div className="fixed bottom-32 right-6 z-50">
        <button
          type="button"
          className="flex items-center gap-3 rounded-3xl border border-white/10 bg-neutral-900 px-6 py-4 font-bold text-white shadow-2xl transition-all hover:scale-105"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
            <span className="text-lg text-white">+</span>
          </div>
          Post Service
        </button>
      </div>

      <div className="mx-auto mt-20 max-w-6xl border-t border-neutral-100 px-5 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">
          One place for machines, labor, transport, irrigation, and drone services.
        </p>
      </div>
    </div>
  )
}
