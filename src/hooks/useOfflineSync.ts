// src/hooks/useOfflineSync.ts
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useOfflineSync(syncFn?: () => Promise<void>) {
  const { isOnline, setSyncing, setSyncComplete } = useAppStore()

  useEffect(() => {
    if (isOnline && syncFn) {
      setSyncing(true)
      syncFn()
        .then(setSyncComplete)
        .catch(() => setSyncComplete())
    }
  }, [isOnline])

  return { isOnline }
}
