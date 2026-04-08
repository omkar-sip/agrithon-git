import { useState } from 'react'
import { TrendingUp, Send, Egg, Handshake, ShieldCheck, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import { SkeletonCard } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'

export default function PoultryMarket() {
  const [activeTab, setActiveTab] = useState<'rates' | 'contracts'>('rates')
  const [advice, setAdvice] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)

  const handleGetAdvice = () => {
    setAdviceLoading(true)
    setTimeout(() => {
      setAdvice('AI Market Strategy:\nNECC Pune rates are showing a strong upward trend right now due to upcoming festivals. Unless your Feed Conversion Ratio is declining rapidly, HOLD your Broiler batch for 3 more days. Expected rate jump logic applied: +₹5/kg.')
      setAdviceLoading(false)
    }, 1500)
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-sky-800">📊 Murgi Mandi</h1>
        <p className="text-soil-500 text-sm -mt-3">NECC Live Rates & Contracts</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['rates', 'contracts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-sky-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'rates' ? 'Live NECC Rates' : 'Contract Farming'}
            </button>
          ))}
        </div>

        {activeTab === 'rates' && (
          <div className="space-y-4">
             <div className="flex gap-2">
               <div className="flex-1 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-bold text-soil-800"><MapPin size={14} className="inline mr-1 text-sky-500"/> Pune Hub</span>
                  <span className="text-xs text-soil-500">Change ▼</span>
               </div>
             </div>

             <Card className="border border-sky-200 shadow-sm">
               <div className="flex justify-between items-start mb-1">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800 flex items-center gap-1"><img src="https://img.icons8.com/color/48/poultry-leg.png" alt="chicken" className="w-5 h-5"/> Live Broiler</h3>
                    <p className="text-xs text-neutral-500 mt-1">Farm Gate Rate (per kg)</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold text-green-700 font-mono">₹112.0</p>
                    <p className="text-xs font-bold text-green-600 flex items-center justify-end gap-1"><TrendingUp size={12}/> +₹2.50 vs yesterday</p>
                 </div>
               </div>
             </Card>
             
             <Card className="border border-sky-200 shadow-sm">
               <div className="flex justify-between items-start mb-1">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800 flex items-center gap-1"><Egg size={16} className="text-yellow-600"/> Live Egg Rate</h3>
                    <p className="text-xs text-neutral-500 mt-1">NECC Price (per 100 eggs)</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold text-soil-800 font-mono">₹540.0</p>
                    <p className="text-xs text-neutral-500 flex items-center justify-end gap-1">Stable</p>
                 </div>
               </div>
               <div className="mt-3 pt-3 border-t border-sky-100 flex justify-between text-xs text-sky-700">
                  <span>Namakkal: ₹530</span>
                  <span>Delhi: ₹555</span>
               </div>
             </Card>

             <button onClick={handleGetAdvice} disabled={adviceLoading} className="btn-primary w-full py-4 text-base mt-2 shadow-md bg-sky-600 border-none outline-none text-white">
                {adviceLoading ? 'Analyzing NECC Trends...' : 'Should I sell Broiler now? Ask AI'} <Send size={18} />
             </button>

             {adviceLoading && <SkeletonCard />}

             {advice && !adviceLoading && (
               <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                 <Card color="green" className="border-2 border-forest-200 shadow-md bg-gradient-to-br from-green-50 to-white">
                   <p className="font-display font-bold text-lg text-forest-800 mb-2">✨ AI Strategy Note:</p>
                   <p className="font-body text-sm text-forest-900 whitespace-pre-wrap leading-snug">{advice}</p>
                 </Card>
               </motion.div>
             )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <Card color="yellow" className="opacity-80 border-yellow-200">
               <p className="font-display font-bold text-base text-yellow-900 mb-1">Zero-Risk Farming</p>
               <p className="text-sm text-yellow-800">Secure your income by partnering with verified corporate integrators. They provide chicks and feed, you provide infrastructure & labor.</p>
            </Card>

            <Card>
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800 flex items-center gap-2">Venky's Integration</h3>
                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1"><ShieldCheck size={14} className="text-green-500"/> Verified Corporate</p>
                 </div>
               </div>
               <p className="text-xs text-soil-700 mb-3 border-b pb-3 border-neutral-100">Growing Charges: ₹8 - ₹10 per kg body weight depending on FCR performance.</p>
               <button onClick={() => toast.success('Application request sent to Integrator')} className="btn-primary w-full bg-forest-50 py-2.5 text-forest-700 flex justify-center items-center gap-2 border border-forest-200"><Handshake size={16}/> Apply for Contract</button>
            </Card>

            <Card>
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800 flex items-center gap-2">Suguna Foods</h3>
                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1"><ShieldCheck size={14} className="text-green-500"/> Verified Corporate</p>
                 </div>
               </div>
               <p className="text-xs text-soil-700 mb-3 border-b pb-3 border-neutral-100">Offers complete medical support and assured buyback guarantee.</p>
               <button onClick={() => toast.success('Application request sent to Integrator')} className="btn-primary w-full bg-forest-50 py-2.5 text-forest-700 flex justify-center items-center gap-2 border border-forest-200"><Handshake size={16}/> Apply for Contract</button>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
