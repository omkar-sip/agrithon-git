import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, ChevronRight, Edit3, Globe, LogOut, Shield, User, Wifi, WifiOff } from 'lucide-react'
import { signOut } from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth } from '../../services/firebase/firebaseConfig'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import { CATEGORY_META, useCategoryStore } from '../../store/useCategoryStore'
import { LANGUAGE_META, useLanguageStore } from '../../store/useLanguageStore'

export default function Settings() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const farmer = useAuthStore((state) => state.farmer)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const authProvider = useAuthStore((state) => state.authProvider)
  const clearStore = useAuthStore((state) => state.signOut)
  const language = useLanguageStore((state) => state.language)
  const category = useCategoryStore((state) => state.category)
  const isOnline = useAppStore((state) => state.isOnline)
  const pendingSyncCount = useAppStore((state) => state.pendingSyncCount)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch {
      // Ignore if Firebase not connected (guest mode)
    } finally {
      clearStore()
      toast(t('toast.signedOut'))
      navigate('/splash', { replace: true })
    }
  }

  return (
    <div className="page-container space-y-5">
      <h1 className="text-2xl font-bold text-neutral-900 pt-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
        {t('settings.title')}
      </h1>

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
              {farmer?.name || t('common.guestFarmer')}
            </p>
            <p className="text-brand-200 text-sm truncate">
              {farmer?.email || (farmer?.phone ? `+91 ${farmer.phone}` : t('common.notLoggedIn'))}
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

        {authProvider && authProvider !== 'guest' && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <Shield size={13} className="text-brand-200" />
            <span className="text-xs text-brand-200">
              {t('settings.signedInWith', { provider: authProvider })}
            </span>
          </div>
        )}
      </div>

      {[
        {
          title: t('settings.farmSettings'),
          items: [
            {
              icon: User,
              label: t('settings.editFarmProfile'),
              value: category ? CATEGORY_META[category].label : t('settings.editFarmProfileValue'),
              onClick: () => navigate('/profile'),
            },
            {
              icon: Shield,
              label: t('settings.farmingCategory'),
              value: category ? `${CATEGORY_META[category].emoji} ${CATEGORY_META[category].label}` : t('settings.notSet'),
              onClick: () => navigate('/category'),
            },
          ],
        },
        {
          title: t('settings.preferences'),
          items: [
            {
              icon: Globe,
              label: t('common.language'),
              value: LANGUAGE_META[language]?.englishName || 'English',
              onClick: () => navigate('/language'),
            },
            {
              icon: Bell,
              label: t('settings.pushNotifications'),
              value: t('settings.pushNotificationsValue'),
              onClick: () => undefined,
            },
          ],
        },
        {
          title: t('settings.data'),
          items: [
            {
              icon: isOnline ? Wifi : WifiOff,
              label: t('settings.network'),
              value: isOnline ? t('settings.networkOnline') : t('settings.networkOffline'),
              onClick: undefined,
              valueColor: isOnline ? 'text-success-700' : 'text-warning-700',
            },
            {
              icon: Shield,
              label: t('settings.pendingSync'),
              value: pendingSyncCount
                ? t('settings.pendingSyncCount', { count: pendingSyncCount })
                : t('settings.allSynced'),
              onClick: undefined,
            },
          ],
        },
      ].map((section) => (
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
                    <p className={`text-xs mt-0.5 truncate ${'valueColor' in item ? item.valueColor || 'text-neutral-400' : 'text-neutral-400'}`}>
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

      <p className="text-center text-xs text-neutral-300 font-mono">
        {t('settings.version')}
      </p>

      {isAuthenticated ? (
        <button
          id="sign-out-btn"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 text-danger-600 font-semibold border border-danger-100 bg-danger-50 hover:bg-danger-100 rounded-xl py-3.5 transition-colors"
        >
          <LogOut size={16} />
          {t('common.signOut')}
        </button>
      ) : (
        <button
          id="sign-in-btn"
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 text-forest-700 font-semibold border border-forest-200 bg-forest-50 hover:bg-forest-100 rounded-xl py-3.5 transition-colors"
        >
          {t('settings.signInCta')}
        </button>
      )}

      <div className="h-4" />
    </div>
  )
}
