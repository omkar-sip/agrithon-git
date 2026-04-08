import { useState } from 'react'
import { Skull, ShieldAlert, Calculator, Syringe, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function FlockDiary() {
  const [activeTab, setActiveTab] = useState<'mortality' | 'fcr' | 'health'>('mortality')

  const handleLogMortality = () => toast.success('Mortality count logged for today.')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-harvest-800">📋 Flock Diary</h1>
        <p className="text-soil-500 text-sm -mt-3">Batch Management & Bio-Security</p>

        <select className="w-full bg-white border border-neutral-200 rounded-xl p-3 font-bold text-soil-800 shadow-sm outline-none focus:ring-2 focus:ring-harvest-500">
           <option>Batch: Broiler A (Day 28)</option>
           <option>Batch: Layer B (Day 180)</option>
           <option>+ Add New Batch</option>
        </select>

        <div className="flex justify-between gap-2">
           <button className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg font-bold text-sm border border-red-100 flex justify-center items-center gap-1">
             <AlertTriangle size={16}/> Mortality Alert
           </button>
           <button className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg font-bold text-sm border border-green-100 flex justify-center items-center gap-1">
             <ShieldAlert size={16}/> Bio-Security
           </button>
        </div>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['mortality', 'fcr', 'health'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-harvest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'fcr' ? 'FCR Calc' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'mortality' && (
          <div className="space-y-4">
             <Card color="red" className="border-red-200">
                <h3 className="font-bold text-red-900 flex items-center gap-2 mb-3"><Skull size={18}/> Log Daily Mortality</h3>
                <div className="flex gap-3">
                   <input type="number" placeholder="No. of birds lost" className="flex-1 bg-white rounded-lg p-2.5 font-bold text-red-900 border border-red-200 outline-none" />
                   <button onClick={handleLogMortality} className="btn-primary bg-red-600 text-white">Save</button>
                </div>
                <p className="text-xs text-red-700 mt-2">Cumulative Mortality: 3% (Normal)</p>
             </Card>

             <Card>
                <div className="flex justify-between items-center mb-2">
                   <h3 className="font-bold text-soil-800">Recent Logs</h3>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm py-2 border-b">
                     <span className="text-soil-600">Oct 12 (Day 28)</span>
                     <span className="font-bold text-red-600">2 birds</span>
                   </div>
                   <div className="flex justify-between text-sm py-2 border-b">
                     <span className="text-soil-600">Oct 11 (Day 27)</span>
                     <span className="font-bold text-soil-800">0 birds</span>
                   </div>
                   <div className="flex justify-between text-sm py-2">
                     <span className="text-soil-600">Oct 10 (Day 26)</span>
                     <span className="font-bold text-red-600">1 bird</span>
                   </div>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'fcr' && (
          <div className="space-y-4">
             <Card color="yellow">
                <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-2"><Calculator size={18}/> Feed Conversion Ratio</h3>
                <p className="text-sm text-yellow-800 mb-4">Calculate how efficiently feed is converting to body weight.</p>
                <div className="space-y-3">
                   <div>
                     <label className="text-xs font-bold text-yellow-800 block mb-1">Total Feed Consumed (kg)</label>
                     <input type="number" defaultValue={850} className="w-full bg-white rounded-lg p-2.5 text-sm font-bold text-soil-800 outline-none" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-yellow-800 block mb-1">Total Weight of Birds (kg)</label>
                     <input type="number" defaultValue={600} className="w-full bg-white rounded-lg p-2.5 text-sm font-bold text-soil-800 outline-none" />
                   </div>
                   <button onClick={() => toast.success('FCR Is 1.41 - Excellent!')} className="btn-primary w-full bg-yellow-600 text-white">Calculate FCR</button>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-3">
             <Card>
                <div className="flex items-start gap-3">
                   <div className="bg-sky-100 text-sky-600 p-2 rounded-full shrink-0"><Syringe size={20}/></div>
                   <div className="flex-1">
                     <div className="flex justify-between">
                        <h3 className="font-bold text-soil-800 text-lg">Newcastle (RDCF)</h3>
                        <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">Scheduled</span>
                     </div>
                     <p className="text-sm text-soil-500 mt-1">Via Drinking Water. Due on Day 30.</p>
                   </div>
                </div>
             </Card>
             <Card color="green" className="opacity-60">
                <div className="flex items-start gap-3">
                   <div className="bg-green-100 text-green-600 p-2 rounded-full shrink-0"><CheckCircle2 size={20}/></div>
                   <div className="flex-1">
                     <h3 className="font-bold text-green-900 text-lg">Gumboro (IBD)</h3>
                     <p className="text-sm text-green-800 mt-1">Given on Day 14.</p>
                   </div>
                </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}

