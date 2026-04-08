export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export type WeekDay = typeof WEEK_DAYS[number]

export type FarmRentalCategoryId =
  | 'tractors'
  | 'land-preparation'
  | 'irrigation'
  | 'harvesting'

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

const pexelsImage = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop`

const fullWeek: WeekDay[] = [...WEEK_DAYS]

const tractorImages = [
  pexelsImage(102723),
  pexelsImage(2253413),
  pexelsImage(19860977),
  pexelsImage(20461949),
  pexelsImage(20461951),
  pexelsImage(8244644),
]

const landPrepImages = [
  pexelsImage(10849317),
  pexelsImage(21711143),
  pexelsImage(12442358),
  pexelsImage(15832684),
  pexelsImage(3071940),
  pexelsImage(12653266),
]

const irrigationImages = [
  pexelsImage(34182297),
  pexelsImage(12532707),
  pexelsImage(11678434),
  pexelsImage(2132250),
  pexelsImage(11849975),
  pexelsImage(3401951),
]

const harvestingImages = [
  pexelsImage(17075355),
  pexelsImage(13239503),
  pexelsImage(5114782),
  pexelsImage(1595104),
  pexelsImage(2165688),
  pexelsImage(2233729),
]

export const FARM_RENTAL_CATEGORIES: Record<FarmRentalCategoryId, FarmRentalCategory> = {
  tractors: {
    id: 'tractors',
    title: 'Tractors',
    subtitle: 'Power-packed machines for every farm task',
    bulletItems: ['Utility tractors', 'Mini tractors', 'Heavy-duty tractors'],
    images: tractorImages.slice(0, 3),
    equipment: [
      {
        id: 'john-deere-5050d',
        name: 'John Deere 5050D',
        location: 'Mysuru, Karnataka',
        pricePerDay: 5200,
        pricePerHour: 850,
        images: [tractorImages[0], tractorImages[1], tractorImages[2]],
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
          { user: 'Kiran P', rating: 4.5, comment: 'Reached on time and handled heavy soil well.', date: 'March 14, 2026' },
          { user: 'Naveen H', rating: 4.8, comment: 'Owner support was excellent throughout.', date: 'February 28, 2026' },
        ],
      },
      {
        id: 'mahindra-575-di',
        name: 'Mahindra 575 DI',
        location: 'Mandya, Karnataka',
        pricePerDay: 4800,
        pricePerHour: 780,
        images: [tractorImages[3], tractorImages[0], tractorImages[4]],
        specifications: {
          brand: 'Mahindra',
          model: '575 DI',
          power: '45 HP',
          fuelType: 'Diesel',
          year: '2021',
        },
        availability: fullWeek,
        owner: { name: 'Prakash N', phone: '+91 98861 44578' },
        reviews: [
          { user: 'Harish R', rating: 4.7, comment: 'Good pulling power for rotavator work.', date: 'March 18, 2026' },
          { user: 'Darshan K', rating: 4.6, comment: 'Clean machine and fair hourly rate.', date: 'March 03, 2026' },
          { user: 'Yogesh S', rating: 4.9, comment: 'Reliable during full-day operations.', date: 'February 20, 2026' },
        ],
      },
      {
        id: 'swaraj-744-fe',
        name: 'Swaraj 744 FE',
        location: 'Hassan, Karnataka',
        pricePerDay: 4600,
        pricePerHour: 740,
        images: [tractorImages[1], tractorImages[5], tractorImages[2]],
        specifications: {
          brand: 'Swaraj',
          model: '744 FE',
          power: '48 HP',
          fuelType: 'Diesel',
          year: '2020',
        },
        availability: fullWeek,
        owner: { name: 'Mahesh B', phone: '+91 99020 88451' },
        reviews: [
          { user: 'Shivappa L', rating: 4.5, comment: 'Great grip on wet fields.', date: 'March 10, 2026' },
          { user: 'Manju K', rating: 4.4, comment: 'Affordable and easy to operate.', date: 'February 27, 2026' },
          { user: 'Arun P', rating: 4.8, comment: 'No downtime during rental period.', date: 'February 15, 2026' },
        ],
      },
      {
        id: 'new-holland-3630-tx',
        name: 'New Holland 3630 TX',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 5400,
        pricePerHour: 870,
        images: [tractorImages[4], tractorImages[3], tractorImages[0]],
        specifications: {
          brand: 'New Holland',
          model: '3630 TX',
          power: '55 HP',
          fuelType: 'Diesel',
          year: '2023',
        },
        availability: fullWeek,
        owner: { name: 'Srinivas V', phone: '+91 97411 76321' },
        reviews: [
          { user: 'Gopal H', rating: 4.9, comment: 'Strong and stable for heavy loads.', date: 'March 26, 2026' },
          { user: 'Nitin D', rating: 4.7, comment: 'Perfect for long working hours.', date: 'March 08, 2026' },
          { user: 'Latha M', rating: 4.8, comment: 'Booking and handover were very smooth.', date: 'February 26, 2026' },
        ],
      },
    ],
  },
  'land-preparation': {
    id: 'land-preparation',
    title: 'Land Preparation Equipment',
    subtitle: 'Build healthy soil and prepare uniform seed beds',
    bulletItems: ['Plough', 'Rotavator', 'Harrow', 'Cultivator', 'Leveler'],
    images: landPrepImages.slice(0, 3),
    equipment: [
      {
        id: 'rotavator',
        name: 'Rotavator',
        location: 'Mandya, Karnataka',
        pricePerDay: 2900,
        pricePerHour: 460,
        images: [landPrepImages[0], landPrepImages[1], landPrepImages[3]],
        specifications: {
          brand: 'Shaktiman',
          model: 'Regular Plus 1.8M',
          power: 'Compatible with 45-55 HP',
          year: '2022',
        },
        availability: fullWeek,
        owner: { name: 'Nagaraj P', phone: '+91 99004 12456' },
        reviews: [
          { user: 'Rakesh M', rating: 4.7, comment: 'Fine soil finish after single pass.', date: 'March 24, 2026' },
          { user: 'Veeru S', rating: 4.6, comment: 'Blades were in very good condition.', date: 'March 05, 2026' },
          { user: 'Pramod K', rating: 4.8, comment: 'Saved one full day of land prep.', date: 'February 18, 2026' },
        ],
      },
      {
        id: 'cultivator',
        name: 'Cultivator',
        location: 'Mysuru, Karnataka',
        pricePerDay: 1800,
        pricePerHour: 320,
        images: [landPrepImages[2], landPrepImages[4], landPrepImages[0]],
        specifications: {
          brand: 'FieldKing',
          model: 'Heavy Duty Spring Cultivator',
          power: 'Compatible with 35-50 HP',
          year: '2021',
        },
        availability: fullWeek,
        owner: { name: 'Sampath R', phone: '+91 98451 66543' },
        reviews: [
          { user: 'Anand T', rating: 4.5, comment: 'Good for weed control between rows.', date: 'March 19, 2026' },
          { user: 'Bharath G', rating: 4.4, comment: 'Strong frame and easy coupling.', date: 'February 25, 2026' },
          { user: 'Lokesh N', rating: 4.7, comment: 'Worked well even in compact soil.', date: 'February 11, 2026' },
        ],
      },
      {
        id: 'disc-harrow',
        name: 'Disc Harrow',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 2600,
        pricePerHour: 420,
        images: [landPrepImages[5], landPrepImages[1], landPrepImages[2]],
        specifications: {
          brand: 'Sonalika Implements',
          model: 'Offset Disc Harrow',
          power: 'Compatible with 45-60 HP',
          year: '2020',
        },
        availability: fullWeek,
        owner: { name: 'Girish H', phone: '+91 94480 22771' },
        reviews: [
          { user: 'Chandu P', rating: 4.6, comment: 'Great clod breaking performance.', date: 'March 15, 2026' },
          { user: 'Mohan R', rating: 4.5, comment: 'Helpful for preparing paddy fields.', date: 'March 02, 2026' },
          { user: 'Shankar J', rating: 4.8, comment: 'Strong discs and clean operation.', date: 'February 17, 2026' },
        ],
      },
      {
        id: 'plough',
        name: 'Plough',
        location: 'Hassan, Karnataka',
        pricePerDay: 1500,
        pricePerHour: 280,
        images: [landPrepImages[3], landPrepImages[0], landPrepImages[4]],
        specifications: {
          brand: 'Mahindra Implements',
          model: 'MB Plough 2 Bottom',
          power: 'Compatible with 40-55 HP',
          year: '2019',
        },
        availability: fullWeek,
        owner: { name: 'Umesh V', phone: '+91 98807 76211' },
        reviews: [
          { user: 'Devaraj M', rating: 4.4, comment: 'Deep tillage quality was very good.', date: 'March 12, 2026' },
          { user: 'Raju K', rating: 4.3, comment: 'Fair pricing and prompt delivery.', date: 'February 23, 2026' },
          { user: 'Vinod S', rating: 4.6, comment: 'Useful for first pass land opening.', date: 'February 09, 2026' },
        ],
      },
    ],
  },
  irrigation: {
    id: 'irrigation',
    title: 'Irrigation Equipment',
    subtitle: 'Water = life of crops',
    bulletItems: ['Water pumps', 'Drip irrigation kits', 'Sprinklers', 'Pipes'],
    images: irrigationImages.slice(0, 3),
    equipment: [
      {
        id: 'water-pump',
        name: 'Water Pump',
        location: 'Mysuru, Karnataka',
        pricePerDay: 2100,
        pricePerHour: 350,
        images: [irrigationImages[0], irrigationImages[3], irrigationImages[1]],
        specifications: {
          brand: 'Kirloskar',
          model: 'KI 5HP Mono Block',
          power: '5 HP',
          fuelType: 'Diesel',
          year: '2021',
        },
        availability: fullWeek,
        owner: { name: 'Ravi N', phone: '+91 97409 55124' },
        reviews: [
          { user: 'Prakash C', rating: 4.7, comment: 'Good discharge and low vibration.', date: 'March 21, 2026' },
          { user: 'Nagesh R', rating: 4.5, comment: 'Perfect for borewell irrigation.', date: 'March 01, 2026' },
          { user: 'Renu K', rating: 4.6, comment: 'Owner helped with setup quickly.', date: 'February 16, 2026' },
        ],
      },
      {
        id: 'sprinkler-system',
        name: 'Sprinkler System',
        location: 'Mandya, Karnataka',
        pricePerDay: 1700,
        pricePerHour: 290,
        images: [irrigationImages[1], irrigationImages[0], irrigationImages[4]],
        specifications: {
          brand: 'Jain Irrigation',
          model: 'Rainport Sprinkler Set',
          year: '2022',
        },
        availability: fullWeek,
        owner: { name: 'Shwetha P', phone: '+91 99860 31852' },
        reviews: [
          { user: 'Deepak S', rating: 4.8, comment: 'Even water spread across the plot.', date: 'March 17, 2026' },
          { user: 'Karthik M', rating: 4.6, comment: 'No leakage in pipes and joints.', date: 'March 04, 2026' },
          { user: 'Ganesh V', rating: 4.7, comment: 'Setup was fast and effective.', date: 'February 19, 2026' },
        ],
      },
      {
        id: 'drip-irrigation-kit',
        name: 'Drip Irrigation Kit',
        location: 'Hassan, Karnataka',
        pricePerDay: 2300,
        pricePerHour: 380,
        images: [irrigationImages[2], irrigationImages[1], irrigationImages[5]],
        specifications: {
          brand: 'Netafim',
          model: 'Inline Drip Starter Kit',
          year: '2023',
        },
        availability: fullWeek,
        owner: { name: 'Pranav G', phone: '+91 99019 67320' },
        reviews: [
          { user: 'Nanda R', rating: 4.9, comment: 'Reduced water usage significantly.', date: 'March 25, 2026' },
          { user: 'Harini M', rating: 4.8, comment: 'Great for vegetable rows.', date: 'March 09, 2026' },
          { user: 'Rohit A', rating: 4.7, comment: 'All emitters worked properly.', date: 'February 24, 2026' },
        ],
      },
      {
        id: 'solar-pump',
        name: 'Solar Pump',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 2600,
        pricePerHour: 430,
        images: [irrigationImages[4], irrigationImages[5], irrigationImages[0]],
        specifications: {
          brand: 'Shakti Pumps',
          model: 'Solar Surface Pump 3HP',
          power: '3 HP',
          fuelType: 'Solar',
          year: '2022',
        },
        availability: fullWeek,
        owner: { name: 'Vinay T', phone: '+91 99643 22910' },
        reviews: [
          { user: 'Suresh B', rating: 4.8, comment: 'Runs consistently on sunny days.', date: 'March 13, 2026' },
          { user: 'Kavya N', rating: 4.6, comment: 'Good option for remote fields.', date: 'March 02, 2026' },
          { user: 'Manohar D', rating: 4.7, comment: 'Very low operating cost.', date: 'February 14, 2026' },
        ],
      },
    ],
  },
  harvesting: {
    id: 'harvesting',
    title: 'Harvesting Equipment',
    subtitle: 'Cut losses and harvest at peak quality',
    bulletItems: ['Combine harvester', 'Reaper machine', 'Thresher', 'Baler'],
    images: harvestingImages.slice(0, 3),
    equipment: [
      {
        id: 'combine-harvester',
        name: 'Combine Harvester',
        location: 'Mandya, Karnataka',
        pricePerDay: 7800,
        pricePerHour: 1250,
        images: [harvestingImages[0], harvestingImages[1], harvestingImages[2]],
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
          { user: 'Ravikiran M', rating: 4.8, comment: 'Operator was skilled and punctual.', date: 'March 11, 2026' },
          { user: 'Sunitha R', rating: 4.7, comment: 'Excellent for paddy and wheat fields.', date: 'February 28, 2026' },
        ],
      },
      {
        id: 'reaper-machine',
        name: 'Reaper Machine',
        location: 'Mysuru, Karnataka',
        pricePerDay: 3400,
        pricePerHour: 560,
        images: [harvestingImages[3], harvestingImages[0], harvestingImages[4]],
        specifications: {
          brand: 'Kubota',
          model: 'Reaper Binder Pro',
          power: '10 HP',
          fuelType: 'Diesel',
          year: '2020',
        },
        availability: fullWeek,
        owner: { name: 'Ramesh K', phone: '+91 98802 88745' },
        reviews: [
          { user: 'Thimmaiah S', rating: 4.7, comment: 'Clean cutting and easy maneuvering.', date: 'March 20, 2026' },
          { user: 'Devika P', rating: 4.5, comment: 'Useful in smaller fragmented plots.', date: 'March 06, 2026' },
          { user: 'Bhuvan N', rating: 4.6, comment: 'Well-maintained and fuel efficient.', date: 'February 22, 2026' },
        ],
      },
      {
        id: 'thresher',
        name: 'Thresher',
        location: 'Hassan, Karnataka',
        pricePerDay: 3200,
        pricePerHour: 520,
        images: [harvestingImages[2], harvestingImages[5], harvestingImages[1]],
        specifications: {
          brand: 'Dasmesh',
          model: 'Multi-Crop Thresher',
          power: '35 HP',
          fuelType: 'Diesel',
          year: '2019',
        },
        availability: fullWeek,
        owner: { name: 'Anil C', phone: '+91 97390 14528' },
        reviews: [
          { user: 'Nagappa R', rating: 4.6, comment: 'Throughput was very good for wheat.', date: 'March 16, 2026' },
          { user: 'Rohan M', rating: 4.5, comment: 'Minimal grain damage observed.', date: 'March 04, 2026' },
          { user: 'Girish L', rating: 4.7, comment: 'Owner provided quick service support.', date: 'February 13, 2026' },
        ],
      },
      {
        id: 'baler',
        name: 'Baler',
        location: 'Tumakuru, Karnataka',
        pricePerDay: 4100,
        pricePerHour: 660,
        images: [harvestingImages[4], harvestingImages[3], harvestingImages[0]],
        specifications: {
          brand: 'John Deere',
          model: 'Square Baler 338',
          power: 'Compatible with 50+ HP',
          year: '2022',
        },
        availability: fullWeek,
        owner: { name: 'Kishore V', phone: '+91 98444 99218' },
        reviews: [
          { user: 'Malli K', rating: 4.8, comment: 'Bales were tight and uniform.', date: 'March 23, 2026' },
          { user: 'Ashok R', rating: 4.6, comment: 'Saved labor and storage time.', date: 'March 07, 2026' },
          { user: 'Lalitha S', rating: 4.7, comment: 'Great machine for straw handling.', date: 'February 21, 2026' },
        ],
      },
    ],
  },
}

export const farmRentalCategoryList = Object.values(FARM_RENTAL_CATEGORIES)

