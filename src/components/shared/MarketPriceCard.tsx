// src/components/shared/MarketPriceCard.tsx
import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react'
import type { MarketPrice } from '../../store/useMarketStore'
import Card from '../ui/Card'
import type { StatusColor } from '../../utils/colorSystem'

interface MarketPriceCardProps {
  price: MarketPrice
  compact?: boolean
  onClick?: () => void
}

const TREND_CONFIG = {
  up: {
    Icon: TrendingUp,
    textColor: 'text-emerald-700',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
    label: '↑',
  },
  down: {
    Icon: TrendingDown,
    textColor: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    label: '↓',
  },
  stable: {
    Icon: Minus,
    textColor: 'text-amber-700',
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    label: '→',
  },
}

export default function MarketPriceCard({ price, compact = false, onClick }: MarketPriceCardProps) {
  const trend = TREND_CONFIG[price.trend] || TREND_CONFIG.stable
  const TrendIcon = trend.Icon

  if (compact) return (
    <Card color={price.color as StatusColor} onClick={onClick} className="shrink-0 w-36">
      <p className="font-display font-bold text-base text-neutral-900">{price.commodity}</p>
      <p className="font-mono font-bold text-xl text-forest-700">₹{price.pricePerQuintal.toLocaleString('en-IN')}</p>
      <p className="text-xs text-neutral-500">/quintal · {price.mandi}</p>
      <div className={`inline-flex items-center gap-1 mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${trend.bg} ${trend.textColor}`}>
        <TrendIcon size={10} />
        {price.trendPercent > 0 ? '+' : ''}{price.trendPercent}%
      </div>
    </Card>
  )

  return (
    <Card color={price.color as StatusColor} onClick={onClick}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-lg text-neutral-900 truncate">{price.commodity}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
            <MapPin size={11} />
            <span className="truncate">{price.mandi}</span>
            <span className="text-neutral-300">·</span>
            <span className="font-semibold text-neutral-600">{price.state}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono font-black text-2xl text-neutral-900">
            ₹{price.pricePerQuintal.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-neutral-400 font-semibold">/quintal</p>
          <div className={`inline-flex items-center gap-1 mt-1 text-xs font-bold px-2.5 py-1 rounded-full border ${trend.bg} ${trend.textColor} ${trend.border}`}>
            <TrendIcon size={11} />
            {price.trendPercent > 0 ? '+' : ''}{price.trendPercent}% this week
          </div>
        </div>
      </div>
    </Card>
  )
}
