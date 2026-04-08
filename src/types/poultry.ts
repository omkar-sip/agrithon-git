// src/types/poultry.ts
export type FlockType = 'broiler' | 'layer' | 'breeder'
export interface FlockBatch { id: string; breed: string; count: number; placementDate: string; flockType: FlockType; supplier: string }
export interface MortalityEntry { id: string; batchId: string; date: string; count: number; cause: string }
export interface EggEntry { id: string; batchId: string; date: string; gradeA: number; gradeB: number; cracked: number; floor: number }
export interface VaccinationEvent { id: string; batchId: string; vaccine: string; disease: string; dateDue: string; dateDone?: string; batchNo?: string }
