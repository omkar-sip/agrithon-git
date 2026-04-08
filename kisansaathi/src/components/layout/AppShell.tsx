// src/components/layout/AppShell.tsx — v5: Global Header + Bottom Nav
import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import GlobalHeader from './GlobalHeader'
import OfflineBanner from '../ui/OfflineBanner'
import FAB from '../ui/FAB'
import { useAppStore } from '../../store/useAppStore'

const NO_FAB_PATHS = ['/sarpanchgpt', '/login', '/splash', '/language', '/category', '/profile', '/scanner']
const NO_HEADER_PATHS = ['/splash', '/language', '/category', '/login']

export default function AppShell() {
  const isOnline = useAppStore(s => s.isOnline)
  const { pathname } = useLocation()

  const showFab = !NO_FAB_PATHS.some(p => pathname.startsWith(p))
  const showHeader = !NO_HEADER_PATHS.some(p => pathname.startsWith(p))

  return (
    <div className="app-stage">
      <div className="page-root app-shell-frame">
        {!isOnline && <OfflineBanner />}

        {showHeader && <GlobalHeader />}

        {/* Scrollable content area */}
        <main className="relative flex-1 overflow-y-auto bg-neutral-50 no-scrollbar">
          <Outlet />
          {/* Extra bottom padding for protruding center nav button */}
          <div className="h-24 shrink-0" aria-hidden />
        </main>

        {/* FAB sits above the nav */}
        {showFab && <FAB />}

        {/* Bottom nav */}
        <BottomNav />
      </div>
    </div>
  )
}
