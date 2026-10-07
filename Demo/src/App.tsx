import { useEffect, useState } from 'react'
import { DatasetSummary } from './components/DatasetSummary'
import { DatasetExample } from './components/DatasetExample'
import { Conclusions } from './components/Conclusions'
import { DemoHeader } from './components/DemoHeader'
import { ModelStatistics } from './components/ModelStatistics'
import { ModelSummary } from './components/ModelSummary'
import { PredictionForm } from './components/PredictionForm'
import { PredictionResult } from './components/PredictionResult'
import { loadEvaluation, loadModel } from './model/loadModel'
import { InputValidationError, predict } from './model/predictor'
import type { Evaluation, Model, PredictionInput, PredictionResult as Result } from './model/types'

export default function App() {
  const [model, setModel] = useState<Model | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<Result | null>(null)
  const [predictionInput, setPredictionInput] = useState<PredictionInput | null>(null)
  const [inputError, setInputError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([loadModel(), loadEvaluation()])
      .then(([loadedModel, loadedEvaluation]) => {
        if (active) {
          setModel(loadedModel)
          setEvaluation(loadedEvaluation)
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Could not load model data.')
        }
      })
    return () => { active = false }
  }, [])

  function runPrediction(input: PredictionInput) {
    if (!model) {
      setInputError('The model is still loading. Please try again in a moment.')
      return
    }
    try {
      const result = predict(input, model)
      setPrediction(result)
      setPredictionInput(input)
      setInputError(null)
    } catch (error) {
      setPrediction(null)
      setPredictionInput(null)
      setInputError(
        error instanceof InputValidationError
          ? error.message
          : 'The classifier could not safely process those values. Check the inputs and try again.',
      )
    }
  }

  function clearInputFeedback() {
    setInputError(null)
    setPrediction(null)
    setPredictionInput(null)
  }

  return (
    <main className="page-shell">
      <div className="page-content">
        <DemoHeader />
        {loadError && <div className="load-error" role="alert">Model data could not be loaded: {loadError}</div>}
        {!model && !loadError && <p className="loading-state">Loading the compact model statistics…</p>}
        {model && (
          <>
            <div className="prediction-grid">
              <PredictionForm
                onPredict={runPrediction}
                onInputChange={clearInputFeedback}
                error={inputError}
              />
              <PredictionResult result={prediction} input={predictionInput} />
            </div>
            <div className="overview-grid">
              <ModelSummary model={model} evaluation={evaluation} />
              <DatasetSummary />
            </div>
            <DatasetExample />
            <ModelStatistics model={model} />
          </>
        )}
        <section className="how-section">
          <div className="section-heading section-heading-light">
            <div><p className="eyebrow">04</p><h2>How it works</h2></div>
          </div>
          <div className="method-flow">
            {['Input features', 'Gaussian likelihoods', 'Class scores', 'Highest score', 'Prediction'].map((step, index) => (
              <div className="method-step" key={step}><span>0{index + 1}</span><strong>{step}</strong></div>
            ))}
          </div>
        </section>
        <Conclusions />
        <footer className="about-footer">
          <div><p className="eyebrow">ABOUT THIS DEMO</p><h2>A browser recreation of a learning project.</h2></div>
          <p>
            The original project was written in Java. It used a manually implemented Gaussian Naive Bayes classifier and a Swing interface as a way to learn machine learning and object-oriented programming. This React and TypeScript demo recreates only the prediction stage. It is not the original submission or a production recommendation system. The page uses statistics exported from the original training CSV. The full dataset of about 1.7 million rows is not included.
          </p>
        </footer>
        <div className="page-bottom"><span>STEAM GAME RECOMMENDATION PREDICTOR</span><span>EDUCATIONAL PROJECT, STATIC DEMO</span></div>
      </div>
    </main>
  )
}
