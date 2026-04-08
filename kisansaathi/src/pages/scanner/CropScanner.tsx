// src/pages/scanner/CropScanner.tsx — Crop Disease Detection with Gemini Vision
import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Camera, Upload, X, Loader2, FileText, Share2, Download } from 'lucide-react'
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
    <div className="page-root bg-neutral-900">
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

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
          🔬 Crop Disease Scanner
        </h1>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">

        {/* ── Idle State — Camera viewfinder ──────────────────── */}
        {scanState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            {/* Viewfinder */}
            <div className="relative w-72 h-72 mb-8">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-brand-500 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-brand-500 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-brand-500 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-brand-500 rounded-br-2xl" />

              {/* Scan line */}
              <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-scan-line" />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl block mb-3">🌿</span>
                  <p className="text-white/60 text-sm font-medium">Point camera at<br />affected crop</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 w-full max-w-xs">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex flex-col items-center gap-2 bg-brand-600 text-white rounded-2xl py-5 shadow-fab active:scale-95 transition-transform"
              >
                <Camera size={28} />
                <span className="text-sm font-semibold">Take Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex flex-col items-center gap-2 bg-white/10 text-white rounded-2xl py-5 border border-white/20 active:scale-95 transition-transform"
              >
                <Upload size={28} />
                <span className="text-sm font-semibold">Upload</span>
              </button>
            </div>

            <p className="text-white/40 text-xs text-center mt-6 max-w-xs leading-relaxed">
              Powered by Gemini AI · Expert agricultural pathology analysis with treatment recommendations
            </p>
          </motion.div>
        )}

        {/* ── Preview State — Image + crop type ───────────────── */}
        {scanState === 'preview' && imageData && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col overflow-y-auto no-scrollbar"
          >
            {/* Image preview */}
            <div className="relative mx-4 rounded-2xl overflow-hidden shadow-scanner">
              <img src={imageData} alt="Crop" className="w-full h-56 object-cover" />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center min-h-fit"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Optional fields */}
            <div className="px-4 py-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1 block">Crop Type (optional)</label>
                <input
                  type="text"
                  value={cropType}
                  onChange={e => setCropType(e.target.value)}
                  placeholder="e.g. Wheat, Cotton, Tomato"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1 block">Additional Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Describe what you see — yellowing, spots, insects..."
                  rows={2}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-brand-500 resize-none min-h-fit"
                />
              </div>

              {error && (
                <div className="bg-danger-500/20 border border-danger-500/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-danger-300">{error}</p>
                </div>
              )}
            </div>

            {/* Analyze button */}
            <div className="px-4 pb-8 mt-auto">
              <button
                onClick={handleAnalyze}
                className="btn-brand flex items-center justify-center gap-2"
              >
                <span className="text-lg">🔬</span> Analyze with AI
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Analyzing State ─────────────────────────────────── */}
        {scanState === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-brand-600/20 flex items-center justify-center">
                <Loader2 size={40} className="text-brand-500 animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-brand-500/10 animate-pulse" />
            </div>
            <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Analyzing Crop...
            </p>
            <p className="text-white/50 text-sm text-center max-w-xs">
              Dr. AgriScan is examining your crop image for diseases, pests, and nutrient deficiencies
            </p>
          </motion.div>
        )}

        {/* ── Result State — Diagnostic Report ────────────────── */}
        {scanState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Small image preview */}
            {imageData && (
              <div className="mx-4 mb-3 h-32 rounded-xl overflow-hidden">
                <img src={imageData} alt="Crop" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Report card */}
            <div className="flex-1 bg-white rounded-t-3xl overflow-y-auto no-scrollbar">
              <div className="px-5 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-brand-600" />
                  <h2 className="text-lg font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                    Diagnostic Report
                  </h2>
                </div>

                {/* Report content */}
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-neutral-800 leading-relaxed font-body bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                    {report}
                  </pre>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-5">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-semibold hover:bg-neutral-200 transition-colors">
                    <Share2 size={15} /> Share
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-semibold hover:bg-neutral-200 transition-colors">
                    <Download size={15} /> Save
                  </button>
                </div>

                {/* Scan again */}
                <button
                  onClick={handleReset}
                  className="btn-brand mt-4 flex items-center justify-center gap-2"
                >
                  <Camera size={18} /> Scan Another Crop
                </button>

                <div className="h-8" />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
