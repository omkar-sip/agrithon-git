// src/pages/splash/SplashScreen.tsx — English only
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useCategoryStore } from '../../store/useCategoryStore'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const { isAuthenticated, isGuest } = useAuthStore()
  const { category } = useCategoryStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated || isGuest) navigate('/', { replace: true })
      else if (category)   navigate('/login',    { replace: true })
      else if (language)   navigate('/category', { replace: true })
      else                 navigate('/language', { replace: true })
    }, 2600)
    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated, isGuest, category, language])

  return (
    <div className="min-h-screen bg-forest-500 flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #4ea04e 0%, transparent 55%), radial-gradient(circle at 70% 70%, #1c451c 0%, transparent 55%)' }}
      />

      {/* Wheat icon */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="text-[96px] mb-6 select-none"
      >
        🌾
      </motion.div>

      {/* App name */}
      <motion.h1
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.55 }}
        className="font-display font-bold text-4xl text-white text-center mb-2 tracking-tight"
      >
        Sarpanch AI
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.45 }}
        className="font-body text-harvest-200 text-lg text-center mb-12"
      >
        Your AI Farming Companion
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="flex gap-2"
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-harvest-300 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 text-forest-300 text-xs font-mono"
      >
        v1.0.0 · Built for 140M Indian Farmers
      </motion.p>
    </div>
  )
}
