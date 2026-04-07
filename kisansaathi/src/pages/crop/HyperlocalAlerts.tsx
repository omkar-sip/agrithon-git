import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const ALERTS = [
  { title: '⛈️ Red Alert: Cyclone Warning', body: 'Cyclone Biparjoy approaching coast — keep livestock indoors', time: '1 hour ago', color: 'red' as const },
  { title: '🌾 Locust Swarm Alert',          body: 'Locust swarm reported 40km east — monitor your fields', time: '3 hours ago', color: 'yellow' as const },
  { title: '💰 New MSP Announced',            body: 'Wheat MSP raised to ₹2,275/qtl for 2026–27 season', time: '1 day ago', color: 'green' as const },
  { title: '🏥 Free Soil Testing Camp',       body: 'Agriculture dept camp at Gram Panchayat — this Saturday', time: '2 days ago', color: 'blue' as const },
]

export default function HyperlocalAlerts() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-danger-700">📍 Village Alerts</h1>
        <p className="text-soil-500 text-sm -mt-3">Hyperlocal alerts specific to your village and district</p>

        <div className="space-y-3">
          {ALERTS.map((a, i) => (
            <Card key={i} color={a.color}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display font-bold text-base text-soil-800">{a.title}</p>
                  <p className="text-sm text-soil-600 mt-0.5">{a.body}</p>
                  <p className="text-xs text-soil-400 mt-1">{a.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
