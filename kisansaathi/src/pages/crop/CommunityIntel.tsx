import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const REPORTS = [
  { farmer: 'Ramesh (Nashik)', time: '2 hours ago', crop: 'Tomato', issue: 'Aphid Attack', desc: '50% of my plants affected — leaves curling', color: 'red' as const, confirmed: 8 },
  { farmer: 'Sunita (Pune)',   time: '5 hours ago', crop: 'Wheat',  issue: 'Rust Disease',  desc: 'Orange rust spots appearing on lower leaves', color: 'yellow' as const, confirmed: 3 },
  { farmer: 'Prakash (Solapur)', time: '1 day ago',  crop: 'Cotton', issue: 'Good Yield',  desc: 'Cotton bolls opening well — market ready', color: 'green' as const, confirmed: 12 },
]

export default function CommunityIntel() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-forest-800">👥 Community Reports</h1>
        <p className="text-soil-500 text-sm -mt-3">Real-time pest and disease reports from farmers near you</p>

        <button className="btn-primary">+ Report Crop Issue</button>

        <div className="space-y-3">
          {REPORTS.map((r, i) => (
            <Card key={i} color={r.color}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="font-display font-bold text-base text-soil-800">{r.issue} — {r.crop}</p>
                  <p className="text-soil-400 text-xs">{r.farmer} · {r.time}</p>
                </div>
                <Badge color={r.color} label={`${r.confirmed} confirmed`} size="sm" />
              </div>
              <p className="text-sm text-soil-600">{r.desc}</p>
            </Card>
          ))}
        </div>

        <Card color="blue">
          <p className="font-bold text-sky-800 text-sm">🔔 Powered by Firebase Firestore — Reports from farmers within 50km radius will appear here in real-time.</p>
        </Card>
      </div>
    </div>
  )
}
