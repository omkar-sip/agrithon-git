// src/store/useTodaysPlanStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TodaysPlanDecision {
  icon: string
  action: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  color: 'red' | 'yellow' | 'green'
  source: 'weather' | 'market' | 'advisory' | 'community'
  expanded?: boolean
}

interface TodaysPlanState {
  decisions: TodaysPlanDecision[]
  generatedAt: number | null
  cropContext: string | null
  isLoading: boolean
  setPlan: (plan: TodaysPlanDecision[], crop: string) => void
  setLoading: (loading: boolean) => void
  isStale: () => boolean
  toggleExpanded: (index: number) => void
}

export const useTodaysPlanStore = create<TodaysPlanState>()(
  persist(
    (set, get) => ({
      decisions: [],
      generatedAt: null,
      cropContext: null,
      isLoading: false,

      setPlan: (decisions, cropContext) =>
        set({ decisions, cropContext, generatedAt: Date.now() }),

      setLoading: (isLoading) => set({ isLoading }),

      isStale: () => {
        const { generatedAt } = get()
        if (!generatedAt) return true
        return Date.now() - generatedAt > 6 * 60 * 60 * 1000 // 6 hours
      },

      toggleExpanded: (index) => {
        set(state => ({
          decisions: state.decisions.map((d, i) =>
            i === index ? { ...d, expanded: !d.expanded } : d
          )
        }))
      },
    }),
    { name: 'sarpanch-todays-plan' }
  )
)
