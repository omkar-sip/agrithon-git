export type AdvisoryWaterRequirement = 'Low' | 'Medium' | 'High'
export type AdvisoryProfitLevel = 'Low' | 'Medium' | 'High'
export type AdvisoryDifficulty = 'Easy' | 'Moderate' | 'Hard'
export type AdvisoryRiskLevel = 'Low' | 'Medium' | 'High'
export type BudgetCompatibility = 'Fits Well' | 'Manageable' | 'Stretch' | 'Over Budget' | 'Not provided'

export interface CropAdvisoryCrop {
  cropName: string
  reason: string
  waterRequirement: AdvisoryWaterRequirement
  profitLevel: AdvisoryProfitLevel
  difficulty: AdvisoryDifficulty
  riskLevel: AdvisoryRiskLevel
  riskExplanation: string
  suggestion: string
  budgetCompatibility: BudgetCompatibility
  estimatedCostInr?: number
}

export interface CropAdvisoryBudgetSummary {
  estimatedCostInr: number
  budgetFit: string
}

export interface CropAdvisoryResult {
  crops: CropAdvisoryCrop[]
  overallRiskLevel: AdvisoryRiskLevel
  overallRiskExplanation: string
  overallSuggestion: string
  budgetSummary?: CropAdvisoryBudgetSummary
}
