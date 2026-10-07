export interface ModelStatistics {
  totalReviews: number
  recommendedCount: number
  notRecommendedCount: number
  percentRecommended: number
  percentNotRecommended: number
  meanLogHoursRecommended: number
  meanLogHoursNotRecommended: number
  stdDevLogHoursRecommended: number
  stdDevLogHoursNotRecommended: number
  meanLogHoursToPriceRecommended: number
  meanLogHoursToPriceNotRecommended: number
  stdDevLogHoursToPriceRecommended: number
  stdDevLogHoursToPriceNotRecommended: number
  meanHoursToPriceRecommended: number
  meanHoursToPriceNotRecommended: number
  meanHoursRecommended: number
  meanHoursNotRecommended: number
  percentWindowsRecommended: number
  percentMacRecommended: number
  percentLinuxRecommended: number
  percentWindowsNotRecommended: number
  percentMacNotRecommended: number
  percentLinuxNotRecommended: number
}

export interface Model {
  metadata: {
    model: string
    source: string
    trainingRows: number
  }
  probabilities: {
    recommended: number
    notRecommended: number
  }
  statistics: ModelStatistics
}

export interface EvaluationSplit {
  rows: number | null
  correct: number | null
  accuracy: number | null
}

export interface Evaluation {
  validation: {
    correctedModel: EvaluationSplit
    originalJavaBehavior: EvaluationSplit
  }
  testing: {
    correctedModel: EvaluationSplit
    originalJavaBehavior: EvaluationSplit
  }
}

export interface PredictionInput {
  hoursPlayed: number
  price: number
  windows: boolean
  mac: boolean
  linux: boolean
}

export interface PredictionResult {
  prediction: 'recommended' | 'not-recommended'
  recommendedScore: number
  notRecommendedScore: number
  displayRecommendedScore: number
  displayNotRecommendedScore: number
  logHours: number
  logHoursToPrice: number
}
