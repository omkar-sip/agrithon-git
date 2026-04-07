// src/types/fishery.ts
export type FishSpecies = 'catla' | 'rohu' | 'mrigal' | 'tilapia' | 'pangasius' | 'shrimp'
export interface Pond { id: string; name: string; areaAcres: number; depthFt: number; stockingDate: string; species: FishSpecies; stockingDensity: number }
export interface WaterQualityReading { id: string; pondId: string; date: string; do_mgL: number; ph: number; ammonia_mgL: number; turbidity: number; temperature_C: number; aiAdvice?: string }
export interface PondGrowthLog { id: string; pondId: string; date: string; sampleWeight_g: number; sampleCount: number; estimatedBiomass_kg: number }
