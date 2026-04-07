import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Send, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { getMarketAdvice } from '../../services/gemini/geminiClient'
import { useLanguageStore } from '../../store/useLanguageStore'
import { getMockMarketPrices } from '../../services/marketService'
import MarketPriceCard from '../../components/shared/MarketPriceCard'
import Card from '../../components/ui/Card'
import { SkeletonCard } from '../../components/ui/Skeleton'
import type { MarketPrice } from '../../store/useMarketStore'
import toast from 'react-hot-toast'

export default function MarketPrices() {
  const { language } = useLanguageStore()
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [selected, setSelected] = useState<MarketPrice | null>(null)
  const [advice, setAdvice] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)

  useEffect(() => {
    const data = getMockMarketPrices()
    setPrices(data)
    setSelected(data[0])
  }, [])

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
    } catch { toast.error('Could not get AI advice.') }
    finally { setAdviceLoading(false) }
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-forest-800">📊 Market Prices</h1>
          <button onClick={() => setPrices(getMockMarketPrices())} className="flex items-center gap-1 text-forest-600 bg-forest-50 rounded-full px-3 py-1.5 text-sm font-bold min-h-fit"><RefreshCw size={13} /> Refresh</button>
        </div>
        <p className="text-soil-500 text-sm -mt-2">Live mandi prices · Select a commodity for AI advice</p>

        <div className="space-y-2">
          {prices.map(p => (
            <MarketPriceCard key={p.id} price={p} onClick={() => setSelected(p)} />
          ))}
        </div>

        {selected && (
          <button id="get-market-advice-btn" onClick={handleGetAdvice} disabled={adviceLoading} className="btn-primary">
            {adviceLoading ? 'Getting AI Advice...' : `Should I sell ${selected.commodity} now? Ask AI`} <Send size={18} />
          </button>
        )}

        {adviceLoading && <SkeletonCard />}

        {advice && !adviceLoading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card color="orange">
              <p className="font-display font-bold text-lg text-soil-800 mb-2">AI Market Advice:</p>
              <p className="font-body text-sm text-soil-700 whitespace-pre-wrap">{advice}</p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
