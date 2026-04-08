import { useState } from 'react'
import { Droplet, AlertTriangle, Camera, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import { SkeletonCard } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'

export default function WaterQuality() {
  const [activeTab, setActiveTab] = useState<'params' | 'colorAI'>('params')
  const [ph, setPh] = useState(8.5)
  const [ammonia] = useState(1.2)
  const [loading, setLoading] = useState(false)
  const [aiResult, setAiResult] = useState('')

  const handleSimulateAI = () => {
    setLoading(true)
    setAiResult('')
    setTimeout(() => {
        setAiResult('AI Visual Analysis:\nWater color is Dark Green with thick surface scum.\n\nDiagnosis: Severe Algal Bloom (Excess Phytoplankton).\n\nAction: Stop feeding immediately. Run aerators at maximum capacity tonight to prevent DO crash. Apply agriculture lime (CaCO3).')
        setLoading(false)
    }, 2000)
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-blue-800">💧 Jal Parikshan</h1>
        <p className="text-soil-500 text-sm -mt-3">Water Quality & AI Color Analysis</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['params', 'colorAI'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'params' ? 'Pond Parameters' : 'AI Color Scan'}
            </button>
          ))}
        </div>

        {activeTab === 'params' && (
          <div className="space-y-4">
             <Card color="red" className="border-red-200 bg-red-50">
               <div className="flex gap-3">
                 <AlertTriangle size={24} className="text-red-600 shrink-0 mt-0.5" />
                 <div>
                    <h3 className="font-bold text-red-900 text-lg">Ammonia High Alert!</h3>
                    <p className="text-sm text-red-800">Reading: {ammonia} ppm (Danger &gt; 1.0)</p>
                    <p className="text-xs font-bold text-red-900 mt-2 p-2 bg-white rounded border border-red-200">ACTION: Change 20% water immediately and apply Zeolite.</p>
                 </div>
               </div>
             </Card>

             <Card>
                <div className="flex justify-between items-center mb-3 border-b border-neutral-100 pb-2">
                   <h3 className="font-bold text-soil-800 flex items-center gap-2"><Activity size={18}/> Manual Readings</h3>
                   <span className="text-xs text-soil-500 font-bold bg-neutral-100 px-2 py-1 rounded">Pond A</span>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Droplet size={20}/></div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-soil-600 block mb-1">Dissolved Oxygen (mg/L)</label>
                        <input type="number" defaultValue={5.2} className="w-full bg-neutral-50 rounded-lg p-2 font-bold text-soil-800 border border-neutral-200 outline-none" />
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">pH</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <label className="text-xs font-bold text-soil-600">pH Level: {ph}</label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ph > 8.0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{ph > 8.0 ? 'Alkaline' : 'Optimal'}</span>
                        </div>
                        <input type="range" min="4" max="11" step="0.1" value={ph} onChange={e => setPh(parseFloat(e.target.value))} className="w-full accent-yellow-500 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-neutral-400 mt-1 px-1"><span>4.0 (Acid)</span><span>7.0</span><span>11.0 (Alk)</span></div>
                      </div>
                   </div>

                   <button onClick={() => toast.success('Readings Saved.')} className="btn-primary w-full bg-blue-600 text-white mt-2">Log Parameters</button>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'colorAI' && (
          <div className="space-y-4">
             <Card color="blue" className="bg-gradient-to-br from-sky-50 to-white">
                <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2"><Camera size={18}/> Pond Color Scanner</h3>
                <p className="text-sm text-blue-800 mb-4 block">To check bloom health, take a clear photo of the pond surface under sunlight. Gemini AI will analyze the phytoplankton density.</p>

                <button onClick={handleSimulateAI} className="w-full border-2 border-dashed border-blue-300 bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 shadow-sm transition-colors">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Camera size={24}/></div>
                  <span className="text-sm font-bold text-blue-800 text-center">Scan Pond Water</span>
                </button>
             </Card>

             {loading && (
               <div className="space-y-2">
                 <SkeletonCard />
                 <p className="text-center text-sm font-bold text-blue-600 animate-pulse mt-2">AI Analyzing water reflectance patterns...</p>
               </div>
             )}

             {aiResult && !loading && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                 <Card color="red" className="border-2 border-red-200 bg-white shadow-md">
                   <h3 className="font-display font-bold text-xl text-red-900 mb-3 flex items-center gap-2">Diagnosis Result</h3>
                   <div className="bg-red-50 p-4 rounded-lg font-body text-red-900 whitespace-pre-wrap text-sm leading-relaxed border border-red-100 font-bold">
                     {aiResult}
                   </div>
                 </Card>
               </motion.div>
             )}
          </div>
        )}

      </div>
    </div>
  )
}
