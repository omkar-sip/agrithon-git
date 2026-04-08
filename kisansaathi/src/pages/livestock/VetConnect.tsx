import { useState } from 'react'
import { Phone, Video, MapPin, Truck, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function VetConnect() {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'telemed'>('hospitals')

  const handleSOS = () => toast.error('Emergency SOS sent to nearest Vet!')
  const handleAmbulance = () => toast.success('Pashu Sanjeevani Ambulance requested.')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <div className="flex justify-between items-start">
           <div>
             <h1 className="font-display font-bold text-2xl text-danger-800">🩺 Pashu Doctor</h1>
             <p className="text-soil-500 text-sm -mt-1">Veterinary Hospitals & Telemedicine</p>
           </div>
           
           <button onClick={handleSOS} className="bg-red-100 text-red-700 p-3 rounded-full flex flex-col items-center shadow-sm active:scale-95 transition-transform animate-pulse border-2 border-red-200">
             <AlertTriangle size={24} />
           </button>
        </div>

        <button onClick={handleAmbulance} className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-red-600 shadow-sm"><Truck size={24}/></div>
              <div className="text-left">
                <p className="font-bold text-red-900 text-lg">Pashu Ambulance</p>
                <p className="text-xs text-red-700">Dial 1962 / Request Large Animal Transport</p>
              </div>
           </div>
           <Phone size={20} className="text-red-500" />
        </button>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['hospitals', 'telemed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-danger-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'hospitals' ? 'Nearby Vets' : 'Teleconsult'}
            </button>
          ))}
        </div>

        {activeTab === 'hospitals' && (
          <div className="space-y-4">
             <Card className="border-green-200">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800 flex items-center gap-2">Govt Vet Hospital <ShieldCheck size={16} className="text-green-600"/></h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1"><MapPin size={14}/> Yeola City (4km away)</p>
                 </div>
                 <span className="badge bg-green-100 text-green-800">Free</span>
               </div>
               <p className="text-xs text-soil-600 mb-3 block">Timing: 9 AM - 5 PM</p>
               <div className="grid grid-cols-2 gap-2">
                 <button className="btn-secondary bg-sky-50 text-sky-700 border-sky-200 py-2 flex items-center justify-center gap-2"><MapPin size={16}/> Direct</button>
                 <button className="btn-secondary bg-green-50 text-green-700 border-green-200 py-2 flex items-center justify-center gap-2"><Phone size={16}/> Call</button>
               </div>
             </Card>

             <Card>
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">Dr. Sharma's Clinic</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1"><MapPin size={14}/> Pimpalgaon (6km away)</p>
                 </div>
                 <span className="badge bg-neutral-100 text-neutral-600 block">Private</span>
               </div>
               <p className="text-xs text-soil-600 mb-3">Fee: ₹200 · ⭐ 4.8 (12 reviews)</p>
               <div className="grid grid-cols-2 gap-2">
                 <button className="btn-secondary py-2 flex items-center justify-center gap-2"><MapPin size={16}/> Direct</button>
                 <button className="btn-secondary py-2 flex items-center justify-center gap-2"><Phone size={16}/> Call</button>
               </div>
             </Card>
          </div>
        )}

        {activeTab === 'telemed' && (
          <div className="space-y-4">
             <Card color="blue" className="bg-gradient-to-br from-sky-50 to-white">
                <div className="flex items-start gap-4">
                   <img src="https://ui-avatars.com/api/?name=Vet+Doc&background=0284c7&color=fff" alt="Vet" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                   <div className="flex-1">
                     <h3 className="font-bold text-sky-900 text-lg">Dr. Anjali Patil</h3>
                     <p className="text-sm text-sky-700">Govt Empanelled Vet (Cattle Spl)</p>
                     <p className="text-xs text-sky-600 mt-1 flex items-center gap-1"><HeartPulse size={12}/> Speaks: Marathi, Hindi</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                   <button onClick={() => toast.success('Starting Audio Call...')} className="btn-primary w-full bg-forest-600 text-white flex justify-center items-center gap-2 py-2.5"><Phone size={16}/> Call (₹50)</button>
                   <button onClick={() => toast.success('Starting Video Call...')} className="btn-primary w-full bg-sky-600 text-white flex justify-center items-center gap-2 py-2.5"><Video size={16}/> Video Call</button>
                </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
