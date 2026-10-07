import type { Evaluation, Model } from './types'

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Unable to load ${path}: HTTP ${response.status}`)
  }
  return (await response.json()) as T
}

export function loadModel(): Promise<Model> {
  return loadJson<Model>(`${import.meta.env.BASE_URL}model/model.json`)
}

export function loadEvaluation(): Promise<Evaluation> {
  return loadJson<Evaluation>(`${import.meta.env.BASE_URL}model/evaluation.json`)
}
