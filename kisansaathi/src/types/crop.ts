// src/types/crop.ts
export interface CropStage { name: string; daysFromSowing: number; description: string }
export interface CropAdvisory { cropType: string; stage: CropStage; weeklyTask: string; warning?: string }
export interface CropDiaryEntry { id: string; farmerId: string; cropType: string; date: string; note: string; photo?: string; synced: boolean }
export type SoilType = 'black' | 'red' | 'alluvial' | 'laterite' | 'sandy' | 'clayey'
export interface SoilReport { n: number; p: number; k: number; ph: number; soilType: SoilType; uploadedAt: string }

// src/types/market.ts — re-export from store
export type { MarketPrice } from '../store/useMarketStore'
