import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, User, ShieldCheck } from 'lucide-react'
import type { FarmEquipmentItem } from './farmRentalData'

interface BookingModalProps {
  item: FarmEquipmentItem
  onClose: () => void
  isDrone?: boolean
  onConfirm: (item: FarmEquipmentItem, date: string, price: number) => void
}

export default function BookingModal({ item, onClose, isDrone, onConfirm }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [acres, setAcres] = useState(1)

  // Drone specific calculation
  const droneBaseRate = 800 // per hour
  const timePerAcre = 20 // minutes
  const totalMinutes = acres * timePerAcre
  const droneCost = Math.round((totalMinutes / 60) * droneBaseRate) + 500 // +500 for operator

  const finalCost = isDrone ? droneCost : item.pricePerDay
  const finalPriceLabel = isDrone ? `₹${droneCost} (incl. operator)` : `₹${item.pricePerDay} (Full Day)`

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else {
      onConfirm(item, date || 'April 9, 2026', finalCost)
      setStep(4) // Success state
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-100 flex">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 transition-all duration-500 ${step >= s ? 'bg-blue-600' : ''}`} />
          ))}
        </div>

        <div className="p-8 pt-10">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                 {step === 4 ? 'Booking Confirmed!' : 'Book Service'}
              </h2>
              <p className="text-neutral-500 text-sm font-medium">{item.name}</p>
            </div>
            {step < 4 && (
              <button onClick={onClose} className="p-2 bg-neutral-100 rounded-full text-neutral-400 hover:bg-neutral-200 transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                     <Calendar className="text-blue-600" size={20} />
                     <div className="flex-1">
                       <p className="text-[10px] font-bold text-neutral-400 uppercase">Select Date</p>
                       <input 
                         type="date" 
                         className="bg-transparent border-none p-0 text-sm font-bold text-neutral-900 w-full outline-none" 
                         onChange={(e) => setDate(e.target.value)}
                       />
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                     <Clock className="text-blue-600" size={20} />
                     <div className="flex-1">
                       <p className="text-[10px] font-bold text-neutral-400 uppercase">Select Time</p>
                       <input 
                         type="time" 
                         className="bg-transparent border-none p-0 text-sm font-bold text-neutral-900 w-full outline-none" 
                         onChange={(e) => setTime(e.target.value)}
                       />
                     </div>
                  </div>
                  {isDrone && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Land Area (Acres)</p>
                        <div className="flex items-center gap-4 mt-1">
                          <input 
                            type="range" 
                            min="1" max="50" 
                            className="flex-1 accent-blue-600"
                            value={acres}
                            onChange={(e) => setAcres(parseInt(e.target.value))}
                          />
                          <span className="text-lg font-black text-blue-900">{acres}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-neutral-900 rounded-[2rem] p-6 text-white space-y-4">
                   <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-neutral-400 text-sm">Service Fee</span>
                      <span className="font-bold">{finalPriceLabel}</span>
                   </div>
                   {isDrone && (
                     <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-neutral-400 text-sm">Est. Duration</span>
                        <span className="font-bold">{totalMinutes} Mins</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-brand-400">Total Price</span>
                      <span className="font-black">₹{finalCost}</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <ShieldCheck className="text-green-600" size={20} />
                  <p className="text-xs font-bold text-green-700">Advance payment optional. Pay after service completion.</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden">
                      <img src={item.images[0]} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="font-bold text-lg text-neutral-900">{item.name}</h4>
                      <p className="text-neutral-500 text-sm">{item.location}</p>
                   </div>
                   <div className="w-full pt-4 border-t border-neutral-200">
                      <div className="flex justify-around">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase">Date</p>
                          <p className="text-sm font-bold">{date || '9 April'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase">Time</p>
                          <p className="text-sm font-bold">{time || '10:00 AM'}</p>
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="space-y-8 text-center py-10"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                   <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-neutral-900">Successfully Booked!</h3>
                   <p className="text-neutral-500 text-sm max-w-[240px] mx-auto">
                     The provider has been notified. You can track this in your Activity History.
                   </p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center gap-4 text-left">
                   <User className="text-blue-600" size={24} />
                   <div>
                      <p className="text-sm font-bold text-neutral-900">{item.owner.name}</p>
                      <p className="text-xs text-neutral-500">{item.owner.phone}</p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex gap-4">
            {step < 4 && (
              <>
                {step > 1 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="p-4 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-neutral-200 transition-all"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-neutral-800 transition-all active:scale-[0.98]"
                >
                  {step === 3 ? 'Confirm Booking' : 'Next Step'}
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            {step === 4 && (
              <button 
                onClick={onClose}
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
