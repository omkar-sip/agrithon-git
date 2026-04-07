// src/components/ui/FAB.tsx — Floating Action Button for "Ask Sarpanch AI"
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

interface FABProps { label?: string }

export default function FAB({ label = 'Ask AI' }: FABProps) {
  const navigate = useNavigate()
  return (
    <motion.button
      onClick={() => navigate('/sarpanchgpt')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-forest-900 text-white rounded-full shadow-fab px-4 h-12 font-semibold text-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Mic size={16} />
      <span>{label}</span>
    </motion.button>
  )
}
