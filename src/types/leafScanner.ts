export type TreatmentType = 'Organic' | 'Chemical' | 'Manual'

export interface LeafTreatment {
  name: string
  usage: string
  type: TreatmentType
  averageCostInr: number
}

export interface LeafDiseaseAnalysis {
  cropName: string
  diseaseName: string
  severity: 'Low' | 'Medium' | 'High'
  treatments: LeafTreatment[]
}

export interface PlantNetMatch {
  scientificName: string
  commonName: string
  score: number
}
