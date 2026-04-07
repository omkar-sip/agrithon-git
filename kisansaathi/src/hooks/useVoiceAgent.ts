// src/hooks/useVoiceAgent.ts
// Speech-to-Text → Gemini AI → Text-to-Speech pipeline
import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguageStore } from '../store/useLanguageStore'

export type VoiceAgentState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'

interface UseVoiceAgentOptions {
  onTranscript?: (text: string) => void
  onResponse?: (text: string) => void
  onStateChange?: (state: VoiceAgentState) => void
}

// Map app language codes → BCP-47 tags for SpeechRecognition
const LANG_BCP47: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  pa: 'pa-Guru-IN',
}

export function useVoiceAgent(
  aiResponseFn: (text: string) => Promise<string>,
  options: UseVoiceAgentOptions = {}
) {
  const { language } = useLanguageStore()
  const [state, setState_]   = useState<VoiceAgentState>('idle')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse]     = useState('')
  const [error, setError]           = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef       = useRef<SpeechSynthesisUtterance | null>(null)
  const abortRef       = useRef(false)

  const setState = (s: VoiceAgentState) => {
    setState_(s)
    options.onStateChange?.(s)
  }

  const stopAll = useCallback(() => {
    abortRef.current = true
    recognitionRef.current?.stop()
    window.speechSynthesis?.cancel()
    setState('idle')
  }, [])

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis || abortRef.current) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_BCP47[language] || 'en-IN'
    utterance.rate = 0.92
    utterance.pitch = 1

    // Prefer a local voice for the language
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)))
    if (preferred) utterance.voice = preferred

    utterance.onstart  = () => setState('speaking')
    utterance.onend    = () => setState('idle')
    utterance.onerror  = () => setState('idle')

    synthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [language])

  const startListening = useCallback(() => {
    if (state !== 'idle') { stopAll(); return }
    abortRef.current = false

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      setError('Voice input not supported in this browser. Please use Chrome.')
      setState('error')
      return
    }

    const recognition: SpeechRecognition = new SpeechRec()
    recognition.lang = LANG_BCP47[language] || 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart  = () => { setState('listening'); setTranscript(''); setError(null) }
    recognition.onerror  = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== 'aborted') {
        setError(`Microphone error: ${e.error}`)
        setState('error')
      }
    }
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(text)
      options.onTranscript?.(text)
    }
    recognition.onend = async () => {
      if (abortRef.current) return
      const finalText = transcript || ''
      if (!finalText.trim()) { setState('idle'); return }

      setState('processing')
      try {
        const aiText = await aiResponseFn(finalText)
        if (abortRef.current) return
        setResponse(aiText)
        options.onResponse?.(aiText)
        speak(aiText)
      } catch {
        setError('AI response failed')
        setState('error')
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [state, language, transcript, aiResponseFn, speak, stopAll])

  // Cleanup on unmount
  useEffect(() => () => stopAll(), [])

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  return {
    state,
    transcript,
    response,
    error,
    isSupported,
    isListening:   state === 'listening',
    isProcessing:  state === 'processing',
    isSpeaking:    state === 'speaking',
    startListening,
    stopAll,
    speak,
  }
}
