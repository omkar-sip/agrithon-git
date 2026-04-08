import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  User,
  ShieldCheck,
} from 'lucide-react'
import type { FarmEquipmentItem } from './farmRentalData'

interface BookingModalProps {
  item: FarmEquipmentItem
  onClose: () => void
  isDrone?: boolean
  onConfirm: (item: FarmEquipmentItem, date: string, price: number) => void
}

export default function BookingModal({
  item,
  onClose,
  isDrone,
  onConfirm,
}: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [acres, setAcres] = useState(1)

  const fallbackDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
    []
  )

  const droneBaseRate = 800
  const timePerAcre = 20
  const totalMinutes = acres * timePerAcre
  const droneCost = Math.round((totalMinutes / 60) * droneBaseRate) + 500

  const finalCost = isDrone ? droneCost : item.pricePerDay
  const finalPriceLabel = isDrone ? `Rs ${droneCost} (incl. operator)` : `Rs ${item.pricePerDay} (full day)`

  const handleNext = () => {
    if (step < 3) {
      setStep((current) => current + 1)
      return
    }

    onConfirm(item, date || fallbackDate, finalCost)
    setStep(4)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl sm:rounded-[2.5rem]"
      >
        <div className="absolute left-0 right-0 top-0 flex h-1.5 bg-neutral-100">
          {[1, 2, 3].map((stage) => (
            <div key={stage} className={`flex-1 transition-all duration-500 ${step >= stage ? 'bg-blue-600' : ''}`} />
          ))}
        </div>

        <div className="p-8 pt-10">
          <div className="mb-8 flex items-start justify-between">
            <div className="space-y-1">
              <h2
                className="text-2xl font-black text-neutral-900"
                style={{ fontFamily: 'Baloo 2, sans-serif' }}
              >
                {step === 4 ? 'Booking Confirmed' : 'Book Service'}
              </h2>
              <p className="text-sm font-medium text-neutral-500">{item.name}</p>
            </div>

            {step < 4 && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-neutral-100 p-2 text-neutral-400 transition-colors hover:bg-neutral-200"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <Calendar className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase text-neutral-400">Select Date</p>
                      <input
                        type="date"
                        className="w-full border-none bg-transparent p-0 text-sm font-bold text-neutral-900 outline-none"
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <Clock className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase text-neutral-400">Select Time</p>
                      <input
                        type="time"
                        className="w-full border-none bg-transparent p-0 text-sm font-bold text-neutral-900 outline-none"
                        onChange={(event) => setTime(event.target.value)}
                      />
                    </div>
                  </div>

                  {isDrone && (
                    <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase text-blue-600">Land Area (Acres)</p>
                        <div className="mt-1 flex items-center gap-4">
                          <input
                            type="range"
                            min="1"
                            max="50"
                            className="flex-1 accent-blue-600"
                            value={acres}
                            onChange={(event) => setAcres(parseInt(event.target.value, 10))}
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
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4 rounded-[2rem] bg-neutral-900 p-6 text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-sm text-neutral-400">Service Fee</span>
                    <span className="font-bold">{finalPriceLabel}</span>
                  </div>

                  {isDrone && (
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-sm text-neutral-400">Estimated Duration</span>
                      <span className="font-bold">{totalMinutes} mins</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xl">
                    <span className="font-bold text-brand-400">Total Price</span>
                    <span className="font-black">Rs {finalCost}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
                  <ShieldCheck className="text-green-600" size={20} />
                  <p className="text-xs font-bold text-green-700">
                    Advance payment is optional. Pay after service completion if you prefer.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-neutral-100 bg-neutral-50 p-8">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-sm">
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-neutral-900">{item.name}</h4>
                    <p className="text-sm text-neutral-500">{item.location}</p>
                  </div>

                  <div className="w-full border-t border-neutral-200 pt-4">
                    <div className="flex justify-around">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-neutral-400">Date</p>
                        <p className="text-sm font-bold">{date || fallbackDate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-neutral-400">Time</p>
                        <p className="text-sm font-bold">{time || '10:00'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 py-10 text-center"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-neutral-900">Successfully Booked</h3>
                  <p className="mx-auto max-w-[240px] text-sm text-neutral-500">
                    The provider has been notified. You can track this booking in your activity history.
                  </p>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-left">
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
            {step < 4 ? (
              <>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((current) => current - 1)}
                    className="rounded-2xl bg-neutral-100 p-4 text-neutral-600 transition-all hover:bg-neutral-200"
                  >
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-neutral-900 py-4 font-bold text-white shadow-xl transition-all active:scale-[0.98] hover:bg-neutral-800"
                >
                  {step === 3 ? 'Confirm Booking' : 'Next Step'}
                  <ChevronRight size={20} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl bg-brand-600 py-4 text-lg font-black text-white shadow-xl transition-all active:scale-95"
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
