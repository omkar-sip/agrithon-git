import { useState } from 'react'
import { Activity, Stethoscope, AlertOctagon, Syringe } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function AnimalHealthLog() {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'vaccines'>('symptoms')

  const handleSymptomCheck = () => { toast.error('Symptom severity high! Recommending Vet Consult.') }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-harvest-800">📋 Pashu Diary</h1>
        <p className="text-soil-500 text-sm -mt-3">Health & Vaccination Logs</p>

        {/* Animal Selector */}
        <select className="w-full bg-white border border-neutral-200 rounded-xl p-3 font-bold text-soil-800 shadow-sm outline-none focus:ring-2 focus:ring-harvest-500">
           <option>Select Animal: HF Cow #01 (Tag: XA90)</option>
           <option>Select Animal: Murrah Buffalo #02</option>
           <option>+ Register New Animal</option>
        </select>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['symptoms', 'vaccines'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-harvest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'symptoms' ? 'Health Check' : 'Vaccinations'}
            </button>
          ))}
        </div>

        {activeTab === 'symptoms' && (
          <div className="space-y-4">
             <Card color="yellow" className="bg-gradient-to-br from-yellow-50 to-white">
                <h3 className="font-bold text-harvest-800 flex items-center gap-2 mb-3"><Stethoscope size={18}/> Symptom Checker</h3>
                <p className="text-sm text-harvest-700 mb-2 font-bold">Aapke pashu mein kya dikha?</p>
                <div className="flex flex-wrap gap-2 mb-4">
                   <button className="px-3 py-1.5 bg-white border border-yellow-200 text-yellow-800 rounded-full text-xs font-bold hover:bg-yellow-100">Not eating</button>
                   <button className="px-3 py-1.5 bg-yellow-200 border border-yellow-300 text-yellow-900 rounded-full text-xs font-bold border-2 ring-1 ring-yellow-400">High fever</button>
                   <button className="px-3 py-1.5 bg-white border border-yellow-200 text-yellow-800 rounded-full text-xs font-bold hover:bg-yellow-100">Limping</button>
                   <button className="px-3 py-1.5 bg-white border border-yellow-200 text-yellow-800 rounded-full text-xs font-bold hover:bg-yellow-100">Low Milk Output</button>
                </div>
                <button onClick={handleSymptomCheck} className="btn-primary bg-harvest-600 text-white w-full flex items-center justify-center gap-2">
                  <Activity size={16} /> Analyze Symptoms
                </button>
             </Card>

             <h3 className="section-title">Past Medical History</h3>
             <Card className="shadow-sm">
                <div className="flex justify-between items-start">
                   <div>
                     <p className="font-bold text-soil-800">Mastitis Treatment</p>
                     <p className="text-xs text-soil-500">Treated with Amoxicillin</p>
                   </div>
                   <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md">2 months ago</span>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'vaccines' && (
          <div className="space-y-3">
             <Card color="red" className="border-red-200 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                   <p className="font-bold text-red-800 flex items-center gap-2"><AlertOctagon size={16}/> ACTION REQUIRED</p>
                   <span className="text-xs font-bold bg-white text-red-600 px-2 py-1 rounded-md">OVERDUE</span>
                </div>
                <p className="text-sm font-bold text-red-900">FMD (Foot & Mouth Disease)</p>
                <p className="text-xs text-red-700 mb-3">Was due on: Oct 10, 2023</p>
                <button className="w-full bg-red-600 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50">Log Vaccination</button>
             </Card>
             
             <Card>
                <div className="flex justify-between items-start">
                   <div className="flex items-start gap-3">
                     <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Syringe size={20}/></div>
                     <div>
                       <p className="font-bold text-soil-800">HS (Hemorrhagic Septicemia)</p>
                       <p className="text-xs text-soil-500">Given on: Mar 15, 2023</p>
                     </div>
                   </div>
                   <span className="text-xs font-bold text-green-600">Done</span>
                </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
