import type { PredictionInput, PredictionResult as Result } from '../model/types'

interface PredictionResultProps {
  result: Result | null
  input: PredictionInput | null
}

const percentage = (value: number) => `${(value * 100).toFixed(1)}%`

export function PredictionResult({ result, input }: PredictionResultProps) {
  const recommended = result?.prediction === 'recommended'
  const platforms = input
    ? [input.windows && 'Windows', input.mac && 'macOS', input.linux && 'Linux'].filter(Boolean).join(', ') || 'No platform selected'
    : ''

  return (
    <section className={`result-panel ${result ? 'has-result' : ''}`} aria-labelledby="result-title" aria-live="polite">
      <div className="section-heading">
        <div><p className="eyebrow">02</p><h2 id="result-title">Prediction result</h2></div>
        <span className="result-status">{result ? 'Complete' : 'Waiting for input'}</span>
      </div>
      {!result ? (
        <div className="empty-result">
          <p>Enter the review details to see the model output.</p>
        </div>
      ) : (
        <>
          <div className={`prediction-callout ${recommended ? 'recommend' : 'not-recommend'}`}>
            <div>
              <span className="result-overline">MODEL OUTPUT</span>
              <strong>{recommended ? 'Recommended' : 'Not recommended'}</strong>
            </div>
          </div>
          <div className="submitted-values">
            <span>{input?.hoursPlayed.toLocaleString()} hours</span>
            <span>€{input?.price.toLocaleString()}</span>
            <span>{platforms}</span>
          </div>
          <div className="score-block">
            <div className="score-title"><span>Relative model score</span><span>Not a probability</span></div>
            <ScoreRow label="Recommended" score={result.displayRecommendedScore} active={recommended} />
            <ScoreRow label="Not recommended" score={result.displayNotRecommendedScore} active={!recommended} />
          </div>
          <p className="result-explainer">The classifier compares the feature likelihoods under both review classes. These relative scores are not calibrated probabilities.</p>
        </>
      )}
    </section>
  )
}

function ScoreRow({ label, score, active }: { label: string; score: number; active: boolean }) {
  return (
    <div className={`score-row ${active ? 'active' : ''}`}>
      <span>{label}</span>
      <div className="score-track" aria-hidden="true"><span style={{ width: percentage(score) }} /></div>
      <strong>{percentage(score)}</strong>
    </div>
  )
}
