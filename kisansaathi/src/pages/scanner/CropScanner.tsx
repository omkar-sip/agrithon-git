// src/pages/scanner/CropScanner.tsx — Premium UI Upgrade
import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, Camera, Upload, X, Loader2, 
  FileText, Share2, Download, ShieldAlert, 
  CheckCircle2, AlertCircle, ShoppingBag, MessageSquare
} from 'lucide-react'
import { analyzeCropImage } from '../../services/gemini/geminiClient'
import { useLanguageStore } from '../../store/useLanguageStore'

type ScanState = 'idle' | 'preview' | 'analyzing' | 'result'

export default function CropScanner() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [scanState, setScanState] = useState<ScanState>('idle')
  const [imageData, setImageData] = useState<string | null>(null)
  const [cropType, setCropType] = useState('')
  const [notes, setNotes] = useState('')
  const [report, setReport] = useState('')
  const [error, setError] = useState('')

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageData(reader.result as string)
      setScanState('preview')
      setError('')
    }
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = async () => {
    if (!imageData) return
    setScanState('analyzing')
    setError('')
    try {
      const result = await analyzeCropImage({
        base64Image: imageData,
        cropType: cropType || undefined,
        additionalNotes: notes || undefined,
        language,
      })
      setReport(result)
      setScanState('result')
    } catch (err) {
      setError('Analysis failed. Please try again.')
      setScanState('preview')
    }
  }

  const handleReset = () => {
    setImageData(null)
    setReport('')
    setCropType('')
    setNotes('')
    setError('')
    setScanState('idle')
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col overflow-hidden">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header - Glassmorphic */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
          Crop Disease Scanner
        </h1>
        <div className="w-11" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── Idle State ────────────────────────────────────────── */}
        {scanState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 relative"
          >
            {/* Background Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-600/20 blur-[100px] rounded-full pointer-events-none" />

            {/* Viewfinder - Premium Design */}
            <div className="relative w-80 h-80 mb-12">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-[5px] border-l-[5px] border-brand-500 rounded-tl-[2.5rem]" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-[5px] border-r-[5px] border-brand-500 rounded-tr-[2.5rem]" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[5px] border-l-[5px] border-brand-500 rounded-bl-[2.5rem]" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[5px] border-r-[5px] border-brand-500 rounded-br-[2.5rem]" />

              <div className="absolute inset-4 border border-white/10 rounded-[2rem] overflow-hidden">
                 {/* Moving Scan Line */}
                <motion.div 
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Center Graphic */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                    <div className="w-20 h-20 bg-brand-600/30 rounded-full flex items-center justify-center mb-4">
                       <Camera size={32} className="text-brand-400" />
                    </div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] text-center">
                        Align Crop to Center
                    </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Stacked & Mobile First */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="group relative flex items-center justify-center gap-4 bg-brand-600 text-white rounded-[2rem] py-6 shadow-2xl active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Camera size={28} />
                <span className="text-lg font-bold">Snapshot Now</span>
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-[2rem] py-6 active:scale-95 transition-all"
              >
                <Upload size={24} className="text-brand-400" />
                <span className="text-lg font-bold">Upload Gallery</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Preview State ─────────────────────────────────────── */}
        {scanState === 'preview' && imageData && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex-1 flex flex-col justify-end"
          >
            <div className="flex-1 p-6 flex flex-col">
                <div className="relative flex-1 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                    <img src={imageData} alt="Crop Preview" className="w-full h-full object-cover" />
                    <button
                        onClick={handleReset}
                        className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-white"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-t-[3rem] p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-neutral-400 uppercase ml-2">Identify Crop</label>
                    <input
                        type="text"
                        value={cropType}
                        onChange={e => setCropType(e.target.value)}
                        placeholder="e.g. Tomato, Rice, Maize..."
                        className="w-full bg-neutral-100 border-none rounded-2xl px-6 py-4 text-neutral-900 placeholder:text-neutral-400 font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-neutral-400 uppercase ml-2">Observed Symptoms</label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Help Dr. Scan with more details..."
                        rows={2}
                        className="w-full bg-neutral-100 border-none rounded-2xl px-6 py-4 text-neutral-900 placeholder:text-neutral-400 font-bold outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    className="w-full py-5 bg-brand-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                >
                    <Loader2 className="hidden" size={24} />
                    🔬 Run AI Diagnostic
                </button>
            </div>
          </motion.div>
        )}

        {/* ── Analyzing State ───────────────────────────────────── */}
        {scanState === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-10"
          >
            <div className="relative w-48 h-48 mb-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-[3px] border-dashed border-brand-500/30 rounded-full"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 border-[2px] border-brand-500/20 rounded-full"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-brand-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                     <Loader2 size={48} className="text-white animate-spin" />
                  </div>
               </div>
            </div>
            <h2 className="text-3xl font-black text-white text-center mb-3" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Consulting Dr. AgriScan...
            </h2>
            <p className="text-white/50 text-center font-medium leading-relaxed">
                Analyzing pixels for pathogens, pests, and nutrient patterns. This usually takes 5-10 seconds.
            </p>
          </motion.div>
        )}

        {/* ── Result State ───────────────────────────────────────── */}
        {scanState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-6 py-4 h-48 flex-shrink-0">
               <img src={imageData!} className="w-full h-full object-cover rounded-[2.5rem] shadow-xl border-2 border-white/10" />
            </div>

            <div className="flex-1 bg-neutral-50 rounded-t-[3.5rem] overflow-y-auto no-scrollbar shadow-inner-lg mt-[-2rem]">
                <div className="p-8 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-md">
                            <FileText size={20} />
                         </div>
                         <h2 className="text-2xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>Report</h2>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 bg-white text-neutral-400 rounded-xl border border-neutral-100 shadow-sm active:scale-90 transition-all"><Share2 size={18} /></button>
                        <button className="p-3 bg-white text-neutral-400 rounded-xl border border-neutral-100 shadow-sm active:scale-90 transition-all"><Download size={18} /></button>
                      </div>
                   </div>

                   {/* Diagnostic Output - Premium Styling */}
                   <div className="space-y-6">
                      <div className="bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-4">
                         <div className="flex items-center gap-3 text-brand-600">
                            <ShieldAlert size={20} />
                            <h3 className="font-black text-lg">AI Diagnosis</h3>
                         </div>
                         <div className="text-neutral-700 leading-relaxed font-medium whitespace-pre-wrap">
                            {report}
                         </div>
                      </div>

                      {/* Recommendation Quick Actions */}
                      <div className="grid grid-cols-2 gap-4">
                         <button 
                           onClick={() => navigate('/sarpanchgpt')}
                           className="flex flex-col items-center gap-3 p-6 bg-brand-50 border border-brand-100 rounded-[2.5rem] hover:bg-brand-100 transition-colors"
                         >
                            <div className="w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><MessageSquare size={24} /></div>
                            <span className="text-xs font-black text-brand-900">Ask Expert</span>
                         </button>
                         <button 
                           onClick={() => navigate('/marketplace')}
                           className="flex flex-col items-center gap-3 p-6 bg-success-50 border border-success-100 rounded-[2.5rem] hover:bg-success-100 transition-colors"
                         >
                            <div className="w-12 h-12 bg-success-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><ShoppingBag size={24} /></div>
                            <span className="text-xs font-black text-success-900">Buy Medicine</span>
                         </button>
                      </div>
                   </div>

                   <button
                        onClick={handleReset}
                        className="w-full py-5 bg-neutral-900 text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                    >
                        <Camera size={24} /> Scan Next Problem
                    </button>
                    <div className="h-10" />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
