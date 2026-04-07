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

  const handleDiagnose = async () => {
    if (!symptoms.trim()) { toast.error('Please describe the symptoms'); return }
    setLoading(true)
    try {
      const res = await diagnoseCropDisease({ cropType: crop, symptomsDescription: symptoms, language })
      setResult(res)
    } catch { toast.error('AI response failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-forest-800">🩺 Crop Doctor</h1>
        <p className="text-soil-500 font-body text-sm -mt-3">Diagnose crop diseases and pests with AI</p>

        <div>
          <p className="font-bold text-soil-700 mb-2">Select Your Crop:</p>
          <div className="flex flex-wrap gap-2">
            {CROPS.map(c => (
              <button key={c} id={`crop-${c.toLowerCase()}`} onClick={() => setCrop(c)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${crop === c ? 'bg-forest-500 text-white' : 'bg-white border border-parchment text-soil-700'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <p className="font-bold text-soil-700 mb-2">🔍 Describe Symptoms:</p>
          <div className="flex gap-2">
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
              placeholder="e.g. Yellow spots on leaves, plants wilting, white powder on stems..."
              rows={3} className="flex-1 bg-parchment rounded-xl p-3 text-base text-soil-800 outline-none resize-none border-2 border-transparent focus:border-forest-400 transition-colors" />
            <VoiceInputButton onResult={text => setSymptoms(p => p + text)} size="sm" />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex items-center gap-2 bg-harvest-50 text-harvest-700 rounded-xl px-4 py-2.5 text-sm font-bold min-h-fit"><Camera size={16} /> Upload Photo</button>
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
    </div>
  )
}
