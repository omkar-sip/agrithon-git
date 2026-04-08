// src/hooks/useVoiceInput.ts
import { useState, useRef, useCallback } from 'react'

interface UseVoiceInputOptions { onResult?: (transcript: string) => void }

export function useVoiceInput({ onResult }: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript]   = useState('')
  const [error, setError]             = useState<string | null>(null)
  const recogRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback((lang = 'hi-IN') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice input not supported in this browser')
      return
    }
    const SpeechRecog = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recog = new SpeechRecog()
    recog.lang = lang
    recog.continuous = false
    recog.interimResults = true

    recog.onresult = (e: SpeechRecognitionEvent) => {
      const text = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('')
      setTranscript(text)
      if (e.results[e.results.length - 1].isFinal) {
        onResult?.(text)
        setIsListening(false)
      }
    }
    recog.onerror = (e: SpeechRecognitionErrorEvent) => {
      setError(e.error)
      setIsListening(false)
    }
    recog.onend = () => setIsListening(false)

    recogRef.current = recog
    recog.start()
    setIsListening(true)
    setError(null)
  }, [onResult])

  const stopListening = useCallback(() => {
    recogRef.current?.stop()
    setIsListening(false)
  }, [])

  return { isListening, transcript, error, startListening, stopListening }
}
