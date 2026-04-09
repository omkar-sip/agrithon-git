import { useEffect, useState, startTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Droplets,
  IndianRupee,
  Leaf,
  Loader2,
  MapPin,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageTransition from '../../components/layout/PageTransition'
import Card from '../../components/ui/Card'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { generateCropAdvisory } from '../../services/gemini/geminiClient'
import { geocodeLocationQuery, resolveLocationByIp, type ResolvedLocation } from '../../services/locationService'
import { reverseGeocodeLocation } from '../../services/weatherService'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useLocationStore } from '../../store/useLocationStore'
import { useWeatherStore } from '../../store/useWeatherStore'
import { formatLocalizedNumber } from '../../i18n'
import { useWeather } from '../../hooks/useWeather'
import type { CropAdvisoryCrop, CropAdvisoryResult } from '../../types/cropAdvisory'

type SoilType = 'Sandy' | 'Clay' | 'Loamy' | 'Black'
type WaterAvailability = 'Low' | 'Medium' | 'High'
type Season = 'Kharif' | 'Rabi' | 'Zaid'

const SOIL_TYPES: SoilType[] = ['Sandy', 'Clay', 'Loamy', 'Black']
const WATER_LEVELS: WaterAvailability[] = ['Low', 'Medium', 'High']
const SEASONS: Season[] = ['Kharif', 'Rabi', 'Zaid']

const surfaceMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24 } },
}

const budgetCompatibilityTone = {
  'Fits Well': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Manageable: 'bg-brand-50 text-brand-700 border-brand-100',
  Stretch: 'bg-amber-50 text-amber-700 border-amber-100',
  'Over Budget': 'bg-red-50 text-red-700 border-red-100',
  'Not provided': 'bg-neutral-100 text-neutral-600 border-neutral-200',
} as const

const riskTone = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  High: 'bg-red-50 text-red-700 border-red-100',
} as const

const waterSourceToAvailability = (waterSource?: string): WaterAvailability => {
  if (waterSource === 'irrigated') return 'High'
  if (waterSource === 'pond') return 'Medium'
  return 'Low'
}

const landHoldingToAcres = (landHolding?: string): number | '' => {
  if (landHolding === '<1') return 0.8
  if (landHolding === '1-5') return 3
  if (landHolding === '5-10') return 7
  if (landHolding === '10+') return 12
  return ''
}

const getRainfallHint = (rainfallMm: number): string => {
  if (rainfallMm >= 12) return 'heavy rainfall'
  if (rainfallMm >= 4) return 'moderate rainfall'
  if (rainfallMm > 0) return 'light rainfall'
  return 'mostly dry conditions'
}

const buildStoredLocation = (params: {
  district?: string
  state?: string
  village?: string
  coords?: { lat: number; lon: number } | null
  fallbackLabel?: string
}): ResolvedLocation | null => {
  if (!params.coords) return null

  const label =
    [params.village, params.district, params.state].filter(Boolean).join(', ') ||
    params.fallbackLabel ||
    'Current farm location'

  return {
    label,
    district: params.district || params.village || '',
    state: params.state || '',
    coords: params.coords,
    source: 'profile',
  }
}

const requestBrowserLocation = () =>
  new Promise<{ lat: number; lon: number }>((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      error => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  })

export default function CropAdvisory() {
  const farmer = useAuthStore(state => state.farmer)
  const language = useLanguageStore(state => state.language)
  const storedDistrict = useLocationStore(state => state.district)
  const storedState = useLocationStore(state => state.state)
  const storedVillage = useLocationStore(state => state.village)
  const storedCoords = useLocationStore(state => state.coords)
  const setLocation = useLocationStore(state => state.setLocation)
  const fetchAndSetWeather = useWeatherStore(state => state.fetchAndSetWeather)
  const weatherCoords = useWeatherStore(state => state.lastCoords)
  const { current, isLoading: isWeatherLoading } = useWeather()

  const [soilType, setSoilType] = useState<SoilType>('Loamy')
  const [waterAvailability, setWaterAvailability] = useState<WaterAvailability>(
    waterSourceToAvailability(farmer?.waterSource),
  )
  const [season, setSeason] = useState<Season>('Kharif')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [soilPh, setSoilPh] = useState<string>('')
  const [landSize, setLandSize] = useState<number | ''>(landHoldingToAcres(farmer?.landHolding))
  const [budget, setBudget] = useState<number | ''>('')
  const [manualLocation, setManualLocation] = useState(
    [storedDistrict || farmer?.district, storedState || farmer?.state].filter(Boolean).join(', '),
  )
  const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto')
  const [resolvedLocation, setResolvedLocation] = useState<ResolvedLocation | null>(null)
  const [isResolvingLocation, setIsResolvingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [advisory, setAdvisory] = useState<CropAdvisoryResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')

  useEffect(() => {
    const initialLocation =
      buildStoredLocation({
        district: storedDistrict || farmer?.district,
        state: storedState || farmer?.state,
        village: storedVillage || farmer?.village,
        coords: storedCoords || farmer?.coords || weatherCoords,
        fallbackLabel: current?.location,
      }) ||
      (current && weatherCoords
        ? {
            label: current.location || 'Current farm location',
            district: storedDistrict || farmer?.district || '',
            state: storedState || farmer?.state || '',
            coords: weatherCoords,
            source: 'profile' as const,
          }
        : null)

    if (initialLocation) {
      setResolvedLocation(currentLocation => currentLocation ?? initialLocation)
    }
  }, [
    current,
    farmer?.coords,
    farmer?.district,
    farmer?.state,
    farmer?.village,
    storedCoords,
    storedDistrict,
    storedState,
    storedVillage,
    weatherCoords,
  ])

  const applyResolvedLocation = async (location: ResolvedLocation) => {
    setResolvedLocation(location)
    setLocationError('')

    setLocation({
      district: location.district,
      state: location.state,
      village: location.source === 'profile' ? storedVillage || farmer?.village || '' : '',
      coords: location.coords,
      source:
        location.source === 'manual'
          ? 'manual'
          : location.source === 'profile'
            ? 'profile'
            : 'device',
    })

    setManualLocation([location.district, location.state].filter(Boolean).join(', ') || location.label)

    await fetchAndSetWeather(location.coords.lat, location.coords.lon, { force: true })
  }

  const handleUseMyLocation = async () => {
    setLocationMode('auto')
    setIsResolvingLocation(true)
    setLocationError('')

    try {
      const coords = await requestBrowserLocation()
      const reverse = await reverseGeocodeLocation(coords.lat, coords.lon).catch(() => null)

      await applyResolvedLocation({
        label: reverse?.label || current?.location || 'Detected farm location',
        district: reverse?.district || storedDistrict || farmer?.district || '',
        state: reverse?.state || storedState || farmer?.state || '',
        coords,
        source: 'device',
      })

      toast.success('Using your current location.')
    } catch (error) {
      try {
        const fallback = await resolveLocationByIp()
        await applyResolvedLocation(fallback)
        toast.success('Using approximate location from your network.')
      } catch {
        const message =
          error instanceof Error
            ? error.message
            : 'Could not detect your location. Enter it manually.'

        setLocationError(message)
        toast.error('Could not detect location. Enter it manually.')
        setLocationMode('manual')
      }
    } finally {
      setIsResolvingLocation(false)
    }
  }

  const handleManualLookup = async () => {
    setLocationMode('manual')
    setIsResolvingLocation(true)
    setLocationError('')

    try {
      const location = await geocodeLocationQuery(manualLocation)
      await applyResolvedLocation(location)
      toast.success('Location updated.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Location lookup failed.'
      setLocationError(message)
      toast.error(message)
    } finally {
      setIsResolvingLocation(false)
    }
  }

  const handleGenerate = async () => {
    if (!resolvedLocation) {
      setGenerateError('Choose your location first so we can match weather and crop conditions.')
      return
    }

    if (!current) {
      setGenerateError('Weather is still loading. Please try again in a moment.')
      return
    }

    setGenerateError('')
    setIsGenerating(true)

    try {
      const result = await generateCropAdvisory({
        language,
        location: resolvedLocation.label,
        weather: {
          temperatureC: Math.round(current.temp),
          humidity: Math.round(current.humidity),
          rainfallMm: current.rainfallMm,
          condition: current.description,
        },
        soilType,
        waterAvailability,
        season,
        soilPh: soilPh === '' ? null : Number(soilPh),
        landSizeAcres: landSize === '' ? null : Number(landSize),
        budgetInr: budget === '' ? null : Number(budget),
      })

      startTransition(() => setAdvisory(result))
      toast.success('Crop recommendations are ready.')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not generate crop recommendations right now.'
      setGenerateError(message)
      toast.error('Could not generate crop recommendations.')
    } finally {
      setIsGenerating(false)
    }
  }

  const weatherHint =
    current &&
    `Based on current weather in your area (${Math.round(current.temp)}°C, ${getRainfallHint(current.rainfallMm)})`

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <motion.section {...surfaceMotion} className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                  🌿 Fasal Salah
                </h1>
                <p className="text-sm text-neutral-500">
                  Get crop recommendations shaped by your land, weather, and farm budget.
                </p>
              </div>
              <div className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700">
                AI Guided
              </div>
            </div>
          </motion.section>

          <motion.section {...surfaceMotion}>
            <Card className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-card">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Location Selection</h2>
                  <p className="text-xs text-neutral-500">Use live location or type your city, district, or state.</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void handleUseMyLocation()}
                  disabled={isResolvingLocation}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                    locationMode === 'auto'
                      ? 'border-brand-200 bg-brand-50 text-brand-800'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/80 p-2.5 shadow-sm">
                      {isResolvingLocation && locationMode === 'auto' ? (
                        <Loader2 size={16} className="animate-spin text-brand-700" />
                      ) : (
                        <MapPin size={16} className="text-brand-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">📍 Use My Location</p>
                      <p className="text-xs text-neutral-500">Browser GPS first, IP fallback if needed.</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationMode('manual')}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                    locationMode === 'manual'
                      ? 'border-brand-200 bg-brand-50 text-brand-800'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/80 p-2.5 shadow-sm">
                      <Target size={16} className="text-brand-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">✍️ Enter Location Manually</p>
                      <p className="text-xs text-neutral-500">Search by city, district, or state.</p>
                    </div>
                  </div>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {locationMode === 'manual' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        value={manualLocation}
                        onChange={event => setManualLocation(event.target.value)}
                        placeholder="City / District / State"
                        className="input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => void handleManualLookup()}
                        disabled={isResolvingLocation || !manualLocation.trim()}
                        className="btn-primary sm:w-auto"
                      >
                        {isResolvingLocation && locationMode === 'manual' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Locating
                          </>
                        ) : (
                          'Use location'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Active advisory location</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {resolvedLocation?.label || current?.location || 'Select a location to begin'}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {locationError ||
                    (weatherHint
                      ? `🌦️ ${weatherHint}`
                      : isWeatherLoading
                        ? 'Loading current weather context...'
                        : 'Weather context appears here after location is resolved.')}
                </p>
              </div>
            </Card>
          </motion.section>

          <motion.section {...surfaceMotion}>
            <Card className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Farm Inputs</h2>
                  <p className="text-xs text-neutral-500">Start with the basics. Add more detail only when useful.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(value => !value)}
                  className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-200"
                >
                  More Details
                  <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Soil Type</span>
                  <select value={soilType} onChange={event => setSoilType(event.target.value as SoilType)} className="input">
                    {SOIL_TYPES.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Water Availability</span>
                  <select
                    value={waterAvailability}
                    onChange={event => setWaterAvailability(event.target.value as WaterAvailability)}
                    className="input"
                  >
                    {WATER_LEVELS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Season</span>
                  <select value={season} onChange={event => setSeason(event.target.value as Season)} className="input">
                    {SEASONS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <AnimatePresence initial={false}>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <label className="space-y-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Soil pH</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="14"
                          value={soilPh}
                          onChange={event => setSoilPh(event.target.value)}
                          className="input"
                          placeholder="6.5"
                        />
                      </label>

                      <label className="space-y-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Land Size (acres)</span>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={landSize}
                          onChange={event => setLandSize(event.target.value === '' ? '' : Number(event.target.value))}
                          className="input"
                          placeholder="3"
                        />
                      </label>

                      <label className="space-y-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Budget (₹)</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={budget}
                          onChange={event => setBudget(event.target.value === '' ? '' : Number(event.target.value))}
                          className="input"
                          placeholder="25000"
                        />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => void handleGenerate()}
                  disabled={isGenerating || isResolvingLocation || isWeatherLoading}
                  className="btn-primary sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Generating
                    </>
                  ) : isWeatherLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Updating weather
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate Advisory
                    </>
                  )}
                </button>
              </div>

              {generateError && (
                <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {generateError}
                </div>
              )}
            </Card>
          </motion.section>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.section key="loading" {...surfaceMotion} className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </motion.section>
            ) : advisory ? (
              <motion.section key="results" {...surfaceMotion} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                      Recommendations
                    </h2>
                    <p className="text-xs text-neutral-500">Top 5 crop fits for your current farm conditions.</p>
                    <p className="mt-1 text-[11px] text-neutral-400">AI estimates only, not guaranteed income or final cost.</p>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {advisory.crops.map((crop, index) => (
                    <CropRecommendationCard
                      key={`${crop.cropName}-${index}`}
                      crop={crop}
                      language={language}
                    />
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <Card className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${riskTone[advisory.overallRiskLevel]}`}>
                        <Target size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Risk outlook</p>
                        <h3 className="mt-1 text-base font-bold text-neutral-900">
                          {advisory.overallRiskLevel} risk
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{advisory.overallRiskExplanation}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-[28px] border border-brand-100 bg-brand-50/60 p-5 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">Recommended next step</p>
                        <h3 className="mt-1 text-base font-bold text-neutral-900">What to do now</h3>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{advisory.overallSuggestion}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {advisory.budgetSummary && budget !== '' && (
                  <Card className="rounded-[28px] border border-emerald-100 bg-emerald-50/60 p-5 shadow-card">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                          <IndianRupee size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Estimated setup cost</p>
                          <h3 className="mt-1 text-base font-bold text-neutral-900">
                            INR {formatLocalizedNumber(advisory.budgetSummary.estimatedCostInr, { maximumFractionDigits: 0 }, language)}
                          </h3>
                          <p className="mt-2 text-sm text-neutral-700">{advisory.budgetSummary.budgetFit}</p>
                        </div>
                      </div>
                      <div className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        Budget entered: INR {formatLocalizedNumber(Number(budget), { maximumFractionDigits: 0 }, language)}
                      </div>
                    </div>
                  </Card>
                )}
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

function CropRecommendationCard({
  crop,
  language,
}: {
  crop: CropAdvisoryCrop
  language: string
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <Card className="group rounded-[28px] border border-neutral-200 bg-white p-5 shadow-card transition-all hover:shadow-card-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Leaf size={18} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">{crop.cropName}</h3>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${riskTone[crop.riskLevel]}`}>
                  {crop.riskLevel} risk
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{crop.reason}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Water</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-neutral-900">
              <Droplets size={14} className="text-brand-600" /> {crop.waterRequirement}
            </p>
          </div>
          <div className="rounded-2xl bg-neutral-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Profit potential</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-neutral-900">
              <TrendingUp size={14} className="text-emerald-600" /> {crop.profitLevel}
            </p>
          </div>
          <div className="rounded-2xl bg-neutral-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Difficulty</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-neutral-900">
              <Sprout size={14} className="text-amber-600" /> {crop.difficulty}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Risk explanation</p>
          <p className="mt-1 text-sm text-neutral-600">{crop.riskExplanation}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full border px-3 py-1.5 text-xs font-semibold text-neutral-700">
            Suggestion: {crop.suggestion}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {typeof crop.estimatedCostInr === 'number' && crop.estimatedCostInr > 0 && (
              <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700">
                Est. cost INR {formatLocalizedNumber(crop.estimatedCostInr, { maximumFractionDigits: 0 }, language)}
              </span>
            )}
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${budgetCompatibilityTone[crop.budgetCompatibility]}`}>
              {crop.budgetCompatibility}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
