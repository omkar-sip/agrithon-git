import { useMemo, useState } from 'react'
import { FlaskConical, Leaf, LoaderCircle, Sprout } from 'lucide-react'
import { get, set } from 'idb-keyval'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import { analyzeSoilHealth } from '../../services/ai'
import { saveSoilReport } from '../../services/firebase/firestoreService'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useLocationStore } from '../../store/useLocationStore'

const SOIL_CACHE_PREFIX = 'mitti-sehat-report'

const buildCacheKey = (soilType: string, crop: string, n: string, p: string, k: string) =>
  `${SOIL_CACHE_PREFIX}:${soilType}:${crop}:${n}:${p}:${k}`.toLowerCase()

export default function SoilHealth() {
  const farmer = useAuthStore((state) => state.farmer)
  const { language } = useLanguageStore()
  const district = useLocationStore((state) => state.district)

  const [soilType, setSoilType] = useState('Loamy')
  const [crop, setCrop] = useState(farmer?.crops?.[0] || 'Wheat')
  const [npk, setNpk] = useState({ n: '', p: '', k: '' })
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const cacheKey = useMemo(
    () => buildCacheKey(soilType, crop, npk.n, npk.p, npk.k),
    [crop, npk.k, npk.n, npk.p, soilType]
  )

  const handleAnalyze = async () => {
    if (!crop.trim()) {
      toast.error('Enter a crop first.')
      return
    }

    setIsLoading(true)

    try {
      const cached = await get<string>(cacheKey)
      if (cached) {
        setResult(cached)
        toast.success('Loaded cached soil guidance.')
        return
      }

      const analysis = await analyzeSoilHealth({
        soilType,
        crop,
        npk,
        language,
      })

      setResult(analysis)
      await set(cacheKey, analysis)

      if (farmer?.uid) {
        await saveSoilReport({
          userId: farmer.uid,
          input: {
            soilType,
            crop,
            npk,
          },
          result: analysis,
        })
      }

      toast.success('Soil guidance ready.')
    } catch (error) {
      console.error(error)
      toast.error('Unable to analyze soil right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-5 max-w-5xl mx-auto w-full space-y-5 pb-24">
      <section className="rounded-[28px] bg-gradient-to-br from-amber-700 via-amber-600 to-lime-500 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/75">Mitti Sehat</p>
            <h1 className="mt-2 text-3xl font-black" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Understand soil before spending
            </h1>
            <p className="mt-2 text-sm text-white/90">
              Enter soil type, crop, and optional NPK values to get a short fertilizer and suitability plan.
            </p>
          </div>
          <div className="rounded-3xl bg-white/15 p-3">
            <Leaf size={28} />
          </div>
        </div>
      </section>

      <Card className="space-y-4 border border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
            <FlaskConical size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Soil Input</h2>
            <p className="text-sm text-neutral-500">Enter soil type, crop and optional NPK for AI recommendation.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Soil type</span>
            <select
              value={soilType}
              onChange={(event) => setSoilType(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-amber-500"
            >
              {['Loamy', 'Clay', 'Sandy', 'Black soil', 'Red soil'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Crop</span>
            <input
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-amber-500"
              placeholder="Eg. Wheat"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="font-bold text-neutral-700">Nitrogen (N) <span className="font-normal text-neutral-400">kg/acre</span></span>
            <input
              value={npk.n}
              onChange={(event) => setNpk((current) => ({ ...current, n: event.target.value }))}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-amber-500"
              placeholder="Optional"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Phosphorus (P)</span>
            <input
              value={npk.p}
              onChange={(event) => setNpk((current) => ({ ...current, p: event.target.value }))}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-amber-500"
              placeholder="Optional"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Potassium (K)</span>
            <input
              value={npk.k}
              onChange={(event) => setNpk((current) => ({ ...current, k: event.target.value }))}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-amber-500"
              placeholder="Optional"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => void handleAnalyze()}
          disabled={isLoading}
          className="w-full rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? 'Analyzing soil...' : 'Get soil recommendation'}
        </button>
      </Card>

      <Card className="space-y-4 border border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-lime-100 p-3 text-lime-700">
            <Sprout size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Recommendation</h2>
            <p className="text-sm text-neutral-500">Short, practical, local-language friendly output.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-5 text-sm text-neutral-500">
            <LoaderCircle size={18} className="animate-spin" />
            Preparing Mitti Sehat guidance...
          </div>
        ) : result ? (
          <div className="rounded-2xl bg-lime-50 px-4 py-4 text-sm leading-7 text-lime-950 whitespace-pre-wrap">
            {result}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
            No soil report yet. Submit the form to generate a fertilizer and crop suitability note.
          </div>
        )}

        <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Local tip: {district || 'Your district'} farmers should still confirm pH and organic carbon through the nearest soil lab for major fertilizer decisions.
        </div>
      </Card>
    </div>
  )
}
