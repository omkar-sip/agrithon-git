// src/components/layout/BottomNav.tsx — v2 clean minimal
import { NavLink } from 'react-router-dom'
import { Home, TrendingUp, CloudSun, Bell, User } from 'lucide-react'
import { useAlertStore } from '../../store/useAlertStore'
import { useCategoryStore } from '../../store/useCategoryStore'
import clsx from 'clsx'

const NAV_ITEMS = [
  { label: 'Home',    icon: Home,       path: '/',            exact: true  },
  { label: 'Market',  icon: TrendingUp,  path: '/crop/market', exact: false },
  { label: 'Weather', icon: CloudSun,    path: '/crop/weather',exact: false },
  { label: 'Alerts',  icon: Bell,        path: '/settings',    exact: false },
  { label: 'Profile', icon: User,        path: '/profile',     exact: false },
]

export default function BottomNav() {
  const unread   = useAlertStore(s => s.unreadCount)
  const category = useCategoryStore(s => s.category)

  // Override market/weather paths based on category
  const getPath = (label: string) => {
    if (label === 'Market') {
      if (category === 'livestock') return '/livestock'
      if (category === 'fishery')   return '/fishery'
      return '/crop/market'
    }
    if (label === 'Weather') {
      if (category === 'fishery') return '/fishery/weather'
      return '/crop/weather'
    }
    return null
  }

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map(({ label, icon: Icon, path, exact }) => {
          const resolvedPath = getPath(label) || path
          return (
            <NavLink
              key={label}
              to={resolvedPath}
              end={exact}
              className={({ isActive }) => clsx(
                'flex flex-col items-center justify-center flex-1 gap-1 transition-colors duration-150 relative',
                isActive ? 'text-forest-900' : 'text-neutral-400 hover:text-neutral-600'
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.2 : 1.6}
                      className="transition-all duration-150"
                    />
                    {label === 'Alerts' && unread > 0 && (
                      <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </div>
                  <span className={clsx(
                    'text-[10px] font-medium transition-all duration-150',
                    isActive ? 'text-forest-900' : 'text-neutral-400'
                  )}>
                    {label}
                  </span>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-forest-900 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
