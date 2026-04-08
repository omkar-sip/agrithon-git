import { useState } from 'react'
import { FileText, CheckCircle2, Clock, Globe, ShieldCheck, MapPin } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

const SCHEMES = [
  { id: 1, name: 'PM-KISAN Samman Nidhi', desc: '₹6000/year income support', status: 'Active', icon: Globe, highlight: 'Next installment: Nov 15' },
  { id: 2, name: 'PMFBY (Crop Insurance)', desc: 'Protect your harvest against weather', status: 'Pending', icon: ShieldCheck, highlight: 'Action Required: Upload Aadhaar' },
  { id: 3, name: 'Kisan Credit Card (KCC)', desc: 'Low interest working capital loan', status: 'Not Applied', icon: FileText, highlight: 'Apply via nearest bank' },
  { id: 4, name: 'MahaDBT Tractor Subsidy', desc: 'State specific 50% capital subsidy', status: 'Closing Soon', icon: Clock, highlight: 'Deadline in 5 days!' },
]

export default function SchemesBenefits() {
  const [activeTab, setActiveTab] = useState<'status' | 'kcc' | 'csc'>('status')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-soil-800">🏛️ Sarkari Sahayata</h1>
        <p className="text-soil-500 text-sm -mt-3">Government Schemes & Subsidies</p>

        {/* Custom Tab Bar */}
        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['status', 'kcc', 'csc'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'status' ? 'My Schemes' : tab === 'kcc' ? 'KCC Loan' : 'Find CSC Center'}
            </button>
          ))}
        </div>

        {activeTab === 'status' && (
          <div className="space-y-4">
             {SCHEMES.map(s => (
                <Card key={s.id} className="shadow-sm">
                   <div className="flex gap-4">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                       s.status === 'Active' ? 'bg-green-100 text-green-600' :
                       s.status === 'Closing Soon' ? 'bg-mango-100 text-mango-600' :
                       'bg-neutral-100 text-neutral-500'
                     }`}>
                       <s.icon size={20} />
                     </div>
                     <div className="flex-1">
                       <h3 className="font-bold text-soil-800">{s.name}</h3>
                       <p className="text-xs text-soil-500 mb-2">{s.desc}</p>
                       
                       <div className={`text-xs font-bold px-2 py-1 inline-flex rounded-md ${
                          s.status === 'Active' ? 'bg-green-50 text-green-700' :
                          s.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                          s.status === 'Closing Soon' ? 'bg-red-50 text-red-700' :
                          'bg-neutral-50 text-neutral-600'
                       }`}>
                          {s.status === 'Active' && <CheckCircle2 size={12} className="mr-1 mt-0.5"/>}
                          {s.status}
                       </div>
                       
                       <div className="mt-3 bg-neutral-50 p-2 rounded-lg text-xs font-semibold text-soil-700 border border-neutral-100">
                          {s.highlight}
                       </div>
                     </div>
                   </div>
                </Card>
             ))}
          </div>
        )}

        {activeTab === 'kcc' && (
          <div className="space-y-4">
            <Card color="green" className="bg-gradient-to-br from-green-50 to-white shadow-sm border border-green-200">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="font-display font-bold text-xl text-green-900 border-b border-green-200 pb-1 w-full flex items-center gap-2"><FileText size={20}/> KCC e-Passbook</h3>
                    <p className="text-xs text-green-700 mt-2">State Bank of India • A/c ending 4589</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100">
                     <p className="text-[10px] uppercase font-bold text-soil-500 mb-1">Total Limit</p>
                     <p className="font-bold font-mono text-lg text-soil-800">₹3,00,000</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100">
                     <p className="text-[10px] uppercase font-bold text-soil-500 mb-1">Available Bal</p>
                     <p className="font-bold font-mono text-lg text-green-700">₹1,45,000</p>
                  </div>
               </div>

               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-yellow-800 flex items-center gap-1"><Clock size={14}/> Next Repayment Due</span>
                     <span className="font-bold text-sm text-yellow-900">₹15,000</span>
                  </div>
                  <p className="text-[10px] text-yellow-700">Due Date: 15 May 2024 (To maintain 3% interest subvention)</p>
               </div>
               
               <button onClick={() => toast.success('Redirecting to SBI portal...')} className="w-full mt-3 bg-green-600 text-white font-bold py-3 rounded-xl shadow-sm active:scale-95 transition-transform">Pay Due Amount</button>
            </Card>
          </div>
        )}

        {activeTab === 'csc' && (
          <div className="space-y-4">
             <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
               <h3 className="font-bold text-sky-800 mb-1 flex items-center gap-2">Common Service Centers (CSC)</h3>
               <p className="text-sm text-sky-700 mb-3">Govt centers where you can apply for schemes, upload documents, and update Aadhaar.</p>
               
               <Card>
                 <div className="flex justify-between items-start">
                   <div>
                      <h3 className="font-bold font-display text-lg text-soil-800">Maha e-Seva Kendra</h3>
                      <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1"><MapPin size={14}/> Main Chowk, Yeola (2km away)</p>
                   </div>
                 </div>
                 <button className="btn-primary mt-3 w-full border border-sky-600 bg-sky-50 text-sky-700">Get Directions</button>
               </Card>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
