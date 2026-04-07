import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const SCHEMES = [
  { name: 'PM-KISAN', benefit: '₹6,000/year', desc: 'Direct income support — ₹2,000 every 4 months to eligible farmers', deadline: 'Anytime', color: 'green' as const, urgent: false },
  { name: 'PM Fasal Bima Yojana', benefit: 'Crop Insurance', desc: 'Insurance against crop loss due to natural calamities, pest & disease', deadline: '31 July 2026', color: 'yellow' as const, urgent: true },
  { name: 'Kisan Credit Card (KCC)', benefit: 'Up to ₹3 Lakh credit', desc: 'Low-interest credit for farming needs at 4% interest rate', deadline: 'Anytime', color: 'green' as const, urgent: false },
  { name: 'eNAM Portal', benefit: 'Better market access', desc: 'Sell crops online at best prices across Indian mandis', deadline: 'Anytime', color: 'blue' as const, urgent: false },
  { name: 'Soil Health Card', benefit: 'Free soil testing', desc: 'Free soil test report with nutrient recommendations from government lab', deadline: 'Anytime', color: 'green' as const, urgent: false },
]

export default function SchemesBenefits() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-mango-600">🏛️ Government Schemes</h1>
        <p className="text-soil-500 text-sm -mt-3">Benefits you are eligible for as a farmer</p>

        <div className="space-y-3">
          {SCHEMES.map((s, i) => (
            <Card key={i} color={s.color}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-display font-bold text-lg text-soil-800">{s.name}</p>
                {s.urgent && <Badge color="red" label="Apply Now" size="sm" />}
              </div>
              <p className="font-bold text-forest-700 text-base mb-1">{s.benefit}</p>
              <p className="text-sm text-soil-600">{s.desc}</p>
              {s.deadline !== 'Anytime' && <p className="text-xs text-danger-600 font-bold mt-2">📅 Deadline: {s.deadline}</p>}
              <button className="mt-3 text-sm font-bold text-forest-600 underline">Apply / Learn More →</button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
