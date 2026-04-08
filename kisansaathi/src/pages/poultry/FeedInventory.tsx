import { useState } from 'react'
import { AlertOctagon, TrendingUp, RefreshCw, ShoppingCart } from 'lucide-react'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

const INVENTORY = [
  { id: 1, type: 'Broiler Pre-Starter', stock: 50, consumption: 25, unit: 'kg', price: '₹42/kg' },
  { id: 2, type: 'Broiler Finisher', stock: 450, consumption: 120, unit: 'kg', price: '₹37/kg' },
  { id: 3, type: 'Layer Phase 2', stock: 120, consumption: 110, unit: 'kg', price: '₹32/kg' },
]

export default function FeedInventory() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'prices'>('inventory')

  const handleUpdate = () => toast.success('Feed inventory updated.')

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5 pb-20">
        <h1 className="font-display font-bold text-2xl text-orange-800">🌾 Dana Management</h1>
        <p className="text-soil-500 text-sm -mt-3">Feed Inventory & Local Prices</p>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          {['inventory', 'prices'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-white text-orange-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab === 'inventory' ? 'My Stock' : 'Buy Feed'}
            </button>
          ))}
        </div>

        {activeTab === 'inventory' && (
          <div className="space-y-4">
             {INVENTORY.map(item => {
               const daysLeft = Math.floor(item.stock / item.consumption)
               const isCritical = daysLeft < 3

               return (
                 <Card key={item.id} color={isCritical ? 'red' : 'green'} className={isCritical ? 'border-red-300' : ''}>
                    <div className="flex justify-between items-start mb-2">
                       <h3 className={`font-bold text-lg ${isCritical ? 'text-red-900' : 'text-green-900'}`}>{item.type}</h3>
                       {isCritical && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 animate-pulse"><AlertOctagon size={10}/> Critical</span>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 border-b pb-3 border-neutral-100">
                      <div>
                        <p className={`text-xs ${isCritical ? 'text-red-700' : 'text-green-700'}`}>Current Stock</p>
                        <p className={`font-mono font-bold text-2xl ${isCritical ? 'text-red-800' : 'text-green-800'}`}>{item.stock} <span className="text-sm font-sans">kg</span></p>
                      </div>
                      <div>
                         <p className={`text-xs ${isCritical ? 'text-red-700' : 'text-green-700'}`}>Daily Use limit</p>
                         <p className={`font-mono font-bold text-xl opacity-80 ${isCritical ? 'text-red-800' : 'text-green-800'}`}>{item.consumption} kg/day</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div>
                         {isCritical ? (
                           <p className="text-sm font-bold text-red-700 flex items-center gap-1">Only {daysLeft} days of feed left!</p>
                         ) : (
                           <p className="text-sm font-bold text-green-700">Stock lasts for ~{daysLeft} days</p>
                         )}
                       </div>
                       <button className={`btn-secondary py-1.5 px-3 text-xs ${isCritical ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}>Update Stock</button>
                    </div>
                 </Card>
               )
             })}
             
             <Card>
               <h3 className="font-bold text-soil-800 mb-2 flex items-center gap-2"><RefreshCw size={16}/> Daily Consumption Log</h3>
               <div className="flex gap-2 mb-2">
                 <select className="flex-1 bg-neutral-50 rounded-lg p-2 text-sm border border-neutral-200 outline-none">
                   <option>Layer Phase 2</option>
                   <option>Broiler Finisher</option>
                 </select>
                 <input type="number" placeholder="kg fed" className="w-24 bg-neutral-50 rounded-lg p-2 text-sm border border-neutral-200 outline-none" />
               </div>
               <button onClick={handleUpdate} className="btn-primary w-full bg-orange-600 text-white">Save Consumption</button>
             </Card>
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="space-y-4">
             <h2 className="section-title mb-2">Local Supplier Prices</h2>
             
             <Card className="shadow-sm border-orange-100">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">Suguna Layer Phase 2</h3>
                    <p className="text-sm text-neutral-500">Omkar Feed Traders, Yeola</p>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-orange-700 font-mono">₹1600<span className="text-xs"> /50kg</span></p>
                    <p className="text-[10px] text-orange-600 flex items-center justify-end gap-1"><TrendingUp size={10}/> +₹20 vs last week</p>
                 </div>
               </div>
               <div className="border-t border-dashed border-neutral-200 pt-2 mt-2">
                  <button className="flex items-center gap-2 text-sm font-bold text-orange-600"><ShoppingCart size={14}/> Contact Supplier</button>
               </div>
             </Card>

             <Card className="shadow-sm border-orange-100">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold font-display text-lg text-soil-800">Godrej Broiler Finisher</h3>
                    <p className="text-sm text-neutral-500">AgriMart, Nashik</p>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-orange-700 font-mono">₹2100<span className="text-xs"> /50kg</span></p>
                 </div>
               </div>
               <div className="border-t border-dashed border-neutral-200 pt-2 mt-2">
                  <button className="flex items-center gap-2 text-sm font-bold text-orange-600"><ShoppingCart size={14}/> Contact Supplier</button>
               </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  )
}
