import { useState } from 'react'
import { Calculator, Wheat, Leaf, Coins, CheckCircle2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function FeedCalculator() {
  const [ratio, setRatio] = useState(false)

  const handleCalculate = () => {
    setRatio(true)
    toast.success('Feed ratio calculated based on Milk Yield & Body Weight.')
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-forest-800">🌾 Aahar Calculator</h1>
        <p className="text-soil-500 text-sm -mt-3">Optimize feed cost and animal nutrition</p>

        <Card className="shadow-md border border-neutral-100">
           <h3 className="font-bold text-soil-800 flex items-center gap-2 mb-3"><Calculator size={18}/> Calculate Daily Feed</h3>
           <div className="space-y-3">
             <div>
               <label className="text-xs font-bold text-soil-500 block mb-1">Select Animal</label>
               <select className="w-full bg-parchment rounded-lg p-2.5 text-sm font-bold text-forest-800 border-2 border-transparent focus:border-forest-300 outline-none">
                 <option>HF Cow #01 (Lactating, 14L/day)</option>
                 <option>Murrah Buffalo #02 (Dry)</option>
               </select>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               <div>
                 <label className="text-xs font-bold text-soil-500 block mb-1">Current Weight (kg)</label>
                 <input type="number" defaultValue={450} className="w-full bg-parchment rounded-lg p-2.5 text-sm font-bold text-forest-800 border-2 border-transparent focus:border-forest-300 outline-none" />
               </div>
               <div>
                 <label className="text-xs font-bold text-soil-500 block mb-1">Milk Yield (L)</label>
                 <input type="number" defaultValue={14} className="w-full bg-parchment rounded-lg p-2.5 text-sm font-bold text-forest-800 border-2 border-transparent focus:border-forest-300 outline-none" />
               </div>
             </div>
             
             <button onClick={handleCalculate} className="btn-primary w-full py-3 bg-forest-600 text-white mt-1">Calculate Ratio</button>
           </div>
        </Card>

        {ratio && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card color="green" className="bg-gradient-to-br from-green-50 to-white shadow-sm border border-green-200">
               <h3 className="font-display font-bold text-xl text-green-900 mb-2">Required Daily Diet (Per Animal)</h3>
               <div className="space-y-2">
                 <div className="flex justify-between items-center bg-white p-2.5 border border-green-100 rounded-lg">
                    <span className="flex items-center gap-2 text-sm font-bold text-green-800"><Leaf size={16}/> Green Fodder</span>
                    <span className="font-mono font-bold text-green-700">15 kg</span>
                 </div>
                 <div className="flex justify-between items-center bg-white p-2.5 border border-green-100 rounded-lg">
                    <span className="flex items-center gap-2 text-sm font-bold text-yellow-800"><Wheat size={16}/> Dry Fodder</span>
                    <span className="font-mono font-bold text-yellow-700">5 kg</span>
                 </div>
                 <div className="flex justify-between items-center bg-white p-2.5 border border-green-100 rounded-lg">
                    <span className="flex items-center gap-2 text-sm font-bold text-soil-800"><Coins size={16}/> Concentrate Mixture</span>
                    <span className="font-mono font-bold text-soil-700">5.5 kg</span>
                 </div>
               </div>
               
               <div className="mt-4 bg-green-100 p-3 rounded-lg border border-green-200">
                 <p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1"><CheckCircle2 size={14}/> Bachat Tip (Saves ₹40/day):</p>
                 <p className="text-xs text-green-800 leading-snug">Substitute 1kg of expensive concentrate with Azolla (grown in backyard). Azolla is rich in protein and boosts milk fat.</p>
               </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
