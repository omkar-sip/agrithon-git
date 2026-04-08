import { useState } from 'react'
import { Search, SlidersHorizontal, ChevronRight, Tractor, Users, Truck, Droplets, Plane, History } from 'lucide-react'
import { useFarmRental } from '../../hooks/useFarmRental'
import type { FarmRentalCategoryId, FarmEquipmentItem } from './farmRentalData'
import { FARM_RENTAL_CATEGORIES } from './farmRentalData'
import FarmServiceCard from './FarmServiceCard'
import BookingModal from './BookingModal'
import MyActivityOverlay from './MyActivityOverlay'

export default function FarmRentalHome() {
  const { 
    filters, setFilters, filteredItems, 
    activeTab, setActiveTab, 
    favorites, toggleFavorite, 
    bookingHistory, addBooking 
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

  const handleBooking = (item: FarmEquipmentItem) => {
    setSelectedItem(item)
  }

  const handleFavoriteSelect = (_id: string, categoryId: string) => {
    setActiveTab(categoryId as FarmRentalCategoryId)
    setIsActivityOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Header & Hero */}
      <div className="bg-white px-5 pt-8 pb-6 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Farm Services
              </h1>
              <p className="text-neutral-500 text-sm font-medium">
                Rent equipment & book professional services.
              </p>
            </div>
            <button 
              onClick={() => setIsActivityOpen(true)}
              className="relative p-4 bg-neutral-100 rounded-2xl text-neutral-600 hover:bg-neutral-200 transition-all active:scale-95"
            >
              <History size={24} />
              {(bookingHistory.length > 0 || favorites.length > 0) && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-blue-600 border-2 border-white rounded-full" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search tractors, labor, drones..." 
                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-4 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isFilterOpen ? 'bg-blue-600 text-white' : 'bg-neutral-50 text-neutral-600'}`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Filters Panel */}
          {isFilterOpen && (
            <div className="bg-neutral-50 p-5 rounded-3xl border border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Price Range (Day)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="500"
                      className="flex-1 accent-blue-600"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    />
                    <span className="text-sm font-bold text-neutral-700">₹{filters.priceRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Max Distance (km)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      className="flex-1 accent-blue-600"
                      value={filters.distance}
                      onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                    />
                    <span className="text-sm font-bold text-neutral-700">{filters.distance} km</span>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Availability</label>
                   <div className="flex gap-2">
                     {['all', 'Available', 'Limited'].map((status) => (
                       <button
                         key={status}
                         onClick={() => setFilters({ ...filters, availability: status as any })}
                         className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                           filters.availability === status 
                           ? 'bg-blue-600 text-white' 
                           : 'bg-white text-neutral-500 border border-neutral-100'
                         }`}
                       >
                         {status.toUpperCase()}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FarmRentalCategoryId)}
                  className={`flex flex-col items-center gap-2 px-6 py-4 rounded-3xl transition-all min-w-[100px] border ${
                    isActive 
                    ? 'bg-blue-50 border-blue-100 text-blue-600 scale-105 shadow-sm' 
                    : 'bg-white border-transparent text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-50 text-neutral-400'}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-5 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {FARM_RENTAL_CATEGORIES[activeTab]?.title}
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Showing {filteredItems.length} verified services nearby
            </p>
          </div>
          <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
            View All <ChevronRight size={16} />
          </button>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <FarmServiceCard 
                key={item.id} 
                item={item} 
                onBook={handleBooking}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-white rounded-[2.5rem] border border-dashed border-neutral-200">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-300">
              <Search size={40} />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">No services found</p>
              <p className="text-neutral-500 text-sm">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedItem && (
        <BookingModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          isDrone={activeTab === 'drones'}
          onConfirm={(item, date, price) => addBooking(item, date, price)}
        />
      )}

      {/* My Activity Overlay */}
      {isActivityOpen && (
        <MyActivityOverlay 
          onClose={() => setIsActivityOpen(false)}
          bookingHistory={bookingHistory}
          favorites={favorites}
          onRemoveFavorite={toggleFavorite}
          onSelectFavorite={handleFavoriteSelect}
        />
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-32 right-6 z-50">
        <button className="bg-neutral-900 text-white px-6 py-4 rounded-3xl font-bold shadow-2xl flex items-center gap-3 hover:scale-105 transition-all border border-white/10">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">+</span>
          </div>
          Post Service
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-20 text-center border-t border-neutral-100 mt-20">
        <p className="text-neutral-400 font-bold text-sm uppercase tracking-widest italic">
          “This unified platform allows farmers to access machinery, labor, transport, and advanced services like drones — all in one place, without ownership.”
        </p>
      </div>

    </div>
  )
}
