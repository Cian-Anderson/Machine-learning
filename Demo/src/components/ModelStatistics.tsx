import type { Model } from '../model/types'

interface ModelStatisticsProps {
  model: Model
}

const formatCount = (value: number) => Math.round(value).toLocaleString()
const formatHours = (value: number) => `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} h`
const formatPercent = (value: number) => `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`

export function ModelStatistics({ model }: ModelStatisticsProps) {
  const { statistics } = model
  return (
    <section className="statistics-section" aria-labelledby="statistics-title">
      <div className="section-heading section-heading-light">
        <div><p className="eyebrow">03</p><h2 id="statistics-title">Training statistics</h2></div>
        <span className="training-count">{formatCount(statistics.totalReviews)} training reviews</span>
      </div>
      <div className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">CLASS COUNTS</span>
          <div className="class-count"><span>Recommended</span><strong>{formatCount(statistics.recommendedCount)}</strong></div>
          <div className="class-count"><span>Not recommended</span><strong>{formatCount(statistics.notRecommendedCount)}</strong></div>
          <div className="distribution-track"><span style={{ width: formatPercent(statistics.percentRecommended) }} /></div>
          <div className="split-pct"><span>{formatPercent(statistics.percentRecommended)}</span><span>{formatPercent(statistics.percentNotRecommended)}</span></div>
        </article>
        <article className="stat-card">
          <span className="stat-label">AVERAGE PLAYTIME</span>
          <div className="stat-comparison"><div><span>Recommended</span><strong>{formatHours(statistics.meanHoursRecommended)}</strong></div><div><span>Not recommended</span><strong>{formatHours(statistics.meanHoursNotRecommended)}</strong></div></div>
        </article>
        <article className="stat-card">
          <span className="stat-label">AVERAGE HOURS PER PRICE UNIT</span>
          <div className="stat-comparison"><div><span>Recommended</span><strong>{statistics.meanHoursToPriceRecommended.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div><div><span>Not recommended</span><strong>{statistics.meanHoursToPriceNotRecommended.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div></div>
        </article>
        <article className="stat-card platform-stat">
          <span className="stat-label">PLATFORM SUPPORT</span>
          <PlatformRow name="Windows" recommended={statistics.percentWindowsRecommended} notRecommended={statistics.percentWindowsNotRecommended} />
          <PlatformRow name="macOS" recommended={statistics.percentMacRecommended} notRecommended={statistics.percentMacNotRecommended} />
          <PlatformRow name="Linux" recommended={statistics.percentLinuxRecommended} notRecommended={statistics.percentLinuxNotRecommended} />
        </article>
      </div>
    </section>
  )
}

function PlatformRow({ name, recommended, notRecommended }: { name: string; recommended: number; notRecommended: number }) {
  return (
    <div className="platform-stat-row">
      <strong>{name}</strong>
      <span>Recommended {formatPercent(recommended)}</span>
      <span>Not recommended {formatPercent(notRecommended)}</span>
    </div>
  )
}
