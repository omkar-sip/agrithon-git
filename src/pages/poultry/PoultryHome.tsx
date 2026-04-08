import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const QUICK_ACTIONS = [
  { label: 'Flock Diary',    emoji: '📋', path: '/poultry/flock',   color: 'bg-harvest-50 text-harvest-700', desc: 'Batch Track' },
  { label: 'Feed Manage',    emoji: '🌾', path: '/poultry/feed',    color: 'bg-orange-50 text-orange-700', desc: 'Inventory' },
  { label: 'Egg Log',        emoji: '🥚', path: '/poultry/egg',     color: 'bg-yellow-50 text-yellow-700', desc: 'Production' },
  { label: 'Market Prices',  emoji: '📊', path: '/poultry/market',  color: 'bg-sky-50 text-sky-700',      desc: 'Live Rates' },
  { label: 'Disease Scan',   emoji: '🚨', path: '/poultry/disease', color: 'bg-red-50 text-danger-700',   desc: 'Detection' },
]

const MOCK_FLOCKS = [
  { name: 'Broiler Batch A', count: 500, age: '28 days', status: 'Healthy', color: 'green' as const, avgWeight: '1.2 kg' },
  { name: 'Layer Flock B',   count: 300, age: '180 days', status: 'Disease Alert', color: 'red' as const, avgWeight: '1.8 kg' },
]

export default function PoultryHome() {
  const navigate = useNavigate()
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-mango-600">🐓 Poultry Management</h1>

        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)} className={`${a.color} rounded-2xl p-3 flex flex-col items-center gap-1 min-h-[90px] justify-center shadow-card active:scale-95 transition-transform`}>
              <span className="text-3xl">{a.emoji}</span>
              <span className="text-xs font-bold text-center leading-tight">{a.label}</span>
              <span className="text-[10px] text-center opacity-60">{a.desc}</span>
            </button>
          ))}
        </div>

        <section>
          <h2 className="section-title">🐓 My Flocks</h2>
          {MOCK_FLOCKS.map((f, i) => (
            <Card key={i} color={f.color} className="mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-base text-soil-800">{f.name}</p>
                  <p className="text-soil-500 text-sm">{f.count} birds · Age: {f.age} · Avg: {f.avgWeight}</p>
                </div>
                <Badge color={f.color} label={f.status} />
              </div>
            </Card>
          ))}
          <button className="btn-secondary mt-2">+ Add New Flock Batch</button>
        </section>

        <Card color="red">
          <p className="font-display font-bold text-base text-danger-800">⚠️ Disease Alert — Layer Flock B</p>
          <p className="text-sm text-danger-700 mt-0.5">Unusual mortality rate detected. Consult Vet AI immediately.</p>
          <button className="mt-2 text-sm font-bold text-danger-700 underline">Open Vet AI →</button>
        </Card>
      </div>
    </div>
  )
}
