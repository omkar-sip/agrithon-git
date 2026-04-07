// src/store/useCategoryStore.ts — all labels in English only
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FarmingCategory = 'crop' | 'livestock' | 'poultry' | 'fishery'

export const CATEGORY_META: Record<FarmingCategory, {
  label: string
  emoji: string
  description: string
  colorClass: string
  bgClass: string
  gradient: string
}> = {
  crop: {
    label: 'Crop Farming',
    emoji: '🌾',
    description: 'Wheat, Rice, Cotton & more',
    colorClass: 'text-forest-700',
    bgClass: 'bg-forest-50',
    gradient: 'from-forest-500 to-forest-700',
  },
  livestock: {
    label: 'Livestock',
    emoji: '🐄',
    description: 'Cattle, Buffalo, Goat',
    colorClass: 'text-harvest-700',
    bgClass: 'bg-harvest-50',
    gradient: 'from-harvest-400 to-harvest-600',
  },
  poultry: {
    label: 'Poultry Farming',
    emoji: '🐓',
    description: 'Broiler, Layer, Hatchery',
    colorClass: 'text-mango-600',
    bgClass: 'bg-orange-50',
    gradient: 'from-mango-500 to-orange-600',
  },
  fishery: {
    label: 'Fishery & Aquaculture',
    emoji: '🐟',
    description: 'Pond Farming, Marine Fishing',
    colorClass: 'text-sky-700',
    bgClass: 'bg-sky-50',
    gradient: 'from-sky-500 to-sky-700',
  },
}

interface CategoryState {
  category: FarmingCategory | null
  subCategories: string[]
  setCategory: (cat: FarmingCategory) => void
  setSubCategories: (subs: string[]) => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      category: null,
      subCategories: [],
      setCategory: (category) => set({ category }),
      setSubCategories: (subCategories) => set({ subCategories }),
    }),
    { name: 'sarpanch-category' }
  )
)
