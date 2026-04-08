import { MapPin, Cloudy, Bug, TrendingUp, Landmark, SignalHigh, CheckCircle2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

const MOCK_ALERTS = [
  { id: 1, type: 'weather', title: 'Flash Flood Risk in Yeola', desc: 'Heavy localized rain expected at 4PM. Move machinery to higher ground.', time: '10 mins ago', icon: Cloudy, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 2, type: 'pest', title: 'Fall Armyworm Outbreak', desc: 'Sighted in Pimpalgaon (5km from you). Requires immediate scouting.', time: '2 hours ago', icon: Bug, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 3, type: 'market', title: 'Tomato Prices Surging', desc: 'Nashik mandi price jumped by 15% today. Good time to harvest.', time: '5 hours ago', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 4, type: 'scheme', title: 'MahaDBT Subsidy Closing', desc: 'Final 2 days to apply for tractor subsidy. Upload Aadhaar ASAP.', time: 'Yesterday', icon: Landmark, color: 'text-mango-600', bg: 'bg-mango-50' },
]

export default function HyperlocalAlerts() {
  const handleToggleSMS = () => toast.success('SMS fallback activated for offline zones.')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <div className="flex justify-between items-start">
           <div>
             <h1 className="font-display font-bold text-2xl text-soil-800">🚨 Mera Gaon, Mera Alert</h1>
             <p className="text-soil-500 text-sm flex items-center gap-1 -mt-1"><MapPin size={12}/> Locked to: Yeola, Nashik</p>
           </div>
        </div>
        
        {/* Connection Status Card */}
        <div className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between border-green-200">
           <div className="flex items-center gap-2">
             <div className="relative">
                <SignalHigh size={18} className="text-green-500" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
             </div>
             <p className="font-bold text-sm text-soil-800">Online — Syncing Alerts</p>
           </div>
           <button onClick={handleToggleSMS} className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md hover:bg-neutral-200">
             Enable SMS Backup
           </button>
        </div>

        <section className="space-y-3">
          {MOCK_ALERTS.map(alert => (
            <Card key={alert.id} className="shadow-sm border border-neutral-100 flex items-start gap-4">
              <div className={`${alert.bg} ${alert.color} p-3 rounded-xl shrink-0`}>
                 <alert.icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-soil-800 line-clamp-1">{alert.title}</h3>
                    <span className="text-[10px] font-bold text-neutral-400 shrink-0 mt-1">{alert.time}</span>
                 </div>
                 <p className="text-sm text-soil-600 leading-snug">{alert.desc}</p>
                 <div className="flex justify-end mt-2">
                    <button className="flex items-center gap-1 text-xs font-bold text-forest-600 hover:text-forest-800 transition-colors">
                      <CheckCircle2 size={12} /> Mark as Read
                    </button>
                 </div>
              </div>
            </Card>
          ))}
        </section>

      </div>
    </div>
  )
}
