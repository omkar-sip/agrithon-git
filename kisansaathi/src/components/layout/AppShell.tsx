// src/components/layout/AppShell.tsx — responsive: bottom nav mobile, sidebar desktop
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import OfflineBanner from '../ui/OfflineBanner'
import FAB from '../ui/FAB'
import { useAppStore } from '../../store/useAppStore'
import { useLocation } from 'react-router-dom'

// Pages where FAB should not be shown
const NO_FAB_PATHS = ['/sarpanchgpt', '/login', '/splash', '/language', '/category', '/profile']

export default function AppShell() {
  const isOnline  = useAppStore(s => s.isOnline)
  const { pathname } = useLocation()
  const showFab   = !NO_FAB_PATHS.some(p => pathname.startsWith(p))

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Top navigation */}
      <TopBar />

      {/* Offline warning */}
      {!isOnline && <OfflineBanner />}

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Ask AI FAB (all pages except chat) */}
      {showFab && <FAB />}

      {/* Bottom navigation (mobile) */}
      <BottomNav />
    </div>
  )
}
