import { useState } from 'react'
import { TrendingUp, Search, MapPin, Handshake, Calculator } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function MandiBhav() {
  const [activeTab, setActiveTab] = useState<'prices' | 'sell' | 'calendar'>('prices')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-soil-800">📈 Pashu Mandi</h1>
        <p className="text-soil-500 text-sm -mt-3">Livestock market prices and trade</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['prices', 'sell', 'calendar'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-harvest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'prices' ? 'Live Rates' : tab === 'sell' ? 'Estimator' : 'Mandi Calendar'}
            </button>
          ))}
        </div>

        {activeTab === 'prices' && (
          <div className="space-y-4">
             <div className="relative mb-4">
               <Search className="absolute left-3 top-3 text-neutral-400" size={18} />
               <input type="text" placeholder="Search Breed (e.g. Gir, Murrah)..." className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl shadow-sm outline-none focus:border-harvest-400" />
             </div>

             <h2 className="section-title mb-2">Live Market Trends</h2>
             <Card className="border border-green-200 shadow-sm mb-3">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">HF Cow (Lactating)</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1"><MapPin size={14}/> Loni Pashu Mandi</p>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-green-700 font-mono">₹65,000</p>
                    <p className="text-xs text-green-600 flex items-center justify-end gap-1"><TrendingUp size={12}/> +₹2,000</p>
                 </div>
               </div>
             </Card>
             
             <Card className="shadow-sm mb-3">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">Murrah Buffalo</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1"><MapPin size={14}/> Dhule Mandi</p>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-soil-800 font-mono">₹85,000</p>
                    <p className="text-xs text-neutral-500 flex items-center justify-end gap-1">Stable</p>
                 </div>
               </div>
             </Card>
          </div>
        )}

        {activeTab === 'sell' && (
          <div className="space-y-4">
             <Card color="yellow" className="bg-gradient-to-br from-yellow-50 to-white">
                <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-3"><Calculator size={18}/> Fair Price Estimator</h3>
                <p className="text-sm text-yellow-800 mb-4">Calculate a fair selling price based on current market data.</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-yellow-900 block mb-1">Breed & Type</label>
                    <select className="w-full bg-white rounded-lg p-2.5 text-sm font-bold text-soil-800 border-2 border-transparent outline-none">
                      <option>Murrah Buffalo</option>
                      <option>HF Cow</option>
                      <option>Gir Cow</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="text-xs font-bold text-yellow-900 block mb-1">Lactation No.</label>
                       <input type="number" defaultValue={2} className="w-full bg-white rounded-lg p-2.5 text-sm font-bold text-soil-800 border-2 border-transparent outline-none" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-yellow-900 block mb-1">Milk Yield/Day</label>
                       <input type="number" defaultValue={12} className="w-full bg-white rounded-lg p-2.5 text-sm font-bold text-soil-800 border-2 border-transparent outline-none" />
                     </div>
                  </div>
                  
                  <button onClick={() => toast.success('Estimated Value: ₹82,000 - ₹88,000')} className="btn-primary bg-yellow-600 text-white w-full py-3 mt-2">Estimate Value</button>
                </div>
             </Card>

             <button className="w-full bg-white border border-neutral-200 p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-neutral-50">
               <div className="flex items-center gap-3">
                 <div className="bg-harvest-100 text-harvest-600 p-2 rounded-full"><Handshake size={20}/></div>
                 <div className="text-left">
                   <p className="font-bold text-soil-800 font-display">Post Classified Ad</p>
                   <p className="text-xs text-soil-500">Sell directly to local farmers</p>
                 </div>
               </div>
             </button>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-3">
             <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex items-start gap-4">
               <div className="bg-white p-2 rounded-lg text-sky-600 text-center shadow-sm w-16 shrink-0">
                  <p className="text-xs font-bold text-neutral-500 uppercase">Mon</p>
                  <p className="text-xl font-black font-display text-sky-800">14</p>
               </div>
               <div>
                  <h3 className="font-bold text-sky-900 text-lg">Loni Pashu Mandi</h3>
                  <p className="text-sm text-sky-700 mt-1">Biggest market for HF & Jersey cows in Ahmednagar district. ~40km from you.</p>
               </div>
             </div>
             
             <div className="bg-white p-4 rounded-xl border border-neutral-200 flex items-start gap-4">
               <div className="bg-neutral-50 p-2 rounded-lg text-neutral-600 text-center shadow-sm w-16 shrink-0 border border-neutral-200">
                  <p className="text-xs font-bold text-neutral-500 uppercase">Thu</p>
                  <p className="text-xl font-black font-display text-neutral-800">17</p>
               </div>
               <div>
                  <h3 className="font-bold text-soil-800 text-lg">Dhule Thursday Market</h3>
                  <p className="text-sm text-soil-600 mt-1">Known for high-quality Murrah Buffalos. Specialized cattle yard available.</p>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
