// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './i18n'
import 'leaflet/dist/leaflet.css'
import './index.css'

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    if (!registrations.length) {
      sessionStorage.removeItem('dev-sw-reset')
      return
    }

    await Promise.all(registrations.map((registration) => registration.unregister()))

    if (navigator.serviceWorker.controller && !sessionStorage.getItem('dev-sw-reset')) {
      sessionStorage.setItem('dev-sw-reset', '1')
      window.location.reload()
      return
    }

    sessionStorage.removeItem('dev-sw-reset')
  })
}

// Online/Offline event listeners
window.addEventListener('online',  () => window.dispatchEvent(new CustomEvent('network-change', { detail: { online: true } })))
window.addEventListener('offline', () => window.dispatchEvent(new CustomEvent('network-change', { detail: { online: false } })))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
