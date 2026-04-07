// src/App.tsx
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Router from './router'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const { setOnline } = useAppStore()

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<{ online: boolean }>
      setOnline(evt.detail.online)
    }
    window.addEventListener('network-change', handler)
    return () => window.removeEventListener('network-change', handler)
  }, [setOnline])

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
