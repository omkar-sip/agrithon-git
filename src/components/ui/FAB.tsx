// src/components/ui/FAB.tsx — Ask AI button, positioned above bottom nav
import { useNavigate } from 'react-router-dom'
import { Mic } from 'lucide-react'

interface FABProps { label?: string }

export default function FAB({ label = 'Sarpanch Salah' }: FABProps) {
  const navigate = useNavigate()
  return (
    <div className="shrink-0 flex justify-end px-4 -mt-16 pb-2 pointer-events-none relative z-[60]">
      <button
        onClick={() => navigate('/sarpanch-salah')}
        className="pointer-events-auto flex items-center gap-2 bg-brand-600 text-white rounded-full shadow-fab px-4 h-12 font-semibold text-sm hover:bg-brand-700 active:scale-95 transition-all"
      >
        <Mic size={16} />
        <span>{label}</span>
      </button>
    </div>
  )
}
