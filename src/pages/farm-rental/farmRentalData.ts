export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export type WeekDay = typeof WEEK_DAYS[number]

export type FarmRentalCategoryId =
  | 'tractors'
  | 'labor'
  | 'transport'
  | 'irrigation'
  | 'drones'

export type AvailabilityStatus = 'Available' | 'Limited' | 'Not Available'

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
const availabilityStatuses: AvailabilityStatus[] = ['Available', 'Limited', 'Not Available']

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
    images: [tractorImg, harvesterImg, tractorImg],
    equipment: [
      {
        id: 'tractor-jd',
        name: 'John Deere 5050D',
        location: 'Mysuru, Karnataka',
        pricePerDay: 5200,
        pricePerHour: 850,
        images: [tractorImg, harvesterImg, tractorImg],
        condition: 'Excellent - 2023 model with regular service history.',
        experience: 'Owner has 15+ years of farming and mechanical expertise.',
        specifications: {
          brand: 'John Deere',
          model: '5050D',
          power: '50 HP',
          fuelType: 'Diesel',
          year: '2023',
        },
        availability: fullWeek,
        owner: { name: 'Raghavendra Gowda', phone: '+91 98450 11223' },
        reviews: [
          { user: 'Santosh M', rating: 5, comment: 'Very smooth operation and good pickup.', date: 'March 22, 2026' },
        ],
      },
      {
        id: 'rotavator-sk',
        name: 'Shaktiman Rotavator',
        location: 'Mandya, Karnataka',
        pricePerDay: 2900,
        pricePerHour: 460,
        images: [tractorImg, harvesterImg, tractorImg],
        condition: 'Like new with heavy-duty blades and clean maintenance.',
        experience: 'Used exclusively for precision land preparation.',
        specifications: {
          brand: 'Shaktiman',
          model: 'Regular Plus',
          year: '2021',
        },
        availability: fullWeek,
        owner: { name: 'Prakash N', phone: '+91 98861 44578' },
        reviews: [
          { user: 'Manju K', rating: 4.7, comment: 'Clean machine and fair hourly pricing.', date: 'March 10, 2026' },
        ],
      },
      {
        id: 'harvester-preet',
        name: 'Preet Combine Harvester',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 7800,
        pricePerHour: 1250,
        images: [harvesterImg, tractorImg, harvesterImg],
        condition: 'Premium condition with high grain cleaning efficiency.',
        experience: 'Operator has 10 seasons of harvesting experience across South India.',
        specifications: {
          brand: 'Preet',
          model: '987 Delux',
          power: '101 HP',
          fuelType: 'Diesel',
          year: '2021',
        },
        availability: fullWeek,
        owner: { name: 'Shivakumar H', phone: '+91 98458 33126' },
        reviews: [
          { user: 'Mahadeva P', rating: 4.9, comment: 'Fast harvest with very low grain loss.', date: 'March 27, 2026' },
        ],
      },
    ],
  },
  labor: {
    id: 'labor',
    title: 'Labor Services',
    subtitle: 'Experienced hands for your fields',
    bulletItems: ['Daily labor', 'Harvest teams', 'Machine operators'],
    images: [laborImg, laborImg, laborImg],
    equipment: [
      {
        id: 'skilled-operator',
        name: 'Skilled Machine Operator',
        location: 'Mysuru, Karnataka',
        pricePerDay: 1200,
        pricePerHour: 150,
        images: [laborImg, laborImg, laborImg],
        condition: 'Certified machinery operator with strong safety record.',
        experience: 'Expert in driving tractor brands and managing attachments.',
        specifications: {
          brand: 'Operator',
          model: 'Pro',
          year: 'N/A',
        },
        availability: fullWeek,
        owner: { name: 'Kiran Gowda', phone: '+91 98765 43210' },
        reviews: [
          { user: 'Harish R', rating: 4.8, comment: 'Punctual and very careful with field setup.', date: 'March 18, 2026' },
        ],
      },
      {
        id: 'harvest-team',
        name: 'Harvest Team (5 Members)',
        location: 'Mandya, Karnataka',
        pricePerDay: 3400,
        pricePerHour: 520,
        images: [laborImg, laborImg, laborImg],
        condition: 'Reliable crew for paddy, millet, and vegetable harvest cycles.',
        experience: 'Handled 100+ seasonal harvest jobs in nearby districts.',
        specifications: {
          brand: 'Field Crew',
          model: 'Seasonal Team',
          year: 'N/A',
        },
        availability: fullWeek,
        owner: { name: 'Savitha R', phone: '+91 99804 22345' },
        reviews: [
          { user: 'Gopal H', rating: 4.6, comment: 'Good pace and disciplined team.', date: 'March 12, 2026' },
        ],
      },
    ],
  },
  transport: {
    id: 'transport',
    title: 'Transport Services',
    subtitle: 'Reliable crop and equipment hauling',
    bulletItems: ['Trolleys', 'Mini trucks', 'Pickups'],
    images: [transportImg, transportImg, transportImg],
    equipment: [
      {
        id: 'mini-truck-tata',
        name: 'Tata Ace (Chota Hathi)',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 2200,
        pricePerHour: 350,
        images: [transportImg, transportImg, transportImg],
        condition: 'Covered payload area and well-maintained cargo deck.',
        experience: 'Driver knows all local mandi routes within a 100 km radius.',
        specifications: {
          brand: 'Tata',
          model: 'Ace Gold',
          fuelType: 'Diesel',
          year: '2023',
        },
        availability: fullWeek,
        owner: { name: 'Lokesh T', phone: '+91 99001 22334' },
        reviews: [
          { user: 'Nitin D', rating: 4.7, comment: 'On-time delivery and smooth loading support.', date: 'March 8, 2026' },
        ],
      },
      {
        id: 'tractor-trolley',
        name: 'Tractor Trolley Transport',
        location: 'Hassan, Karnataka',
        pricePerDay: 1800,
        pricePerHour: 300,
        images: [transportImg, transportImg, transportImg],
        condition: 'High-capacity trailer suited for produce and farm inputs.',
        experience: 'Owner regularly handles bulk transport during harvest weeks.',
        specifications: {
          brand: 'Swaraj',
          model: 'Heavy Trolley',
          fuelType: 'Diesel',
          year: '2022',
        },
        availability: fullWeek,
        owner: { name: 'Mahesh B', phone: '+91 99020 88451' },
        reviews: [
          { user: 'Arun P', rating: 4.5, comment: 'Useful for mandi trips and input movement.', date: 'February 15, 2026' },
        ],
      },
    ],
  },
  irrigation: {
    id: 'irrigation',
    title: 'Irrigation Services',
    subtitle: 'Sustainable water management',
    bulletItems: ['Pumps', 'Drip kits', 'Sprinklers'],
    images: [irrigationImg, irrigationImg, irrigationImg],
    equipment: [
      {
        id: 'water-pump-kirloskar',
        name: 'Diesel Water Pump (5 HP)',
        location: 'Mysuru, Karnataka',
        pricePerDay: 2100,
        pricePerHour: 350,
        images: [irrigationImg, irrigationImg, irrigationImg],
        condition: 'Reliable start with low fuel consumption and clean output.',
        experience: 'Handled by a technician with 20 years of borewell experience.',
        specifications: {
          brand: 'Kirloskar',
          model: '5 HP Mono',
          fuelType: 'Diesel',
          year: '2021',
        },
        availability: fullWeek,
        owner: { name: 'Ravi N', phone: '+91 97409 55124' },
        reviews: [
          { user: 'Prakash C', rating: 4.7, comment: 'Good discharge and low vibration.', date: 'March 21, 2026' },
        ],
      },
      {
        id: 'drip-installation-team',
        name: 'Drip Installation Team',
        location: 'Mandya, Karnataka',
        pricePerDay: 2600,
        pricePerHour: 420,
        images: [irrigationImg, irrigationImg, irrigationImg],
        condition: 'Field-ready setup crew for vegetable rows and orchards.',
        experience: 'Installed drip networks across 200+ acres in the last two seasons.',
        specifications: {
          brand: 'Netafim',
          model: 'Field Setup',
          year: '2024',
        },
        availability: fullWeek,
        owner: { name: 'Shwetha P', phone: '+91 99860 31852' },
        reviews: [
          { user: 'Deepak S', rating: 4.8, comment: 'Quick setup and even water spread.', date: 'March 17, 2026' },
        ],
      },
    ],
  },
  drones: {
    id: 'drones',
    title: 'Drone Services',
    subtitle: 'Precision aerial application',
    bulletItems: ['Spraying', 'Monitoring', 'Surveys'],
    images: [droneImg, droneImg, droneImg],
    equipment: [
      {
        id: 'spray-drone-dji',
        name: 'Agri Spray Drone (Agras T30)',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 5000,
        pricePerHour: 800,
        images: [droneImg, droneImg, droneImg],
        condition: 'Latest generation precision drone with multi-nozzle coverage.',
        experience: 'DGCA certified remote pilot with 500+ flight hours.',
        specifications: {
          brand: 'DJI',
          model: 'Agras T30',
          year: '2023',
        },
        availability: fullWeek,
        owner: { name: 'AgriDrone Solutions', phone: '+91 90000 11111' },
        reviews: [
          { user: 'Kavya N', rating: 4.9, comment: 'Precise spraying and excellent reporting.', date: 'March 9, 2026' },
        ],
      },
      {
        id: 'crop-survey-drone',
        name: 'Crop Survey Drone',
        location: 'Mysuru, Karnataka',
        pricePerDay: 4600,
        pricePerHour: 720,
        images: [droneImg, droneImg, droneImg],
        condition: 'Equipped for crop scouting, mapping, and stress monitoring.',
        experience: 'Pilot specializes in acreage estimation and canopy health analysis.',
        specifications: {
          brand: 'DJI',
          model: 'Phantom Agri',
          year: '2022',
        },
        availability: fullWeek,
        owner: { name: 'SkyFarm Tech', phone: '+91 98110 45678' },
        reviews: [
          { user: 'Renu K', rating: 4.7, comment: 'Useful data and clear problem spots captured.', date: 'February 16, 2026' },
        ],
      },
    ],
  },
}

export const FARM_RENTAL_ITEMS = Object.values(FARM_RENTAL_CATEGORIES).flatMap((category) => category.equipment)
export const farmRentalCategoryList = Object.values(FARM_RENTAL_CATEGORIES)

const hashString = (value: string) =>
  value.split('').reduce((hash, character) => ((hash * 33) ^ character.charCodeAt(0)) >>> 0, 5381)

export function getAvailabilityStatus(itemId: string): AvailabilityStatus {
  return availabilityStatuses[hashString(itemId) % availabilityStatuses.length]
}

export function getEstimatedDistanceKm(itemId: string) {
  return Number((((hashString(itemId) % 120) + 18) / 10).toFixed(1))
}

export function getFarmRentalItemById(itemId: string) {
  return FARM_RENTAL_ITEMS.find((item) => item.id === itemId)
}

export function getFarmRentalCategoryIdByItemId(itemId: string): FarmRentalCategoryId | null {
  const entry = Object.entries(FARM_RENTAL_CATEGORIES).find(([, category]) =>
    category.equipment.some((item) => item.id === itemId)
  )

  return entry ? (entry[0] as FarmRentalCategoryId) : null
}
