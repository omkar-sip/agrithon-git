import { useNavigate } from 'react-router-dom'
import { Search, Bell, Menu } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

export default function GlobalHeader() {
  const navigate = useNavigate()
  const farmer = useAuthStore(s => s.farmer)
  const initials = farmer?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return (
    <header
      className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 transition-all hover:bg-neutral-100 active:scale-95"
          >
            <Menu size={21} strokeWidth={2} />
          </button>

          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase leading-none tracking-[0.24em] text-neutral-300">
              AgroSathi
            </p>
            <h1 className="text-xl font-black leading-none text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Farmer
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search marketplace"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 transition-all hover:bg-neutral-100 active:scale-95"
            onClick={() => navigate('/marketplace')}
          >
            <Search size={19} strokeWidth={2} />
          </button>

          <button
            aria-label="Open notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 transition-all hover:bg-neutral-100 active:scale-95"
            onClick={() => navigate('/settings')}
          >
            <Bell size={19} strokeWidth={2} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-brand-500" />
          </button>

          <button
            aria-label="Open profile"
            onClick={() => navigate('/profile')}
            className="ml-1 h-10 w-10 overflow-hidden rounded-full border-2 border-neutral-50 shadow-sm transition-all active:scale-95"
          >
            {farmer?.photoURL ? (
              <img src={farmer.photoURL} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-100 text-xs font-bold text-brand-700">
                {initials || 'FR'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}