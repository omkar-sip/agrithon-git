import { useState } from 'react'
import { Droplet, BarChart3, TrendingDown, Factory, CalendarHeart } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function MilkYieldTracker() {
  const [activeTab, setActiveTab] = useState<'log' | 'trends' | 'society'>('log')

  const handleSave = () => toast.success('Milk yield saved successfully!')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-sky-800">🥛 Doodh Diary</h1>
        <p className="text-soil-500 text-sm -mt-3">Daily Yield & Breeding Cycle</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['log', 'trends', 'society'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-sky-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'society' ? 'Co-ops' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'log' && (
          <div className="space-y-4">
             <Card color="blue" className="bg-gradient-to-br from-sky-50 to-white">
                <div className="flex justify-between items-center mb-3 border-b border-sky-100 pb-2">
                   <h3 className="font-bold text-sky-900">Today's Entry (Oct 12)</h3>
                   <span className="text-xs font-bold text-sky-700 bg-white px-2 py-1 rounded-md">HF Cow #01</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div>
                     <label className="text-xs font-bold text-sky-700 block mb-1">Morning (AM) Liters</label>
                     <div className="relative">
                        <input type="number" defaultValue={8.5} className="w-full bg-white rounded-lg p-3 pt-3 pb-3 pl-10 text-xl font-mono font-bold text-sky-900 border-2 border-transparent focus:border-sky-300 outline-none" />
                        <Droplet size={20} className="absolute left-3 top-3.5 text-sky-300" />
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-sky-700 block mb-1">Evening (PM) Liters</label>
                     <div className="relative">
                        <input type="number" placeholder="0.0" className="w-full bg-white rounded-lg p-3 pt-3 pb-3 pl-10 text-xl font-mono font-bold text-sky-900 border-2 border-transparent focus:border-sky-300 outline-none" />
                        <Droplet size={20} className="absolute left-3 top-3.5 text-sky-300" />
                     </div>
                   </div>
                </div>
                
                <button onClick={handleSave} className="btn-primary w-full bg-sky-600 text-white">Save Today's Yield</button>
             </Card>

             <Card color="orange" className="border-mango-200">
               <h3 className="font-bold text-mango-900 flex items-center gap-2 mb-2"><CalendarHeart size={18}/> Breeding Cycle Status</h3>
               <p className="text-sm text-mango-800">HF Cow #01 is in Day 180 of lactation. Expect gradual yield drop. <strong>Pregnancy check due next week.</strong></p>
             </Card>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            <Card>
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-soil-800 flex items-center gap-2"><BarChart3 size={18}/> Weekly Yield</h3>
                 <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md flex items-center gap-1"><TrendingDown size={12}/> -1.2L vs Peak</span>
               </div>
               
               {/* Mock Bar Chart */}
               <div className="flex items-end justify-between h-32 gap-2 pt-4 border-t border-neutral-100 mt-2">
                 {[12, 13, 14, 13.5, 12.8, 12.5, 12].map((val, i) => (
                   <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-sky-200 rounded-t-sm relative" style={{ height: `${(val / 15) * 100}%` }}>
                         <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-neutral-500">{val}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">Day {i+1}</span>
                   </div>
                 ))}
               </div>
            </Card>

            <Card color="yellow">
               <p className="font-bold text-yellow-800 mb-1">Breed Benchmark (HF)</p>
               <p className="text-sm text-yellow-700">Average yield for this stage is ~13.5L/day. You are performing <strong>below average (12L)</strong>. Check 'Feed Calculator' for ration adjustments.</p>
            </Card>
          </div>
        )}

        {activeTab === 'society' && (
          <div className="space-y-4">
             <Card>
               <div className="flex items-start gap-3 border-b pb-3 mb-3">
                 <div className="bg-sky-100 text-sky-600 p-2 rounded-lg shrink-0"><Factory size={24}/></div>
                 <div>
                   <h3 className="font-bold text-soil-800 text-lg">Gokul Dairy Co-op</h3>
                   <p className="text-sm text-soil-500">Bulk Milk Cooling Center (2.5 km)</p>
                 </div>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-soil-600">Today's Rate (6% Fat):</span>
                  <span className="font-bold text-sky-700 font-mono text-lg">₹38.50/L</span>
               </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
