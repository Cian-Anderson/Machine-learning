const columns = [
  'review_id',
  'app_id',
  'user_id',
  'date',
  'hours',
  'price',
  'rating(Num)',
  'windows',
  'Mac',
  'linux',
  'is_recommended',
]

const rows = [
  ['0', '975370', '51580', 'Monday 12 December 2022', '36.3', '30', '9', '1', '0', '0', '1'],
  ['1', '304390', '2586', 'Friday 17 February 2017', '11.5', '15', '5', '1', '0', '0', '0'],
  ['3', '703080', '259432', 'Friday 23 September 2022', '27.4', '45', '7', '1', '0', '0', '1'],
]

export function DatasetExample() {
  return (
    <section className="dataset-example" aria-labelledby="example-title">
      <div className="section-heading">
        <div><p className="eyebrow">EXAMPLE DATA</p><h2 id="example-title">First three training rows</h2></div>
        <span className="example-source">From Training.csv</span>
      </div>
      <div className="example-table-wrap" role="region" aria-label="First three rows of Training.csv" tabIndex={0}>
        <table className="example-table">
          <thead>
            <tr>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((value, index) => <td key={columns[index]}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="example-note">These are the first three records from the local training CSV. The model uses hours, price, platform support, and the recommendation label.</p>
    </section>
  )
}
