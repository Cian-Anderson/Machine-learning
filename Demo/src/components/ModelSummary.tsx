import type { Evaluation, Model } from '../model/types'

interface ModelSummaryProps {
  model: Model
  evaluation: Evaluation | null
}

const formatAccuracy = (accuracy: number | null) => accuracy === null ? 'Unavailable' : `${accuracy.toFixed(2)}%`

export function ModelSummary({ model, evaluation }: ModelSummaryProps) {
  return (
    <section className="model-panel" aria-labelledby="model-title">
      <div className="section-heading">
        <div><p className="eyebrow">MODEL</p><h2 id="model-title">Model results</h2></div>
        <span className="model-meta">Gaussian Naive Bayes | {model.metadata.trainingRows.toLocaleString()} training rows</span>
      </div>
      {evaluation ? (
        <div className="comparison-wrap">
          <table className="comparison-table">
            <thead><tr><th scope="col">Version</th><th scope="col">Validation</th><th scope="col">Testing</th></tr></thead>
            <tbody>
              <tr>
                <th scope="row">Browser model</th>
                <td>{formatAccuracy(evaluation.validation.correctedModel.accuracy)}</td>
                <td>{formatAccuracy(evaluation.testing.correctedModel.accuracy)}</td>
              </tr>
              <tr>
                <th scope="row">Original Java</th>
                <td>{formatAccuracy(evaluation.validation.originalJavaBehavior.accuracy)}</td>
                <td>{formatAccuracy(evaluation.testing.originalJavaBehavior.accuracy)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="unavailable-note">Evaluation results are unavailable.</p>
      )}
      {evaluation && (
        <p className="model-explanation">
          Browser demo uses consistent feature preprocessing; original Java results are retained for historical comparison.
        </p>
      )}
    </section>
  )
}
