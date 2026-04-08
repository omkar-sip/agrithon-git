// src/components/layout/AppShell.tsx — v4: non-fixed nav, proper flex layout
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import OfflineBanner from '../ui/OfflineBanner'
import FAB from '../ui/FAB'
import { useAppStore } from '../../store/useAppStore'
import { useLocation } from 'react-router-dom'

const NO_FAB_PATHS = ['/sarpanchgpt', '/login', '/splash', '/language', '/category', '/profile', '/scanner']

export default function AppShell() {
  const isOnline = useAppStore(s => s.isOnline)
  const { pathname } = useLocation()
  const showFab = !NO_FAB_PATHS.some(p => pathname.startsWith(p))

  return (
    <div className="page-root">
      {!isOnline && <OfflineBanner />}

      {/* Scrollable content area — takes all remaining height above the nav */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <Outlet />
        {/* Extra bottom padding so last content isn't clipped by center scanner protrusion */}
        <div className="h-8 shrink-0" aria-hidden />
      </main>

      {/* FAB sits above the nav, inside the flex flow but absolutely positioned within main */}
      {showFab && <FAB />}

      {/* Bottom nav is a flex child — NOT fixed. It naturally sits at the bottom. */}
      <BottomNav />
    </div>
  )
}
