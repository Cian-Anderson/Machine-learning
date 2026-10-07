import type { Model, PredictionInput, PredictionResult } from './types'

export class InputValidationError extends Error {}

function gaussianLogLikelihood(value: number, mean: number, standardDeviation: number): number {
  if (!(standardDeviation > 0)) {
    return value === mean ? 0 : Number.NEGATIVE_INFINITY
  }
  return (
    -Math.log(Math.sqrt(2 * Math.PI) * standardDeviation) -
    ((value - mean) ** 2) / (2 * standardDeviation ** 2)
  )
}

function logScore(input: {
  logHours: number
  logHoursToPrice: number
  windows: boolean
  mac: boolean
  linux: boolean
}, model: Model, recommended: boolean): number {
  const stats = model.statistics
  const suffix = recommended ? 'Recommended' : 'NotRecommended'
  const prior = recommended ? model.probabilities.recommended : model.probabilities.notRecommended
  const hoursMean = stats[`meanLogHours${suffix}`]
  const hoursDeviation = stats[`stdDevLogHours${suffix}`]
  const ratioMean = stats[`meanLogHoursToPrice${suffix}`]
  const ratioDeviation = stats[`stdDevLogHoursToPrice${suffix}`]
  const percentWindows = stats[`percentWindows${suffix}`]
  const percentMac = stats[`percentMac${suffix}`]
  const percentLinux = stats[`percentLinux${suffix}`]

  const windowsLikelihood = (input.windows ? percentWindows : 100 - percentWindows) / 100
  const macLikelihood = (input.mac ? percentMac : 100 - percentMac) / 100
  const linuxLikelihood = (input.linux ? percentLinux : 100 - percentLinux) / 100
  if (prior <= 0 || windowsLikelihood <= 0 || macLikelihood <= 0 || linuxLikelihood <= 0) {
    return Number.NEGATIVE_INFINITY
  }

  return (
    Math.log(prior) +
    gaussianLogLikelihood(input.logHours, hoursMean, hoursDeviation) +
    gaussianLogLikelihood(input.logHoursToPrice, ratioMean, ratioDeviation) +
    Math.log(windowsLikelihood) +
    Math.log(macLikelihood) +
    Math.log(linuxLikelihood)
  )
}

function relativeScores(recommendedLogScore: number, notRecommendedLogScore: number) {
  const maximum = Math.max(recommendedLogScore, notRecommendedLogScore)
  if (!Number.isFinite(maximum)) {
    return { recommended: 0.5, notRecommended: 0.5 }
  }
  const recommendedWeight = Math.exp(recommendedLogScore - maximum)
  const notRecommendedWeight = Math.exp(notRecommendedLogScore - maximum)
  const total = recommendedWeight + notRecommendedWeight
  return {
    recommended: recommendedWeight / total,
    notRecommended: notRecommendedWeight / total,
  }
}

export function predict(input: PredictionInput, model: Model): PredictionResult {
  if (!Number.isFinite(input.hoursPlayed) || input.hoursPlayed <= 0) {
    throw new InputValidationError('Enter hours played greater than 0 so its logarithm is defined.')
  }
  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new InputValidationError('Enter a finite game price greater than €0.')
  }

  const hoursToPrice = input.hoursPlayed / input.price
  const logHours = Math.log(input.hoursPlayed)
  const logHoursToPrice = Math.log(hoursToPrice)
  if (!Number.isFinite(hoursToPrice) || hoursToPrice <= 0 || !Number.isFinite(logHoursToPrice)) {
    throw new InputValidationError('Those values produce an unsafe hours-to-price ratio. Try different hours or price.')
  }

  const features = {
    logHours,
    logHoursToPrice,
    windows: input.windows,
    mac: input.mac,
    linux: input.linux,
  }
  const recommendedLogScore = logScore(features, model, true)
  const notRecommendedLogScore = logScore(features, model, false)
  const display = relativeScores(recommendedLogScore, notRecommendedLogScore)

  return {
    prediction: recommendedLogScore > notRecommendedLogScore ? 'recommended' : 'not-recommended',
    recommendedScore: Math.exp(recommendedLogScore),
    notRecommendedScore: Math.exp(notRecommendedLogScore),
    displayRecommendedScore: display.recommended,
    displayNotRecommendedScore: display.notRecommended,
    logHours,
    logHoursToPrice,
  }
}
