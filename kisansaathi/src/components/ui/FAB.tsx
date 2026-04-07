// src/components/ui/FAB.tsx — Floating Action Button for "Ask Sarpanch AI"
import { useNavigate } from 'react-router-dom'
import { Mic } from 'lucide-react'

interface FABProps { label?: string }

export default function FAB({ label = 'Ask AI' }: FABProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/sarpanchgpt')}
      className="fixed bottom-20 right-4 z-[60] flex items-center gap-2 bg-forest-900 text-white rounded-full shadow-fab px-4 h-12 font-semibold text-sm hover:bg-forest-800 active:scale-95 transition-all"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Mic size={16} />
      <span>{label}</span>
    </button>
  )
}
