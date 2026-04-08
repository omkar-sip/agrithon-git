import { useState } from 'react'
import { Leaf, MessageSquareText, MapPin, Globe, PenTool, Mic, Camera, Image as ImageIcon, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

interface Post {
  id: number
  author: string
  avatar: string
  time: string
  title: string
  content?: string
  category: string
  catColor: 'green' | 'yellow' | 'red' | 'blue'
  upvotes: number
  replies: number
  isLocal: boolean
}

const FORUM_POSTS: Post[] = [
  { id: 1, author: 'Vijay Patil', avatar: '🧑🏽‍🌾', time: '1 hour ago', title: 'Tomato price crash — should I cold-store?', content: 'Current mandi rate is ₹4/kg. Does anyone know if APMC cold storage is full?', category: 'Advice Needed', catColor: 'yellow', upvotes: 24, replies: 8, isLocal: true },
  { id: 2, author: 'Ministry of Agri', avatar: '🏛️', time: '3 hours ago', title: 'Heavy Rain Alert for Nashik District', category: 'Alert', catColor: 'red', upvotes: 142, replies: 15, isLocal: true },
  { id: 3, author: 'Raju Sharma', avatar: '👨🏽‍🌾', time: '1 day ago', title: 'Got ₹2 lakh from PM-KISAN FPO scheme!', content: 'We aggregated 15 farmers in our village and applied for the FPO grant. Approved in 4 weeks.', category: 'Success Story', catColor: 'green', upvotes: 67, replies: 23, isLocal: false },
  { id: 4, author: 'Lakshmi Rao', avatar: '👩🏽‍🌾', time: '2 days ago', title: 'Selling 10L Milk Chiller (Used)', content: 'Upgrading to larger bulk cooler. ₹12,000 negotiable.', category: 'Buy/Sell', catColor: 'blue', upvotes: 31, replies: 14, isLocal: true },
]

export default function Forum() {
  const [feedLevel, setFeedLevel] = useState<'local' | 'national'>('local')
  const [composeBox, setComposeBox] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')

  const displayPosts = FORUM_POSTS.filter(p => feedLevel === 'national' || p.isLocal)

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return
    toast.success('Your post is live in Kisan Choupal!')
    setComposeBox(false)
    setNewPostContent('')
  }

  return (
    <div className="page-container bg-neutral-100 min-h-screen">
      <div className="max-w-lg mx-auto w-full pb-20">
        
        {/* Sticky Header Actions */}
        <div className="sticky top-14 bg-neutral-100 z-30 pt-4 pb-2 px-4 shadow-sm border-b border-neutral-200">
           <h1 className="font-display font-bold text-2xl text-forest-800">💬 Kisan Choupal</h1>
           <p className="text-soil-500 text-sm mb-4">Farmer Community Forum</p>

           <div className="flex bg-white p-1 rounded-xl shadow-sm border border-neutral-200">
             <button
               onClick={() => setFeedLevel('local')}
               className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors flex items-center justify-center gap-2 ${feedLevel === 'local' ? 'bg-forest-50 text-forest-700 shadow-sm border border-forest-100' : 'text-neutral-500 hover:text-neutral-700'}`}
             >
               <MapPin size={16}/> My Panchayat
             </button>
             <button
               onClick={() => setFeedLevel('national')}
               className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors flex items-center justify-center gap-2 ${feedLevel === 'national' ? 'bg-forest-50 text-forest-700 shadow-sm border border-forest-100' : 'text-neutral-500 hover:text-neutral-700'}`}
             >
               <Globe size={16}/> All India
             </button>
           </div>
        </div>

        <div className="px-4 mt-4 space-y-4">
          {/* Create Post Button / Box */}
          <AnimatePresence mode="popLayout">
            {!composeBox ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setComposeBox(true)}
                className="w-full bg-white border border-neutral-200 p-4 rounded-xl shadow-sm flex items-center gap-3 text-left hover:shadow-card transition-shadow"
              >
                <div className="bg-neutral-100 p-2 rounded-full text-neutral-500"><PenTool size={20}/></div>
                <div className="flex-1">
                  <p className="font-bold text-soil-800 font-display">Ask the Community</p>
                  <p className="text-xs text-soil-500">Post a photo, ask for advice, or sell produce.</p>
                </div>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-forest-300 rounded-xl shadow-card overflow-hidden"
              >
                 <textarea
                   value={newPostContent}
                   onChange={e => setNewPostContent(e.target.value)}
                   autoFocus
                   placeholder="Type your question or advice here..."
                   className="w-full min-h-[100px] p-4 text-sm outline-none resize-none bg-forest-50/30 text-soil-800 font-medium"
                 />
                 <div className="bg-forest-50 p-2 border-t border-forest-100 flex justify-between items-center">
                    <div className="flex gap-2">
                       <button className="p-2 text-forest-600 hover:bg-white rounded-full transition-colors"><Mic size={18}/></button>
                       <button className="p-2 text-forest-600 hover:bg-white rounded-full transition-colors"><Camera size={18}/></button>
                       <button className="p-2 text-forest-600 hover:bg-white rounded-full transition-colors"><ImageIcon size={18}/></button>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setComposeBox(false)} className="text-xs font-bold text-neural-500 px-3 py-2">Cancel</button>
                       <button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="bg-forest-600 text-white font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 disabled:opacity-50">Post <Send size={14}/></button>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts Feed */}
          {displayPosts.map((p) => (
            <Card key={p.id} className="cursor-pointer border border-neutral-200/60 shadow-sm active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl bg-neutral-100 rounded-full w-10 h-10 flex items-center justify-center border border-neutral-200">{p.avatar}</span>
                  <div>
                    <p className="font-bold text-sm text-soil-800">{p.author}</p>
                    <p className="text-[10px] text-soil-500">{p.time} • {p.isLocal ? 'Pimpalgaon, MH' : 'Gujarat'}</p>
                  </div>
                </div>
                {p.category === 'Alert' ? (
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">{p.category}</span>
                ) : p.category === 'Success Story' ? (
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">{p.category}</span>
                ) : p.category === 'Advice Needed' ? (
                   <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded uppercase">{p.category}</span>
                ) : (
                   <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">{p.category}</span>
                )}
              </div>
              
              <div className="mt-3">
                <h3 className="font-display font-bold text-lg text-soil-900 leading-snug">{p.title}</h3>
                {p.content && <p className="text-sm text-soil-700 mt-1 line-clamp-3 leading-relaxed">{p.content}</p>}
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 mt-4 pt-3">
                <button
                  onClick={(e) => { e.stopPropagation(); toast.success('You gave a Leaf to this post!') }}
                  className="flex items-center gap-1.5 text-xs font-bold text-forest-600 hover:bg-forest-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Leaf size={16} /> <span>{p.upvotes} Leaves</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs font-bold text-soil-500 hover:bg-neutral-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
                  <MessageSquareText size={16} /> <span>{p.replies} Comments</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
