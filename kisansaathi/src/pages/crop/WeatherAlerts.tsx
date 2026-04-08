import { MapPin, Bell } from 'lucide-react'
import Card from '../../components/ui/Card'
import WeatherWidget from '../../components/shared/WeatherWidget'
import type { StatusColor } from '../../utils/colorSystem'
import toast from 'react-hot-toast'

interface ForecastDay { day: string; temp: string; desc: string; action: string; color: StatusColor; icon: string }

const MOCK_FORECAST: ForecastDay[] = [
  { day: 'Today',      temp: '32°C', desc: 'Partly Cloudy',  action: '🟢 Good day to spray pesticides', color: 'green',  icon: '⛅' },
  { day: 'Tomorrow',   temp: '28°C', desc: 'Heavy Rain',     action: '🔴 Do NOT go to fields — flooding risk',  color: 'red',    icon: '🌧️' },
  { day: 'Day 3',      temp: '30°C', desc: 'Cloudy',         action: '🟡 Prepare fungicide — humidity rising',  color: 'yellow', icon: '☁️' },
  { day: 'Day 4',      temp: '33°C', desc: 'Sunny',          action: '🟢 Ideal for irrigation — morning',       color: 'green',  icon: '☀️' },
  { day: 'Day 5',      temp: '31°C', desc: 'Light Drizzle',  action: '🟡 Hold off harvesting if possible',     color: 'yellow', icon: '🌦️' },
  { day: 'Day 6',      temp: '32°C', desc: 'Clear',          action: '🟢 Safe to resume harvest',               color: 'green',  icon: '☀️' },
  { day: 'Day 7',      temp: '34°C', desc: 'Hot & Dry',      action: '🔴 High heat alert — protect seedlings', color: 'red',    icon: '🔥' },
]

export default function WeatherAlerts() {
  const handleSetAlert = () => toast.success('Push notification set for RED weather alerts!')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        
        <div className="flex justify-between items-start">
           <div>
             <h1 className="font-display font-bold text-2xl text-sky-800">🌤️ Weather → Actions</h1>
             <p className="text-soil-500 text-sm flex items-center gap-1 mt-0.5"><MapPin size={12}/> Yeola, Nashik (Hyperlocal)</p>
           </div>
           <button onClick={handleSetAlert} className="bg-sky-50 text-sky-700 p-2.5 rounded-full shadow-sm active:scale-95 transition-transform">
              <Bell size={20} />
           </button>
        </div>

        <WeatherWidget />

        <section>
          <h2 className="section-title">📅 7-Day Action Forecast</h2>
          <div className="space-y-3">
            {MOCK_FORECAST.map((f, i) => (
              <Card key={i} color={f.color} className="shadow-sm border-b border-transparent">
                <div className="flex items-center gap-4">
                  <span className="text-4xl shrink-0 select-none">{f.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-display font-bold text-lg text-soil-800">{f.day}</p>
                      <p className="font-mono font-bold text-lg text-sky-700">{f.temp}</p>
                    </div>
                    <p className="text-soil-500 text-xs font-semibold uppercase tracking-wider mb-1">{f.desc}</p>
                    <p className="font-bold text-sm text-soil-800 leading-snug">{f.action}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Card color="blue" className="shadow-card-md border-2 border-sky-100">
          <p className="font-display font-bold text-base text-sky-800 flex items-center gap-2">💧 Weekly Rainfall Advisory</p>
          <p className="text-sm text-sky-700 mt-1">Based on the 7-day forecast: Total expected rainfall is <span className="font-bold">48mm</span>. Soil moisture will be adequate — reduce manual irrigation by 60%.</p>
        </Card>
      </div>
    </div>
  )
}
