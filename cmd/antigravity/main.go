export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export type WeekDay = typeof WEEK_DAYS[number]

export type FarmRentalCategoryId =
  | 'tractors'

export interface EquipmentReview {
  user: string
  rating: number
  comment: string
  date: string
}

export interface EquipmentSpecifications {
  brand: string
  model: string
  power?: string
  fuelType?: string
  year: string
}

export interface FarmEquipmentItem {
  id: string
  name: string
  location: string
  pricePerDay: number
  pricePerHour: number
  images: string[]
  specifications: EquipmentSpecifications
  availability: WeekDay[]
  owner: {
    name: string
    phone: string
  }
  reviews: EquipmentReview[]
}

export interface FarmRentalCategory {
  id: FarmRentalCategoryId
  title: string
  subtitle: string
  bulletItems: string[]
  images: string[]
  equipment: FarmEquipmentItem[]
}

const fullWeek: WeekDay[] = [...WEEK_DAYS]

const tractorImages = [
  '/assets/images/farm-rental/tractor.png',
]

export const FARM_RENTAL_CATEGORIES: Record<FarmRentalCategoryId, FarmRentalCategory> = {
  tractors: {
    id: 'tractors',
    title: 'Tractors',
    subtitle: 'Power-packed machines for every farm task',
    bulletItems: ['Utility tractors', 'Mini tractors', 'Heavy-duty tractors'],
    images: [tractorImages[0]],
    equipment: [
      {
        id: 'john-deere-5050d',
        name: 'John Deere 5050D',
        location: 'Mysuru, Karnataka',
        pricePerDay: 5200,
        pricePerHour: 850,
        images: [tractorImages[0]],
        specifications: {
          brand: 'John Deere',
          model: '5050D',
          power: '50 HP',
          fuelType: 'Diesel',
          year: '2022',
        },
        availability: fullWeek,
        owner: { name: 'Raghavendra Gowda', phone: '+91 98450 11223' },
        reviews: [
          { user: 'Santosh M', rating: 5, comment: 'Very smooth and fuel efficient tractor.', date: 'March 22, 2026' },
        ],
      },
      {
        id: 'mahindra-575-di',
        name: 'Mahindra 575 DI',
        location: 'Mandya, Karnataka',
        pricePerDay: 4800,
        pricePerHour: 780,
        images: [tractorImages[0]],
        specifications: {
          brand: 'Mahindra',
          model: '575 DI',
          power: '45 HP',
          fuelType: 'Diesel',
          year: '2021',
        },
        availability: fullWeek,
        owner: { name: 'Prakash N', phone: '+91 98861 44578' },
        reviews: [],
      },
      {
        id: 'swaraj-744-fe',
        name: 'Swaraj 744 FE',
        location: 'Hassan, Karnataka',
        pricePerDay: 4600,
        pricePerHour: 740,
        images: [tractorImages[0]],
        specifications: {
          brand: 'Swaraj',
          model: '744 FE',
          power: '48 HP',
          fuelType: 'Diesel',
          year: '2020',
        },
        availability: fullWeek,
        owner: { name: 'Mahesh B', phone: '+91 99020 88451' },
        reviews: [],
      },
      {
        id: 'new-holland-3630-tx',
        name: 'New Holland 3630 TX',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 5400,
        pricePerHour: 870,
        images: [tractorImages[0]],
        specifications: {
          brand: 'New Holland',
          model: '3630 TX',
          power: '55 HP',
          fuelType: 'Diesel',
          year: '2023',
        },
        availability: fullWeek,
        owner: { name: 'Srinivas V', phone: '+91 97411 76321' },
        reviews: [],
      },
    ],
  },
}

export const farmRentalCategoryList = Object.values(FARM_RENTAL_CATEGORIES)
