import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const QUICK_ACTIONS = [
  { label: 'Health Track',     emoji: '🐄', path: '/livestock/health',   color: 'bg-harvest-50 text-harvest-700', desc: 'Pashu Diary' },
  { label: 'Vet Connect',      emoji: '🩺', path: '/livestock/vet',      color: 'bg-red-50 text-danger-700',      desc: 'Doctor Consult' },
  { label: 'Feed Calculator',  emoji: '🌾', path: '/livestock/feed',     color: 'bg-forest-50 text-forest-700',   desc: 'Aahar Plan' },
  { label: 'Milk Log',         emoji: '🥛', path: '/livestock/milk',     color: 'bg-sky-50 text-sky-700',         desc: 'Doodh Diary' },
  { label: 'Insurance',        emoji: '🛡️', path: '/livestock/insurance',color: 'bg-orange-50 text-mango-700',    desc: 'Bima Claims' },
  { label: 'Mandi Prices',     emoji: '📈', path: '/livestock/mandi',    color: 'bg-harvest-50 text-harvest-700', desc: 'Pashu Bazar' },
]

const MOCK_ANIMALS = [
  { name: 'HF Cow #01', kind: 'Cow', milk: '14L/day', health: 'Healthy', color: 'green' as const },
  { name: 'Murrah Buffalo #02', kind: 'Buffalo', milk: '8L/day', health: 'Vaccination Due', color: 'yellow' as const },
]

export default function LivestockHome() {
  const navigate = useNavigate()
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-harvest-700">🐄 Livestock Management</h1>

        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)}
              className={`${a.color} rounded-2xl p-3 flex flex-col items-center gap-1 min-h-[90px] justify-center shadow-card active:scale-95 transition-transform`}>
              <span className="text-3xl">{a.emoji}</span>
              <span className="text-xs font-bold text-center leading-tight">{a.label}</span>
              <span className="text-[10px] text-center opacity-60">{a.desc}</span>
            </button>
          ))}
        </div>

        <section>
          <h2 className="section-title">🐄 My Animals</h2>
          {MOCK_ANIMALS.map((a, i) => (
            <Card key={i} color={a.color} className="mb-2">
              <div className="flex items-center justify-between">
                <div><p className="font-bold text-base text-soil-800">{a.name}</p><p className="text-soil-500 text-sm">{a.kind} · {a.milk}</p></div>
                <Badge color={a.color} label={a.health} />
              </div>
            </Card>
          ))}
          <button className="btn-secondary mt-2">+ Register New Animal</button>
        </section>

        <Card color="yellow">
          <p className="font-display font-bold text-base text-harvest-800">📅 Upcoming: Vaccination Due</p>
          <p className="text-sm text-harvest-700 mt-0.5">Murrah Buffalo #02 — FMD vaccination due in 3 days</p>
        </Card>
      </div>
    </div>
  )
}
