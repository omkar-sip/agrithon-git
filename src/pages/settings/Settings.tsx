// src/pages/settings/Settings.tsx — Profile + Sign Out
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Globe, Bell, LogOut, Shield, User, Wifi, WifiOff, Edit3 } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebase/firebaseConfig'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanguageStore, LANGUAGE_META } from '../../store/useLanguageStore'
import { useCategoryStore, CATEGORY_META } from '../../store/useCategoryStore'
import { useAppStore } from '../../store/useAppStore'
import toast from 'react-hot-toast'

export default function Settings() {
  const navigate = useNavigate()
  const { farmer, isAuthenticated, authProvider, signOut: clearStore } = useAuthStore()
  const { language } = useLanguageStore()
  const { category } = useCategoryStore()
  const { isOnline, pendingSyncCount } = useAppStore()

  const handleSignOut = async () => {
    try {
      await signOut(auth)       // Firebase sign out
    } catch {
      // Ignore if Firebase not connected (guest mode)
    } finally {
      clearStore()              // Clear Zustand store
      toast('Signed out successfully')
      navigate('/splash', { replace: true })
    }
  }

  return (
    <div className="page-container space-y-5">
      <h1 className="text-2xl font-bold text-neutral-900 pt-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
        Profile
      </h1>

      {/* ── Profile card ───────────────────────────────────────────── */}
      <div className="bg-brand-600 text-white rounded-2xl p-5">
        <div className="flex items-center gap-4">
          {farmer?.photoURL ? (
            <img
              src={farmer.photoURL}
              alt={farmer.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white/30 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/15 ring-2 ring-white/20 flex items-center justify-center shrink-0 select-none text-2xl">
              {category ? CATEGORY_META[category].emoji : '🌾'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg leading-tight truncate" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              {farmer?.name || 'Guest Farmer'}
            </p>
            <p className="text-brand-200 text-sm truncate">
              {farmer?.email || (farmer?.phone ? `+91 ${farmer.phone}` : 'Not logged in')}
            </p>
            {farmer?.village && (
              <p className="text-brand-300 text-xs mt-0.5 truncate">
                {farmer.village}{farmer.district ? `, ${farmer.district}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
          >
            <Edit3 size={15} />
          </button>
        </div>

        {/* Auth method badge */}
        {authProvider && authProvider !== 'guest' && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <Shield size={13} className="text-brand-200" />
            <span className="text-xs text-brand-200">
              Signed in with{' '}
              <span className="font-semibold text-white capitalize">{authProvider}</span>
            </span>
          </div>
        )}
      </div>

      {/* ── Settings groups ────────────────────────────────────────── */}
      {[
        {
          title: 'Farm Settings',
          items: [
            {
              icon: User,
              label: 'Edit Farm Profile',
              value: category ? CATEGORY_META[category].label : 'Set up profile',
              onClick: () => navigate('/profile'),
            },
            {
              icon: Shield,
              label: 'Farming Category',
              value: category ? `${CATEGORY_META[category].emoji} ${CATEGORY_META[category].label}` : 'Not set',
              onClick: () => navigate('/category'),
            },
          ],
        },
        {
          title: 'Preferences',
          items: [
            {
              icon: Globe,
              label: 'Language',
              value: LANGUAGE_META[language]?.englishName || 'English',
              onClick: () => navigate('/language'),
            },
            {
              icon: Bell,
              label: 'Push Notifications',
              value: 'Enabled for weather & prices',
              onClick: () => {},
            },
          ],
        },
        {
          title: 'Data',
          items: [
            {
              icon: isOnline ? Wifi : WifiOff,
              label: 'Network',
              value: isOnline ? 'Online — data syncing' : 'Offline — using cached data',
              onClick: undefined,
              valueColor: isOnline ? 'text-success-700' : 'text-warning-700',
            },
            {
              icon: Shield,
              label: 'Pending Sync',
              value: pendingSyncCount
                ? `${pendingSyncCount} records waiting to sync`
                : 'All data synced',
              onClick: undefined,
            },
          ],
        },
      ].map(section => (
        <section key={section.title}>
          <p className="section-label">{section.title}</p>
          <div className="bg-white border border-neutral-200 rounded-xl shadow-card overflow-hidden">
            {section.items.map((item, i) => (
              <div
                key={i}
                className={`list-item ${item.onClick ? 'cursor-pointer hover:bg-neutral-50 active:bg-neutral-100' : 'cursor-default'}`}
                onClick={item.onClick}
                role={item.onClick ? 'button' : undefined}
              >
                <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-neutral-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800">{item.label}</p>
                  {item.value && (
                    <p className={`text-xs mt-0.5 truncate ${(item as any).valueColor || 'text-neutral-400'}`}>
                      {item.value}
                    </p>
                  )}
                </div>
                {item.onClick && <ChevronRight size={15} className="text-neutral-300 shrink-0" />}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ── Version ───────────────────────────────────────────────── */}
      <p className="text-center text-xs text-neutral-300 font-mono">
        Sarpanch AI v1.0.0 · Built for Indian Farmers
      </p>

      {/* ── Sign In / Sign Out ────────────────────────────────────── */}
      {isAuthenticated ? (
        <button
          id="sign-out-btn"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 text-danger-600 font-semibold border border-danger-100 bg-danger-50 hover:bg-danger-100 rounded-xl py-3.5 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      ) : (
        <button
          id="sign-in-btn"
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 text-forest-700 font-semibold border border-forest-200 bg-forest-50 hover:bg-forest-100 rounded-xl py-3.5 transition-colors"
        >
          Sign In / Create Account
        </button>
      )}

      <div className="h-4" />
    </div>
  )
}
