// src/components/ui/Skeleton.tsx
import clsx from 'clsx'

interface SkeletonProps { className?: string; rows?: number }

export const SkeletonLine = ({ className }: { className?: string }) => (
  <div className={clsx('skeleton h-4 rounded-lg', className)} />
)

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={clsx('bg-white rounded-2xl p-4 shadow-card space-y-3', className)}>
    <SkeletonLine className="w-2/3 h-5" />
    <SkeletonLine className="w-full" />
    <SkeletonLine className="w-4/5" />
  </div>
)

export const SkeletonPriceCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-card w-36 shrink-0 space-y-2">
    <SkeletonLine className="w-16 h-4" />
    <SkeletonLine className="w-20 h-6" />
    <SkeletonLine className="w-12 h-3" />
  </div>
)

export default function Skeleton({ rows = 3, className }: SkeletonProps) {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
