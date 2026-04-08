import { useState, useEffect } from 'react'
import { Send, RefreshCw, Bell, Smartphone, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [alertBoxOpen, setAlertBoxOpen] = useState(false)

  useEffect(() => {
    const data = getMockMarketPrices()
    setPrices(data)
    setSelected(data[0]) // Auto-select first commodity
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

  const handleSetAlert = () => { toast.success(`Price alert set for ${selected?.commodity}!`) }
  const handleSendSMS = () => { toast.success('Prices sent via SMS! (Mock MSG91)') }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-forest-800">📊 Market Intelligence</h1>
          <button onClick={() => setPrices(getMockMarketPrices())} className="flex items-center gap-1 text-forest-600 bg-forest-50 p-2 rounded-full min-h-fit">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Commodity / Mandi Selector (Mocked Layout) */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
             <span className="text-sm font-bold text-soil-800">{selected?.commodity || 'Select Commodity'}</span>
             <span className="text-xs text-soil-500">Change ▼</span>
          </div>
          <div className="flex-1 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm flex items-center gap-2">
             <MapPin size={14} className="text-soil-400" />
             <span className="text-sm font-bold text-soil-800 line-clamp-1">{selected?.mandi || 'Select Mandi'}</span>
          </div>
        </div>

        {/* Price Tracker List - Includes Sparkline Mock */}
        <div className="space-y-3">
          {prices.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} className={`cursor-pointer transition-all ${selected?.id === p.id ? 'ring-2 ring-forest-500 rounded-xl' : ''}`}>
               <MarketPriceCard price={p} />
               {selected?.id === p.id && (
                 <div className="bg-forest-50 border-x-2 border-b-2 border-forest-500 rounded-b-xl -mt-2 pt-4 pb-3 px-4 shadow-sm">
                    {/* Nearest Mandis Comparison */}
                    <p className="text-xs font-bold text-forest-800 mb-2">Nearby Mandis Comparison:</p>
                    <div className="flex justify-between w-full text-xs text-forest-700 font-mono bg-white p-2 border border-forest-200 rounded-lg">
                      <div className="text-center"><span>Pune</span><br/><span className="font-bold text-danger-600">₹{p.pricePerQuintal - 120}</span></div>
                      <div className="border-r border-forest-200"></div>
                      <div className="text-center"><span>{p.mandi}</span><br/><span className="font-bold text-forest-800">₹{p.pricePerQuintal}</span></div>
                      <div className="border-r border-forest-200"></div>
                      <div className="text-center"><span>Mumbai</span><br/><span className="font-bold text-success-600">₹{p.pricePerQuintal + 250}</span></div>
                    </div>
                 </div>
               )}
            </div>
          ))}
        </div>

        {/* Action Bar: SMS & Alerts */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setAlertBoxOpen(!alertBoxOpen)} className="flex items-center justify-center gap-2 bg-white border-2 border-mango-100 text-mango-700 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform">
             <Bell size={16} /> Target Alert
          </button>
          <button onClick={handleSendSMS} className="flex items-center justify-center gap-2 bg-white border-2 border-sky-100 text-sky-700 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform">
             <Smartphone size={16} /> SMS Me Prices
          </button>
        </div>

        {/* Mandi Price Alerts Novelty Component */}
        <AnimatePresence>
          {alertBoxOpen && selected && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
               <Card color="yellow" className="bg-mango-50 shadow-inner border border-mango-200 mt-1">
                 <h3 className="font-bold text-mango-900 mb-2 flex items-center gap-2"><Bell size={16}/> Notify me when price hits:</h3>
                 <div className="flex gap-2">
                   <div className="relative flex-1">
                     <span className="absolute left-3 top-3 text-mango-600 font-bold">₹</span>
                     <input type="number" defaultValue={selected.pricePerQuintal + 200} className="w-full bg-white pl-8 pr-3 py-3 rounded-lg font-bold text-mango-900 border border-mango-300 outline-none focus:ring-2 focus:ring-mango-400" />
                   </div>
                   <button onClick={handleSetAlert} className="bg-mango-600 hover:bg-mango-700 text-white font-bold px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap">Save Filter</button>
                 </div>
                 <p className="text-[10px] text-mango-700 mt-2">You will receive an SMS via MSG91 when {selected.commodity} crosses this line.</p>
               </Card>
             </motion.div>
          )}
        </AnimatePresence>

        {/* AI "Best time to sell" Advisor */}
        {selected && (
          <button id="get-market-advice-btn" onClick={handleGetAdvice} disabled={adviceLoading} className="btn-primary w-full py-4 text-base mt-2 shadow-md">
            {adviceLoading ? 'Analyzing Trends...' : `Should I sell ${selected.commodity} now? Ask AI`} <Send size={18} />
          </button>
        )}

        {adviceLoading && <SkeletonCard />}

        {advice && !adviceLoading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card color="green" className="border-2 border-forest-200 shadow-md">
              <p className="font-display font-bold text-xl text-forest-800 mb-2">✨ AI Strategy Note:</p>
              <p className="font-body text-base font-medium text-forest-900 whitespace-pre-wrap">{advice}</p>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  )
}
