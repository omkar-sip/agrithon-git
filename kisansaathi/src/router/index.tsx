// src/router/index.tsx
import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'

// ─── Eager-loaded (critical path) ─────────────────────────────────────────
import SplashScreen    from '../pages/splash/SplashScreen'
import LanguageSelect  from '../pages/splash/LanguageSelect'
import CategorySelect  from '../pages/splash/CategorySelect'
import Login           from '../pages/auth/Login'
import Home            from '../pages/home/Home'

// ─── Lazy-loaded (separate chunks per category) ────────────────────────────
const Profile        = lazy(() => import('../pages/auth/Profile'))
const CropHome       = lazy(() => import('../pages/crop/CropHome'))
const CropAdvisory   = lazy(() => import('../pages/crop/CropAdvisory'))
const WeatherAlerts  = lazy(() => import('../pages/crop/WeatherAlerts'))
const MarketPrices   = lazy(() => import('../pages/crop/MarketPrices'))
const SoilHealth     = lazy(() => import('../pages/crop/SoilHealth'))
const SchemesBenefits = lazy(() => import('../pages/crop/SchemesBenefits'))
const CommunityIntel = lazy(() => import('../pages/crop/CommunityIntel'))
const HyperlocalAlerts = lazy(() => import('../pages/crop/HyperlocalAlerts'))
const LivestockHome  = lazy(() => import('../pages/livestock/LivestockHome'))
const PoultryHome    = lazy(() => import('../pages/poultry/PoultryHome'))
const FisheryHome    = lazy(() => import('../pages/fishery/FisheryHome'))
const Forum          = lazy(() => import('../pages/community/Forum'))
const SarpanchGPT    = lazy(() => import('../pages/community/SarpanchGPT'))
const Settings       = lazy(() => import('../pages/settings/Settings'))

// ─── Loading fallback ──────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-cream">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-forest-200 border-t-forest-500 rounded-full animate-spin" />
      <p className="font-body text-forest-600 text-base">Loading...</p>
    </div>
  </div>
)

const router = createBrowserRouter([
  // ─── Onboarding (no shell) ──────────────────────────────────────────────
  { path: '/splash',    element: <SplashScreen /> },
  { path: '/language',  element: <LanguageSelect /> },
  { path: '/category',  element: <CategorySelect /> },
  { path: '/login',     element: <Login /> },
  { path: '/profile',   element: <Suspense fallback={<PageLoader />}><Profile /></Suspense> },

  // ─── Main app (with AppShell) ───────────────────────────────────────────
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true,          element: <Home /> },
      // Crop
      { path: 'crop',         element: <Suspense fallback={<PageLoader />}><CropHome /></Suspense> },
      { path: 'crop/advisory', element: <Suspense fallback={<PageLoader />}><CropAdvisory /></Suspense> },
      { path: 'crop/weather', element: <Suspense fallback={<PageLoader />}><WeatherAlerts /></Suspense> },
      { path: 'crop/market',  element: <Suspense fallback={<PageLoader />}><MarketPrices /></Suspense> },
      { path: 'crop/soil',    element: <Suspense fallback={<PageLoader />}><SoilHealth /></Suspense> },
      { path: 'crop/schemes', element: <Suspense fallback={<PageLoader />}><SchemesBenefits /></Suspense> },
      { path: 'crop/community', element: <Suspense fallback={<PageLoader />}><CommunityIntel /></Suspense> },
      { path: 'crop/alerts',  element: <Suspense fallback={<PageLoader />}><HyperlocalAlerts /></Suspense> },
      // Livestock
      { path: 'livestock',    element: <Suspense fallback={<PageLoader />}><LivestockHome /></Suspense> },
      // Poultry
      { path: 'poultry',      element: <Suspense fallback={<PageLoader />}><PoultryHome /></Suspense> },
      // Fishery
      { path: 'fishery',      element: <Suspense fallback={<PageLoader />}><FisheryHome /></Suspense> },
      // Community
      { path: 'forum',        element: <Suspense fallback={<PageLoader />}><Forum /></Suspense> },
      { path: 'sarpanchgpt',  element: <Suspense fallback={<PageLoader />}><SarpanchGPT /></Suspense> },
      // Settings
      { path: 'settings',     element: <Suspense fallback={<PageLoader />}><Settings /></Suspense> },
    ]
  },

  // ─── Catch-all ──────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/splash" replace /> },
])

export default function Router() {
  return <RouterProvider router={router} />
}
