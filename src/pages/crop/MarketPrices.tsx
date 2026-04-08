import { useCallback, useEffect, useMemo, useState } from 'react'
import { Send, RefreshCw, Bell, Smartphone, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { getMarketAdvice } from '../../services/gemini/geminiClient'
import { fetchMarketPrices, hasLiveMarketApi } from '../../services/marketService'
import { hasSmsApi, sendMarketPriceSms } from '../../services/messagingService'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useAppStore } from '../../store/useAppStore'
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

export default function MarketPrices() {
  const { language } = useLanguageStore()
  const farmerPhone = useAuthStore(s => s.farmer?.phone || s.phone || '')
  const isOnline = useAppStore(s => s.isOnline)

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

  const hasLiveApi = hasLiveMarketApi()
  const hasSms = hasSmsApi()

  const loadPrices = useCallback(async (showToast = false) => {
    setIsLoadingPrices(true)
    try {
      const nextPrices = await fetchMarketPrices(selected?.mandi)

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
  }, [hasLiveApi, selected?.mandi])

  useEffect(() => {
    void loadPrices()
  }, [loadPrices])

  useEffect(() => {
    if (!selected) {
      setTargetPrice('')
      return
    }
    setTargetPrice(String(Math.round(selected.pricePerQuintal + 200)))
  }, [selected?.id, selected?.pricePerQuintal])

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
    return `Rs${selected.pricePerQuintal}/qtl at ${selected.mandi}`
  }, [selected])

  const handleGetAdvice = async () => {
    if (!selected) return
    setAdviceLoading(true)
    try {
      const resp = await getMarketAdvice({
        commodity: selected.commodity,
        currentPrice: selected.pricePerQuintal,
        priceTrend: `${selected.trend} ${selected.trendPercent}% this week`,
        nearestMandis: `${selected.mandi}, Pune, Mumbai`,
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
      toast.success('Alert saved locally. Add MSG91 key to send SMS alerts.')
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
      toast.error('MSG91 key is missing. Add VITE_MSG91_AUTH_KEY in your .env.')
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
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-forest-800">Market Intelligence</h1>
          <button
            onClick={() => void loadPrices(true)}
            className="flex items-center gap-1 text-forest-600 bg-forest-50 p-2 rounded-full min-h-fit"
            disabled={isLoadingPrices}
          >
            <RefreshCw size={18} className={isLoadingPrices ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className={`font-semibold px-2 py-1 rounded-full ${dataSource === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {dataSource === 'live' ? 'Live market API' : 'Fallback demo data'}
          </span>
          {lastUpdatedLabel ? <span className="text-soil-500">Updated {lastUpdatedLabel}</span> : null}
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

        <div className="space-y-3">
          {isLoadingPrices && !prices.length ? (
            [1, 2, 3].map(item => <SkeletonCard key={item} />)
          ) : (
            prices.map(price => (
              <div
                key={price.id}
                onClick={() => setSelected(price)}
                className={`cursor-pointer transition-all ${selected?.id === price.id ? 'ring-2 ring-forest-500 rounded-xl' : ''}`}
              >
                <MarketPriceCard price={price} />
                {selected?.id === price.id && (
                  <div className="bg-forest-50 border-x-2 border-b-2 border-forest-500 rounded-b-xl -mt-2 pt-4 pb-3 px-4 shadow-sm">
                    <p className="text-xs font-bold text-forest-800 mb-2">Nearby Mandis Comparison:</p>
                    <div className="flex justify-between w-full text-xs text-forest-700 font-mono bg-white p-2 border border-forest-200 rounded-lg">
                      <div className="text-center"><span>Pune</span><br /><span className="font-bold text-danger-600">Rs{price.pricePerQuintal - 120}</span></div>
                      <div className="border-r border-forest-200" />
                      <div className="text-center"><span>{price.mandi}</span><br /><span className="font-bold text-forest-800">Rs{price.pricePerQuintal}</span></div>
                      <div className="border-r border-forest-200" />
                      <div className="text-center"><span>Mumbai</span><br /><span className="font-bold text-success-600">Rs{price.pricePerQuintal + 250}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAlertBoxOpen(!alertBoxOpen)}
            className="flex items-center justify-center gap-2 bg-white border-2 border-mango-100 text-mango-700 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
          >
            <Bell size={16} /> Target Alert
          </button>
          <button
            onClick={() => void handleSendSMS()}
            disabled={isSmsLoading || !selected}
            className="flex items-center justify-center gap-2 bg-white border-2 border-sky-100 text-sky-700 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform disabled:opacity-50"
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
                    <span className="absolute left-3 top-3 text-mango-600 font-bold">Rs</span>
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
                    : 'MSG91 key not found. Filter is saved locally for now.'}
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
          <p className="text-xs text-soil-500 text-center">
            Selected: {priceSummary}
          </p>
        )}
      </div>
    </div>
  )
}

