import { useState } from 'react'
import { Camera, Image as ImageIcon, AlertTriangle, Activity, Stethoscope, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import { SkeletonCard } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'

export default function DiseaseScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [loading, setLoading] = useState(false)

  // Quick mock for camera/upload instead of complex native bridge for now
  const handleSimulateCapture = () => {
    setImagePreview('https://dummyimage.com/600x400/fff/aaa&text=Droppings+Photo')
    toast.success('Photo captured successfully.')
  }

  const handleDiagnose = async () => {
    if (!imagePreview) return
    setLoading(true)
    setDiagnosis('')
    try {
      // Mocking Gemini response based on instruction requirement: Coccidiosis from droppings
      setTimeout(() => {
        setDiagnosis('AI Analysis Complete:\nVisual symptoms detected match **Coccidiosis**. Presence of blood in droppings identified. \n\nIMMEDIATE ACTION:\n1. Isolate affected birds immediately.\n2. Administer Amprolium in drinking water.\n3. Increase litter dryness.\n4. Consult a Vet to confirm.')
        setLoading(false)
      }, 2000)
    } catch { toast.error('Check network connectivity') }
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-danger-800">🚨 Murgi Doctor</h1>
        <p className="text-soil-500 text-sm -mt-3">AI Disease Scanner (Photo Diagnosis)</p>

        <Card color="yellow" className="bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
           <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-2"><AlertTriangle size={18}/> Early Detection saves Flocks</h3>
           <p className="text-sm text-yellow-800 mb-4 block">Take a clear photo of abnormal bird droppings or an affected bird (e.g., swollen eyes, drooping wings) for instant AI analysis.</p>

           <div className="grid grid-cols-2 gap-3">
              <button onClick={handleSimulateCapture} className="w-full border-2 border-dashed border-red-300 bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-red-50">
                <div className="bg-red-100 p-2 rounded-full text-red-600"><Camera size={20}/></div>
                <span className="text-xs font-bold text-red-800 text-center">Open Camera</span>
              </button>
              <button disabled className="w-full border-2 border-dashed border-neutral-300 bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                <div className="bg-neutral-100 p-2 rounded-full text-neutral-600"><ImageIcon size={20}/></div>
                <span className="text-xs font-bold text-neutral-500 text-center">Gallery<br/>(Disabled)</span>
              </button>
           </div>
        </Card>

        {imagePreview && !loading && !diagnosis && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
             <div className="relative rounded-xl overflow-hidden border border-neutral-200 shadow-sm h-48 bg-black flex items-center justify-center">
                <p className="text-white relative z-10 font-bold opacity-50">[Simulated Image Captured]</p>
                <div className="absolute inset-0 bg-neutral-800 bg-opacity-50 blur-sm"></div>
             </div>
             
             <button onClick={handleDiagnose} className="btn-primary w-full bg-red-600 text-white flex justify-center items-center gap-2 py-3 shadow-md">
               <Activity size={18} className="animate-pulse" /> Run AI Diagnosis
             </button>
          </motion.div>
        )}

        {loading && (
          <div className="space-y-2">
            <SkeletonCard />
            <p className="text-center text-sm font-bold text-red-600 animate-pulse mt-2">Gemini Vision AI analyzing droppings pattern...</p>
          </div>
        )}

        {diagnosis && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card color="red" className="border-2 border-red-200 bg-white">
              <h3 className="font-display font-bold text-xl text-red-900 mb-3 flex items-center gap-2"><Stethoscope size={20} className="text-red-600"/> Diagnosis Result</h3>
              <div className="bg-red-50 p-4 rounded-lg font-body text-red-900 whitespace-pre-wrap text-sm leading-relaxed border border-red-100 font-bold">
                {diagnosis}
              </div>
            </Card>

            <button onClick={() => toast.success('Dialing Doc Anjali...')} className="btn-primary w-full bg-forest-600 text-white flex justify-center items-center gap-2 py-3 shadow-md mt-2">
               <Phone size={18} /> Emergency: Consult Nearest Vet (Free)
            </button>
          </motion.div>
        )}

      </div>
    </div>
  )
}
