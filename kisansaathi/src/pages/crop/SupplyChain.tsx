import { useState } from 'react'
import { Truck, FileText, CheckCircle2, UserCheck, PackageOpen } from 'lucide-react'
import Card from '../../components/ui/Card'
import VoiceInputButton from '../../components/ui/VoiceInputButton'
import toast from 'react-hot-toast'

export default function SupplyChain() {
  const [activeTab, setActiveTab] = useState<'track' | 'buyers' | 'transport'>('track')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-soil-800">🚚 Supply Chain</h1>
        <p className="text-soil-500 text-sm -mt-3">Fasal tracking, transport, and direct buyers</p>

        {/* Custom Tab Bar */}
        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['track', 'buyers', 'transport'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'track' && (
          <div className="space-y-4">
            <Card color="yellow">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg text-soil-800 text-mango-800">Batch #4029</span>
                <span className="badge bg-mango-100 text-mango-800">In Transit</span>
              </div>
              <p className="text-sm border-b pb-2 mb-2 font-mono">20 Quintal • Tomato (Grade A)</p>
              
              <div className="space-y-4 mt-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-green-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] pl-4">
                    <div className="flex flex-col">
                      <time className="text-xs text-neutral-400">Oct 12, 09:00 AM</time>
                      <span className="font-bold text-sm text-soil-800">Harvest Registered</span>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-mango-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Truck size={14} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] pl-4">
                    <div className="flex flex-col">
                      <time className="text-xs text-neutral-400">Oct 12, 11:30 AM</time>
                      <span className="font-bold text-sm text-mango-800">Dispatched to APMC</span>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group border-neutral-300">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-neutral-200 text-neutral-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                     <FileText size={14} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] pl-4 opacity-50">
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-400">Pending</span>
                      <span className="font-bold text-sm text-soil-800">Weighment & Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <button onClick={() => toast.error('PDF Generator Mock')} className="btn-primary w-full bg-soil-800 text-white flex items-center justify-center gap-2">
              <FileText size={16} /> Generate Weighment Slip (PDF)
            </button>
            <button className="btn-primary w-full bg-forest-600 text-white flex items-center justify-center gap-2">
              <PackageOpen size={16} /> Register New Batch
            </button>
          </div>
        )}

        {activeTab === 'buyers' && (
          <div className="space-y-4">
             <Card color="green" className="bg-gradient-to-br from-green-50 to-white shadow-sm border border-green-200">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-display font-bold text-xl text-green-900 flex items-center gap-2"><UserCheck size={20}/> Connect FPO</h3>
                    <p className="text-sm text-green-800 font-medium">Join a Farmer Producer Org for bulk rates</p>
                 </div>
                 <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Featured</span>
               </div>
               
               <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100 mb-3 text-sm text-soil-700">
                 <p><span className="font-bold">Sahyadri Farms FPO</span> (12km away)</p>
                 <p className="text-xs text-soil-500 mt-1">Currently buying: Tomato, Onion, Grapes</p>
                 <div className="flex gap-2 mt-2">
                   <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">Guaranteed Minimum Price</span>
                   <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-1 rounded-md border border-sky-100">Free Cold Storage</span>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 <button onClick={() => toast.success('Application request sent to FPO!')} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg shadow-sm border border-green-700 active:scale-95 transition-transform text-sm">Request to Join FPO</button>
                 <button onClick={() => toast.success('Opening rate card...')} className="bg-white text-green-700 font-bold px-4 py-2.5 rounded-lg shadow-sm border border-green-200 active:scale-95 transition-transform text-sm">View Rates</button>
               </div>
             </Card>

             <Card>
               <div className="flex justify-between items-center">
                 <div>
                    <h3 className="font-bold font-display text-lg">FreshMart Direct</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1"><UserCheck size={14}/> Verified Corporate Buyer</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs text-neutral-500">Buying (Tomato)</p>
                   <p className="text-forest-700 font-bold font-mono">₹1,300/qtl</p>
                 </div>
               </div>
               <button className="btn-primary mt-3 w-full border border-forest-600 bg-forest-50 text-forest-700">Sell to FreshMart</button>
             </Card>

             <Card>
               <div className="flex justify-between items-center">
                 <div>
                    <h3 className="font-bold font-display text-lg">Nashik Traders</h3>
                    <p className="text-sm text-neutral-500">APMC Agent</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs text-neutral-500">Buying (Onion)</p>
                   <p className="text-forest-700 font-bold font-mono">₹900/qtl</p>
                 </div>
               </div>
               <button className="btn-primary mt-3 w-full border border-forest-600 bg-forest-50 text-forest-700">Contact Agent</button>
             </Card>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-4">
             <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
               <h3 className="font-bold text-sky-800 mb-1 flex items-center gap-2"><Truck size={18}/> Book a Truck</h3>
               <p className="text-sm text-sky-700 mb-3">Find verified transporters for your harvest using voice input.</p>
               <div className="space-y-3">
                 <div className="flex gap-2 relative">
                   <input type="text" id="pickup-location" placeholder="Pickup Location (e.g. Yeola)" className="w-full p-3 rounded-lg border border-sky-200 pr-12 focus:outline-sky-400" />
                   <div className="absolute right-2 top-2">
                     <VoiceInputButton onResult={(text) => { const el = document.getElementById('pickup-location') as HTMLInputElement; if(el) el.value = text; }} size="sm" />
                   </div>
                 </div>
                 <div className="flex gap-2 relative">
                   <input type="text" id="drop-location" placeholder="Drop Location (e.g. Pune APMC)" className="w-full p-3 rounded-lg border border-sky-200 pr-12 focus:outline-sky-400" />
                   <div className="absolute right-2 top-2">
                     <VoiceInputButton onResult={(text) => { const el = document.getElementById('drop-location') as HTMLInputElement; if(el) el.value = text; }} size="sm" />
                   </div>
                 </div>
                 <button onClick={() => toast.success('Searching for trucks...')} className="btn-primary w-full bg-sky-600 text-white shadow-sm">Search Transporters</button>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
