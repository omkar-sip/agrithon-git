import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const POSTS = [
  { author: 'Vijay Patil',    time: '1 hour ago', title: 'Tomato price crash — should I cold-store?', upvotes: 24, replies: 8, color: 'orange' as const },
  { author: 'Sunita Devi',    time: '3 hours ago', title: 'My wheat is showing stem rust — any remedy?', upvotes: 12, replies: 5, color: 'red' as const },
  { author: 'Raju Sharma',    time: '1 day ago', title: 'Got ₹2 lakh from PM-KISAN — here is how', upvotes: 67, replies: 23, color: 'green' as const },
  { author: 'Lakshmi Rao', time: '2 days ago', title: 'Best drip irrigation setup under ₹15,000?', upvotes: 31, replies: 14, color: 'blue' as const },
]

export default function Forum() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto w-full space-y-5">
        <h1 className="font-display font-bold text-2xl text-forest-800">💬 Farmer Forum</h1>
        <p className="text-soil-500 text-sm -mt-3">Questions, advice, and tips from farmers like you</p>

        <button className="btn-primary">✍️ Post a Question</button>

        <div className="space-y-3">
          {POSTS.map((p, i) => (
            <Card key={i} color={p.color} className="cursor-pointer active:scale-[0.99] transition-transform">
              <p className="font-display font-bold text-base text-soil-800 mb-1">{p.title}</p>
              <div className="flex items-center gap-3 text-xs text-soil-500">
                <span>👤 {p.author}</span>
                <span>🕐 {p.time}</span>
                <span>👍 {p.upvotes}</span>
                <span>💬 {p.replies} replies</span>
              </div>
            </Card>
          ))}
        </div>

        <Card color="blue">
          <p className="font-bold text-sky-800 text-sm">🔮 Forum powered by Firebase Firestore — Real community posts will appear here after backend connection.</p>
        </Card>
      </div>
    </div>
  )
}
