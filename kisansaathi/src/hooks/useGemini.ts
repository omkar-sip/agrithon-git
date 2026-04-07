// src/hooks/useGemini.ts
import { useState, useCallback } from 'react'
import { useLanguageStore } from '../store/useLanguageStore'

interface UseGeminiOptions { cacheKey?: string }

export function useGemini<T = string>(
  geminiFn: (params: any) => Promise<T>,
  options: UseGeminiOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguageStore()

  const invoke = useCallback(async (params: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await geminiFn({ ...params, language })
      setData(result)
      return result
    } catch (err: any) {
      setError(err?.message || 'AI request failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [geminiFn, language])

  return { data, isLoading, error, invoke, reset: () => setData(null) }
}
