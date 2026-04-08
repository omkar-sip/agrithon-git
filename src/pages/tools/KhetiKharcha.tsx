import { useEffect, useMemo, useState } from 'react'
import { Calculator, IndianRupee, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import { saveBudget } from '../../services/firebase/firestoreService'
import { getMandiPrice } from '../../services/mandi'
import { useAuthStore } from '../../store/useAuthStore'
import { useLocationStore } from '../../store/useLocationStore'

const formatMoney = (value: number) => `Rs ${Math.round(value).toLocaleString('en-IN')}`

export default function KhetiKharcha() {
  const farmer = useAuthStore((state) => state.farmer)
  const locationState = useLocationStore((state) => state.state)
  const locationDistrict = useLocationStore((state) => state.district)
  const location = useMemo(
    () => ({
      state: locationState,
      district: locationDistrict,
    }),
    [locationDistrict, locationState]
  )

  const [crop, setCrop] = useState(farmer?.crops?.[0] || 'Maize')
  const [seedCost, setSeedCost] = useState('2500')
  const [fertilizerCost, setFertilizerCost] = useState('3200')
  const [laborCost, setLaborCost] = useState('4200')
  const [yieldAmount, setYieldAmount] = useState('18')
  const [mandiPrice, setMandiPrice] = useState('0')
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadPrice = async () => {
      setIsLoadingPrice(true)
      try {
        const summary = await getMandiPrice(crop, location)
        if (!cancelled) {
          setMandiPrice(String(summary.avgPrice))
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (!cancelled) {
          setIsLoadingPrice(false)
        }
      }
    }

    void loadPrice()

    return () => {
      cancelled = true
    }
  }, [crop, location])

  const costs = useMemo(() => {
    const seeds = Number(seedCost) || 0
    const fertilizer = Number(fertilizerCost) || 0
    const labor = Number(laborCost) || 0
    const yieldValue = Number(yieldAmount) || 0
    const mandiValue = Number(mandiPrice) || 0
    const cost = seeds + fertilizer + labor
    const revenue = yieldValue * mandiValue
    const profit = revenue - cost

    return {
      seeds,
      fertilizer,
      labor,
      yieldValue,
      mandiValue,
      cost,
      revenue,
      profit,
    }
  }, [fertilizerCost, laborCost, mandiPrice, seedCost, yieldAmount])

  const handleSave = async () => {
    if (!farmer?.uid) {
      toast.success('Calculation done locally. Sign in to save this budget.')
      return
    }

    try {
      await saveBudget({
        userId: farmer.uid,
        crop,
        cost: costs.cost,
        revenue: costs.revenue,
        profit: costs.profit,
        breakdown: {
          seeds: costs.seeds,
          fertilizer: costs.fertilizer,
          labor: costs.labor,
          yieldAmount: costs.yieldValue,
          mandiPrice: costs.mandiValue,
        },
      })
      toast.success('Kheti budget saved.')
    } catch (error) {
      console.error(error)
      toast.error('Unable to save budget right now.')
    }
  }

  return (
    <div className="px-4 py-5 max-w-5xl mx-auto w-full space-y-5 pb-24">
      <section className="rounded-[28px] bg-gradient-to-br from-sky-700 via-sky-600 to-emerald-500 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/75">Kheti Kharcha</p>
            <h1 className="mt-2 text-3xl font-black" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Cost, revenue, profit
            </h1>
            <p className="mt-2 text-sm text-white/90">
              Simple non-AI farm budgeting using seed, fertilizer, labor, yield, and mandi price.
            </p>
          </div>
          <div className="rounded-3xl bg-white/15 p-3">
            <Calculator size={28} />
          </div>
        </div>
      </section>

      <Card className="space-y-4 border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900">Enter your numbers</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Crop</span>
            <input
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-sky-500"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Expected yield (quintal)</span>
            <input
              type="number"
              value={yieldAmount}
              onChange={(event) => setYieldAmount(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-sky-500"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Seed cost</span>
            <input
              type="number"
              value={seedCost}
              onChange={(event) => setSeedCost(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-sky-500"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Fertilizer cost</span>
            <input
              type="number"
              value={fertilizerCost}
              onChange={(event) => setFertilizerCost(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-sky-500"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Labor cost</span>
            <input
              type="number"
              value={laborCost}
              onChange={(event) => setLaborCost(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-sky-500"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-neutral-700">Mandi price per quintal</span>
            <input
              type="number"
              value={mandiPrice}
              onChange={(event) => setMandiPrice(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-sky-500"
            />
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              {isLoadingPrice
                ? '⏳ Refreshing from Agmarknet...'
                : 'Auto-filled from nearby mandi. You can edit manually.'}
            </p>
          </label>
        </div>
      </Card>

      <div className="grid gap-4 grid-cols-3">
        <Card className={`border shadow-none ${costs.profit >= 0 ? 'border-amber-100 bg-amber-50' : 'border-amber-100 bg-amber-50'}`}>
          <div className="flex items-center gap-2 text-amber-700">
            <IndianRupee size={18} />
            <span className="text-sm font-bold">Total Cost</span>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-950">{formatMoney(costs.cost)}</p>
        </Card>
        <Card className="border border-sky-100 bg-sky-50 shadow-none">
          <div className="flex items-center gap-2 text-sky-700">
            <TrendingUp size={18} />
            <span className="text-sm font-bold">Revenue</span>
          </div>
          <p className="mt-2 text-2xl font-black text-sky-950">{formatMoney(costs.revenue)}</p>
        </Card>
        <Card className={`border shadow-none ${costs.profit >= 0 ? 'border-emerald-100 bg-emerald-50' : 'border-red-100 bg-red-50'}`}>
          <div className={`flex items-center gap-2 ${costs.profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            <Calculator size={18} />
            <span className="text-sm font-bold">Profit / Loss</span>
          </div>
          <p className={`mt-2 text-2xl font-black ${costs.profit >= 0 ? 'text-emerald-950' : 'text-red-800'}`}>
            {costs.profit >= 0 ? '+' : ''}{formatMoney(costs.profit)}
          </p>
          {costs.profit < 0 && <p className="text-xs font-semibold text-red-600 mt-1">⚠️ Loss — review costs</p>}
        </Card>
      </div>

      <Card className="space-y-3 border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900">Breakdown</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
            <span className="text-neutral-600">Seeds</span>
            <span className="font-semibold text-neutral-900">{formatMoney(costs.seeds)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
            <span className="text-neutral-600">Fertilizer</span>
            <span className="font-semibold text-neutral-900">{formatMoney(costs.fertilizer)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
            <span className="text-neutral-600">Labor</span>
            <span className="font-semibold text-neutral-900">{formatMoney(costs.labor)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
            <span className="text-neutral-600">Yield x mandi price</span>
            <span className="font-semibold text-neutral-900">
              {costs.yieldValue} x {formatMoney(costs.mandiValue)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Save budget
        </button>
      </Card>
    </div>
  )
}
