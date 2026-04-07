// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './i18n'
import './index.css'

// Online/Offline event listeners
window.addEventListener('online',  () => window.dispatchEvent(new CustomEvent('network-change', { detail: { online: true } })))
window.addEventListener('offline', () => window.dispatchEvent(new CustomEvent('network-change', { detail: { online: false } })))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
