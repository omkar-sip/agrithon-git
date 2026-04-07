// src/components/shared/MarketPriceCard.tsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { MarketPrice } from '../../store/useMarketStore'
import Card from '../ui/Card'
import type { StatusColor } from '../../utils/colorSystem'

interface MarketPriceCardProps {
  price: MarketPrice
  compact?: boolean
  onClick?: () => void
}

export default function MarketPriceCard({ price, compact = false, onClick }: MarketPriceCardProps) {
  const TrendIcon = price.trend === 'up' ? TrendingUp : price.trend === 'down' ? TrendingDown : Minus
  const trendColor = price.trend === 'up' ? 'text-forest-600' : price.trend === 'down' ? 'text-danger-500' : 'text-soil-400'

  if (compact) return (
    <Card color={price.color as StatusColor} onClick={onClick} className="shrink-0 w-36">
      <p className="font-display font-bold text-base text-soil-800">{price.commodity}</p>
      <p className="font-mono font-bold text-xl text-forest-700">₹{price.pricePerQuintal.toLocaleString('en-IN')}</p>
      <p className="text-xs text-soil-500">/quintal · {price.mandi}</p>
      <div className={`flex items-center gap-1 mt-1 text-sm ${trendColor}`}>
        <TrendIcon size={12} />
        <span>{price.trendPercent > 0 ? '+' : ''}{price.trendPercent}%</span>
      </div>
    </Card>
  )

  return (
    <Card color={price.color as StatusColor} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-bold text-lg text-soil-800">{price.commodity}</p>
          <p className="text-soil-500 text-sm">{price.mandi} · {price.state}</p>
        </div>
        <div className="text-right">
          <p className="font-mono font-bold text-xl text-forest-700">
            ₹{price.pricePerQuintal.toLocaleString('en-IN')}
          </p>
          <div className={`flex items-center gap-1 justify-end text-sm ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{price.trendPercent > 0 ? '+' : ''}{price.trendPercent}% this week</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
