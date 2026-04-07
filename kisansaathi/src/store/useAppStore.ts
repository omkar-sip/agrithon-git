// src/store/useAppStore.ts
import { create } from 'zustand'

interface AppState {
  isOnline: boolean
  isSyncing: boolean
  lastSyncAt: number | null
  pendingSyncCount: number
  setOnline: (online: boolean) => void
  setSyncing: (syncing: boolean) => void
  setSyncComplete: () => void
  incrementPending: () => void
  decrementPending: () => void
}

export const useAppStore = create<AppState>()((set) => ({
  isOnline: navigator.onLine,
  isSyncing: false,
  lastSyncAt: null,
  pendingSyncCount: 0,

  setOnline: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setSyncComplete: () => set({ isSyncing: false, lastSyncAt: Date.now() }),
  incrementPending: () => set(s => ({ pendingSyncCount: s.pendingSyncCount + 1 })),
  decrementPending: () => set(s => ({ pendingSyncCount: Math.max(0, s.pendingSyncCount - 1) })),
}))
