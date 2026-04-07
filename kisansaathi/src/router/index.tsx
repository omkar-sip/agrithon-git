// src/router/index.tsx — v2 with correct flow
// Flow: /splash → /language → /category → /login → /profile (setup) → /
import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'

// ─── Eager-loaded (critical path) ─────────────────────────────────────────────
import SplashScreen   from '../pages/splash/SplashScreen'
import LanguageSelect from '../pages/splash/LanguageSelect'
import CategorySelect from '../pages/splash/CategorySelect'
import Login          from '../pages/auth/Login'
import Home           from '../pages/home/Home'

// ─── Lazy-loaded ───────────────────────────────────────────────────────────────
const Profile          = lazy(() => import('../pages/auth/Profile'))
const Settings         = lazy(() => import('../pages/settings/Settings'))
const CropHome         = lazy(() => import('../pages/crop/CropHome'))
const CropAdvisory     = lazy(() => import('../pages/crop/CropAdvisory'))
const WeatherAlerts    = lazy(() => import('../pages/crop/WeatherAlerts'))
const MarketPrices     = lazy(() => import('../pages/crop/MarketPrices'))
const SoilHealth       = lazy(() => import('../pages/crop/SoilHealth'))
const SchemesBenefits  = lazy(() => import('../pages/crop/SchemesBenefits'))
const CommunityIntel   = lazy(() => import('../pages/crop/CommunityIntel'))
const HyperlocalAlerts = lazy(() => import('../pages/crop/HyperlocalAlerts'))
const LivestockHome    = lazy(() => import('../pages/livestock/LivestockHome'))
const PoultryHome      = lazy(() => import('../pages/poultry/PoultryHome'))
const FisheryHome      = lazy(() => import('../pages/fishery/FisheryHome'))
const Forum            = lazy(() => import('../pages/community/Forum'))
const SarpanchGPT      = lazy(() => import('../pages/community/SarpanchGPT'))

// ─── Loading fallback ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-neutral-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-[3px] border-neutral-200 border-t-forest-900 rounded-full animate-spin" />
      <p className="text-neutral-500 text-sm">Loading...</p>
    </div>
  </div>
)

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

const router = createBrowserRouter([
  // ── Standalone routes (no shell) ─────────────────────────────────────────────
  { path: '/splash',       element: <SplashScreen /> },
  { path: '/language',     element: <LanguageSelect /> },
  { path: '/category',     element: <CategorySelect /> },
  { path: '/login',        element: <Login /> },
  { path: '/profile',      element: <S><Profile /></S> },
  { path: '/sarpanchgpt',  element: <S><SarpanchGPT /></S> },

  // ── Main app (with AppShell shell: TopBar + BottomNav) ───────────────────────
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },

      // Settings/My Profile (inside app shell with nav)
      // BottomNav "Profile" tab goes here
      { path: 'settings', element: <S><Settings /></S> },

      // Crop farming
      { path: 'crop',           element: <S><CropHome /></S> },
      { path: 'crop/advisory',  element: <S><CropAdvisory /></S> },
      { path: 'crop/weather',   element: <S><WeatherAlerts /></S> },
      { path: 'crop/market',    element: <S><MarketPrices /></S> },
      { path: 'crop/soil',      element: <S><SoilHealth /></S> },
      { path: 'crop/schemes',   element: <S><SchemesBenefits /></S> },
      { path: 'crop/community', element: <S><CommunityIntel /></S> },
      { path: 'crop/alerts',    element: <S><HyperlocalAlerts /></S> },

      // Livestock / Poultry / Fishery
      { path: 'livestock', element: <S><LivestockHome /></S> },
      { path: 'poultry',   element: <S><PoultryHome /></S> },
      { path: 'fishery',   element: <S><FisheryHome /></S> },

      // Community
      { path: 'forum',       element: <S><Forum /></S> },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/splash" replace /> },
])

export default function Router() {
  return <RouterProvider router={router} />
}
