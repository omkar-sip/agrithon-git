// src/components/ui/Button.tsx
import clsx from 'clsx'
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'market'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:   'bg-forest-500 text-white shadow-card active:bg-forest-700 disabled:bg-forest-300',
  secondary: 'border-2 border-forest-500 text-forest-700 bg-white active:bg-forest-50',
  ghost:     'text-forest-600 bg-transparent underline underline-offset-2',
  danger:    'bg-danger-500 text-white shadow-card active:bg-danger-700',
  market:    'bg-harvest-400 text-white shadow-card active:bg-harvest-600',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'text-sm px-4 py-2.5 min-h-[40px] rounded-xl',
  md: 'text-base px-5 py-3.5 min-h-[52px] rounded-2xl',
  lg: 'text-lg px-6 py-4 min-h-[56px] rounded-2xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'font-display font-bold flex items-center justify-center gap-2',
        'transition-all duration-150 active:scale-[0.97]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
}
