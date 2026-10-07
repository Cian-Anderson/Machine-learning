import { createReadStream } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'

const demoDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectDirectory = resolve(demoDirectory, '..')
const outputDirectory = resolve(demoDirectory, 'public', 'model')
const epsilon = 0.0000001

function getInputPaths(args) {
  const paths = {
    training: resolve(projectDirectory, 'Training.csv'),
    validation: resolve(projectDirectory, 'Validation.csv'),
    testing: resolve(projectDirectory, 'Testing.csv'),
  }

  for (let index = 0; index < args.length; index += 1) {
    const option = args[index]
    if (!['--training', '--validation', '--testing'].includes(option)) {
      throw new Error(`Unknown argument: ${option}`)
    }
    const value = args[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`Expected a path after ${option}`)
    }

    const key = option.slice(2)
    paths[key] = isAbsolute(value) ? value : resolve(process.cwd(), value)
    index += 1
  }
  return paths
}

function parseNumber(value, field, lineNumber) {
  const parsed = Number(value?.trim())
  if (!value?.trim() || !Number.isFinite(parsed)) {
    throw new Error(`Invalid ${field} at CSV line ${lineNumber}: ${JSON.stringify(value)}`)
  }
  return parsed
}

function parseRow(line, lineNumber) {
  const values = line.replace(/^\uFEFF/, '').split(',')
  if (values.length <= 10) {
    throw new Error(`Expected at least 11 columns at CSV line ${lineNumber}`)
  }
  const hours = parseNumber(values[4], 'hours', lineNumber)
  const price = parseNumber(values[5], 'price', lineNumber)
  const recommendation = parseNumber(values[10], 'recommendation label', lineNumber)
  if (recommendation !== 0 && recommendation !== 1) {
    throw new Error(`Expected a 0/1 recommendation label at CSV line ${lineNumber}`)
  }
  return {
    hours,
    price,
    windows: parseNumber(values[7], 'Windows flag', lineNumber) === 1,
    mac: parseNumber(values[8], 'macOS flag', lineNumber) === 1,
    linux: parseNumber(values[9], 'Linux flag', lineNumber) === 1,
    recommended: recommendation === 1,
  }
}

async function forEachDataRow(path, callback) {
  const input = createInterface({
    input: createReadStream(path, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })
  let lineNumber = 0
  let foundHeader = false

  for await (const line of input) {
    lineNumber += 1
    if (!foundHeader) {
      if (line.trim()) foundHeader = true
      continue
    }
    if (line.trim()) callback(parseRow(line, lineNumber))
  }
  if (!foundHeader) throw new Error(`CSV has no header: ${path}`)
}

function createClassAccumulator() {
  return {
    count: 0,
    hours: { mean: 0, m2: 0 },
    hoursToPrice: { mean: 0, m2: 0 },
    windows: 0,
    mac: 0,
    linux: 0,
  }
}

function addMoment(moment, value, count) {
  const delta = value - moment.mean
  moment.mean += delta / count
  moment.m2 += delta * (value - moment.mean)
}

function createAccumulator() {
  return { recommended: createClassAccumulator(), notRecommended: createClassAccumulator() }
}

function addTrainingRow(accumulator, row) {
  const group = row.recommended ? accumulator.recommended : accumulator.notRecommended
  const count = group.count + 1
  const logHours = Math.log(row.hours > 0 ? row.hours : epsilon)
  const hoursToPrice = row.hours > 0 ? row.hours / row.price : epsilon
  const logHoursToPrice = Math.log(hoursToPrice)

  if (![logHours, hoursToPrice, logHoursToPrice].every(Number.isFinite)) {
    throw new Error('Training data produced a non-finite feature; check for zero prices or invalid hours.')
  }

  group.count = count
  addMoment(group.hours, logHours, count)
  addMoment(group.hoursToPrice, logHoursToPrice, count)
  group.windows += Number(row.windows)
  group.mac += Number(row.mac)
  group.linux += Number(row.linux)
}

function finishMoments(group) {
  if (group.count === 0) throw new Error('Training data must contain examples from both recommendation classes.')
  return {
    meanLogHours: group.hours.mean,
    stdDevLogHours: Math.sqrt(group.hours.m2 / group.count),
    meanLogHoursToPrice: group.hoursToPrice.mean,
    stdDevLogHoursToPrice: Math.sqrt(group.hoursToPrice.m2 / group.count),
    percentWindows: (group.windows / group.count) * 100,
    percentMac: (group.mac / group.count) * 100,
    percentLinux: (group.linux / group.count) * 100,
  }
}

async function generateModel(trainingPath) {
  const accumulator = createAccumulator()
  let rows = 0
  await forEachDataRow(trainingPath, (row) => {
    rows += 1
    addTrainingRow(accumulator, row)
  })
  if (rows === 0) throw new Error('Training.csv contains no data rows')

  const recommended = finishMoments(accumulator.recommended)
  const notRecommended = finishMoments(accumulator.notRecommended)
  return {
    metadata: {
      model: 'Gaussian Naive Bayes',
      source: 'Original Java project training data',
      trainingRows: rows,
      featureSpace: 'Consistent log-hours and log-hours-to-price',
    },
    probabilities: {
      recommended: accumulator.recommended.count / rows,
      notRecommended: accumulator.notRecommended.count / rows,
    },
    statistics: {
      totalReviews: rows,
      recommendedCount: accumulator.recommended.count,
      notRecommendedCount: accumulator.notRecommended.count,
      percentRecommended: (accumulator.recommended.count / rows) * 100,
      percentNotRecommended: (accumulator.notRecommended.count / rows) * 100,
      meanLogHoursRecommended: recommended.meanLogHours,
      meanLogHoursNotRecommended: notRecommended.meanLogHours,
      stdDevLogHoursRecommended: recommended.stdDevLogHours,
      stdDevLogHoursNotRecommended: notRecommended.stdDevLogHours,
      meanLogHoursToPriceRecommended: recommended.meanLogHoursToPrice,
      meanLogHoursToPriceNotRecommended: notRecommended.meanLogHoursToPrice,
      stdDevLogHoursToPriceRecommended: recommended.stdDevLogHoursToPrice,
      stdDevLogHoursToPriceNotRecommended: notRecommended.stdDevLogHoursToPrice,
      meanHoursToPriceRecommended: Math.exp(recommended.meanLogHoursToPrice),
      meanHoursToPriceNotRecommended: Math.exp(notRecommended.meanLogHoursToPrice),
      meanHoursRecommended: Math.exp(recommended.meanLogHours),
      meanHoursNotRecommended: Math.exp(notRecommended.meanLogHours),
      percentWindowsRecommended: recommended.percentWindows,
      percentMacRecommended: recommended.percentMac,
      percentLinuxRecommended: recommended.percentLinux,
      percentWindowsNotRecommended: notRecommended.percentWindows,
      percentMacNotRecommended: notRecommended.percentMac,
      percentLinuxNotRecommended: notRecommended.percentLinux,
    },
  }
}

function gaussianLogLikelihood(value, mean, standardDeviation) {
  if (!(standardDeviation > 0)) {
    return value === mean ? 0 : Number.NEGATIVE_INFINITY
  }
  return -Math.log(Math.sqrt(2 * Math.PI) * standardDeviation) -
    ((value - mean) ** 2) / (2 * standardDeviation ** 2)
}

function classLogScore(row, model, recommended) {
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
  const categoricalLikelihood =
    (row.windows ? percentWindows : 100 - percentWindows) / 100 *
    (row.mac ? percentMac : 100 - percentMac) / 100 *
    (row.linux ? percentLinux : 100 - percentLinux) / 100

  if (prior <= 0 || categoricalLikelihood <= 0) return Number.NEGATIVE_INFINITY
  const logHours = Math.log(row.hours > 0 ? row.hours : epsilon)
  const hoursToPrice = row.hours > 0 ? row.hours / row.price : epsilon
  const logHoursToPrice = Math.log(hoursToPrice)
  if (![logHours, logHoursToPrice].every(Number.isFinite)) {
    throw new Error('Evaluation data produced a non-finite model feature.')
  }
  return Math.log(prior) +
    gaussianLogLikelihood(logHours, hoursMean, hoursDeviation) +
    gaussianLogLikelihood(logHoursToPrice, ratioMean, ratioDeviation) +
    Math.log(categoricalLikelihood)
}

function predictCorrected(row, model) {
  return classLogScore(row, model, true) > classLogScore(row, model, false)
}

async function evaluateCorrected(path, model) {
  let rows = 0
  let correct = 0
  await forEachDataRow(path, (row) => {
    rows += 1
    if (predictCorrected(row, model) === row.recommended) correct += 1
  })
  return { rows, correct, accuracy: rows === 0 ? null : (correct / rows) * 100 }
}

function createLegacyAccumulator() {
  return {
    rows: 0,
    recommended: { count: 0, hours: 0, logHours: 0, ratio: 0, windows: 0, mac: 0, linux: 0 },
    notRecommended: { count: 0, hours: 0, logHours: 0, ratio: 0, windows: 0, mac: 0, linux: 0 },
  }
}

async function generateLegacyModel(trainingPath) {
  const totals = createLegacyAccumulator()
  await forEachDataRow(trainingPath, (row) => {
    totals.rows += 1
    const group = row.recommended ? totals.recommended : totals.notRecommended
    const hours = row.hours === 0 ? epsilon : row.hours
    const ratio = row.hours === 0 ? 0 : row.hours / row.price
    if (!Number.isFinite(ratio)) throw new Error('Legacy training ratio is not finite.')
    group.count += 1
    group.hours += hours
    group.logHours += row.hours === 0 ? epsilon : Math.log(row.hours)
    group.ratio += ratio === 0 ? epsilon : ratio
    group.windows += Number(row.windows)
    group.mac += Number(row.mac)
    group.linux += Number(row.linux)
  })

  const averageHoursRecommended = totals.recommended.hours / totals.recommended.count
  const averageHoursNotRecommended = totals.notRecommended.hours / totals.notRecommended.count
  const averageRatioRecommended = totals.recommended.ratio / totals.recommended.count
  const averageRatioNotRecommended = totals.notRecommended.ratio / totals.notRecommended.count
  let squareHoursRecommended = 0
  let squareHoursNotRecommended = 0
  let squareRatioRecommended = 0
  let squareRatioNotRecommended = 0

  await forEachDataRow(trainingPath, (row) => {
    const ratio = row.hours === 0 ? 0 : row.hours / row.price
    if (row.recommended) {
      squareHoursRecommended += (row.hours - averageHoursRecommended) ** 2
      squareRatioRecommended += (ratio - averageRatioRecommended) ** 2
    } else {
      squareHoursNotRecommended += (row.hours - averageHoursNotRecommended) ** 2
      squareRatioNotRecommended += (ratio - averageRatioNotRecommended) ** 2
    }
  })

  return {
    rows: totals.rows,
    priors: {
      recommended: totals.recommended.count / totals.rows,
      notRecommended: totals.notRecommended.count / totals.rows,
    },
    statistics: {
      percentRecommended: (totals.recommended.count / totals.rows) * 100,
      avgLogHoursRecommended: totals.recommended.logHours / totals.recommended.count,
      stdDevHoursRecommended: Math.sqrt(squareHoursRecommended / totals.recommended.count),
      stdDevHoursNotRecommended: Math.sqrt(squareHoursNotRecommended / totals.notRecommended.count),
      stdDevPricePerHourRecommended: Math.sqrt(squareRatioRecommended / totals.recommended.count),
      percentWindowsRecommended: (totals.recommended.windows / totals.rows) * 100,
      percentMacRecommended: (totals.recommended.mac / totals.rows) * 100,
      percentLinuxRecommended: (totals.recommended.linux / totals.rows) * 100,
      percentWindowsNotRecommended: (totals.notRecommended.windows / totals.rows) * 100,
      percentMacNotRecommended: (totals.notRecommended.mac / totals.rows) * 100,
      percentLinuxNotRecommended: (totals.notRecommended.linux / totals.rows) * 100,
    },
  }
}

function legacyGaussian(value, mean, standardDeviation) {
  return Math.exp(gaussianLogLikelihood(value, mean, standardDeviation))
}

function predictLegacy(row, model, split) {
  const stats = model.statistics
  const hoursToPrice = row.hours === 0 ? 0 : Math.log(row.hours / row.price)
  const classifierHours = split === 'training' ? Math.log(Math.log(row.hours)) : Math.log(row.hours)
  const hoursLikelihoodRecommended = legacyGaussian(
    classifierHours,
    stats.avgLogHoursRecommended,
    stats.stdDevHoursRecommended,
  )
  const hoursLikelihoodNotRecommended = legacyGaussian(
    classifierHours,
    stats.avgLogHoursRecommended,
    stats.stdDevHoursNotRecommended,
  )
  const ratioLikelihood = legacyGaussian(
    hoursToPrice,
    stats.avgLogHoursRecommended,
    stats.stdDevPricePerHourRecommended,
  )
  const platformLikelihood = (recommended) => {
    const suffix = recommended ? 'Recommended' : 'NotRecommended'
    const windows = stats[`percentWindows${suffix}`]
    const mac = stats[`percentMac${suffix}`]
    const linux = stats[`percentLinux${suffix}`]
    return (row.windows ? windows : 100 - windows) / 100 *
      (row.mac ? mac : 100 - mac) / 100 *
      (row.linux ? linux : 100 - linux) / 100
  }
  const scoreRecommended = stats.percentRecommended / 100 *
    hoursLikelihoodRecommended * ratioLikelihood * platformLikelihood(true) *
    model.priors.recommended
  const scoreNotRecommended = stats.percentRecommended / 100 *
    hoursLikelihoodNotRecommended * ratioLikelihood * platformLikelihood(false) *
    model.priors.notRecommended
  return scoreRecommended > scoreNotRecommended
}

async function evaluateLegacy(path, model, split) {
  let rows = 0
  let correct = 0
  await forEachDataRow(path, (row) => {
    rows += 1
    if (predictLegacy(row, model, split) === row.recommended) correct += 1
  })
  return { rows, correct, accuracy: rows === 0 ? null : (correct / rows) * 100 }
}

async function optionalEvaluation(path, evaluate) {
  try {
    return await evaluate(path)
  } catch (error) {
    if (error?.code === 'ENOENT') return { rows: null, correct: null, accuracy: null }
    throw error
  }
}

async function main() {
  const paths = getInputPaths(process.argv.slice(2))
  const model = await generateModel(paths.training)
  const legacyModel = await generateLegacyModel(paths.training)
  const evaluation = {}

  for (const split of ['validation', 'testing']) {
    evaluation[split] = {
      correctedModel: await optionalEvaluation(paths[split], (path) => evaluateCorrected(path, model)),
      originalJavaBehavior: await optionalEvaluation(
        paths[split],
        (path) => evaluateLegacy(path, legacyModel, split),
      ),
    }
  }

  await mkdir(outputDirectory, { recursive: true })
  await writeFile(resolve(outputDirectory, 'model.json'), `${JSON.stringify(model, null, 2)}\n`)
  await writeFile(resolve(outputDirectory, 'evaluation.json'), `${JSON.stringify(evaluation, null, 2)}\n`)
  console.log(`Generated ${resolve(outputDirectory, 'model.json')}`)
  console.log(`Training rows: ${model.metadata.trainingRows.toLocaleString()}`)
  for (const split of ['validation', 'testing']) {
    const current = evaluation[split].correctedModel
    const original = evaluation[split].originalJavaBehavior
    if (current.accuracy === null) {
      console.log(`${split} evaluation unavailable (CSV not found).`)
    } else {
      console.log(
        `${split}: corrected ${current.correct.toLocaleString()}/${current.rows.toLocaleString()} ` +
        `(${current.accuracy.toFixed(4)}%), original Java ${original.accuracy.toFixed(4)}%`,
      )
    }
  }
}

main().catch((error) => {
  console.error(`Model generation failed: ${error.message}`)
  process.exitCode = 1
})
