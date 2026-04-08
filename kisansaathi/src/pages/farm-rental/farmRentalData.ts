export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export type WeekDay = typeof WEEK_DAYS[number]

export type FarmRentalCategoryId =
  | 'tractors'
  | 'labor'
  | 'transport'
  | 'irrigation'
  | 'drones'

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
  condition: string
  experience: string
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

const tractorImg = '/assets/images/farm-rental/tractor.png'
const harvesterImg = '/assets/images/farm-rental/harvester.png'
const laborImg = '/assets/images/farm-rental/labor.png'
const transportImg = '/assets/images/farm-rental/transport.png'
const irrigationImg = '/assets/images/farm-rental/irrigation.png'
const droneImg = '/assets/images/farm-rental/drone.png'

export const FARM_RENTAL_CATEGORIES: Record<FarmRentalCategoryId, FarmRentalCategory> = {
  tractors: {
    id: 'tractors',
    title: 'Equipment Rental',
    subtitle: 'Modern machinery for efficient farming',
    bulletItems: ['Tractors', 'Rotavators', 'Harvesting'],
    images: [tractorImg],
    equipment: [
      {
        id: 'tractor-jd',
        name: 'John Deere 5050D',
        location: 'Mysuru, Karnataka',
        pricePerDay: 5200,
        pricePerHour: 850,
        images: [tractorImg],
        condition: 'Excellent - 2023 Model, Regular Service',
        experience: 'Owner has 15+ years of farming & mechanical expertise.',
        specifications: { brand: 'John Deere', model: '5050D', power: '50 HP', fuelType: 'Diesel', year: '2023' },
        availability: fullWeek,
        owner: { name: 'Raghavendra Gowda', phone: '+91 98450 11223' },
        reviews: [{ user: 'Santosh M', rating: 5, comment: 'Very smooth operation.', date: 'March 22, 2026' }],
      },
      {
        id: 'rotavator-sk',
        name: 'Shaktiman Rotavator',
        location: 'Mandya, Karnataka',
        pricePerDay: 2900,
        pricePerHour: 460,
        images: [tractorImg],
        condition: 'Like New - Heavy duty blades, well maintained',
        experience: 'Used exclusively for high-precision land preparation.',
        specifications: { brand: 'Shaktiman', model: 'Regular Plus', year: '2021' },
        availability: fullWeek,
        owner: { name: 'Prakash N', phone: '+91 98861 44578' },
        reviews: [],
      },
      {
        id: 'harvester-preet',
        name: 'Preet Combine Harvester',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 7800,
        pricePerHour: 1250,
        images: [harvesterImg],
        condition: 'Premium Condition - High grain cleaning efficiency',
        experience: 'Operator has 10 seasons of experience across South India.',
        specifications: { brand: 'Preet', model: '987 Delux', power: '101 HP', fuelType: 'Diesel', year: '2021' },
        availability: fullWeek,
        owner: { name: 'Shivakumar H', phone: '+91 98458 33126' },
        reviews: [],
      },
    ],
  },
  labor: {
    id: 'labor',
    title: 'Labor Services',
    subtitle: 'Experienced hands for your fields',
    bulletItems: ['Daily labor', 'Harvest teams', 'Operators'],
    images: [laborImg],
    equipment: [
      {
        id: 'skilled-operator',
        name: 'Skilled Machine Operator',
        location: 'Mysuru, Karnataka',
        pricePerDay: 1200,
        pricePerHour: 150,
        images: [laborImg],
        condition: 'Certified Heavy Machinery License Holder',
        experience: 'Expert in driving all tractor brands and attachment management.',
        specifications: { brand: 'Operator', model: 'Pro', year: 'N/A' },
        availability: fullWeek,
        owner: { name: 'Kiran Gowda', phone: '+91 98765 43210' },
        reviews: [],
      },
    ],
  },
  transport: {
    id: 'transport',
    title: 'Transport Services',
    subtitle: 'Reliable crop & equipment hauling',
    bulletItems: ['Trolleys', 'Mini trucks', 'Pickups'],
    images: [transportImg],
    equipment: [
      {
        id: 'mini-truck-tata',
        name: 'Tata Ace (Chota Hathi)',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 2200,
        pricePerHour: 350,
        images: [transportImg],
        condition: 'Good Running Condition - Covered payload area',
        experience: 'Driver knows all local mandi routes within 100km radius.',
        specifications: { brand: 'Tata', model: 'Ace Gold', fuelType: 'Diesel', year: '2023' },
        availability: fullWeek,
        owner: { name: 'Lokesh T', phone: '+91 99001 22334' },
        reviews: [],
      },
    ],
  },
  irrigation: {
    id: 'irrigation',
    title: 'Irrigation Services',
    subtitle: 'Sustainable water management',
    bulletItems: ['Pumps', 'Drip kits', 'Sprinklers'],
    images: [irrigationImg],
    equipment: [
      {
        id: 'water-pump-kirloskar',
        name: 'Diesel Water Pump (5 HP)',
        location: 'Mysuru, Karnataka',
        pricePerDay: 2100,
        pricePerHour: 350,
        images: [irrigationImg],
        condition: 'Reliable Start - Low fuel consumption',
        experience: 'Handled by a technician with 20 years of borewell experience.',
        specifications: { brand: 'Kirloskar', model: '5 HP Mono', fuelType: 'Diesel', year: '2021' },
        availability: fullWeek,
        owner: { name: 'Ravi N', phone: '+91 97409 55124' },
        reviews: [],
      },
    ],
  },
  drones: {
    id: 'drones',
    title: 'Drone Services',
    subtitle: 'Precision aerial application',
    bulletItems: ['Spraying', 'Monitoring', 'Surveys'],
    images: [droneImg],
    equipment: [
      {
        id: 'spray-drone-dji',
        name: 'Agri-Spray Drone (Agras T30)',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 5000,
        pricePerHour: 800,
        images: [droneImg],
        condition: 'Latest Gen - Multi-nozzle precision tech',
        experience: 'DGCA Certified Remote Pilot with 500+ flight hours.',
        specifications: { brand: 'DJI', model: 'Agras T30', year: '2023' },
        availability: fullWeek,
        owner: { name: 'AgriDrone Solutions', phone: '+91 90000 11111' },
        reviews: [],
      },
    ],
  },
}

export const farmRentalCategoryList = Object.values(FARM_RENTAL_CATEGORIES)
