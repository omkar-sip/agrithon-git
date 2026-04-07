import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const MOCK_NUTRIENTS = [
  { name: 'Nitrogen (N)', value: 180, unit: 'kg/ha', status: 'Low',  color: 'red'    as const, recommendation: 'Apply Urea — 60 kg/acre before next irrigation' },
  { name: 'Phosphorus (P)', value: 24, unit: 'kg/ha', status: 'Medium', color: 'yellow' as const, recommendation: 'Apply DAP — 25 kg/acre at sowing' },
  { name: 'Potassium (K)',  value: 320, unit: 'kg/ha', status: 'Good', color: 'green'  as const, recommendation: 'No additional K needed this season' },
  { name: 'Soil pH',        value: 6.8,  unit: '',      status: 'Ideal', color: 'green' as const, recommendation: 'pH is optimal for most crops' },
]

export default function SoilHealth() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-soil-700">🌱 Soil Health Dashboard</h1>
        <p className="text-soil-500 text-sm -mt-3">Upload soil test report to get AI fertilizer recommendations</p>

        <button className="btn-secondary">📎 Upload Soil Test Report (PDF/Photo)</button>

        <section>
          <h2 className="section-title">🔬 Nutrient Report (Demo Data)</h2>
          <div className="space-y-3">
            {MOCK_NUTRIENTS.map((n, i) => (
              <Card key={i} color={n.color}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display font-bold text-base text-soil-800">{n.name}</p>
                  <Badge color={n.color} label={n.status} />
                </div>
                <p className="font-mono text-2xl font-bold text-forest-700">{n.value}<span className="text-base font-normal text-soil-500 ml-1">{n.unit}</span></p>
                <p className="text-sm text-soil-600 mt-1">💡 {n.recommendation}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card color="blue">
          <p className="font-display font-bold text-base text-sky-800 mb-1">📋 Overall Soil Assessment</p>
          <p className="text-sm text-sky-700">Your soil needs nitrogen supplementation before next crop cycle. Phosphorus and potassium levels are adequate. Soil pH is ideal for wheat and cotton.</p>
        </Card>
      </div>
    </div>
  )
}
