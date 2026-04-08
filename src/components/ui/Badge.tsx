// src/components/ui/Badge.tsx
import clsx from 'clsx'
import type { StatusColor } from '../../utils/colorSystem'

interface BadgeProps {
  color: StatusColor
  label: string
  icon?: string
  size?: 'sm' | 'md'
}

const COLOR_CLASSES: Record<StatusColor, string> = {
  green:  'badge-green',
  yellow: 'badge-yellow',
  red:    'badge-red',
  blue:   'badge-blue',
  orange: 'badge-orange',
}

export default function Badge({ color, label, icon, size = 'md' }: BadgeProps) {
  return (
    <span className={clsx(
      COLOR_CLASSES[color],
      size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
      'inline-flex items-center gap-1 font-bold rounded-full'
    )}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  )
}
