import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchMarketPrices, hasLiveMarketApi, type FetchMarketOptions } from '../services/marketService'
import { getTodaysPlan } from '../services/gemini/geminiClient'
import { useAuthStore } from '../store/useAuthStore'
import { useWeatherStore } from '../store/useWeatherStore'
import { useLanguageStore } from '../store/useLanguageStore'
import { useLocationStore } from '../store/useLocationStore'
import type { MarketPrice } from '../store/useMarketStore'

export interface LiveMarketInsight {
  commodity: string
  mandi: string
  state: string
  price: number
  trendPercent: number
  trend: 'up' | 'down' | 'stable'
  isLive: boolean
}

export interface AiTask {
  icon: string
  action: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  color: 'red' | 'yellow' | 'green'
}

interface HomeInsightsState {
  marketInsight: LiveMarketInsight | null
  topPrices: MarketPrice[]
  aiTasks: AiTask[]
  isMarketLoading: boolean
  isTasksLoading: boolean
}

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes
let cachedInsight: { data: LiveMarketInsight; fetchedAt: number } | null = null
let cachedTasks: { data: AiTask[]; fetchedAt: number } | null = null

const parseAiTasks = (raw: string): AiTask[] => {
  try {
    const cleaned = raw.trim().replace(/```json/g, '').replace(/```/g, '')
    const parsed = JSON.parse(cleaned) as AiTask[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter(t => t.action && t.priority && t.color).slice(0, 3)
    }
  } catch {
    // AI might not return valid JSON — that's okay, we use fallback
  }
  return []
}

export function useHomeInsights(): HomeInsightsState {
  const farmer = useAuthStore(s => s.farmer)
  const weather = useWeatherStore(s => s.current)
  const forecast = useWeatherStore(s => s.forecast)
  const language = useLanguageStore(s => s.language)
  const locationState = useLocationStore(s => s.state)
  const hasFetched = useRef(false)

  const [marketInsight, setMarketInsight] = useState<LiveMarketInsight | null>(
    cachedInsight && Date.now() - cachedInsight.fetchedAt < CACHE_TTL_MS ? cachedInsight.data : null
  )
  const [topPrices, setTopPrices] = useState<MarketPrice[]>([])
  const [aiTasks, setAiTasks] = useState<AiTask[]>(
    cachedTasks && Date.now() - cachedTasks.fetchedAt < CACHE_TTL_MS ? cachedTasks.data : []
  )
  const [isMarketLoading, setIsMarketLoading] = useState(!marketInsight)
  const [isTasksLoading, setIsTasksLoading] = useState(!aiTasks.length)

  const fetchMarketInsight = useCallback(async () => {
    if (cachedInsight && Date.now() - cachedInsight.fetchedAt < CACHE_TTL_MS) {
      setMarketInsight(cachedInsight.data)
      setIsMarketLoading(false)
      return
    }

    setIsMarketLoading(true)
    try {
      const opts: FetchMarketOptions = {}
      const primaryCrop = farmer?.crops?.[0]
      if (primaryCrop) opts.commodity = primaryCrop
      if (locationState) opts.state = locationState
      opts.limit = 50

      const prices = await fetchMarketPrices(opts)
      setTopPrices(prices.slice(0, 6))

      if (prices.length > 0) {
        // Find the farmer's primary crop, or use the top commodity
        let best = prices[0]
        if (primaryCrop) {
          const match = prices.find(p =>
            p.commodity.toLowerCase().includes(primaryCrop.toLowerCase())
          )
          if (match) best = match
        }

        const insight: LiveMarketInsight = {
          commodity: best.commodity,
          mandi: best.mandi,
          state: best.state,
          price: best.pricePerQuintal,
          trendPercent: best.trendPercent,
          trend: best.trend,
          isLive: hasLiveMarketApi(),
        }

        cachedInsight = { data: insight, fetchedAt: Date.now() }
        setMarketInsight(insight)
      }
    } catch (err) {
      console.warn('[HomeInsights] Market fetch failed', err)
    } finally {
      setIsMarketLoading(false)
    }
  }, [farmer?.crops, locationState])

  const fetchAiTasks = useCallback(async () => {
    if (cachedTasks && Date.now() - cachedTasks.fetchedAt < CACHE_TTL_MS) {
      setAiTasks(cachedTasks.data)
      setIsTasksLoading(false)
      return
    }

    if (!weather) return

    setIsTasksLoading(true)
    try {
      const crop = farmer?.crops?.[0] || 'General farming'
      const marketTrend = marketInsight
        ? `${marketInsight.commodity}: ₹${marketInsight.price}/qtl, ${marketInsight.trend} ${marketInsight.trendPercent}%`
        : 'Market data loading'

      const raw = await getTodaysPlan({
        crop,
        growthStage: 'Active growing season',
        weather: `${weather.description}, ${Math.round(weather.temp)}°C, humidity ${weather.humidity}%, wind ${weather.windSpeed}m/s, rain chance ${Math.round(weather.precipitationChance * 100)}%`,
        mandiPriceTrend: marketTrend,
        communityAlerts: forecast.length > 0
          ? `Next 3 days: ${forecast.slice(0, 3).map(d => d.description).join(', ')}`
          : 'No community alerts',
        language,
      })

      const tasks = parseAiTasks(raw)
      if (tasks.length > 0) {
        cachedTasks = { data: tasks, fetchedAt: Date.now() }
        setAiTasks(tasks)
      }
    } catch (err) {
      console.warn('[HomeInsights] AI tasks generation failed', err)
    } finally {
      setIsTasksLoading(false)
    }
  }, [weather, forecast, farmer?.crops, marketInsight, language])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    void fetchMarketInsight()
  }, [fetchMarketInsight])

  useEffect(() => {
    if (!weather || aiTasks.length > 0) return
    void fetchAiTasks()
  }, [weather, aiTasks.length, fetchAiTasks])

  return {
    marketInsight,
    topPrices,
    aiTasks,
    isMarketLoading,
    isTasksLoading,
  }
}
