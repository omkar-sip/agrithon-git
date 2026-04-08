// src/types/farmer.ts
export interface FarmerProfile {
  uid: string
  name: string
  phone: string
  state: string
  district: string
  village: string
  landHolding: '<1' | '1-5' | '5-10' | '10+'
  crops: string[]
  waterSource: 'rain-fed' | 'irrigated' | 'pond'
  aadhaarLinked?: boolean
  language: string
  category: 'crop' | 'livestock' | 'poultry' | 'fishery'
  createdAt?: number
  updatedAt?: number
}
