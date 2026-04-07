// src/services/marketService.ts — Agmarknet / mandi price stub
import type { MarketPrice } from '../store/useMarketStore'

// Mock mandi prices until Agmarknet API key is configured
export const getMockMarketPrices = (): MarketPrice[] => [
  { id: '1', commodity: 'Tomato',    mandi: 'Nashik',     state: 'Maharashtra', pricePerQuintal: 1240, trend: 'up',     trendPercent: 8,  updatedAt: new Date().toISOString(), color: 'green' },
  { id: '2', commodity: 'Onion',     mandi: 'Lasalgaon',  state: 'Maharashtra', pricePerQuintal: 890,  trend: 'down',   trendPercent: -5, updatedAt: new Date().toISOString(), color: 'red' },
  { id: '3', commodity: 'Wheat',     mandi: 'Delhi',      state: 'Delhi',       pricePerQuintal: 2150, trend: 'stable', trendPercent: 0,  updatedAt: new Date().toISOString(), color: 'yellow' },
  { id: '4', commodity: 'Potato',    mandi: 'Agra',       state: 'UP',          pricePerQuintal: 680,  trend: 'up',     trendPercent: 3,  updatedAt: new Date().toISOString(), color: 'green' },
  { id: '5', commodity: 'Soybean',   mandi: 'Indore',     state: 'MP',          pricePerQuintal: 4200, trend: 'down',   trendPercent: -2, updatedAt: new Date().toISOString(), color: 'red' },
  { id: '6', commodity: 'Cotton',    mandi: 'Nagpur',     state: 'Maharashtra', pricePerQuintal: 6800, trend: 'up',     trendPercent: 5,  updatedAt: new Date().toISOString(), color: 'green' },
  { id: '7', commodity: 'Rice',      mandi: 'Kolkata',    state: 'West Bengal', pricePerQuintal: 1950, trend: 'stable', trendPercent: 0,  updatedAt: new Date().toISOString(), color: 'yellow' },
  { id: '8', commodity: 'Maize',     mandi: 'Pune',       state: 'Maharashtra', pricePerQuintal: 1380, trend: 'up',     trendPercent: 4,  updatedAt: new Date().toISOString(), color: 'green' },
]

export const fetchMarketPrices = async (_mandi: string): Promise<MarketPrice[]> => {
  // TODO: Integrate Agmarknet API
  await new Promise(r => setTimeout(r, 500)) // Simulate network
  return getMockMarketPrices()
}
