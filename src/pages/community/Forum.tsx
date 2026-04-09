import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  ChevronRight,
  CloudSun,
  HeartHandshake,
  Leaf,
  MessageSquareText,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Tractor,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../../components/layout/PageTransition'
import Card from '../../components/ui/Card'
import { GOVERNMENT_FARMER_PORTAL_URL, isExternalUrl, openExternalUrl } from '../../utils/externalLinks'

type CommunityPost = {
  id: string
  author: string
  location: string
  crop: string
  message: string
  tags: string[]
  timeAgo: string
  replies: number
}

type QuickResource = {
  id: string
  title: string
  description: string
  route: string
  icon: typeof Leaf
  accent: string
}

type VideoResource = {
  id: string
  title: string
  channel: string
  duration: string
  summary: string
  youtubeId: string
  focus: string
  tags: string[]
}

type VideoCategory = {
  id: string
  label: string
  description: string
  videos: VideoResource[]
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Mahesh Patil',
    location: 'Nashik, Maharashtra',
    crop: 'Onion',
    message:
      'Morning humidity stayed high for three days, so I shifted irrigation to late afternoon and disease pressure reduced. Sharing in case it helps nearby onion growers.',
    tags: ['Humidity', 'Irrigation', 'Onion'],
    timeAgo: '12 min ago',
    replies: 8,
  },
  {
    id: 'post-2',
    author: 'Ritu Chaudhary',
    location: 'Karnal, Haryana',
    crop: 'Wheat',
    message:
      'Used split fertilizer dosing this week after light showers. Crop is responding better than a single heavy dose. Anyone else trying this in wheat right now?',
    tags: ['Wheat', 'Fertilizer', 'Field update'],
    timeAgo: '34 min ago',
    replies: 5,
  },
  {
    id: 'post-3',
    author: 'Imran Sheikh',
    location: 'Sehore, Madhya Pradesh',
    crop: 'Soybean',
    message:
      'Please check lower leaf yellowing early. My field looked fine from a distance, but patch scouting helped me catch the issue before it spread.',
    tags: ['Soybean', 'Scouting', 'Pest watch'],
    timeAgo: '1 hr ago',
    replies: 11,
  },
]

const QUICK_RESOURCES: QuickResource[] = [
  {
    id: 'resource-advisory',
    title: 'Fasal Salah',
    description: 'Match crop choices with season, soil, and local weather.',
    route: '/crop-advisory',
    icon: Sparkles,
    accent: 'bg-brand-50 text-brand-700 border-brand-100',
  },
  {
    id: 'resource-scanner',
    title: 'Leaf Scanner',
    description: 'Check leaf issues and download an easy-to-read report.',
    route: '/scanner',
    icon: Leaf,
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    id: 'resource-weather',
    title: 'Weather Alerts',
    description: 'Plan irrigation and spraying around upcoming conditions.',
    route: '/crop/weather',
    icon: CloudSun,
    accent: 'bg-sky-50 text-sky-700 border-sky-100',
  },
  {
    id: 'resource-schemes',
    title: 'Sarkari Yojana',
    description: 'Find scheme support and government assistance quickly.',
    route: GOVERNMENT_FARMER_PORTAL_URL,
    icon: ShieldCheck,
    accent: 'bg-amber-50 text-amber-700 border-amber-100',
  },
]

const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'smart-farming',
    label: 'Smart Farming',
    description: 'Practical farm decisions, planning habits, and modern production thinking.',
    videos: [
      {
        id: 'smart-1',
        title: '10 Modern Agriculture Farming Technologies',
        channel: 'Innovative Techs',
        duration: '10 min',
        summary: 'A quick overview of practical modern farming methods farmers can evaluate for productivity and labor efficiency.',
        youtubeId: 'JeU_EYFH1Jk',
        focus: 'Planning upgrades and identifying efficient techniques.',
        tags: ['Technology', 'Planning', 'Productivity'],
      },
      {
        id: 'smart-2',
        title: 'Top Modern Agriculture Machinery',
        channel: 'Farming Machines',
        duration: '9 min',
        summary: 'Useful for understanding which machinery trends are becoming relevant in day-to-day field operations.',
        youtubeId: 'J-QYmOnIf7U',
        focus: 'Mechanization choices and field efficiency.',
        tags: ['Machinery', 'Operations', 'Mechanization'],
      },
    ],
  },
  {
    id: 'soil-health',
    label: 'Soil Health',
    description: 'Build stronger soil decisions through organic matter, structure, and nutrient balance.',
    videos: [
      {
        id: 'soil-1',
        title: 'Soil Health Principles for Better Farming',
        channel: 'NRCS Conservation',
        duration: '7 min',
        summary: 'Covers the foundations of keeping soil active, covered, and biologically healthy for stronger crop performance.',
        youtubeId: 'GqaIJk_VcsI',
        focus: 'Understanding the basics behind resilient soil.',
        tags: ['Soil', 'Moisture', 'Nutrients'],
      },
      {
        id: 'soil-2',
        title: 'How Soil Works for Crop Growth',
        channel: 'Ag Learning',
        duration: '8 min',
        summary: 'A simple explanation of how soil structure and microbial activity influence yield and crop stability.',
        youtubeId: '5ObT8CFLl6E',
        focus: 'Connecting soil health to daily crop outcomes.',
        tags: ['Soil health', 'Structure', 'Learning'],
      },
    ],
  },
  {
    id: 'bio-inputs',
    label: 'Bio Inputs',
    description: 'Low-cost, sustainable input ideas and regenerative practices farmers can try carefully.',
    videos: [
      {
        id: 'bio-1',
        title: 'Regenerative Agriculture Practices Explained',
        channel: 'Sustainable Agriculture',
        duration: '11 min',
        summary: 'A strong starting point for farmers exploring natural input reduction and better long-term soil care.',
        youtubeId: 'Z1YlA1TEkb0',
        focus: 'Reducing dependency on harsh input patterns over time.',
        tags: ['Regenerative', 'Bio inputs', 'Sustainability'],
      },
      {
        id: 'bio-2',
        title: 'Natural Farming and Input Efficiency',
        channel: 'Farm Learning Hub',
        duration: '6 min',
        summary: 'Helpful for understanding phased adoption of natural farming practices without changing everything at once.',
        youtubeId: 'AXW6fY2rjTc',
        focus: 'Step-by-step experimentation with lower-cost methods.',
        tags: ['Natural farming', 'Budget', 'Transition'],
      },
    ],
  },
  {
    id: 'farmer-stories',
    label: 'Farmer Stories',
    description: 'Real-world motivation and examples of farmer-led change on the ground.',
    videos: [
      {
        id: 'story-1',
        title: 'Farmer Success Story and Field Learning',
        channel: 'Rural Stories',
        duration: '9 min',
        summary: 'A practical farmer-led example that helps learners connect advice with field reality and local problem solving.',
        youtubeId: 'JVRKTOUtmVA',
        focus: 'Seeing how farmers adapt and improve over time.',
        tags: ['Success story', 'Local learning', 'Community'],
      },
    ],
  },
]

const stats = [
  { label: 'Active discussions', value: '124', note: 'Farmer updates shared this week' },
  { label: 'Ready resources', value: '4', note: 'Useful tools linked from the app' },
  { label: 'Video lessons', value: '7', note: 'Curated learning across key categories' },
]

export default function Forum() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [draft, setDraft] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(VIDEO_CATEGORIES[0].id)
  const [selectedVideoId, setSelectedVideoId] = useState(VIDEO_CATEGORIES[0].videos[0].id)

  const activeCategory = useMemo(
    () => VIDEO_CATEGORIES.find((category) => category.id === selectedCategoryId) ?? VIDEO_CATEGORIES[0],
    [selectedCategoryId]
  )

  const selectedVideo = useMemo(
    () => activeCategory.videos.find((video) => video.id === selectedVideoId) ?? activeCategory.videos[0],
    [activeCategory, selectedVideoId]
  )

  const handlePostShare = () => {
    const message = draft.trim()
    if (!message) return

    setPosts((currentPosts) => [
      {
        id: `post-${Date.now()}`,
        author: 'You',
        location: 'Your area',
        crop: 'General farming',
        message,
        tags: ['Community note'],
        timeAgo: 'Just now',
        replies: 0,
      },
      ...currentPosts,
    ])
    setDraft('')
  }

  const handleCategoryChange = (categoryId: string) => {
    const nextCategory = VIDEO_CATEGORIES.find((category) => category.id === categoryId)
    if (!nextCategory) return

    setSelectedCategoryId(categoryId)
    setSelectedVideoId(nextCategory.videos[0].id)
  }

  return (
    <PageTransition>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-5 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-700">
                <HeartHandshake size={14} />
                Kisan Kaksha
              </div>
              <h1
                className="mt-3 text-3xl font-black text-neutral-900 sm:text-4xl"
                style={{ fontFamily: 'Baloo 2, sans-serif' }}
              >
                Community, guidance, and video learning in one place
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-[15px]">
                Kisan Kaksha is your farmer room for quick peer learning, app resources, and structured video support.
                Share field updates, open the right tool fast, and learn from curated farming videos without leaving the page.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px] lg:max-w-md">
              {stats.map((item) => (
                <Card
                  key={item.label}
                  className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-card"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-neutral-900">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">{item.note}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
          <section className="space-y-4">
            <Card className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-300">Farmer community</p>
                  <h2 className="mt-1 text-2xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                    Ask, share, and learn with nearby farmers
                  </h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    Share a short field update, practical tip, or question so others can learn faster.
                  </p>
                </div>
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                  <MessageSquareText size={20} />
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-brand-100 bg-brand-50/60 p-4">
                <label htmlFor="kisan-kaksha-message" className="text-sm font-semibold text-neutral-800">
                  Share with the community
                </label>
                <textarea
                  id="kisan-kaksha-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Example: Leaf spot increased after three cloudy days. I shifted irrigation timing and saw improvement."
                  className="mt-3 min-h-[120px] w-full rounded-[22px] border border-brand-100 bg-white px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-neutral-500">
                    Keep posts practical and field-based so other farmers can act on them quickly.
                  </p>
                  <button
                    type="button"
                    onClick={handlePostShare}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700 active:scale-[0.98]"
                  >
                    Share update
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.03 }}
                >
                  <Card className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-card transition-all hover:shadow-card-md">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700">
                        {post.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-neutral-900">{post.author}</p>
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                            {post.crop}
                          </span>
                          <span className="text-xs text-neutral-400">{post.location}</span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-neutral-700">{post.message}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={`${post.id}-${tag}`}
                              className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                          <span>{post.timeAgo}</span>
                          <span>{post.replies} replies</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <Card className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-300">Useful resources</p>
                  <h2 className="mt-1 text-2xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                    Open the right tool faster
                  </h2>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <BookOpen size={20} />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {QUICK_RESOURCES.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() => (isExternalUrl(resource.route) ? openExternalUrl(resource.route) : navigate(resource.route))}
                      className={`w-full rounded-[24px] border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card ${resource.accent}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-white/90 p-3">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-neutral-900">{resource.title}</p>
                            <ChevronRight size={16} className="text-neutral-400" />
                          </div>
                          <p className="mt-1 text-xs leading-5 text-neutral-600">{resource.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-brand-100 bg-brand-50/60 p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-brand-700 shadow-sm">
                  <Tractor size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                    How to use Kisan Kaksha
                  </h3>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-neutral-600">
                    <p>1. Share a short on-field update so the community gets practical context.</p>
                    <p>2. Open a matching tool when you need action, such as scanner, weather, or crop advice.</p>
                    <p>3. Watch one focused video at a time and apply only what fits your farm conditions.</p>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>

        <section className="space-y-4 rounded-[30px] border border-neutral-200 bg-white p-5 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-300">Video resources</p>
              <h2 className="mt-1 text-2xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Learn from curated farming videos inside Kisan Kaksha
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-neutral-500">
                Browse categories like an e-commerce discovery bar, then open the selected YouTube lesson without leaving the app.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
              <PlayCircle size={14} />
              Embedded learning mode
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {VIDEO_CATEGORIES.map((category) => {
              const isActive = category.id === activeCategory.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={`min-w-[220px] rounded-[24px] border px-4 py-3 text-left transition-all ${
                    isActive
                      ? 'border-brand-200 bg-brand-50 text-brand-700 shadow-card'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-brand-100 hover:bg-brand-50/40'
                  }`}
                >
                  <p className="text-sm font-bold">{category.label}</p>
                  <p className={`mt-1 text-xs leading-5 ${isActive ? 'text-brand-700/80' : 'text-neutral-500'}`}>
                    {category.description}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_340px]">
            <Card className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-4 shadow-card">
              <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-black shadow-sm">
                <div className="aspect-video">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-white bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                    {activeCategory.label}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">
                    {selectedVideo.duration}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {selectedVideo.channel}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-black text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                  {selectedVideo.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{selectedVideo.summary}</p>
                <div className="mt-4 rounded-[22px] border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Why this matters</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{selectedVideo.focus}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag) => (
                    <span
                      key={`${selectedVideo.id}-${tag}`}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {activeCategory.videos.map((video) => {
                const isSelected = video.id === selectedVideo.id
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setSelectedVideoId(video.id)}
                    className={`w-full rounded-[24px] border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-brand-200 bg-brand-50 shadow-card'
                        : 'border-neutral-200 bg-white shadow-sm hover:border-brand-100 hover:bg-brand-50/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-24 w-32 overflow-hidden rounded-[18px] bg-neutral-100">
                        <img
                          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/20">
                          <div className="rounded-full bg-white/92 p-2 text-brand-700 shadow-sm">
                            <PlayCircle size={18} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="line-clamp-2 text-sm font-bold text-neutral-900">{video.title}</p>
                          <ChevronRight size={16} className="shrink-0 text-neutral-300" />
                        </div>
                        <p className="mt-1 text-xs font-semibold text-neutral-500">{video.channel}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">{video.summary}</p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-neutral-400">
                          <span>{video.duration}</span>
                          <span className="h-1 w-1 rounded-full bg-neutral-300" />
                          <span>{video.focus}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
