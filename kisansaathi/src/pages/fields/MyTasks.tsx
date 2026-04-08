import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Calendar, Trash2, Clock, CheckCircle2, MoreVertical, MapPin, Bell, PenLine } from 'lucide-react'

const TASKS = [
  {
    id: 1, title: 'Urea Fertilizer', crop: 'Wheat', field: 'North Fields',
    startTime: '12:00 PM', endTime: '1:00 PM', status: 'due',
    description: 'Check soil moisture before starting. Use drip irrigation system.',
    image: '/assets/images/market/urea.png',
  },
  {
    id: 2, title: 'Irrigation', crop: 'Wheat', field: 'North Fields',
    startTime: '9:00 AM', endTime: '11:00 AM', status: 'due',
    description: 'Check soil moisture before starting. Use drip irrigation system.',
    image: '/assets/images/market/irrigation.png',
  },
  {
    id: 3, title: 'Pesticide Spray', crop: 'Groundnuts', field: 'South Fields',
    startTime: '7:00 AM', endTime: '8:30 AM', status: 'completed',
    description: 'Apply neem-based organic pesticide.',
    image: '/assets/images/market/pesticide.png',
  },
  {
    id: 4, title: 'Weeding', crop: 'Cotton', field: 'North Fields',
    startTime: '6:00 AM', endTime: '8:00 AM', status: 'overdue',
    description: 'Manual weeding required around cotton plants.',
    image: '/assets/images/crops/cotton.png',
  },
]

const FILTERS = [
  { label: 'Due', key: 'due', color: 'bg-blue-600' },
  { label: 'Completed', key: 'completed', color: 'bg-green-600' },
  { label: 'Overdue', key: 'overdue', color: 'bg-red-600' },
]

export default function MyTasks() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('due')
  const [taskList, setTaskList] = useState(TASKS)

  const today = new Date()
  const dayName = today.toLocaleDateString('en-IN', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  const filtered = taskList.filter(t => t.status === activeFilter)

  const markDone = (id: number) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t))
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-32 border-b border-neutral-100 rounded-b-[3rem] relative z-10 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
               <button onClick={() => navigate(-1)} className="p-3 bg-neutral-100 rounded-2xl text-neutral-600 hover:bg-neutral-200 transition-all">
                <ChevronLeft size={20} />
              </button>
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                  My Tasks
                </h1>
                <p className="text-neutral-500 text-sm font-medium">{dayName}, {dateStr}</p>
              </div>
            </div>
            <button className="p-4 bg-neutral-100 rounded-2xl text-neutral-600 hover:bg-neutral-200 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeFilter === f.key
                    ? `${f.color} text-white shadow-lg`
                    : 'bg-white text-neutral-400 border border-neutral-100 hover:border-neutral-200 shadow-sm'
                }`}
              >
                {f.label} ({taskList.filter(t => t.status === f.key).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 -mt-20 relative z-20 space-y-6">
        
        {/* Task Cards */}
        <AnimatePresence mode='popLayout'>
          {filtered.length > 0 ? (
            filtered.map((task, i) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-neutral-100 transition-all duration-500"
              >
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden shadow-sm">
                        <img src={task.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-extrabold text-neutral-900 leading-tight">{task.title}</h3>
                        <div className="flex items-center gap-1.5 text-neutral-400 font-medium text-xs">
                          <MapPin size={12} />
                          <span>{task.field} • {task.crop}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 bg-neutral-50 rounded-xl text-neutral-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-2xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Start</p>
                        <p className="text-sm font-black text-neutral-900">{task.startTime}</p>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-2xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">End</p>
                        <p className="text-sm font-black text-neutral-900">{task.endTime}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 leading-relaxed italic">"{task.description}"</p>

                  <div className="flex gap-3 pt-2">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => markDone(task.id)}
                        className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all active:scale-95 shadow-lg"
                      >
                        <CheckCircle2 size={20} />
                        Mark Done
                      </button>
                    )}
                    <button className="p-4 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-neutral-200 transition-all">
                      <PenLine size={20} />
                    </button>
                    <button className="p-4 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-neutral-200 transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-20 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-neutral-200"
            >
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-200">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-neutral-900">All caught up!</p>
                <p className="text-neutral-500 text-sm">No {activeFilter} tasks for today.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
