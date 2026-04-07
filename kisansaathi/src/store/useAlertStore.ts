// src/store/useAlertStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StatusColor } from '../utils/colorSystem'

export interface AppAlert {
  id: string
  type: 'weather_alert' | 'price_spike' | 'price_crash' | 'disease_alert' | 
        'scheme_deadline' | 'advisory' | 'vaccination_due' | 'harvest_ready'
  color: StatusColor
  title: string
  body: string
  farmAction?: string
  createdAt: number
  read: boolean
}

interface AlertState {
  alerts: AppAlert[]
  unreadCount: number
  addAlert: (alert: Omit<AppAlert, 'read' | 'createdAt'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearOld: () => void
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      unreadCount: 0,

      addAlert: (alert) => {
        const newAlert: AppAlert = { ...alert, read: false, createdAt: Date.now() }
        set(state => ({
          alerts: [newAlert, ...state.alerts].slice(0, 50), // keep last 50
          unreadCount: state.unreadCount + 1,
        }))
      },

      markRead: (id) => {
        set(state => ({
          alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },

      markAllRead: () => {
        set(state => ({
          alerts: state.alerts.map(a => ({ ...a, read: true })),
          unreadCount: 0,
        }))
      },

      clearOld: () => {
        const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days
        set(state => ({
          alerts: state.alerts.filter(a => a.createdAt > cutoff),
        }))
      },
    }),
    { name: 'sarpanch-alerts' }
  )
)
