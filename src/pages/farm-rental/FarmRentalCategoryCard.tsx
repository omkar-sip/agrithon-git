import { type FarmRentalCategory } from './farmRentalData'

interface FarmRentalCategoryCardProps {
  category: FarmRentalCategory
  onOpen: () => void
}

export default function FarmRentalCategoryCard({ category, onOpen }: FarmRentalCategoryCardProps) {
  return (
    <button
      onClick={onOpen}
      className="
        w-full text-left bg-white border border-neutral-200 rounded-2xl shadow-card
        overflow-hidden transition-all duration-150 hover:shadow-card-md active:scale-[0.99]
      "
    >
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-neutral-50 border-b border-neutral-100">
        {category.images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`${category.title} photo ${index + 1}`}
            className="w-full h-20 rounded-xl object-cover"
            loading="lazy"
          />
        ))}
      </div>

      <div className="p-4 space-y-2.5">
        <h2 className="font-display font-bold text-lg text-neutral-900">{category.title}</h2>
        <p className="text-sm text-neutral-500">{category.subtitle}</p>

        <ul className="space-y-1.5">
          {category.bulletItems.map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  )
}

