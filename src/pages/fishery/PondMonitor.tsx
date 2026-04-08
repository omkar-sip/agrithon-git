import { useState } from 'react'
import { Waves, CalendarClock, Scale, FishSymbol, Activity } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function PondMonitor() {
  const [activeTab, setActiveTab] = useState<'status' | 'feed' | 'harvest'>('status')

  const handleUpdateLevel = () => toast.success('Water level logged successfully.')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-blue-800">📝 Talab Diary</h1>
        <p className="text-soil-500 text-sm -mt-3">Pond Monitoring & Harvesting</p>

        <select className="w-full bg-white border border-neutral-200 rounded-xl p-3 font-bold text-soil-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
           <option>Pond A (Catla/Rohu Mix - 2 Acres)</option>
           <option>Pond B (Tilapia - 1 Acre)</option>
           <option>+ Register New Pond</option>
        </select>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['status', 'feed', 'harvest'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'status' ? 'Water Level' : tab === 'feed' ? 'Feeding' : 'Harvesting'}
            </button>
          ))}
        </div>

        {activeTab === 'status' && (
          <div className="space-y-4">
             <Card color="blue" className="bg-gradient-to-br from-blue-50 to-white">
                <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3"><Waves size={18}/> Water Level Tracker</h3>
                <div className="flex gap-3 mb-2">
                   <div className="flex-1">
                     <label className="text-xs font-bold text-blue-800 block mb-1">Depth (ft)</label>
                     <input type="number" defaultValue={5.5} className="w-full bg-white rounded-lg p-2.5 font-bold text-blue-900 border border-blue-200 outline-none focus:ring-2 focus:ring-blue-300" />
                   </div>
                   <div className="flex-1">
                     <label className="text-xs font-bold text-blue-800 block mb-1">Water Clarity</label>
                     <select className="w-full bg-white rounded-lg p-2.5 font-bold text-blue-900 border border-blue-200 outline-none">
                        <option>Greenish (Good)</option>
                        <option>Muddy/Brown</option>
                        <option>Clear</option>
                     </select>
                   </div>
                </div>
                <button onClick={handleUpdateLevel} className="btn-primary w-full bg-blue-600 text-white mt-1">Log Reading</button>
             </Card>

             <Card>
                <div className="flex justify-between items-start mb-2">
                   <div>
                     <h3 className="font-bold text-soil-800 text-lg flex items-center gap-2">Pond A Specs</h3>
                     <p className="text-sm text-soil-500 mt-1">Stocked: Sep 1, 2023</p>
                   </div>
                   <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded-md">Healthy</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm border-t border-neutral-100 pt-3">
                   <div><span className="text-soil-500 block text-xs">Fish Count</span><span className="font-bold">6,000 Fingerlings</span></div>
                   <div><span className="text-soil-500 block text-xs">Total Area</span><span className="font-bold">2 Acres</span></div>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="space-y-4">
             <Card color="yellow" className="opacity-90">
                <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-3"><FishSymbol size={18}/> Daily Ration Tracker</h3>
                <div className="space-y-3">
                   <div>
                     <label className="text-xs font-bold text-yellow-900 block mb-1">Select Feed Type</label>
                     <div className="flex gap-2">
                        <button className="flex-1 bg-yellow-600 text-white font-bold py-2 rounded-lg text-sm border-2 border-yellow-700">Floating Pellet</button>
                        <button className="flex-1 bg-white text-yellow-800 font-bold py-2 rounded-lg text-sm border-2 border-yellow-300">Sinking Pellet</button>
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-yellow-900 block mb-1">Quantity (kg)</label>
                     <input type="number" defaultValue={15} className="w-full bg-white rounded-lg p-2.5 font-bold text-yellow-900 border border-yellow-300 outline-none" />
                   </div>
                   <button onClick={() => toast.success('Feed Logged.')} className="btn-primary w-full bg-yellow-600 text-white">Save Ration</button>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'harvest' && (
          <div className="space-y-4">
             <Card color="green" className="bg-gradient-to-br from-green-50 to-white">
                <h3 className="font-bold text-green-900 flex items-center gap-2 mb-2"><CalendarClock size={18}/> Harvest Estimation</h3>
                <p className="text-sm text-green-800 mb-4 border-b border-green-200 pb-3">Based on standard IMC (Indian Major Carp) growth rates and 90 days of stocking.</p>
                
                <div className="flex items-center gap-4 mb-4">
                   <div className="bg-white border border-green-200 p-3 rounded-xl flex-1 text-center">
                      <p className="text-xs font-bold text-green-700 mb-1">Avg. Current Wt.</p>
                      <p className="text-xl font-bold font-mono text-green-900 flex justify-center items-center gap-1"><Scale size={16}/> ~450g</p>
                   </div>
                   <div className="bg-white border border-green-200 p-3 rounded-xl flex-1 text-center">
                      <p className="text-xs font-bold text-green-700 mb-1">Target Wt.</p>
                      <p className="text-xl font-bold font-mono text-green-900 flex justify-center items-center gap-1"><Scale size={16}/> 1.2kg</p>
                   </div>
                </div>

                <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                   <p className="text-sm font-bold text-green-900 flex items-center gap-1"><Activity size={16}/> Expected Harvest: Jan 15, 2024</p>
                   <p className="text-xs text-green-800 mt-1">Approx 105 days remaining.</p>
                </div>
             </Card>

             <Card>
                <div className="flex justify-between items-center">
                   <span className="font-bold text-soil-800 text-lg">Next Sampling Netting</span>
                   <span className="text-xs font-bold bg-sky-100 text-sky-700 px-2 py-1 rounded-md mb-1 block">In 5 Days</span>
                </div>
                <p className="text-sm text-soil-500 mt-1">Check fish girth and adjust feed accordingly.</p>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
