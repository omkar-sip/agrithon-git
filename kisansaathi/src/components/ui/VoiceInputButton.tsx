// src/components/ui/VoiceInputButton.tsx
import { Mic, Square } from 'lucide-react'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { useLanguageStore, LANGUAGE_META } from '../../store/useLanguageStore'
import clsx from 'clsx'

interface VoiceInputButtonProps {
  onResult: (text: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LANG_CODES: Record<string, string> = {
  hi: 'hi-IN', en: 'en-IN', kn: 'kn-IN', bn: 'bn-IN', ta: 'ta-IN', pa: 'pa-IN',
}

export default function VoiceInputButton({ onResult, size = 'md', className }: VoiceInputButtonProps) {
  const { language } = useLanguageStore()
  const { isListening, startListening, stopListening } = useVoiceInput({ onResult })

  const sizeClasses = { sm: 'w-9 h-9', md: 'w-12 h-12', lg: 'w-14 h-14' }

  return (
    <button
      onClick={() => isListening ? stopListening() : startListening(LANG_CODES[language] || 'hi-IN')}
      className={clsx(
        sizeClasses[size],
        'rounded-full flex items-center justify-center transition-all duration-200',
        isListening
          ? 'bg-danger-500 text-white animate-pulse shadow-lg'
          : 'bg-sky-100 text-sky-600 hover:bg-sky-200',
        className
      )}
      aria-label={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening
        ? <Square size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} />
        : <Mic size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} />
      }
    </button>
  )
}
