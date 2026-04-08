import { useState } from 'react'
import { Egg, BarChart2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function EggLog() {
  const [activeTab, setActiveTab] = useState<'log' | 'trends'>('log')

  const handleSave = () => toast.success('Egg production logged successfully!')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-yellow-800">🥚 Anda Register</h1>
        <p className="text-soil-500 text-sm -mt-3">Daily Egg Log & Production Trends</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['log', 'trends'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-yellow-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'log' ? 'Daily Log' : 'Production Trends'}
            </button>
          ))}
        </div>

        {activeTab === 'log' && (
          <div className="space-y-4">
             <Card color="yellow" className="border-yellow-200">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-yellow-900 border-b border-yellow-200 pb-1">Today's Collection: Oct 12</h3>
                   <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md font-bold">Layer Flock B</span>
                </div>
                
                <div className="space-y-3">
                   <div>
                     <label className="text-xs font-bold text-yellow-800 block mb-1">Good Eggs Collected</label>
                     <div className="relative">
                        <input type="number" defaultValue={275} className="w-full bg-white rounded-lg p-3 pt-3 pb-3 pl-10 text-xl font-mono font-bold text-yellow-900 border border-yellow-200 outline-none" />
                        <Egg size={20} className="absolute left-3 top-3.5 text-yellow-500" />
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-red-700 block mb-1">Broken / Damaged Eggs</label>
                     <div className="relative">
                        <input type="number" defaultValue={5} className="w-full bg-white rounded-lg p-3 pt-3 pb-3 pl-10 text-xl font-mono font-bold text-red-900 border border-red-200 outline-none" />
                        <span className="absolute left-3 top-3.5 text-red-400 font-bold text-lg">⚠️</span>
                     </div>
                   </div>
                   <button onClick={handleSave} className="btn-primary w-full bg-yellow-600 text-white mt-2">Save Collection Log</button>
                </div>
             </Card>

             <Card color="green" className="opacity-80">
                <div className="flex items-start gap-2">
                   <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                   <div>
                      <p className="font-bold text-green-900">Breakage Ratio Normal</p>
                      <p className="text-sm text-green-800">Current breakage is 1.7%. Under the 3% safe limit.</p>
                   </div>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
             <Card className="border-red-200 bg-red-50">
               <div className="flex gap-3">
                 <AlertTriangle size={24} className="text-red-600 shrink-0" />
                 <div>
                    <h3 className="font-bold text-red-900 text-lg">Production Drop Alert!</h3>
                    <p className="text-sm text-red-800">Laying percentage dropped by <strong>8%</strong> in the last 48 hours (from 92% to 84%).</p>
                    <p className="text-xs font-bold text-red-900 mt-2">Possible causes: Heat stress, ND virus, or feed quality issue. Consult vet immediately.</p>
                 </div>
               </div>
             </Card>

             <Card>
               <h3 className="font-bold text-soil-800 flex items-center gap-2 mb-2"><BarChart2 size={18}/> Laying Percentage Track</h3>
               <p className="text-xs text-soil-500 mb-4">You vs. Breed Standard (BV-300)</p>
               
               {/* Mock Line Graph overlay style representation */}
               <div className="relative h-40 bg-neutral-50 border border-neutral-100 rounded-lg p-2 flex items-end justify-between gap-1 mt-2">
                 {/* Standard Curve Line mock */}
                 <div className="absolute top-10 left-0 w-full border-t-2 border-dashed border-green-300"></div>
                 <span className="absolute top-6 left-2 text-[10px] font-bold text-green-600">Standard: 93%</span>
                 
                 {[92, 93, 92, 90, 87, 85, 84].map((val, i) => (
                   <div key={i} className="flex flex-col items-center flex-1 h-full justify-end relative">
                     <span className={`text-[10px] mb-1 font-bold ${val < 90 ? 'text-red-500' : 'text-neutral-500'}`}>{val}%</span>
                     <div className={`w-full max-w-[20px] rounded-t-sm ${val < 90 ? 'bg-red-400' : 'bg-yellow-400'}`} style={{ height: `${val}%` }}></div>
                     <span className="text-[9px] text-neutral-400 mt-1 uppercase">D-{6-i}</span>
                   </div>
                 ))}
               </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
