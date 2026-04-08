// src/pages/auth/Profile.tsx — v3 orange theme with 4-step progress bar
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Camera, MapPin, Mic } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useCategoryStore, CATEGORY_META } from '../../store/useCategoryStore'
import toast from 'react-hot-toast'

const LAND_OPTIONS = [
  { value: '<1', label: 'Less than 1 acre' },
  { value: '1-5', label: '1 – 5 acres' },
  { value: '5-10', label: '5 – 10 acres' },
  { value: '10+', label: '10+ acres' },
] as const

const WATER_OPTIONS = [
  { value: 'rain-fed', label: 'Rain Dependent', desc: 'Depends on monsoons' },
  { value: 'irrigated', label: 'Canal / Bore Well', desc: 'Tube well, canal, drip' },
  { value: 'pond', label: 'Pond / Reservoir', desc: 'Farm pond or reservoir' },
] as const

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

type Land = '<1' | '1-5' | '5-10' | '10+'
type Water = 'rain-fed' | 'irrigated' | 'pond'

const STEPS = ['Your Info', 'Farm Location', 'Farm Details', 'Confirm']

export default function Profile() {
  const navigate = useNavigate()
  const { farmer, setFarmer } = useAuthStore()
  const { category } = useCategoryStore()

  const [step, setStep] = useState(0)
  const [name, setName] = useState(farmer?.name || '')
  const [village, setVillage] = useState(farmer?.village || '')
  const [district, setDistrict] = useState(farmer?.district || '')
  const [state, setState] = useState(farmer?.state || '')
  const [land, setLand] = useState<Land>('<1')
  const [water, setWater] = useState<Water>('rain-fed')

  const canProceed = () => {
    if (step === 0) return name.trim().length >= 2
    if (step === 1) return state !== ''
    return true
  }

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
    else handleComplete()
  }

  const handleComplete = () => {
    setFarmer({
      uid: farmer?.uid || 'local',
      name: name.trim() || 'Farmer',
      state, district, village,
      landHolding: land,
      waterSource: water,
      crops: [],
      language: 'en',
      category: category || 'crop',
    })
    toast.success(`Welcome to Sarpanch AI, ${name.trim() || 'Farmer'}!`)
    navigate('/', { replace: true })
  }

  const handleSkip = () => {
    setFarmer({
      uid: farmer?.uid || 'local',
      name: farmer?.name || 'Farmer',
      state: '', district: '', village: '',
      landHolding: '<1', waterSource: 'rain-fed',
      crops: [], language: 'en', category: category || 'crop',
    })
    navigate('/', { replace: true })
  }

  return (
    <div className="page-root bg-white">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
              <ChevronLeft size={20} className="text-neutral-600" />
            </button>
          ) : (
            <button onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
              <ChevronLeft size={20} className="text-neutral-600" />
            </button>
          )}
          <h1 className="text-lg font-bold text-neutral-900 flex-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
            Profile Setup
          </h1>
          <button onClick={handleSkip} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
            Skip
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1">
          <div className="flex-1 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-brand-500' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-400 font-medium ml-2 shrink-0">{step + 1}/{STEPS.length}</span>
        </div>
      </div>

      {/* ── Step Content ──────────────────────────────────────── */}
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

            {/* ── Step 0: Name + Photo ──────────────────────────── */}
            {step === 0 && (
              <div className="space-y-6">
                {/* Photo upload */}
                <div className="flex justify-center">
                  <div className="relative">
                    {farmer?.photoURL ? (
                      <img src={farmer.photoURL} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-100" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center text-3xl select-none ring-4 ring-neutral-50">
                        👨‍🌾
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
                      onChange={e => setName(e.target.value)}
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

            {/* ── Step 1: Location ──────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="input-label">Location (Village/District)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={village}
                      onChange={e => setVillage(e.target.value)}
                      placeholder="Bhuj Kutch Gujarat 370001"
                      className="input pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 min-h-fit">
                      <MapPin size={16} className="text-neutral-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label">State *</label>
                  <select
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
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g. Nashik"
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Farm Details ──────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="input-label">How much land do you farm?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAND_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setLand(opt.value)}
                        className={`
                          py-3.5 px-4 rounded-xl border-2 text-sm font-semibold text-left
                          flex items-center justify-between transition-all duration-150 active:scale-[0.98]
                          ${land === opt.value
                            ? 'border-brand-500 bg-brand-50 text-brand-800'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}
                        `}
                      >
                        {opt.label}
                        {land === opt.value && <Check size={14} className="text-brand-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Primary water source</label>
                  <div className="space-y-2">
                    {WATER_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setWater(opt.value)}
                        className={`
                          w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left
                          transition-all duration-150 active:scale-[0.99]
                          ${water === opt.value
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'}
                        `}
                      >
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${water === opt.value ? 'text-brand-800' : 'text-neutral-900'}`}>
                            {opt.label}
                          </p>
                          <p className={`text-xs mt-0.5 ${water === opt.value ? 'text-brand-600/70' : 'text-neutral-400'}`}>
                            {opt.desc}
                          </p>
                        </div>
                        {water === opt.value
                          ? <Check size={16} className="text-brand-600 shrink-0" />
                          : <div className="w-4 h-4 rounded-full border-2 border-neutral-300 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Confirm ──────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                  All set! 🎉
                </h2>
                <p className="text-sm text-neutral-500">Review your profile details:</p>

                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3">
                  {[
                    { label: 'Name', value: name || 'Not set' },
                    { label: 'Location', value: [village, district, state].filter(Boolean).join(', ') || 'Not set' },
                    { label: 'Land', value: LAND_OPTIONS.find(o => o.value === land)?.label || land },
                    { label: 'Water', value: WATER_OPTIONS.find(o => o.value === water)?.label || water },
                    { label: 'Category', value: category ? CATEGORY_META[category].label : 'Crop Farming' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                      <span className="text-sm text-neutral-500">{item.label}</span>
                      <span className="text-sm font-semibold text-neutral-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer CTA ─────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-white border-t border-neutral-100 max-w-lg mx-auto w-full"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="btn-brand"
        >
          {step < 3 ? 'Continue' : `Start Using Sarpanch AI 🌾`}
        </button>
      </div>
    </div>
  )
}
