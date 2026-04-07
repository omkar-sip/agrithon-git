// src/utils/cropCalendar.ts
// Sowing & harvest timelines for major Indian crops

export interface CropCalendar {
  crop: string
  season: 'kharif' | 'rabi' | 'zaid'
  sowingMonths: number[]   // 1-indexed (1=Jan)
  harvestMonths: number[]
  durationDays: [number, number] // [min, max]
  icon: string
}

export const CROP_CALENDARS: CropCalendar[] = [
  { crop: 'Wheat',       season: 'rabi',   sowingMonths: [10,11],   harvestMonths: [3,4],    durationDays: [120,150], icon: '🌾' },
  { crop: 'Rice',        season: 'kharif', sowingMonths: [6,7],     harvestMonths: [10,11],  durationDays: [100,150], icon: '🌿' },
  { crop: 'Cotton',      season: 'kharif', sowingMonths: [5,6],     harvestMonths: [10,11],  durationDays: [150,180], icon: '☁️' },
  { crop: 'Soybean',     season: 'kharif', sowingMonths: [6,7],     harvestMonths: [10,11],  durationDays: [95,110],  icon: '🫘' },
  { crop: 'Mustard',     season: 'rabi',   sowingMonths: [10,11],   harvestMonths: [2,3],    durationDays: [110,140], icon: '🌼' },
  { crop: 'Maize',       season: 'kharif', sowingMonths: [5,6,7],   harvestMonths: [9,10],   durationDays: [85,105],  icon: '🌽' },
  { crop: 'Tomato',      season: 'zaid',   sowingMonths: [1,2,9,10],harvestMonths: [4,5,12], durationDays: [60,80],   icon: '🍅' },
  { crop: 'Onion',       season: 'rabi',   sowingMonths: [10,11],   harvestMonths: [3,4],    durationDays: [110,125], icon: '🧅' },
  { crop: 'Potato',      season: 'rabi',   sowingMonths: [10,11],   harvestMonths: [2,3],    durationDays: [70,90],   icon: '🥔' },
  { crop: 'Sugarcane',   season: 'kharif', sowingMonths: [2,3],     harvestMonths: [11,12],  durationDays: [270,365], icon: '🎋' },
  { crop: 'Groundnut',   season: 'kharif', sowingMonths: [6,7],     harvestMonths: [10,11],  durationDays: [100,130], icon: '🥜' },
  { crop: 'Chickpea',    season: 'rabi',   sowingMonths: [10,11],   harvestMonths: [2,3],    durationDays: [90,120],  icon: '🫘' },
]

export const getCropCalendar = (cropName: string) =>
  CROP_CALENDARS.find(c => c.crop.toLowerCase() === cropName.toLowerCase())

export const getCurrentGrowthStage = (sowingDate: Date, crop: string): string => {
  const cal = getCropCalendar(crop)
  if (!cal) return 'Unknown stage'
  const daysSown = Math.floor((Date.now() - sowingDate.getTime()) / (1000 * 60 * 60 * 24))
  const [min, max] = cal.durationDays
  const mid = (min + max) / 2
  if (daysSown < 15)        return 'Germination (0-15 days)'
  if (daysSown < mid * 0.3) return 'Vegetative (early growth)'
  if (daysSown < mid * 0.6) return 'Vegetative (leaf/stem development)'
  if (daysSown < mid * 0.8) return 'Flowering / Reproductive stage'
  if (daysSown < mid)       return 'Grain / Fruit filling'
  if (daysSown < max)       return 'Maturity (approaching harvest)'
  return 'Ready to harvest'
}

export const getCropsInSeason = (month: number): CropCalendar[] =>
  CROP_CALENDARS.filter(c => c.sowingMonths.includes(month))
