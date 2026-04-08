// src/components/shared/BannerCarousel.tsx — Auto-sliding banner carousel
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export interface BannerSlide {
  id: string
  image: string
  alt: string
  route: string
}

interface BannerCarouselProps {
  slides: BannerSlide[]
  /** Auto-slide interval in milliseconds (default: 4000) */
  interval?: number
}

export default function BannerCarousel({ slides, interval = 4000 }: BannerCarouselProps) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef(0)
  const intervalRef = useRef<number | null>(null)

  // Stable next function using ref to avoid stale closure
  const currentRef = useRef(current)
  currentRef.current = current

  const startAutoSlide = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
    }
    if (slides.length <= 1) return

    intervalRef.current = window.setInterval(() => {
      setDirection(1)
      setCurrent(prev => (prev + 1) % slides.length)
    }, interval)
  }, [slides.length, interval])

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Start auto-slide on mount
  useEffect(() => {
    startAutoSlide()
    return () => stopAutoSlide()
  }, [startAutoSlide, stopAutoSlide])

  const goTo = useCallback((index: number) => {
    setDirection(index > currentRef.current ? 1 : -1)
    setCurrent(index)
    // Restart auto-slide after manual interaction
    startAutoSlide()
  }, [startAutoSlide])

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setDirection(1)
        setCurrent(prev => (prev + 1) % slides.length)
      } else {
        setDirection(-1)
        setCurrent(prev => (prev - 1 + slides.length) % slides.length)
      }
      startAutoSlide()
    }
  }

  if (slides.length === 0) return null

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0.3 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0.3 }),
  }

  return (
    <div className="w-full">
      {/* Carousel container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-card"
        style={{ aspectRatio: '653 / 308' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.button
            key={slides[current].id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => navigate(slides[current].route)}
            className="absolute inset-0 w-full h-full cursor-pointer block"
          >
            <img
              src={slides[current].image}
              alt={slides[current].alt}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`
                rounded-full transition-all duration-300 min-h-0 min-w-0 p-0
                ${i === current
                  ? 'w-5 h-2 bg-brand-500'
                  : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'}
              `}
            />
          ))}
        </div>
      )}
    </div>
  )
}
