// src/types/livestock.ts
export type AnimalSpecies = 'cow' | 'buffalo' | 'goat' | 'sheep' | 'pig'
export interface Animal { id: string; species: AnimalSpecies; breed: string; age: number; tagNumber: string; weight?: number }
export interface AnimalHealthLog { id: string; animalId: string; date: string; symptoms: string; diagnosis?: string; treatment?: string; vetVisit: boolean }
export interface MilkEntry { id: string; animalId: string; date: string; amLitres: number; pmLitres: number }
export interface VaccinationRecord { id: string; animalId: string; vaccine: string; dateGiven: string; nextDue: string; batchNo: string }
