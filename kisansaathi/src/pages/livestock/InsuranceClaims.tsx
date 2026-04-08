import { useState } from 'react'
import { ShieldCheck, FileText, Camera, Upload, AlertCircle, FileClock } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function InsuranceClaims() {
  const [activeTab, setActiveTab] = useState<'claims' | 'file'>('claims')

  const handleUpload = () => toast.success('Document uploaded for review.')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-mango-800">🛡️ Bima Sahayata</h1>
        <p className="text-soil-500 text-sm -mt-3">Livestock Insurance & Claim Center</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['claims', 'file'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-mango-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'claims' ? 'My Claims' : 'File a Claim'}
            </button>
          ))}
        </div>

        {activeTab === 'claims' && (
          <div className="space-y-4">
             <Card color="yellow" className="bg-gradient-to-br from-yellow-50 to-white">
                <div className="flex justify-between items-start mb-3 border-b border-yellow-200 pb-2">
                   <h3 className="font-bold text-yellow-900 text-lg">Claim #LSI-88902</h3>
                   <span className="text-xs font-bold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-md flex items-center gap-1"><FileClock size={12}/> Processing</span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-yellow-800"><span className="font-bold">Animal:</span> Murrah Buffalo #01 (Tag: X22)</p>
                  <p className="text-sm text-yellow-800"><span className="font-bold">Incident:</span> Illness (FMD Complications)</p>
                  <p className="text-sm text-yellow-800"><span className="font-bold">Filed On:</span> Oct 08, 2023</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-yellow-200 flex items-start gap-3">
                   <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-bold text-soil-800">Action Required</p>
                     <p className="text-xs text-soil-600 mb-2">Please upload the Vet's Post-Mortem Certificate to proceed with the claim.</p>
                     <button onClick={handleUpload} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2"><Upload size={14}/> Upload Document</button>
                   </div>
                </div>
             </Card>
             
             <button className="w-full bg-mango-50 text-mango-800 border-2 border-mango-200 p-4 rounded-xl flex items-center gap-3 hover:bg-mango-100 transition-colors">
               <ShieldCheck size={24} className="text-mango-600" />
               <div className="text-left flex-1">
                 <p className="font-bold font-display text-lg">Register New Insurance</p>
                 <p className="text-xs text-mango-700">Guide for PMFBY Pashu Bima Yojana</p>
               </div>
             </button>
          </div>
        )}

        {activeTab === 'file' && (
          <div className="space-y-4">
            <Card>
               <h3 className="font-bold text-soil-800 flex items-center gap-2 mb-4"><FileText size={18}/> New Claim Request</h3>
               
               <div className="space-y-3">
                 <div>
                   <label className="text-xs font-bold text-soil-500 block mb-1">Select Insured Animal</label>
                   <select className="w-full bg-parchment rounded-lg p-2.5 text-sm font-bold text-soil-800 border-2 border-transparent focus:border-mango-300 outline-none">
                     <option>Murrah Buffalo #01 (Tag: X22)</option>
                     <option>HF Cow #01 (Tag: XA90)</option>
                   </select>
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-soil-500 block mb-1">Incident Type</label>
                   <select className="w-full bg-parchment rounded-lg p-2.5 text-sm font-bold text-soil-800 border-2 border-transparent focus:border-mango-300 outline-none">
                     <option>Illness / Disease</option>
                     <option>Accident</option>
                     <option>Natural Calamity</option>
                   </select>
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-soil-500 block mb-1">Upload Photo (Ear Tag must be visible)</label>
                   <button onClick={() => toast.success('Camera opened')} className="w-full border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-neutral-100">
                     <Camera size={24} className="text-neutral-400" />
                     <span className="text-xs font-bold text-neutral-500">Tap to Scan Photo</span>
                   </button>
                 </div>
                 
                 <button onClick={() => toast.success('Claim Submitted Successfully!')} className="btn-primary w-full bg-mango-600 text-white mt-2 py-3">Submit Claim Application</button>
               </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
