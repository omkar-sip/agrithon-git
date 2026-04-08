import { useCallback, useEffect, useMemo, useState } from 'react'
import { Send, RefreshCw, Bell, Smartphone, MapPin, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { getMarketAdvice } from '../../services/gemini/geminiClient'
import { fetchMarketPrices, hasLiveMarketApi } from '../../services/marketService'
import { getNearbyMandiComparison, type MandiComparison } from '../../services/mandi'
import {
  getSmsApiAvailabilityReason,
  hasSmsApi,
  sendMarketPriceSms,
} from '../../services/messagingService'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useAppStore } from '../../store/useAppStore'
import { useLocationStore } from '../../store/useLocationStore'
import MarketPriceCard from '../../components/shared/MarketPriceCard'
import Card from '../../components/ui/Card'
import { SkeletonCard } from '../../components/ui/Skeleton'
import type { MarketPrice } from '../../store/useMarketStore'

type AlertDraft = {
  commodity: string
  mandi: string
  targetPrice: number
  createdAt: number
}

const ALERTS_STORAGE_KEY = 'market-alert-drafts'

const saveAlertDraft = (draft: AlertDraft) => {
  const raw = localStorage.getItem(ALERTS_STORAGE_KEY)
  const existing = raw ? (JSON.parse(raw) as AlertDraft[]) : []
  const next = [draft, ...existing].slice(0, 30)
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(next))
}

const TrendBadge = ({ trend, percent }: { trend: MarketPrice['trend']; percent: number }) => {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const bg = trend === 'up' ? 'bg-emerald-100 text-emerald-800' : trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${bg}`}>
      <Icon size={12} />
      {percent > 0 ? '+' : ''}{percent}%
    </span>
  )
}

export default function MarketPrices() {
  const { language } = useLanguageStore()
  const farmerPhone = useAuthStore(s => s.farmer?.phone || s.phone || '')
  const isOnline = useAppStore(s => s.isOnline)
  const locationState = useLocationStore(s => s.state)

  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [selected, setSelected] = useState<MarketPrice | null>(null)
  const [advice, setAdvice] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [isSmsLoading, setIsSmsLoading] = useState(false)
  const [alertBoxOpen, setAlertBoxOpen] = useState(false)
  const [targetPrice, setTargetPrice] = useState('')
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState('')
  const [dataSource, setDataSource] = useState<'live' | 'mock'>('mock')

  // Real nearby mandi comparison data
  const [nearbyMandis, setNearbyMandis] = useState<MandiComparison[]>([])
  const [isComparisonLoading, setIsComparisonLoading] = useState(false)

  const hasLiveApi = hasLiveMarketApi()
  const hasSms = hasSmsApi()
  const smsAvailabilityReason = getSmsApiAvailabilityReason()

  const loadPrices = useCallback(async (showToast = false) => {
    setIsLoadingPrices(true)
    try {
      const nextPrices = await fetchMarketPrices({ state: locationState || undefined })

      setPrices(nextPrices)
      setDataSource(hasLiveApi ? 'live' : 'mock')
      setSelected(prev => {
        if (!prev) return nextPrices[0] ?? null
        return (
          nextPrices.find(item => item.id === prev.id) ??
          nextPrices.find(item => item.commodity === prev.commodity && item.mandi === prev.mandi) ??
          nextPrices[0] ??
          null
        )
      })

      const newestTimestamp = nextPrices[0]?.updatedAt ?? new Date().toISOString()
      const lastUpdated = new Date(newestTimestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
      setLastUpdatedLabel(lastUpdated)

      if (showToast) toast.success('Market data refreshed.')
    } catch (error) {
      console.error(error)
      toast.error('Unable to refresh market prices.')
    } finally {
      setIsLoadingPrices(false)
    }
  }, [hasLiveApi, locationState])

  useEffect(() => {
    void loadPrices()
  }, [loadPrices])

  // Load real nearby mandi comparison when a commodity is selected
  useEffect(() => {
    if (!selected) {
      setNearbyMandis([])
      return
    }

    let cancelled = false
    setIsComparisonLoading(true)

    getNearbyMandiComparison(selected.commodity, selected.state)
      .then(comparisons => {
        if (!cancelled) {
          // Filter out the currently selected mandi to avoid self-comparison
          const filtered = comparisons.filter(
            m => m.mandi.toLowerCase() !== selected.mandi.toLowerCase()
          )
          setNearbyMandis(filtered)
        }
      })
      .catch(err => {
        console.warn('[MandiComparison]', err)
        if (!cancelled) setNearbyMandis([])
      })
      .finally(() => {
        if (!cancelled) setIsComparisonLoading(false)
      })

    return () => { cancelled = true }
  }, [selected?.commodity, selected?.state, selected?.mandi])

  useEffect(() => {
    if (!selected) {
      setTargetPrice('')
      return
    }
    setTargetPrice(String(Math.round(selected.pricePerQuintal + 200)))
  }, [selected])

  useEffect(() => {
    if (!isOnline) return
    const intervalMs = hasLiveApi ? 60_000 : 5 * 60_000
    const timer = window.setInterval(() => {
      void loadPrices()
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [hasLiveApi, isOnline, loadPrices])

  const priceSummary = useMemo(() => {
    if (!selected) return ''
    return `₹${selected.pricePerQuintal.toLocaleString('en-IN')}/qtl at ${selected.mandi}`
  }, [selected])

  const handleGetAdvice = async () => {
    if (!selected) return
    setAdviceLoading(true)
    try {
      const mandiNames = nearbyMandis.length
        ? nearbyMandis.slice(0, 3).map(m => `${m.mandi} (₹${m.pricePerQuintal})`).join(', ')
        : `${selected.mandi}`
      const resp = await getMarketAdvice({
        commodity: selected.commodity,
        currentPrice: selected.pricePerQuintal,
        priceTrend: `${selected.trend} ${selected.trendPercent}% this week`,
        nearestMandis: mandiNames,
        language,
      })
      setAdvice(resp)
    } catch {
      toast.error('Could not get AI advice.')
    } finally {
      setAdviceLoading(false)
    }
  }

  const handleSetAlert = async () => {
    if (!selected) return

    const threshold = Number(targetPrice)
    if (!Number.isFinite(threshold) || threshold <= 0) {
      toast.error('Enter a valid target price.')
      return
    }

    saveAlertDraft({
      commodity: selected.commodity,
      mandi: selected.mandi,
      targetPrice: threshold,
      createdAt: Date.now(),
    })

    if (!hasSms) {
      toast.success(
        smsAvailabilityReason === 'blocked_in_browser'
          ? 'Alert saved locally. Browser SMS is disabled in production; use a backend for delivery.'
          : 'Alert saved locally. Add MSG91 config in your .env to send SMS alerts.'
      )
      return
    }

    if (!farmerPhone) {
      toast.success('Alert saved. Add your phone number in profile for SMS delivery.')
      return
    }

    setIsSmsLoading(true)
    try {
      await sendMarketPriceSms({
        phone: farmerPhone,
        commodity: selected.commodity,
        mandi: selected.mandi,
        pricePerQuintal: selected.pricePerQuintal,
        trendPercent: selected.trendPercent,
        targetPrice: threshold,
      })
      toast.success(`SMS alert configured for ${selected.commodity}.`)
    } catch (error) {
      console.error(error)
      toast.error('MSG91 SMS send failed. Alert is still saved locally.')
    } finally {
      setIsSmsLoading(false)
    }
  }

  const handleSendSMS = async () => {
    if (!selected) return

    if (!hasSms) {
      toast.error(
        smsAvailabilityReason === 'blocked_in_browser'
          ? 'Browser SMS is disabled in production. Use a backend proxy for MSG91 delivery.'
          : 'MSG91 config is missing. Add VITE_MSG91_AUTH_KEY in your .env.'
      )
      return
    }

    if (!farmerPhone) {
      toast.error('No phone found in profile. Add a phone number first.')
      return
    }

    setIsSmsLoading(true)
    try {
      await sendMarketPriceSms({
        phone: farmerPhone,
        commodity: selected.commodity,
        mandi: selected.mandi,
        pricePerQuintal: selected.pricePerQuintal,
        trendPercent: selected.trendPercent,
      })
      toast.success('Latest market snapshot sent via SMS.')
    } catch (error) {
      console.error(error)
      toast.error('Could not send SMS through MSG91.')
    } finally {
      setIsSmsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto w-full space-y-5 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-forest-800">Market Intelligence</h1>
          <button
            onClick={() => void loadPrices(true)}
            className="flex items-center gap-1 text-forest-600 bg-forest-50 p-2 rounded-full min-h-fit hover:bg-forest-100 transition-colors"
            disabled={isLoadingPrices}
          >
            <RefreshCw size={18} className={isLoadingPrices ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className={`font-bold px-3 py-1.5 rounded-full ${dataSource === 'live' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
            {dataSource === 'live' ? '● Live — Agmarknet API' : '◌ Demo data — API unavailable'}
          </span>
          {lastUpdatedLabel ? <span className="text-soil-500 font-semibold">Updated {lastUpdatedLabel}</span> : null}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-sm font-bold text-soil-800">{selected?.commodity || 'Select Commodity'}</span>
            <span className="text-xs text-soil-500">Change</span>
          </div>
          <div className="flex-1 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
            <MapPin size={14} className="text-soil-400" />
            <span className="text-sm font-bold text-soil-800 line-clamp-1">{selected?.mandi || 'Select Mandi'}</span>
          </div>
        </div>

        {/* Market price cards — responsive grid on larger screens */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingPrices && !prices.length ? (
            [1, 2, 3].map(item => <SkeletonCard key={item} />)
          ) : (
            prices.map(price => (
              <div
                key={price.id}
                onClick={() => setSelected(price)}
                className={`cursor-pointer transition-all ${selected?.id === price.id ? 'ring-2 ring-forest-500 rounded-xl scale-[1.01]' : 'hover:ring-1 hover:ring-forest-200 rounded-xl'}`}
              >
                <MarketPriceCard price={price} />
              </div>
            ))
          )}
        </div>

        {/* Real Nearby Mandi Comparison — uses actual API data */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-forest-200 bg-gradient-to-br from-forest-50 to-emerald-50 p-4 lg:p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-base lg:text-lg text-forest-900">
                📊 Mandi Price Comparison — {selected.commodity}
              </h3>
              {isComparisonLoading && (
                <span className="text-xs text-forest-600 animate-pulse font-semibold">Loading real prices...</span>
              )}
            </div>

            {/* Current selected mandi highlighted */}
            <div className="rounded-xl bg-forest-600 text-white p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-forest-100 font-semibold uppercase tracking-wide">Selected Mandi</p>
                  <p className="font-bold text-lg">{selected.mandi}</p>
                  <p className="text-xs text-forest-200">{selected.state}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-2xl">₹{selected.pricePerQuintal.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-forest-200">/quintal</p>
                </div>
              </div>
            </div>

            {/* Nearby mandis */}
            {nearbyMandis.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyMandis.map((m, i) => {
                  const diff = m.pricePerQuintal - selected.pricePerQuintal
                  const diffPercent = ((diff / selected.pricePerQuintal) * 100).toFixed(1)
                  const isHigher = diff > 0

                  return (
                    <div key={`${m.mandi}-${i}`} className="rounded-xl bg-white border border-forest-100 p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-neutral-900 truncate">{m.mandi}</p>
                        <TrendBadge trend={m.trend} percent={m.trendPercent} />
                      </div>
                      <p className="text-xs text-neutral-500">{m.state}</p>
                      <div className="flex items-end justify-between mt-2">
                        <p className="font-mono font-bold text-lg text-neutral-900">
                          ₹{m.pricePerQuintal.toLocaleString('en-IN')}
                        </p>
                        <span className={`text-xs font-bold ${isHigher ? 'text-emerald-700' : diff < 0 ? 'text-red-700' : 'text-neutral-500'}`}>
                          {isHigher ? '+' : ''}{diff > 0 || diff < 0 ? `₹${Math.abs(diff).toLocaleString('en-IN')} (${diffPercent}%)` : 'Same'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : !isComparisonLoading ? (
              <div className="flex items-center gap-2 text-sm text-forest-700 bg-white rounded-xl p-3 border border-forest-100">
                <Info size={16} />
                <span>No comparison data available for {selected.commodity} in {selected.state}. Try a broader search.</span>
              </div>
            ) : null}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAlertBoxOpen(!alertBoxOpen)}
            className="flex items-center justify-center gap-2 bg-white border-2 border-mango-200 text-mango-800 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform hover:bg-mango-50"
          >
            <Bell size={16} /> Target Alert
          </button>
          <button
            onClick={() => void handleSendSMS()}
            disabled={isSmsLoading || !selected}
            className="flex items-center justify-center gap-2 bg-white border-2 border-sky-200 text-sky-800 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform disabled:opacity-50 hover:bg-sky-50"
          >
            <Smartphone size={16} /> {isSmsLoading ? 'Sending...' : 'SMS Me Prices'}
          </button>
        </div>

        <AnimatePresence>
          {alertBoxOpen && selected && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <Card color="yellow" className="bg-mango-50 shadow-inner border border-mango-200 mt-1">
                <h3 className="font-bold text-mango-900 mb-2 flex items-center gap-2"><Bell size={16} /> Notify me when price hits:</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-mango-600 font-bold">₹</span>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={event => setTargetPrice(event.target.value)}
                      className="w-full bg-white pl-8 pr-3 py-3 rounded-lg font-bold text-mango-900 border border-mango-300 outline-none focus:ring-2 focus:ring-mango-400"
                    />
                  </div>
                  <button
                    onClick={() => void handleSetAlert()}
                    disabled={isSmsLoading}
                    className="bg-mango-600 hover:bg-mango-700 text-white font-bold px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    Save Filter
                  </button>
                </div>
                <p className="text-[10px] text-mango-700 mt-2">
                  {hasSms
                    ? `SMS via MSG91 will be sent to ${farmerPhone || 'your profile phone'} when available.`
                    : smsAvailabilityReason === 'blocked_in_browser'
                      ? 'Browser SMS is disabled in production. Filter is saved locally; use a backend sender for real delivery.'
                      : 'MSG91 config not found. Filter is saved locally for now.'}
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {selected && (
          <button id="get-market-advice-btn" onClick={() => void handleGetAdvice()} disabled={adviceLoading} className="btn-primary w-full py-4 text-base mt-2 shadow-md">
            {adviceLoading ? 'Analyzing Trends...' : `Should I sell ${selected.commodity} now? Ask AI`} <Send size={18} />
          </button>
        )}

        {adviceLoading && <SkeletonCard />}

        {advice && !adviceLoading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card color="green" className="border-2 border-forest-200 shadow-md">
              <p className="font-display font-bold text-xl text-forest-800 mb-2">AI Strategy Note:</p>
              <p className="font-body text-base font-medium text-forest-900 whitespace-pre-wrap">{advice}</p>
            </Card>
          </motion.div>
        )}

        {selected && (
          <p className="text-xs text-soil-500 text-center font-semibold">
            Selected: {priceSummary}
          </p>
        )}
      </div>
    </div>
  )
}
