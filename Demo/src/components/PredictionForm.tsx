import { useState, type FormEvent } from 'react'
import type { PredictionInput } from '../model/types'

interface PredictionFormProps {
  onPredict: (input: PredictionInput) => void
  onInputChange: () => void
  error: string | null
}

export function PredictionForm({ onPredict, onInputChange, error }: PredictionFormProps) {
  const [hoursPlayed, setHoursPlayed] = useState('')
  const [price, setPrice] = useState('')
  const [platforms, setPlatforms] = useState({ windows: true, mac: false, linux: false })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const hours = hoursPlayed.trim() ? Number(hoursPlayed) : Number.NaN
    const gamePrice = price.trim() ? Number(price) : Number.NaN
    onPredict({ hoursPlayed: hours, price: gamePrice, ...platforms })
  }

  function togglePlatform(platform: keyof typeof platforms) {
    setPlatforms((current) => ({ ...current, [platform]: !current[platform] }))
  }

  return (
    <section className="form-panel" aria-labelledby="input-title">
      <div className="section-heading">
        <div><p className="eyebrow">01</p><h2 id="input-title">Enter review details</h2></div>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field-grid">
          <label className="field">
            <span>Hours played</span>
            <span className="input-wrap">
              <input
                type="number"
                min={2.72}
                step="any"
                inputMode="decimal"
                value={hoursPlayed}
                onChange={(event) => {
                  setHoursPlayed(event.target.value)
                  onInputChange()
                }}
                placeholder="e.g. 120"
                aria-describedby={error ? 'form-error' : 'hours-hint'}
                required
              />
              <span className="input-suffix">hours</span>
            </span>
            <small id="hours-hint">Enter a positive number of hours.</small>
          </label>
          <label className="field">
            <span>Game price</span>
            <span className="input-wrap price-wrap">
              <span className="currency">€</span>
              <input
                type="number"
                min="0.01"
                step="any"
                inputMode="decimal"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value)
                  onInputChange()
                }}
                placeholder="e.g. 19.99"
                aria-describedby={error ? 'form-error' : undefined}
                required
              />
            </span>
          </label>
        </div>
        <fieldset className="platform-field">
          <legend>Platforms</legend>
          <div className="platform-options">
            {([
              ['windows', 'Windows'],
              ['mac', 'macOS'],
              ['linux', 'Linux'],
            ] as const).map(([platform, label]) => (
              <label className={`platform-option ${platforms[platform] ? 'selected' : ''}`} key={platform}>
                <input
                  type="checkbox"
                  checked={platforms[platform]}
                  onChange={() => {
                    togglePlatform(platform)
                    onInputChange()
                  }}
                />
                <span className="check-mark" aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p className="inline-error" id="form-error" role="alert">{error}</p>}
        <button className="run-button" type="submit">Run prediction</button>
        <p className="form-footnote">The model estimates whether a player with this review pattern would recommend the game.</p>
      </form>
    </section>
  )
}
