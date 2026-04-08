// src/components/layout/BottomNav.tsx — v3 with center crop scanner button
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Mountain, ShoppingCart, User, ScanLine } from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { label: 'Home',    icon: Home,         path: '/',           exact: true  },
  { label: 'Fields',  icon: Mountain,     path: '/fields',     exact: false },
  // Center scanner button is rendered separately
  { label: 'Market',  icon: ShoppingCart,  path: '/marketplace', exact: false },
  { label: 'Profile', icon: User,          path: '/settings',    exact: false },
]

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav" style={{ overflow: 'visible' }}>
      <div className="bottom-nav-inner">
        {NAV_ITEMS.slice(0, 2).map(({ label, icon: Icon, path, exact }) => (
          <NavLink
            key={label}
            to={path}
            end={exact}
            className={({ isActive }) => clsx(
              'flex flex-col items-center justify-center flex-1 gap-1 transition-colors duration-150 relative',
              isActive ? 'text-brand-600' : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className="transition-all duration-150"
                />
                <span className={clsx(
                  'text-[10px] font-medium transition-all duration-150',
                  isActive ? 'text-brand-600' : 'text-neutral-400'
                )}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Center — Crop Scanner Button */}
        <div className="flex-1 relative">
          <button
            onClick={() => navigate('/scanner')}
            className="bottom-nav-center"
            aria-label="Scan Crop Disease"
          >
            <ScanLine size={24} strokeWidth={2} />
          </button>
        </div>

        {NAV_ITEMS.slice(2).map(({ label, icon: Icon, path, exact }) => (
          <NavLink
            key={label}
            to={path}
            end={exact}
            className={({ isActive }) => clsx(
              'flex flex-col items-center justify-center flex-1 gap-1 transition-colors duration-150 relative',
              isActive ? 'text-brand-600' : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className="transition-all duration-150"
                />
                <span className={clsx(
                  'text-[10px] font-medium transition-all duration-150',
                  isActive ? 'text-brand-600' : 'text-neutral-400'
                )}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
