// src/pages/fields/MyTasks.tsx — task management matching reference
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Calendar, Trash2, Clock, CheckCircle2 } from 'lucide-react'

const TASKS = [
  {
    id: 1, title: 'Urea Fertilizer', crop: 'Wheat', field: 'North Fields',
    startTime: '12:00 PM', endTime: '1:00 PM', status: 'due',
    description: 'Check soil moisture before starting. Use drip irrigation system.',
    icon: '🧪',
  },
  {
    id: 2, title: 'Irrigation', crop: 'Wheat', field: 'North Fields',
    startTime: '9:00 AM', endTime: '11:00 AM', status: 'due',
    description: 'Check soil moisture before starting. Use drip irrigation system.',
    icon: '💧',
  },
  {
    id: 3, title: 'Pesticide Spray', crop: 'Groundnuts', field: 'South Fields',
    startTime: '7:00 AM', endTime: '8:30 AM', status: 'completed',
    description: 'Apply neem-based organic pesticide.',
    icon: '🧴',
  },
  {
    id: 4, title: 'Weeding', crop: 'Cotton', field: 'North Fields',
    startTime: '6:00 AM', endTime: '8:00 AM', status: 'overdue',
    description: 'Manual weeding required around cotton plants.',
    icon: '🌱',
  },
]

const FILTERS = [
  { label: 'Due', count: 3, key: 'due' },
  { label: 'Completed', count: 2, key: 'completed' },
  { label: 'Overdue', count: 1, key: 'overdue' },
]

const today = new Date()
const dayName = today.toLocaleDateString('en-IN', { weekday: 'long' })
const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function MyTasks() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('due')
  const [taskList, setTaskList] = useState(TASKS)

  const filtered = taskList.filter(t => t.status === activeFilter)

  const markDone = (id: number) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t))
  }

  return (
    <div className="page-root bg-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200">
            <ChevronLeft size={20} className="text-neutral-600" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
            My Task
          </h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
          <Calendar size={18} className="text-neutral-500" />
        </button>
      </div>

      {/* Date card */}
      <div className="mx-4 mt-4 bg-info-50 border border-info-100 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-info-600" />
          <span className="text-sm font-semibold text-info-900">{dayName}, {dateStr}</span>
        </div>
        <span className="text-sm font-bold text-neutral-700">29°C</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              activeFilter === f.key
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-neutral-600 border-neutral-200'
            }`}
          >
            {f.label} ({taskList.filter(t => t.status === f.key).length})
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        <p className="text-sm font-bold text-neutral-900 capitalize">{activeFilter} Tasks</p>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 size={48} className="text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No {activeFilter} tasks</p>
          </div>
        )}

        {filtered.map(task => (
          <div key={task.id} className="bg-white border border-neutral-200 rounded-2xl shadow-card p-4 space-y-3">
            {/* Task header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl select-none">{task.icon}</span>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{task.title}</p>
                  <p className="text-xs text-neutral-500">{task.crop} · {task.field}</p>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100">
                <Trash2 size={14} className="text-neutral-400" />
              </button>
            </div>

            {/* Times */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">Work Start</p>
                  <p className="text-xs font-bold text-neutral-900">{task.startTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">Work End</p>
                  <p className="text-xs font-bold text-neutral-900">{task.endTime}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-500 leading-relaxed">{task.description}</p>

            {/* Actions */}
            {task.status !== 'completed' && (
              <div className="flex gap-3">
                <button
                  onClick={() => markDone(task.id)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors active:scale-[0.98]"
                >
                  Mark Done
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  Edit Task
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
