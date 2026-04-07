import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const QUICK_ACTIONS = [
  { label: 'Pond Monitor',   emoji: '🐟', color: 'bg-sky-50 text-sky-700',     desc: 'Fish growth tracking' },
  { label: 'Water Quality',  emoji: '💧', color: 'bg-blue-50 text-blue-700',   desc: 'DO, pH, temperature' },
  { label: 'Sea Weather',    emoji: '⛵', color: 'bg-sky-50 text-sky-700',     desc: 'Marine safety alerts' },
  { label: 'Harvest Plan',   emoji: '📅', color: 'bg-forest-50 text-forest-700', desc: 'Optimal harvest date' },
  { label: 'Sea Safety',     emoji: '🆘', color: 'bg-red-50 text-danger-700',  desc: 'Emergency alerts' },
  { label: 'Fish Schemes',   emoji: '🏛️', color: 'bg-mango-50 text-mango-700', desc: 'PM Matsya Sampada' },
]

const MOCK_PONDS = [
  { name: 'Pond A', species: 'Catla + Rohu', area: '2 acres', stocking: '90 days ago', status: 'Growing Well', color: 'green' as const },
  { name: 'Pond B', species: 'Tilapia',      area: '1 acre',  stocking: '45 days ago', status: 'Low DO Alert',  color: 'red'   as const },
]

export default function FisheryHome() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-sky-700">�� Fishery & Aquaculture</h1>

        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={i} className={`${a.color} rounded-2xl p-3 flex flex-col items-center gap-1 min-h-[90px] justify-center shadow-card active:scale-95 transition-transform`}>
              <span className="text-3xl">{a.emoji}</span>
              <span className="text-xs font-bold text-center leading-tight">{a.label}</span>
              <span className="text-[10px] text-center opacity-60">{a.desc}</span>
            </button>
          ))}
        </div>

        <section>
          <h2 className="section-title">🐟 My Ponds</h2>
          {MOCK_PONDS.map((p, i) => (
            <Card key={i} color={p.color} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-base text-soil-800">{p.name} — {p.species}</p>
                  <p className="text-soil-500 text-sm">{p.area} · Stocked {p.stocking}</p>
                </div>
                <Badge color={p.color} label={p.status} />
              </div>
            </Card>
          ))}
          <button className="btn-secondary mt-2">+ Register New Pond</button>
        </section>

        <Card color="red">
          <p className="font-display font-bold text-base text-danger-800">⚠️ Low Dissolved Oxygen — Pond B</p>
          <p className="text-sm text-danger-700 mt-0.5">DO reading: 3.2 mg/L (critical below 4). Start aerator immediately to prevent fish mortality.</p>
        </Card>
      </div>
    </div>
  )
}
