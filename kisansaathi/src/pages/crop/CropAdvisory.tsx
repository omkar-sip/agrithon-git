import { useState } from 'react'
import { Camera, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { diagnoseCropDisease } from '../../services/gemini/geminiClient'
import { useLanguageStore } from '../../store/useLanguageStore'
import Card from '../../components/ui/Card'
import VoiceInputButton from '../../components/ui/VoiceInputButton'
import { SkeletonCard } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'

const CROPS = ['Wheat','Rice','Cotton','Mustard','Maize','Tomato','Onion','Soybean','Potato','Groundnut']

export default function CropAdvisory() {
  const { language } = useLanguageStore()
  const [crop, setCrop] = useState('Wheat')
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageBase64, setImageBase64] = useState<string>('')
  const [tab, setTab] = useState<'doctor' | 'calendar'>('doctor')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImageBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDiagnose = async () => {
    if (!symptoms.trim() && !imageBase64) { 
      toast.error('Please describe symptoms or upload a photo'); 
      return 
    }
    setLoading(true)
    try {
      const res = await diagnoseCropDisease({ 
        cropType: crop, 
        symptomsDescription: symptoms || 'Visual symptoms in uploaded photo', 
        language,
        base64Image: imageBase64 || undefined
      })
      setResult(res)
    } catch { toast.error('AI response failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-forest-800">🩺 Crop Doctor</h1>
        <p className="text-soil-500 font-body text-sm -mt-3">Diagnose crop diseases and pests with AI</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl mb-4">
          <button onClick={() => setTab('doctor')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${tab === 'doctor' ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>Dr. AI</button>
          <button onClick={() => setTab('calendar')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${tab === 'calendar' ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>Calendar</button>
        </div>

        <div>
          <p className="font-bold text-soil-700 mb-2">Select Your Crop:</p>
          <div className="flex flex-wrap gap-2">
            {CROPS.map(c => (
              <button key={c} id={`crop-${c.toLowerCase()}`} onClick={() => setCrop(c)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${crop === c ? 'bg-forest-500 text-white' : 'bg-white border border-parchment text-soil-700'}`}>{c}</button>
            ))}
          </div>
        </div>

        {tab === 'doctor' && (
           <div className="space-y-5">
             <div className="bg-white rounded-2xl p-4 shadow-card">
               <p className="font-bold text-soil-700 mb-2">🔍 Describe Symptoms:</p>
               <div className="flex gap-2">
                 <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
                   placeholder="e.g. Yellow spots on leaves, plants wilting, white powder on stems..."
                   rows={3} className="flex-1 bg-parchment rounded-xl p-3 text-base text-soil-800 outline-none resize-none border-2 border-transparent focus:border-forest-400 transition-colors" />
                 <VoiceInputButton onResult={text => setSymptoms(p => p + ' ' + text)} size="sm" />
               </div>
               
               {imageBase64 && (
                 <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
                   <img src={imageBase64} alt="Crop symptom" className="w-full h-full object-cover" />
                   <button onClick={() => setImageBase64('')} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs">X</button>
                 </div>
               )}

               <div className="flex gap-2 mt-3">
                 <label className="flex items-center gap-2 bg-harvest-50 text-harvest-700 rounded-xl px-4 py-2.5 text-sm font-bold min-h-fit cursor-pointer hover:bg-harvest-100 transition-colors">
                   <Camera size={16} /> 
                   <span>Upload Photo</span>
                   <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                 </label>
               </div>
             </div>

             <button id="diagnose-btn" onClick={handleDiagnose} disabled={loading} className="btn-primary">
               {loading ? 'Diagnosing...' : 'Diagnose with AI 🩺'} <Send size={18} />
             </button>

             {loading && <SkeletonCard />}

             {result && !loading && (
               <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                 <Card color="yellow">
                   <p className="font-display font-bold text-lg text-soil-800 mb-2">AI Diagnosis & Advice:</p>
                   <p className="font-body text-sm text-soil-700 whitespace-pre-wrap">{result}</p>
                   <p className="text-xs text-soil-400 mt-3">✨ Powered by Gemini AI · Always consult your local agriculture officer for critical decisions.</p>
                 </Card>
               </motion.div>
             )}
           </div>
        )}

        {tab === 'calendar' && (
           <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Card color="green" className="bg-gradient-to-br from-forest-50 to-white">
                 <h3 className="font-bold text-forest-900 border-b border-forest-200 pb-2 mb-3">Rabi Season Cycle: {crop}</h3>
                 
                 <div className="relative border-l-2 border-forest-300 ml-3 space-y-6">
                    <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-forest-600 ring-4 ring-white" />
                       <p className="text-xs font-bold text-forest-600 uppercase tracking-wide">Base Prep (Oct 1-15)</p>
                       <p className="text-sm font-bold text-soil-800 mt-1">Deep Plowing & Basal Dose</p>
                       <p className="text-xs text-soil-600">Apply NPK 12:32:16 as recommended by soil test.</p>
                    </div>

                    <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white" />
                       <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Current Phase (Nov 15)</p>
                       <p className="text-sm font-bold text-soil-800 mt-1">First Irrigation (CRI Stage)</p>
                       <div className="bg-blue-50 px-2 py-1 mt-1 border border-blue-100 rounded-md">
                          <p className="text-xs font-bold text-blue-800">Action: Apply 1st top dressing of Nitrogen (Urea 40kg/acre)</p>
                       </div>
                    </div>

                    <div className="relative pl-6 opacity-60">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-400 ring-4 ring-white" />
                       <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Flowering (Jan 10)</p>
                       <p className="text-sm font-bold text-neutral-800 mt-1">Pest Management</p>
                    </div>

                    <div className="relative pl-6 opacity-60">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-mango-500 ring-4 ring-white" />
                       <p className="text-xs font-bold text-mango-600 uppercase tracking-wide">Harvesting (Mar 20)</p>
                       <p className="text-sm font-bold text-neutral-800 mt-1">Combine Harvesting</p>
                    </div>
                 </div>
              </Card>
           </motion.div>
        )}
      </div>
    </div>
  )
}
