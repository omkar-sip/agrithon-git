// src/components/shared/AlertBanner.tsx
import { X, AlertCircle, Info, AlertTriangle, Zap } from 'lucide-react'
import type { StatusColor } from '../../utils/colorSystem'
import type { ReactNode } from 'react'

interface AlertBannerProps {
  color: StatusColor
  title: string
  body?: string
  onDismiss?: () => void
  icon?: ReactNode
  compact?: boolean
}

const ICONS: Record<StatusColor, ReactNode> = {
  green:  <Info size={18} />,
  yellow: <AlertTriangle size={18} />,
  red:    <AlertCircle size={18} />,
  blue:   <Info size={18} />,
  orange: <Zap size={18} />,
}

const COLORS: Record<StatusColor, { bg: string; border: string; text: string; icon: string }> = {
  green:  { bg: 'bg-forest-50',  border: 'border-l-4 border-forest-500',  text: 'text-forest-800', icon: 'text-forest-600' },
  yellow: { bg: 'bg-harvest-50', border: 'border-l-4 border-harvest-400', text: 'text-harvest-800', icon: 'text-harvest-600' },
  red:    { bg: 'bg-red-50',     border: 'border-l-4 border-danger-500',  text: 'text-danger-800',  icon: 'text-danger-600' },
  blue:   { bg: 'bg-sky-50',     border: 'border-l-4 border-sky-500',     text: 'text-sky-800',    icon: 'text-sky-600' },
  orange: { bg: 'bg-orange-50',  border: 'border-l-4 border-mango-500',   text: 'text-mango-800',  icon: 'text-mango-600' },
}

export default function AlertBanner({ color, title, body, onDismiss, icon, compact = false }: AlertBannerProps) {
  const c = COLORS[color]
  return (
    <div className={`${c.bg} ${c.border} rounded-2xl ${compact ? 'px-3 py-2.5' : 'px-4 py-3'} flex items-start gap-3 shadow-card`}>
      <span className={`${c.icon} shrink-0 mt-0.5`}>{icon || ICONS[color]}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-display font-bold ${compact ? 'text-sm' : 'text-base'} ${c.text} leading-tight`}>{title}</p>
        {body && <p className={`font-body ${compact ? 'text-xs' : 'text-sm'} text-soil-600 mt-0.5 leading-snug`}>{body}</p>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 text-soil-400 hover:text-soil-600 transition-colors p-0.5">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
