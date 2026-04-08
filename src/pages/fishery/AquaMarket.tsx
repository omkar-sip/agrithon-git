import { useState } from 'react'
import { TrendingUp, Truck, Users, Calculator, MapPin, Anchor } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function AquaMarket() {
  const [activeTab, setActiveTab] = useState<'rates' | 'buyers' | 'transport'>('rates')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-sky-800">📈 Machli Bazar</h1>
        <p className="text-soil-500 text-sm -mt-3">Wholesale Rates & Buyer Directory</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['rates', 'buyers', 'transport'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-sky-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'rates' ? 'Live Rates' : tab === 'buyers' ? 'Buyers' : 'Logistics'}
            </button>
          ))}
        </div>

        {activeTab === 'rates' && (
          <div className="space-y-4">
             <Card className="border border-sky-200 shadow-sm mb-3 bg-gradient-to-r from-sky-50 to-white">
               <div className="flex justify-between items-start mb-2 border-b border-sky-100 pb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-sky-900 flex items-center gap-1"><Anchor size={16}/> Rohu (1-1.5kg)</h3>
                    <p className="text-xs text-sky-700 mt-0.5 flex items-center gap-1"><MapPin size={12}/> Howrah Wholesale Fish Market</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold text-sky-800 font-mono">₹145</p>
                    <p className="text-[10px] text-green-600 font-bold flex items-center justify-end gap-1 uppercase"><TrendingUp size={10}/> High Demand</p>
                 </div>
               </div>
               <div className="flex justify-between text-xs font-bold px-1">
                 <span className="text-neutral-500">Retail Est: ₹220/kg</span>
                 <span className="text-sky-600 underline">Price History →</span>
               </div>
             </Card>
             
             <Card className="shadow-sm mb-3">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">Catla (2kg+)</h3>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><MapPin size={12}/> Local Mandi</p>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-soil-800 font-mono">₹180</p>
                    <p className="text-[10px] text-neutral-500 flex items-center justify-end gap-1">Stable</p>
                 </div>
               </div>
             </Card>
             
             <Card color="yellow" className="mt-4">
                <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-2"><Calculator size={16}/> Instant Profitability Estimator</h3>
                <div className="grid grid-cols-2 gap-2 mb-2">
                   <div>
                     <label className="text-[10px] uppercase font-bold text-yellow-800">Total FCR Cost/kg</label>
                     <input type="number" defaultValue={85} className="w-full bg-white p-2 rounded text-sm font-bold border border-yellow-200 outline-none"/>
                   </div>
                   <div>
                     <label className="text-[10px] uppercase font-bold text-yellow-800">Expected Sale ₹/kg</label>
                     <input type="number" defaultValue={145} className="w-full bg-white p-2 rounded text-sm font-bold border border-yellow-200 outline-none"/>
                   </div>
                </div>
                <div className="bg-yellow-200 text-yellow-900 p-2 rounded text-center font-bold text-sm">
                   Estimated Margin: ₹60 / kg (+70% ROI)
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'buyers' && (
          <div className="space-y-4">
             <Card>
               <div className="flex justify-between items-start mb-2">
                 <div className="flex gap-3">
                    <div className="bg-sky-100 text-sky-600 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0"><Users size={20}/></div>
                    <div>
                      <h3 className="font-bold text-soil-800 text-base">Coastal Aqua Exports</h3>
                      <p className="text-xs text-soil-500">Bulk Buyer • Vannamei Shrimp Specialist</p>
                      <p className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-sm inline-block mt-1 font-bold">Verified Corporate</p>
                    </div>
                 </div>
               </div>
               <button onClick={() => toast.success('Connecting to buyer...')} className="btn-secondary w-full text-sm py-2 mt-2">Contact Buyer</button>
             </Card>

             <Card>
               <div className="flex justify-between items-start mb-2">
                 <div className="flex gap-3">
                    <div className="bg-neutral-100 text-neutral-600 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0"><Users size={20}/></div>
                    <div>
                      <h3 className="font-bold text-soil-800 text-base">Ramesh Fish Traders</h3>
                      <p className="text-xs text-soil-500">Local Mandi Aggregator • IMC</p>
                      <p className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-sm inline-block mt-1 font-bold">Cash on pickup</p>
                    </div>
                 </div>
               </div>
               <button onClick={() => toast.success('Connecting to buyer...')} className="btn-secondary w-full text-sm py-2 mt-2">Contact Buyer</button>
             </Card>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-4">
             <Card color="blue" className="bg-gradient-to-br from-sky-50 to-white">
                <h3 className="font-bold text-sky-900 flex items-center gap-2 mb-2"><Truck size={18}/> Cold Chain Logistics</h3>
                <p className="text-sm text-sky-800 mb-4 block">Book insulated ice boxes and refrigerated transport (Reefer Vans) to prevent spoilage during mandi transport.</p>
                
                <div className="space-y-3">
                   <div>
                     <label className="text-xs font-bold text-sky-800 block mb-1">Requirement</label>
                     <select className="w-full bg-white rounded-lg p-2.5 font-bold text-sky-900 border border-sky-200 outline-none">
                        <option>10 Insulated Ice Boxes (50L)</option>
                        <option>1-Ton Reefer Pickup Truck</option>
                     </select>
                   </div>
                   <button onClick={() => toast.success('Transport booking requested.')} className="btn-primary w-full bg-sky-600 text-white">Book Transport</button>
                </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
