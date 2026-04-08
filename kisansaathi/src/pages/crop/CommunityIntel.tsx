import { useState } from 'react'
import { Users, AlertTriangle, ThumbsUp, MapPin, MessageSquare, Flag, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

const REPORTS = [
  { id: 1, type: 'pest', title: 'Fall Armyworm in Maize', location: 'Yeola East (3km away)', time: '2 hours ago', count: 12, spray: 'Spinosad 45% SC', confirmed: false },
  { id: 2, type: 'disease', title: 'Early Blight in Tomato', location: 'Pimpalgaon (7km away)', time: '5 hours ago', count: 8, spray: 'Mancozeb 75% WP', confirmed: true },
]

export default function CommunityIntel() {
  const [reports, setReports] = useState(REPORTS)

  const handleConfirm = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, count: r.count + 1, confirmed: true } : r))
    toast.success('Thanks! Your confirmation helps build the alert network.')
  }

  const handleFlag = () => { toast.success('Report flagged for review.') }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-soil-800">👥 Kisan Samudaya</h1>
        <p className="text-soil-500 text-sm -mt-3">Peer intelligence from farmers near you</p>

        {/* Global Summary Card */}
        <Card color="orange" className="shadow-sm border border-mango-200 bg-gradient-to-br from-mango-50 to-white">
          <div className="flex gap-4 items-start">
             <div className="bg-mango-100 text-mango-600 p-3 rounded-full shrink-0">
               <AlertTriangle size={24} />
             </div>
             <div>
               <h3 className="font-bold text-mango-900 text-lg">Hyperlocal Alert (Nashik)</h3>
               <p className="text-sm text-mango-800"><strong>12 farmers</strong> near you reported Fall Armyworm attacks today. Most successful treatment reported is <span className="font-bold border-b border-mango-400">Spinosad</span>.</p>
             </div>
          </div>
        </Card>

        {/* Action Button */}
        <button className="w-full btn-primary bg-forest-600 text-white shadow-md flex items-center justify-center gap-2 py-3.5">
          <MessageSquare size={18} /> I spotted a pest/disease
        </button>

        {/* Reports Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title mb-0">Local Outbreak Reports</h2>
            <span className="text-xs text-soil-500 font-bold bg-neutral-100 px-2 py-1 rounded-md">Radius: 10km</span>
          </div>

          {reports.map(r => (
            <Card key={r.id} className="shadow-sm border border-neutral-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${r.type === 'pest' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    <AlertTriangle size={16} />
                  </div>
                  <h3 className="font-bold text-soil-800 text-lg">{r.title}</h3>
                </div>
                <button onClick={handleFlag} className="text-neutral-300 hover:text-red-400 p-1"><Flag size={14}/></button>
              </div>

              <div className="text-sm text-soil-600 mb-3 space-y-1">
                <p className="flex items-center gap-1"><MapPin size={14} className="text-soil-400" /> {r.location}</p>
                <p className="flex items-center gap-1 text-xs"><Clock size={14} className="text-soil-400" /> {r.time}</p>
              </div>

              {r.spray && (
                <div className="bg-green-50 text-green-800 text-sm p-2 rounded-lg mb-4 border border-green-100">
                  <span className="font-bold text-xs uppercase tracking-wide text-green-600 block mb-0.5">Top Treatment Used:</span>
                  {r.spray}
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-soil-200 border-2 border-white flex items-center justify-center text-[10px]">👤</div>)}
                  <span className="text-xs font-bold text-soil-500 ml-3 pl-2">+{r.count} reported this</span>
                </div>
                
                <button 
                  onClick={() => !r.confirmed && handleConfirm(r.id)}
                  disabled={r.confirmed}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${r.confirmed ? 'bg-forest-100 text-forest-700' : 'bg-white border border-forest-200 text-forest-600 hover:bg-forest-50'}`}
                >
                  <ThumbsUp size={14} />
                  {r.confirmed ? 'Confirmed' : 'I saw this too'}
                </button>
              </div>
            </Card>
          ))}
        </section>

      </div>
    </div>
  )
}
