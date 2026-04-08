// src/components/layout/BottomNav.tsx — streamlined 5-item functional bar
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Mountain, ShoppingCart, ScanLine, Tractor } from 'lucide-react'
import clsx from 'clsx'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Home',    icon: Home,         path: '/',           exact: true  },
  { label: 'Fields',  icon: Mountain,     path: '/fields',     exact: false },
  // Center scanner button is rendered separately
  { label: 'Market',  icon: ShoppingCart,  path: '/marketplace', exact: false },
  { label: 'Rental',  icon: Tractor,       path: '/farm-rental', exact: false },
]

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav" style={{ overflow: 'visible' }}>
      <div className="bottom-nav-inner shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {NAV_ITEMS.slice(0, 2).map(({ label, icon: Icon, path, exact }) => (
          <NavLink
            key={label}
            to={path}
            end={exact}
            className={({ isActive }) => clsx(
              'flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300 relative',
              isActive ? 'text-brand-600' : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={clsx('transition-all', isActive && 'scale-110')}
                />
                <span className={clsx(
                  'font-bold transition-all text-[10px]',
                  isActive ? 'text-brand-600' : 'text-neutral-400'
                )}>
                  {label}
                </span>
                {isActive && (
                  <motion.span 
                    layoutId="nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-brand-600 rounded-full" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Center — Crop Scanner Button */}
        <div className="flex-1 relative h-full flex items-center justify-center">
          <button
            onClick={() => navigate('/scanner')}
            className="bottom-nav-center shadow-[0_8px_25px_rgba(249,115,22,0.4)]"
            aria-label="Scan Crop Disease"
          >
            <ScanLine size={28} strokeWidth={2.5} />
          </button>
        </div>

        {NAV_ITEMS.slice(2).map(({ label, icon: Icon, path, exact }) => (
          <NavLink
            key={label}
            to={path}
            end={exact}
            className={({ isActive }) => clsx(
              'flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300 relative',
              isActive ? 'text-brand-600' : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={clsx('transition-all', isActive && 'scale-110')}
                />
                <span className={clsx(
                  'font-bold transition-all text-[10px]',
                  isActive ? 'text-brand-600' : 'text-neutral-400'
                )}>
                  {label}
                </span>
                {isActive && (
                  <motion.span 
                    layoutId="nav-indicator-2"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-brand-600 rounded-full" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
