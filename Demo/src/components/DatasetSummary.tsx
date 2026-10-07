const dataset = [
  { name: 'Training', rows: '1,000,000', size: '64.72 MB' },
  { name: 'Validation', rows: '126,346', size: '8.18 MB' },
  { name: 'Testing', rows: '589,329', size: '38.06 MB' },
]

export function DatasetSummary() {
  return (
    <section className="dataset-panel" aria-labelledby="dataset-title">
      <div className="section-heading">
        <div><p className="eyebrow">DATASET</p><h2 id="dataset-title">Data splits</h2></div>
        <span className="total-rows">1,715,675 rows</span>
      </div>
      <div className="dataset-table" role="table" aria-label="Original dataset split sizes">
        {dataset.map((split) => (
          <div className="dataset-row" role="row" key={split.name}>
            <strong role="cell">{split.name}</strong><span role="cell">{split.rows} rows</span><span role="cell">{split.size}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
