// src/pages/auth/Profile.tsx — clean profile setup wizard v2
// Flow: Login → Profile (3 steps) → Home
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useCategoryStore, CATEGORY_META } from '../../store/useCategoryStore'
import toast from 'react-hot-toast'

// ── Data ────────────────────────────────────────────────────────────
const LAND_OPTIONS = [
  { value: '<1',  label: 'Less than 1 acre' },
  { value: '1-5', label: '1 – 5 acres' },
  { value: '5-10',label: '5 – 10 acres' },
  { value: '10+', label: '10+ acres' },
] as const

const WATER_OPTIONS = [
  { value: 'rain-fed',  label: 'Rain Dependent',   desc: 'Farming depends on monsoons' },
  { value: 'irrigated', label: 'Canal / Bore Well', desc: 'Tube well, canal, or drip system' },
  { value: 'pond',      label: 'Pond / Reservoir',  desc: 'Farm pond or natural reservoir' },
] as const

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

type Land  = '<1' | '1-5' | '5-10' | '10+'
type Water = 'rain-fed' | 'irrigated' | 'pond'

const STEPS = ['Your Name', 'Farm Location', 'Farm Details']

export default function Profile() {
  const navigate = useNavigate()
  const { farmer, setFarmer } = useAuthStore()
  const { category }          = useCategoryStore()

  const [step, setStep]         = useState(0)
  const [name, setName]         = useState(farmer?.name || '')
  const [village, setVillage]   = useState(farmer?.village || '')
  const [district, setDistrict] = useState(farmer?.district || '')
  const [state, setState]       = useState(farmer?.state || '')
  const [land, setLand]         = useState<Land>('<1')
  const [water, setWater]       = useState<Water>('rain-fed')

  const catMeta = category ? CATEGORY_META[category] : null

  const canProceed = () => {
    if (step === 0) return name.trim().length >= 2
    if (step === 1) return state !== ''
    return true
  }

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1)
    else handleComplete()
  }

  const handleComplete = () => {
    setFarmer({
      uid:  farmer?.uid || 'local',
      name: name.trim() || 'Farmer',
      state, district, village,
      landHolding: land,
      waterSource: water,
      crops:    [],
      language: 'en',
      category: category || 'crop',
    })
    toast.success(`Welcome to Sarpanch AI, ${name.trim() || 'Farmer'}!`)
    navigate('/', { replace: true })
  }

  const handleSkip = () => {
    setFarmer({
      uid:      farmer?.uid || 'local',
      name:     farmer?.name || 'Farmer',
      state:    '', district: '', village: '',
      landHolding: '<1', waterSource: 'rain-fed',
      crops: [], language: 'en', category: category || 'crop',
    })
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* ── Header + progress ──────────────────────────────────────── */}
      <div className="bg-forest-900 text-white px-5 pb-6"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        {/* Back navigation */}
        <div className="flex items-center gap-3 mb-5">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronLeft size={18} />
            </button>
          ) : <div className="w-9 h-9" />}
          <div className="flex-1">
            <p className="text-forest-300 text-xs font-medium">
              Step {step + 1} of {STEPS.length}
            </p>
            <p className="font-bold text-base text-white" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              {STEPS[step]}
            </p>
          </div>
          <button onClick={handleSkip}
            className="text-forest-300 text-sm hover:text-white transition-colors">
            Skip
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-gold-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Step content ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="px-5 py-6 max-w-lg mx-auto w-full space-y-5"
          >

            {/* ── Step 0: Name ──────────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1"
                    style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                    What's your name?
                  </h2>
                  <p className="text-sm text-neutral-500">
                    We'll use this to personalise your advice
                  </p>
                </div>

                {/* If Google/email auth provided name, show it */}
                {farmer?.name && farmer.name !== 'Farmer' && (
                  <div className="flex items-center gap-3 bg-success-50 border border-success-100 rounded-xl px-4 py-3">
                    {farmer.photoURL && (
                      <img src={farmer.photoURL} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-success-700 font-medium">Google account detected</p>
                      <p className="text-sm font-semibold text-neutral-900">{farmer.name}</p>
                    </div>
                    <button onClick={() => setName(farmer.name)}
                      className="ml-auto text-xs bg-success-600 text-white rounded-lg px-3 py-1.5 font-semibold">
                      Use this
                    </button>
                  </div>
                )}

                <div>
                  <label className="input-label">Your full name</label>
                  <input
                    id="farmer-name-input"
                    type="text"
                    autoFocus
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="input text-lg"
                  />
                </div>

                {/* Category context */}
                {catMeta && (
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl select-none">{catMeta.emoji}</span>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium">Your farming category</p>
                      <p className="text-sm font-semibold text-neutral-900">{catMeta.label}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 1: Location ──────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1"
                    style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                    Where is your farm?
                  </h2>
                  <p className="text-sm text-neutral-500">
                    For accurate local weather &amp; market prices
                  </p>
                </div>

                <div>
                  <label className="input-label">State *</label>
                  <select
                    id="state-select"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="input"
                  >
                    <option value="">Select your state</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">District</label>
                  <input
                    id="district-input"
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g. Nashik"
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Village / Town</label>
                  <input
                    id="village-input"
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="Your village name"
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Farm details ──────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1"
                    style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                    About your farm
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Helps us give accurate advice for your situation
                  </p>
                </div>

                {/* Land holding */}
                <div>
                  <label className="input-label">How much land do you farm?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAND_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        id={`land-${opt.value}`}
                        onClick={() => setLand(opt.value)}
                        className={`
                          py-3.5 px-4 rounded-xl border-2 text-sm font-semibold text-left
                          flex items-center justify-between
                          transition-all duration-150 active:scale-[0.98]
                          ${land === opt.value
                            ? 'border-forest-900 bg-forest-900 text-white'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}
                        `}
                      >
                        {opt.label}
                        {land === opt.value && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Water source */}
                <div>
                  <label className="input-label">Primary water source</label>
                  <div className="space-y-2">
                    {WATER_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        id={`water-${opt.value}`}
                        onClick={() => setWater(opt.value)}
                        className={`
                          w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left
                          transition-all duration-150 active:scale-[0.99]
                          ${water === opt.value
                            ? 'border-sky-700 bg-sky-700 text-white'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'}
                        `}
                      >
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${water === opt.value ? 'text-white' : 'text-neutral-900'}`}>
                            {opt.label}
                          </p>
                          <p className={`text-xs mt-0.5 ${water === opt.value ? 'text-white/75' : 'text-neutral-400'}`}>
                            {opt.desc}
                          </p>
                        </div>
                        {water === opt.value
                          ? <Check size={16} className="text-white shrink-0" />
                          : <div className="w-4 h-4 rounded-full border-2 border-neutral-300 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer CTA ─────────────────────────────────────────────── */}
      <div className="px-5 py-4 bg-white border-t border-neutral-200 max-w-lg mx-auto w-full"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
        <button
          id="profile-next-btn"
          onClick={handleNext}
          disabled={!canProceed()}
          className={`
            w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base
            transition-all duration-200 active:scale-[0.98]
            ${canProceed()
              ? 'bg-forest-900 text-white shadow-card-md hover:bg-forest-800'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}
          `}
        >
          {step < 2 ? (
            <>Continue <ChevronRight size={18} /></>
          ) : (
            <>Start Using Sarpanch AI {catMeta?.emoji || '🌾'}</>
          )}
        </button>
      </div>
    </div>
  )
}
