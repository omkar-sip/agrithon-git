import { useMemo, useState } from 'react'
import { AlertTriangle, FileText, LoaderCircle, ShieldCheck, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import { analyzeContractRisk } from '../../services/ai'
import { saveContractAnalysis } from '../../services/firebase/firestoreService'
import { uploadContractDocument } from '../../services/firebase/storageService'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanguageStore } from '../../store/useLanguageStore'

const sanitizeText = (value: string) =>
  value
    .replace(/\0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const extractTextFromFile = async (file: File) => {
  const raw = await file.text()
  const cleaned = sanitizeText(raw)
  if (cleaned.length < 120) {
    throw new Error('Could not extract enough text from this file.')
  }
  return cleaned
}

export default function SaudaSuraksha() {
  const farmer = useAuthStore((state) => state.farmer)
  const { language } = useLanguageStore()

  const [file, setFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const status = useMemo(() => {
    const firstLine = analysis.split('\n')[0]?.trim().toUpperCase()
    if (firstLine.includes('SAFE')) return 'SAFE'
    if (firstLine.includes('RISKY')) return 'RISKY'
    return ''
  }, [analysis])

  const handleAnalyze = async () => {
    if (!file && !pastedText.trim()) {
      toast.error('Upload a contract or paste the contract text.')
      return
    }

    setIsLoading(true)

    try {
      let extractedText = pastedText.trim()

      if (file && !extractedText) {
        extractedText = await extractTextFromFile(file)
      }

      if (!extractedText) {
        toast.error('Paste the contract text for analysis.')
        return
      }

      let fileUrl = ''

      if (file && farmer?.uid) {
        try {
          const upload = await uploadContractDocument(farmer.uid, file)
          fileUrl = upload.fileUrl
        } catch (error) {
          console.error(error)
          toast.success('Contract analyzed locally. Cloud upload was skipped.')
        }
      }

      const result = await analyzeContractRisk({
        contractText: extractedText,
        language,
      })

      setAnalysis(result)

      if (farmer?.uid && fileUrl) {
        await saveContractAnalysis({
          userId: farmer.uid,
          fileUrl,
          analysis: result,
          fileName: file?.name || 'contract.txt',
        })
      }

      toast.success('Contract review ready.')
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Could not analyze the contract.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-5 max-w-3xl mx-auto w-full space-y-5 pb-24">
      <section className="rounded-[28px] bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-500 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/75">Sauda Suraksha</p>
            <h1 className="mt-2 text-3xl font-black" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Check contracts before you sign
            </h1>
            <p className="mt-2 text-sm text-white/90">
              Upload the contract, paste the important text, and get a short SAFE or RISKY summary in simple language.
            </p>
          </div>
          <div className="rounded-3xl bg-white/15 p-3">
            <ShieldCheck size={28} />
          </div>
        </div>
      </section>

      <Card className="space-y-4 border border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Contract input</h2>
            <p className="text-sm text-neutral-500">Best results come from pasted text or text-based files.</p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-sm font-medium text-neutral-700">
          <Upload size={18} />
          <span>{file ? file.name : 'Upload contract file'}</span>
          <input
            type="file"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-semibold text-neutral-700">Paste contract text</span>
          <textarea
            value={pastedText}
            onChange={(event) => setPastedText(event.target.value)}
            className="min-h-[180px] w-full rounded-2xl border border-neutral-200 px-3 py-3 outline-none focus:border-emerald-500"
            placeholder="Paste payment terms, quality clauses, delivery clauses, penalties, and dispute terms here..."
          />
        </label>

        <button
          type="button"
          onClick={() => void handleAnalyze()}
          disabled={isLoading}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? 'Checking contract...' : 'Analyze contract'}
        </button>
      </Card>

      <Card className="space-y-4 border border-neutral-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Risk summary</h2>
            <p className="text-sm text-neutral-500">Short explanation with risky clauses highlighted.</p>
          </div>
          {status ? (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                status === 'SAFE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {status}
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-5 text-sm text-neutral-500">
            <LoaderCircle size={18} className="animate-spin" />
            Reading clauses and preparing a farmer-friendly summary...
          </div>
        ) : analysis ? (
          <div className="rounded-2xl bg-neutral-50 px-4 py-4 text-sm leading-7 text-neutral-800 whitespace-pre-wrap">
            {analysis}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
            No analysis yet. Upload the file or paste the contract text to start.
          </div>
        )}

        <div className="flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle size={18} className="shrink-0" />
          <p>
            Always confirm payment date, quality rejection, transport responsibility, and dispute process before signing.
          </p>
        </div>
      </Card>
    </div>
  )
}
