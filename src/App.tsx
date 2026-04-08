// src/App.tsx
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Router from './router'
import { useAppStore } from './store/useAppStore'
import { useAuthStore } from './store/useAuthStore'
import { useWeatherStore } from './store/useWeatherStore'
import { initFCM } from './services/notificationService'

export default function App() {
  const { setOnline } = useAppStore()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const farmer = useAuthStore(s => s.farmer)
  const fetchAndSetWeather = useWeatherStore(s => s.fetchAndSetWeather)

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<{ online: boolean }>
      setOnline(evt.detail.online)
    }
    window.addEventListener('network-change', handler)
    return () => window.removeEventListener('network-change', handler)
  }, [setOnline])

  useEffect(() => {
    if (!isAuthenticated || !farmer?.coords) return
    void fetchAndSetWeather(farmer.coords.lat, farmer.coords.lon)
  }, [farmer?.coords, fetchAndSetWeather, isAuthenticated])

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    void initFCM()
  }, [])

  return (
    <>
      <Router />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '15px',
            borderRadius: '16px',
            background: '#1c451c',
            color: '#fff',
            minWidth: '280px',
          },
        }}
      />
    </>
  )
}
