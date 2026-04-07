// src/pages/auth/Profile.tsx — English only
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useCategoryStore, CATEGORY_META } from '../../store/useCategoryStore'
import VoiceInputButton from '../../components/ui/VoiceInputButton'
import toast from 'react-hot-toast'

const LAND_OPTIONS = ['Less than 1 acre', '1–5 acres', '5–10 acres', '10+ acres']
const WATER_OPTIONS = [
  { value: 'rain-fed',  label: 'Rain Dependent',    icon: '🌧️' },
  { value: 'irrigated', label: 'Canal / Tube Well',  icon: '💧' },
  { value: 'pond',      label: 'Pond / Tank Water',  icon: '🏞️' },
]
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
]

export default function Profile() {
  const navigate  = useNavigate()
  const { phone, setFarmer } = useAuthStore()
  const { category } = useCategoryStore()
  const [step, setStep]       = useState(1)
  const [name, setName]       = useState('')
  const [village, setVillage] = useState('')
  const [district, setDistrict] = useState('')
  const [state, setState]     = useState('')
  const [land, setLand]       = useState(LAND_OPTIONS[0])
  const [water, setWater]     = useState<'rain-fed' | 'irrigated' | 'pond'>('rain-fed')

  const catEmoji = category ? CATEGORY_META[category].emoji : '🌾'

  const handleComplete = () => {
    const landMap: Record<string, any> = {
      'Less than 1 acre': '<1', '1–5 acres': '1-5', '5–10 acres': '5-10', '10+ acres': '10+'
    }
    setFarmer({
      uid: phone || 'guest',
      name: name || 'Farmer',
      phone: phone || '',
      state, district, village,
      landHolding: landMap[land] || '<1',
      crops: [],
      waterSource: water,
    })
    toast.success(`Welcome, ${name || 'Farmer'}! 🙏`)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress header */}
      <div className="bg-forest-500 pt-12 pb-6 px-6 text-white">
        <p className="text-harvest-200 text-sm mb-2">Set up your farm profile</p>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-harvest-400' : 'bg-forest-400'}`} />
          ))}
        </div>
        <h1 className="font-display font-bold text-xl">{catEmoji} Step {step} of 3</h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-5"
        >
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="section-title">👤 What's your name?</h2>
              <div className="flex gap-2">
                <input
                  id="farmer-name-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="flex-1 bg-white rounded-2xl px-4 py-4 text-lg text-soil-800 outline-none border-2 border-parchment focus:border-forest-400 transition-colors shadow-card"
                />
                <VoiceInputButton onResult={text => setName(text)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="section-title">📍 Where is your farm?</h2>
              {[
                { id: 'village', label: 'Village / Town', value: village, setter: setVillage, placeholder: 'Your village name' },
                { id: 'district', label: 'District',       value: district, setter: setDistrict, placeholder: 'Your district' },
              ].map(({ id, label, value, setter, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="text-soil-600 text-sm mb-1 block font-bold">{label}</label>
                  <div className="flex gap-2">
                    <input
                      id={id}
                      type="text"
                      value={value}
                      onChange={e => setter(e.target.value)}
                      placeholder={placeholder}
                      className="flex-1 bg-white rounded-2xl px-4 py-4 text-base text-soil-800 outline-none border-2 border-parchment focus:border-forest-400 transition-colors shadow-card"
                    />
                    <VoiceInputButton onResult={text => setter(text)} size="sm" />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-soil-600 text-sm mb-1 block font-bold">State</label>
                <select
                  id="state-select"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full bg-white rounded-2xl px-4 py-4 text-base text-soil-800 outline-none border-2 border-parchment focus:border-forest-400 transition-colors shadow-card"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">🌱 How much land do you farm?</h2>
                <div className="grid grid-cols-2 gap-2">
                  {LAND_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      id={`land-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setLand(opt)}
                      className={`rounded-2xl py-4 text-sm font-bold transition-all duration-200 ${
                        land === opt ? 'bg-forest-500 text-white shadow-card-hover' : 'bg-white border-2 border-parchment text-soil-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="section-title">💧 Primary Water Source</h2>
                <div className="space-y-2">
                  {WATER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      id={`water-${opt.value}`}
                      onClick={() => setWater(opt.value as any)}
                      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-bold transition-all duration-200 ${
                        water === opt.value
                          ? 'bg-sky-500 text-white shadow-card-hover'
                          : 'bg-white border-2 border-parchment text-soil-700'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="p-5 pb-10 space-y-3">
        {step < 3 ? (
          <button id="next-step-btn" onClick={() => setStep(s => s + 1)} className="btn-primary">
            Next <ChevronRight size={22} />
          </button>
        ) : (
          <button id="complete-profile-btn" onClick={handleComplete} className="btn-primary">
            Start Using Sarpanch AI {catEmoji}
          </button>
        )}
        {step > 1 && (
          <button id="prev-step-btn" onClick={() => setStep(s => s - 1)} className="btn-ghost">
            ← Back
          </button>
        )}
        <button id="skip-profile-btn" onClick={() => navigate('/')} className="btn-ghost text-soil-400 text-sm">
          Fill in later
        </button>
      </div>
    </div>
  )
}
