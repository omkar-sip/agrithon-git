// src/components/ui/Card.tsx
import clsx from 'clsx'
import type { StatusColor } from '../../utils/colorSystem'
import type { ReactNode } from 'react'

interface CardProps {
  color?: StatusColor
  children: ReactNode
  className?: string
  onClick?: () => void
}

const CARD_CLASSES: Record<StatusColor, string> = {
  green:  'card-green',
  yellow: 'card-yellow',
  red:    'card-red',
  blue:   'card-blue',
  orange: 'card-orange',
}

export default function Card({ color, children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        color ? CARD_CLASSES[color] : 'bg-white rounded-2xl p-4 shadow-card',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform duration-100',
        className
      )}
    >
      {children}
    </div>
  )
}
