import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  Check,
  ChevronLeft,
  LocateFixed,
  MapPin,
  Mic,
  Navigation,
} from 'lucide-react'
import toast from 'react-hot-toast'
import FarmLocationMap from '../../components/shared/FarmLocationMap'
import FarmingCategorySelector from '../../components/shared/FarmingCategorySelector'
import { apiAvailability } from '../../config/env'
import {
  createUserProfilePayload,
  saveFarmerProfile,
} from '../../services/firebase/firestoreService'
import { CATEGORY_META, useCategoryStore } from '../../store/useCategoryStore'
import { useAuthStore } from '../../store/useAuthStore'
import { DEFAULT_LOCATION_COORDS, reverseGeocodeLocation } from '../../services/weatherService'

const LAND_OPTIONS = [
  { value: '<1', label: 'Less than 1 acre' },
  { value: '1-5', label: '1 - 5 acres' },
  { value: '5-10', label: '5 - 10 acres' },
  { value: '10+', label: '10+ acres' },
] as const

const WATER_OPTIONS = [
  { value: 'rain-fed', label: 'Rain Dependent', desc: 'Depends on monsoons' },
  { value: 'irrigated', label: 'Canal / Bore Well', desc: 'Tube well, canal, drip' },
  { value: 'pond', label: 'Pond / Reservoir', desc: 'Farm pond or reservoir' },
] as const

type Land = '<1' | '1-5' | '5-10' | '10+'
type Water = 'rain-fed' | 'irrigated' | 'pond'
type Coords = { lat: number; lon: number }

const STEPS = ['Farming Type', 'Your Info', 'Farm Location', 'Farm Details', 'Confirm']

export default function Profile() {
  const navigate = useNavigate()
  const { farmer, setFarmer } = useAuthStore()
  const { category, setCategory } = useCategoryStore()

  const [step, setStep] = useState(0)
  const [name, setName] = useState(farmer?.name || '')
  const [village, setVillage] = useState(farmer?.village || '')
  const [district, setDistrict] = useState(farmer?.district || '')
  const [state, setState] = useState(farmer?.state || '')
  const [land, setLand] = useState<Land>(farmer?.landHolding || '<1')
  const [water, setWater] = useState<Water>(farmer?.waterSource || 'rain-fed')
  const [coords, setCoords] = useState<Coords>(farmer?.coords || DEFAULT_LOCATION_COORDS)
  const [hasPickedLocation, setHasPickedLocation] = useState(Boolean(farmer?.coords))
  const [locationLabel, setLocationLabel] = useState(
    [farmer?.village, farmer?.district, farmer?.state].filter(Boolean).join(', ') || 'Tap the map or detect your farm location'
  )
  const [isResolvingLocation, setIsResolvingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasPickedLocation) return
    setLocationLabel([village, district, state].filter(Boolean).join(', ') || 'Farm coordinates selected')
  }, [district, hasPickedLocation, state, village])

  const canProceed = () => {
    if (step === 0) return Boolean(category)
    if (step === 1) return name.trim().length >= 2
    if (step === 2) return Boolean(hasPickedLocation || state || district || village)
    return true
  }

  const applyResolvedLocation = async (nextCoords: Coords) => {
    setCoords(nextCoords)
    setHasPickedLocation(true)
    setIsResolvingLocation(true)
    setLocationError(null)

    try {
      const result = await reverseGeocodeLocation(nextCoords.lat, nextCoords.lon)
      setVillage(prev => prev || result.village)
      setDistrict(prev => prev || result.district)
      setState(prev => prev || result.state)
      setLocationLabel(result.label)
    } catch {
      setLocationError('Location details could not be fetched. You can still fill them manually.')
      setLocationLabel('Farm coordinates selected')
    } finally {
      setIsResolvingLocation(false)
    }
  }

  const handleDetectLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported on this device.')
      return
    }

    setLocationError(null)
    setIsResolvingLocation(true)

    navigator.geolocation.getCurrentPosition(
      position => {
        void applyResolvedLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      error => {
        setIsResolvingLocation(false)
        setLocationError(error.message)
        toast.error('Could not detect your location.')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5 * 60 * 1000 }
    )
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(current => current + 1)
    else void handleComplete()
  }

  const persistProfile = async (profile: Parameters<typeof setFarmer>[0]) => {
    if (!apiAvailability.hasFirebaseConfig || !farmer?.uid || farmer.uid === 'local') return

    await saveFarmerProfile(
      farmer.uid,
      createUserProfilePayload(
        {
          ...farmer,
          ...profile,
          uid: farmer.uid,
        },
        { provider: useAuthStore.getState().authProvider, isProfileComplete: true }
      )
    )
  }

  const handleComplete = async () => {
    const resolvedCategory = category || 'crop'
    if (!category) setCategory(resolvedCategory)

    const nextProfile = {
      uid: farmer?.uid || 'local',
      name: name.trim() || 'Farmer',
      coords: hasPickedLocation ? coords : null,
      state,
      district,
      village,
      landHolding: land,
      waterSource: water,
      crops: farmer?.crops || [],
      language: farmer?.language || 'en',
      category: resolvedCategory,
    } as const

    setFarmer(nextProfile)

    try {
      await persistProfile(nextProfile)
    } catch (error) {
      console.error('[Firestore] Failed to save farmer profile.', error)
      toast.error('Profile saved locally. Firestore sync failed, please check Firebase setup.')
    }

    toast.success(`Welcome to Sarpanch AI, ${name.trim() || 'Farmer'}!`)
    navigate('/', { replace: true })
  }

  const handleSkip = async () => {
    const resolvedCategory = category || 'crop'
    if (!category) setCategory(resolvedCategory)

    const nextProfile = {
      uid: farmer?.uid || 'local',
      name: farmer?.name || 'Farmer',
      coords: null,
      state: '',
      district: '',
      village: '',
      landHolding: '<1',
      waterSource: 'rain-fed',
      crops: farmer?.crops || [],
      language: farmer?.language || 'en',
      category: resolvedCategory,
    } as const

    setFarmer(nextProfile)

    try {
      await persistProfile(nextProfile)
    } catch (error) {
      console.error('[Firestore] Failed to save skipped farmer profile.', error)
      toast.error('Profile saved locally. Firestore sync failed, please check Firebase setup.')
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="page-root bg-white">
      <div className="px-4 pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(current => current - 1)}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <ChevronLeft size={20} className="text-neutral-600" />
            </button>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <ChevronLeft size={20} className="text-neutral-600" />
            </button>
          )}
          <h1 className="text-lg font-bold text-neutral-900 flex-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
            Profile Setup
          </h1>
          <button onClick={() => void handleSkip()} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
            Skip
          </button>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex-1 flex gap-1.5">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  index <= step ? 'bg-brand-500' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-400 font-medium ml-2 shrink-0">{step + 1}/{STEPS.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="px-6 py-4 max-w-lg mx-auto w-full space-y-5"
          >
            {step === 0 && (
              <FarmingCategorySelector
                category={category}
                onSelectCategory={setCategory}
              />
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    {farmer?.photoURL ? (
                      <img src={farmer.photoURL} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-100" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center text-3xl select-none ring-4 ring-neutral-50">
                        F
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-card">
                      <Camera size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label">Your name</label>
                  <div className="relative">
                    <input
                      autoFocus
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={event => setName(event.target.value)}
                      placeholder="Ramesh Kumar"
                      className="input pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 min-h-fit">
                      <Mic size={16} className="text-neutral-400" />
                    </button>
                  </div>
                </div>

                {farmer?.phone && (
                  <div>
                    <label className="input-label">Mobile Number</label>
                    <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
                      <span className="text-base text-neutral-900">+91 {farmer.phone}</span>
                      <Check size={18} className="text-success-500" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-[28px] border border-neutral-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Choose your exact farm location</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Drag the pin or tap the map to improve hyper-local forecasts.
                      </p>
                    </div>
                    <button
                      onClick={handleDetectLocation}
                      type="button"
                      className="btn-secondary px-3 py-2 text-xs min-h-fit shrink-0"
                    >
                      <LocateFixed size={14} />
                      Detect My Location
                    </button>
                  </div>

                  <FarmLocationMap center={coords} onChange={nextCoords => void applyResolvedLocation(nextCoords)} />

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/80 border border-neutral-200 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Latitude</p>
                      <p className="text-sm font-bold text-neutral-900">{coords.lat.toFixed(5)}</p>
                    </div>
                    <div className="rounded-2xl bg-white/80 border border-neutral-200 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Longitude</p>
                      <p className="text-sm font-bold text-neutral-900">{coords.lon.toFixed(5)}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                        <Navigation size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Detected locality</p>
                        <p className="text-sm font-semibold text-neutral-900 break-words">
                          {isResolvingLocation ? 'Resolving location details...' : locationLabel}
                        </p>
                        {locationError && <p className="text-xs text-warning-700 mt-1">{locationError}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="input-label">Village / Town</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={village}
                      onChange={event => setVillage(event.target.value)}
                      placeholder="e.g. Bhuj"
                      className="input pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 min-h-fit">
                      <MapPin size={16} className="text-neutral-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={event => setDistrict(event.target.value)}
                    placeholder="e.g. Nashik"
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={event => setState(event.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="input"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="input-label">How much land do you farm?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAND_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setLand(option.value)}
                        className={`py-3.5 px-4 rounded-xl border-2 text-sm font-semibold text-left flex items-center justify-between transition-all duration-150 active:scale-[0.98] ${
                          land === option.value
                            ? 'border-brand-500 bg-brand-50 text-brand-800'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {option.label}
                        {land === option.value && <Check size={14} className="text-brand-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Primary water source</label>
                  <div className="space-y-2">
                    {WATER_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setWater(option.value)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 active:scale-[0.99] ${
                          water === option.value
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${water === option.value ? 'text-brand-800' : 'text-neutral-900'}`}>
                            {option.label}
                          </p>
                          <p className={`text-xs mt-0.5 ${water === option.value ? 'text-brand-600/70' : 'text-neutral-400'}`}>
                            {option.desc}
                          </p>
                        </div>
                        {water === option.value ? (
                          <Check size={16} className="text-brand-600 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-neutral-300 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                  All set!
                </h2>
                <p className="text-sm text-neutral-500">Review your profile details:</p>

                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3">
                  {[
                    { label: 'Name', value: name || 'Not set' },
                    { label: 'Location', value: [village, district, state].filter(Boolean).join(', ') || 'Not set' },
                    { label: 'Coordinates', value: hasPickedLocation ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : 'Not set' },
                    { label: 'Land', value: LAND_OPTIONS.find(option => option.value === land)?.label || land },
                    { label: 'Water', value: WATER_OPTIONS.find(option => option.value === water)?.label || water },
                    { label: 'Category', value: category ? CATEGORY_META[category].label : 'Crop Farming' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
                      <span className="text-sm text-neutral-500">{item.label}</span>
                      <span className="text-sm font-semibold text-neutral-900 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="px-6 py-4 bg-white border-t border-neutral-100 max-w-lg mx-auto w-full"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <button onClick={handleNext} disabled={!canProceed()} className="btn-brand">
          {step < STEPS.length - 1 ? 'Continue' : 'Start Using Sarpanch AI'}
        </button>
      </div>
    </div>
  )
}
