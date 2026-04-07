import { TrendingUp } from 'lucide-react'
import Card from '../../components/ui/Card'
import WeatherWidget from '../../components/shared/WeatherWidget'
import type { StatusColor } from '../../utils/colorSystem'

interface ForecastDay { day: string; temp: string; desc: string; action: string; color: StatusColor; icon: string }

const MOCK_FORECAST: ForecastDay[] = [
  { day: 'Today',      temp: '32°C', desc: 'Partly Cloudy',  action: '�� Good day to spray pesticides', color: 'green',  icon: '⛅' },
  { day: 'Tomorrow',   temp: '28°C', desc: 'Heavy Rain',     action: '🔴 Do NOT go to fields — flooding risk',  color: 'red',    icon: '��️' },
  { day: 'Day 3',      temp: '30°C', desc: 'Cloudy',         action: '🟡 Prepare fungicide — humidity rising',  color: 'yellow', icon: '☁️' },
  { day: 'Day 4',      temp: '33°C', desc: 'Sunny',          action: '🟢 Ideal for irrigation — morning',       color: 'green',  icon: '☀️' },
  { day: 'Day 5',      temp: '31°C', desc: 'Light Drizzle',  action: '🟡 Hold off harvesting if possible',     color: 'yellow', icon: '🌦️' },
]

export default function WeatherAlerts() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-sky-800">🌤️ Weather → Farm Actions</h1>
        <p className="text-soil-500 text-sm -mt-3">AI translates weather into what you should do on your farm</p>

        <WeatherWidget />

        <section>
          <h2 className="section-title">📅 5-Day Forecast & Farm Actions</h2>
          <div className="space-y-3">
            {MOCK_FORECAST.map((f, i) => (
              <Card key={i} color={f.color}>
                <div className="flex items-center gap-4">
                  <span className="text-4xl shrink-0 select-none">{f.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-display font-bold text-lg text-soil-800">{f.day}</p>
                      <p className="font-mono font-bold text-lg text-forest-700">{f.temp}</p>
                    </div>
                    <p className="text-soil-500 text-sm">{f.desc}</p>
                    <p className="font-bold text-base mt-1 text-soil-800">{f.action}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Card color="blue">
          <p className="font-display font-bold text-base text-sky-800">💧 Rainfall Advisory</p>
          <p className="text-sm text-sky-700 mt-1">Based on forecast: Total expected rainfall this week is <span className="font-bold">48mm</span>. Soil moisture will be adequate — reduce irrigation by 60%.</p>
        </Card>
      </div>
    </div>
  )
}
