import { useState } from 'react'
import { Wind, Navigation, AlertTriangle, RadioTower, CheckCircle2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function SeaWeather() {
  // Let's toggle between go and no-go states based on a mock location setting
  const [isCoastal, setIsCoastal] = useState(true)
  const isSafe = false // Mocking an unsafe "NO GO" condition to show the high alert UI

  const handleSOS = () => {
    toast.error('Emergency SOS GPS Location Sent via ISRO NAVIC.')
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-teal-800">🌊 Marine Alert</h1>
        <p className="text-soil-500 text-sm -mt-3">INCOIS Coastal Weather & SOS</p>

        {!isCoastal ? (
          <Card className="text-center py-10 opacity-70">
            <RadioTower size={40} className="mx-auto text-neutral-300 mb-3" />
            <h3 className="font-bold text-soil-800">You are inland.</h3>
            <p className="text-sm text-soil-500 mt-1">Marine alerts are only active for coastal and deep-sea fishers.</p>
            <button onClick={() => setIsCoastal(true)} className="text-xs text-teal-600 underline mt-4">Simulate Coastal Location</button>
          </Card>
        ) : (
          <div className="space-y-4">
             {/* Go / No-Go Banner */}
             <Card color={isSafe ? 'green' : 'red'} className={`border-2 ${isSafe ? 'border-green-300' : 'border-red-400 bg-red-600'} text-white`}>
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-1 block">INCOIS Status</span>
                    {isSafe ? (
                      <h2 className="font-display font-bold text-2xl text-green-900 flex items-center gap-2"><CheckCircle2 size={24}/> SAFE TO FISH</h2>
                    ) : (
                      <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2 animate-pulse"><AlertTriangle size={24}/> NO GO ALERT</h2>
                    )}
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] font-bold block opacity-80">Wind Spd</span>
                    <span className={`font-mono font-bold text-xl ${isSafe ? 'text-green-800' : 'text-white'}`}>{isSafe ? '12 km/h' : '65 km/h'}</span>
                 </div>
               </div>
               {!isSafe && (
                 <p className="text-sm font-bold opacity-90 border-t border-red-500 pt-2 mt-2">Severe Cyclone Warning. Do not venture into the sea. High waves expected (3.5m+).</p>
               )}
             </Card>

             <Card className="border border-teal-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-teal-900 flex items-center gap-2 border-b border-teal-50 pb-1 w-full"><Wind size={18}/> Marine Parameters (Mock)</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                   <div>
                     <p className="text-xs text-soil-500 font-bold uppercase">Wave Height</p>
                     <p className="font-bold text-red-600">3.8 Meters</p>
                   </div>
                   <div>
                     <p className="text-xs text-soil-500 font-bold uppercase">Sea Condition</p>
                     <p className="font-bold text-red-600">Very Rough</p>
                   </div>
                   <div>
                     <p className="text-xs text-soil-500 font-bold uppercase">Tide Info</p>
                     <p className="font-bold text-soil-800">High Tide: 14:30</p>
                   </div>
                   <div>
                     <p className="text-xs text-soil-500 font-bold uppercase">Visibility</p>
                     <p className="font-bold text-soil-800">Low (Fog)</p>
                   </div>
                </div>
             </Card>

             <div className="p-4 border border-red-200 rounded-xl bg-gradient-to-br from-white to-red-50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2"><RadioTower size={100} className="text-red-100 opacity-50 transform translate-x-4 -translate-y-4"/></div>
                <div className="relative z-10">
                  <h3 className="font-bold text-red-900 text-lg mb-1 flex items-center gap-2"><Navigation size={18}/> Emergency SOS</h3>
                  <p className="text-xs text-red-800 mb-4 pr-10">Transmit your exact GPS coordinates via satellite to Coast Guard and registered family contacts immediately.</p>
                  <button onClick={handleSOS} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2">
                     <AlertTriangle size={20} /> LONG PRESS TO SEND SOS
                  </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
