import { useState } from 'react'
import { Camera, FlaskConical, MapPin, Search } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'
import { SkeletonCard } from '../../components/ui/Skeleton'

export default function SoilHealth() {
  const [activeTab, setActiveTab] = useState<'report' | 'labs'>('report')
  const [loading, setLoading] = useState(false)
  const [npk, setNpk] = useState({ n: '', p: '', k: '' })
  
  const handleSimulateOCR = () => {
    setLoading(true)
    setTimeout(() => {
      setNpk({ n: '120', p: '25', k: '40' })
      toast.success('Soil card scanned successfully!')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-soil-800">🌱 Mitti Ki Sehat</h1>
        <p className="text-soil-500 text-sm -mt-3">Soil Health Card & Lab Locator</p>

        {/* Custom Tab Bar */}
        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['report', 'labs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'report' ? 'Soil Report' : 'Testing Labs'}
            </button>
          ))}
        </div>

        {activeTab === 'report' && (
          <div className="space-y-4">
            
            <button onClick={handleSimulateOCR} disabled={loading} className="w-full border-2 border-dashed border-forest-300 bg-forest-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-forest-100 transition-colors active:scale-95">
               <div className="bg-white p-3 rounded-full shadow-sm text-forest-600"><Camera size={24}/></div>
               <div className="text-center">
                 <p className="font-bold text-forest-800">Scan Soil Health Card</p>
                 <p className="text-xs text-forest-600 mt-1">Upload a photo to auto-fill (OCR)</p>
               </div>
            </button>

            {loading && <SkeletonCard />}

            {!loading && (
              <Card>
                <h3 className="font-bold text-soil-800 mb-3 flex items-center gap-2"><FlaskConical size={18}/> Manual NPK Entry</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-soil-500 mb-1 block">Nitrogen (N)</label>
                    <input type="number" value={npk.n} onChange={e => setNpk({...npk, n: e.target.value})} className="w-full bg-parchment rounded-lg p-2 text-center font-mono font-bold text-forest-800 border-2 border-transparent focus:border-forest-300" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-soil-500 mb-1 block">Phosphorus (P)</label>
                    <input type="number" value={npk.p} onChange={e => setNpk({...npk, p: e.target.value})} className="w-full bg-parchment rounded-lg p-2 text-center font-mono font-bold text-forest-800 border-2 border-transparent focus:border-forest-300" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-soil-500 mb-1 block">Potassium (K)</label>
                    <input type="number" value={npk.k} onChange={e => setNpk({...npk, k: e.target.value})} className="w-full bg-parchment rounded-lg p-2 text-center font-mono font-bold text-forest-800 border-2 border-transparent focus:border-forest-300" placeholder="0" />
                  </div>
                </div>

                {npk.n && (
                  <div className="mt-4 p-3 bg-harvest-50 rounded-lg border border-harvest-200">
                    <p className="text-xs font-bold text-harvest-800 mb-1">Fertilizer Recommendation (Tomato):</p>
                    <p className="text-sm text-harvest-900">Your Nitrogen is adequate. Reduce Urea application by 10kg/acre. Add Zinc sulphate to improve flowering.</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-3">
             <div className="relative">
               <Search className="absolute left-3 top-3 text-neutral-400" size={18} />
               <input type="text" placeholder="Search near Nashik..." className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl shadow-sm" />
             </div>
             
             <Card>
               <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">Govt Soil Testing Lab KVK</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1"><MapPin size={14}/> Agricultural University, Nashik</p>
                 </div>
                 <span className="badge bg-green-100 text-green-800">Govt</span>
               </div>
               <button className="btn-primary mt-3 w-full border border-forest-600 bg-forest-50 text-forest-700">Get Directions</button>
             </Card>

             <Card>
               <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">AgriCare Private Lab</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1"><MapPin size={14}/> Pimpalgaon Baswant, Nashik</p>
                 </div>
                 <span className="badge bg-neutral-100 text-neutral-600">Private</span>
               </div>
               <button className="btn-primary mt-3 w-full border border-forest-600 bg-forest-50 text-forest-700">Get Directions</button>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
