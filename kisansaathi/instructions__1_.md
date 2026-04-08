# 🌾 KisanSaathi — Complete PWA Scaffold Instructions
### One App. Every Farmer. Every Problem.

---

## 🧭 Project Overview

**App Name:** KisanSaathi ("Farmer's Companion")  
**Stack:** React 18 + TypeScript + Vite + Zustand + TailwindCSS + PWA (Vite PWA Plugin)  
**Target Users:** Indian smallholder farmers across 4 primary farming categories  
**Design Philosophy:** *Soil-rooted Digital* — warm earthy tones, icon-first UI, minimum reading, maximum action. Every screen must work for a semi-literate farmer using a budget Android phone in bright sunlight.

---

## 🏗️ Project Scaffold & File Structure

```
kisansaathi/
├── public/
│   ├── icons/                        # PWA icons (72, 96, 128, 144, 152, 192, 384, 512px)
│   ├── manifest.webmanifest
│   └── offline.html
├── src/
│   ├── assets/
│   │   ├── illustrations/            # SVG illustrations per category
│   │   ├── flags/                    # Language flag icons
│   │   └── onboarding/              # Splash screen assets
│   ├── components/
│   │   ├── ui/                       # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   └── VoiceInputButton.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── PageTransition.tsx
│   │   └── shared/
│   │       ├── WeatherWidget.tsx
│   │       ├── MarketPriceCard.tsx
│   │       ├── AlertBanner.tsx
│   │       ├── CategoryBadge.tsx
│   │       └── LanguagePill.tsx
│   ├── pages/
│   │   ├── splash/
│   │   │   ├── SplashScreen.tsx      # Animated logo splash
│   │   │   ├── LanguageSelect.tsx    # Step 1 of onboarding
│   │   │   └── CategorySelect.tsx    # Step 2 of onboarding
│   │   ├── auth/
│   │   │   ├── Login.tsx             # OTP-based login (phone number)
│   │   │   └── Profile.tsx           # Farmer profile setup
│   │   ├── home/
│   │   │   └── Home.tsx              # Dynamic home based on category
│   │   ├── crop/                     # Category 1: Traditional Crop Farming
│   │   │   ├── CropHome.tsx          # Today's Plan engine (primary screen)
│   │   │   ├── CropAdvisory.tsx      # AI Crop Doctor + Advisory + Prediction
│   │   │   ├── WeatherAlerts.tsx     # Weather → Farm Actions
│   │   │   ├── MarketPrices.tsx      # Live Market Intelligence
│   │   │   ├── SupplyChain.tsx       # Fasal Tracking
│   │   │   ├── SoilHealth.tsx        # Mitti Ki Sehat
│   │   │   ├── SchemesBenefits.tsx   # Sarkari Sahayata
│   │   │   ├── CommunityIntel.tsx    # Kisan Samudaya (NEW)
│   │   │   └── HyperlocalAlerts.tsx  # Mera Gaon, Mera Alert (NEW)
│   │   ├── livestock/               # Category 2: Livestock Rearing
│   │   │   ├── LivestockHome.tsx
│   │   │   ├── AnimalHealthLog.tsx
│   │   │   ├── VetConnect.tsx
│   │   │   ├── FeedCalculator.tsx
│   │   │   ├── MilkYieldTracker.tsx
│   │   │   ├── InsuranceClaims.tsx
│   │   │   └── MandiBhav.tsx        # Livestock market prices
│   │   ├── poultry/                 # Category 3: Poultry Farming
│   │   │   ├── PoultryHome.tsx
│   │   │   ├── FlockHealthDiary.tsx
│   │   │   ├── VaccinationSchedule.tsx
│   │   │   ├── EggProductionLog.tsx
│   │   │   ├── FeedInventory.tsx
│   │   │   ├── BuyerConnect.tsx
│   │   │   └── DiseaseAlerts.tsx
│   │   ├── fishery/                 # Category 4: Fishery & Aquaculture
│   │   │   ├── FisheryHome.tsx
│   │   │   ├── PondMonitor.tsx
│   │   │   ├── WaterQualityLog.tsx
│   │   │   ├── FishingWeather.tsx
│   │   │   ├── HarvestPlanner.tsx
│   │   │   ├── MarineAlerts.tsx
│   │   │   └── AquacultureSchemes.tsx
│   │   ├── community/
│   │   │   ├── Forum.tsx
│   │   │   └── ExpertConnect.tsx
│   │   └── settings/
│   │       └── Settings.tsx
│   ├── store/                        # Zustand stores
│   │   ├── useAppStore.ts            # Global app state
│   │   ├── useAuthStore.ts           # Auth + farmer profile
│   │   ├── useLanguageStore.ts       # i18n active language
│   │   ├── useCategoryStore.ts       # Active farming category
│   │   ├── useWeatherStore.ts        # Cached weather data
│   │   ├── useMarketStore.ts         # Market price cache
│   │   ├── useAlertStore.ts          # Push alerts queue
│   │   └── useTodaysPlanStore.ts     # Today's Plan decisions (crop)
│   ├── hooks/
│   │   ├── useGeolocation.ts
│   │   ├── useVoiceInput.ts          # Web Speech API wrapper
│   │   ├── useOfflineSync.ts
│   │   ├── useWeather.ts
│   │   └── useTranslation.ts
│   ├── i18n/
│   │   ├── index.ts                  # i18n setup (i18next)
│   │   └── locales/
│   │       ├── en.json
│   │       ├── hi.json
│   │       ├── kn.json
│   │       ├── bn.json
│   │       ├── ta.json
│   │       └── pa.json
│   ├── services/
│   │   ├── api.ts                    # Axios base client
│   │   ├── weatherService.ts         # OpenWeatherMap / IMD API
│   │   ├── marketService.ts          # Agmarknet / eNAM API
│   │   ├── smsService.ts             # SMS fallback (MSG91)
│   │   └── notificationService.ts    # FCM push notifications
│   ├── utils/
│   │   ├── dateHelper.ts
│   │   ├── unitConverter.ts          # kg↔quintal, L↔mL etc.
│   │   ├── cropCalendar.ts           # Sowing/harvest date logic
│   │   └── offline.ts               # IndexedDB helpers (idb-keyval)
│   ├── types/
│   │   ├── farmer.ts
│   │   ├── crop.ts
│   │   ├── livestock.ts
│   │   ├── poultry.ts
│   │   ├── fishery.ts
│   │   └── market.ts
│   ├── router/
│   │   └── index.tsx                 # React Router v6 setup
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "zustand": "^4.5.2",
    "i18next": "^23.11.0",
    "react-i18next": "^14.1.2",
    "axios": "^1.7.2",
    "idb-keyval": "^6.2.1",
    "framer-motion": "^11.2.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.383.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vite-plugin-pwa": "^0.20.0",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.3",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0"
  }
}
```

---

## 🔧 Vite Config (with PWA)

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'illustrations/*.svg'],
      manifest: {
        name: 'KisanSaathi',
        short_name: 'KisanSaathi',
        description: 'One app for every Indian farmer',
        theme_color: '#2D6A2D',
        background_color: '#FFFBF2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openweathermap\.org\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'weather-cache', expiration: { maxAgeSeconds: 3600 } }
          },
          {
            urlPattern: /^https:\/\/agmarknet\.gov\.in\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'market-cache', expiration: { maxAgeSeconds: 7200 } }
          }
        ]
      }
    })
  ]
})
```

---

## 🎨 Design System

### Color Palette (Tailwind Config)

```ts
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Forest Green (growth, nature)
        forest: { 50: '#f0f7f0', 100: '#d9edd9', 200: '#b3dbb3', 300: '#7dc07d', 400: '#4ea04e', 500: '#2D6A2D', 600: '#245724', 700: '#1c451c', 800: '#143214', 900: '#0c200c' },
        // Accent — Harvest Gold (warmth, abundance)
        harvest: { 50: '#fffbf0', 100: '#fff3d0', 200: '#ffe599', 300: '#ffd255', 400: '#ffc107', 500: '#e6a800', 600: '#cc9000', 700: '#a37200', 800: '#7a5500', 900: '#523800' },
        // Soil — Earthy Brown (trust, roots)
        soil: { 50: '#fdf8f3', 100: '#f5e8d5', 200: '#e8ccaa', 300: '#d4a870', 400: '#c08040', 500: '#8B4513', 600: '#7a3d11', 700: '#63310e', 800: '#4c240a', 900: '#341807' },
        // Sky — Calm Blue (water, weather)
        sky: { 50: '#f0f7ff', 100: '#d9ecff', 200: '#b3d9ff', 300: '#7dbeff', 400: '#4da3ff', 500: '#1a7fd4', 600: '#1566ab', 700: '#104d82', 800: '#0a3459', 900: '#051b30' },
        // Alert — Mango Orange (urgency, alerts)
        alert: { 400: '#ff8c00', 500: '#e67600', 600: '#cc6600' },
        // Background
        cream: '#FFFBF2',
        parchment: '#F5EDD8',
      },
      fontFamily: {
        // Display: Baloo 2 (Indian warmth, great multilingual)
        display: ['Baloo 2', 'sans-serif'],
        // Body: Noto Sans (supports all 6 languages perfectly)
        body: ['Noto Sans', 'sans-serif'],
        // Numbers/data: DM Mono
        mono: ['DM Mono', 'monospace'],
      },
      fontSize: {
        // Larger base sizes for readability in bright sunlight
        'xs': ['13px', '18px'],
        'sm': ['15px', '22px'],
        'base': ['17px', '26px'],
        'lg': ['20px', '30px'],
        'xl': ['24px', '34px'],
        '2xl': ['30px', '40px'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      }
    }
  }
}
```

### Typography Rules
- **All body text:** minimum 17px — farmer must read under direct sunlight
- **CTAs/Buttons:** minimum 18px bold — fat thumb friendly (min 48px tap height)
- **Icons always accompany text** — never text-only labels
- **Display font (Baloo 2):** headers, category names, welcome messages
- **Body font (Noto Sans):** everything else — supports Devanagari, Kannada, Bengali, Tamil, Gurmukhi natively

---

## 🌐 Internationalization Setup

```ts
// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import hi from './locales/hi.json'
import kn from './locales/kn.json'
import bn from './locales/bn.json'
import ta from './locales/ta.json'
import pa from './locales/pa.json'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi }, kn: { translation: kn }, bn: { translation: bn }, ta: { translation: ta }, pa: { translation: pa } },
  lng: 'hi', // default Hindi
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
```

**Language codes and scripts:**
| Language | Code | Script | Google Font Subset |
|----------|------|--------|-------------------|
| English | `en` | Latin | latin |
| Hindi | `hi` | Devanagari | devanagari |
| Kannada | `kn` | Kannada | kannada |
| Bengali | `bn` | Bengali | bengali |
| Tamil | `ta` | Tamil | tamil |
| Punjabi | `pa` | Gurmukhi | gurmukhi |

Load all Noto Sans subsets via Google Fonts in `index.html`.

---

## 🗃️ Zustand Store Specifications

### `useAuthStore.ts`
```ts
interface AuthState {
  isAuthenticated: boolean
  phone: string | null
  farmer: FarmerProfile | null
  setFarmer: (farmer: FarmerProfile) => void
  logout: () => void
}
// Persist to localStorage
```

### `useLanguageStore.ts`
```ts
interface LanguageState {
  language: 'en' | 'hi' | 'kn' | 'bn' | 'ta' | 'pa'
  setLanguage: (lang: string) => void
}
// Persist to localStorage
```

### `useCategoryStore.ts`
```ts
type FarmingCategory = 'crop' | 'livestock' | 'poultry' | 'fishery'
interface CategoryState {
  category: FarmingCategory | null
  setCategory: (cat: FarmingCategory) => void
  subCategories: string[]          // e.g., ['wheat', 'rice'] for crop
  setSubCategories: (subs: string[]) => void
}
// Persist to localStorage
```

### `useWeatherStore.ts`
```ts
interface WeatherState {
  current: WeatherData | null
  forecast: ForecastDay[]
  alerts: WeatherAlert[]
  lastFetched: number | null
  setWeather: (data: WeatherData) => void
  isStale: () => boolean            // > 1 hour old
}
```

### `useMarketStore.ts`
```ts
interface MarketState {
  prices: MarketPrice[]             // commodity, mandi, price, trend
  lastFetched: number | null
  selectedMandi: string | null
  setMandi: (mandi: string) => void
  setPrices: (prices: MarketPrice[]) => void
}
```

### `useAlertStore.ts`
```ts
interface AlertState {
  alerts: AppAlert[]               // weather, disease, price spike, govt scheme
  unreadCount: number
  markRead: (id: string) => void
  addAlert: (alert: AppAlert) => void
}
```

---

## 📱 Screen-by-Screen Specifications

---

### SCREEN 1 — Splash Screen (`SplashScreen.tsx`)

**Purpose:** First impression — 2.5 seconds animated logo  
**Implementation:**
- Full screen `bg-forest-500` with animated wheat/leaf SVG illustration
- App name "KisanSaathi" in Baloo 2, white, center-aligned
- Tagline in current device language (auto-detected via `navigator.language`)
- Framer Motion: fade in logo → stagger text → auto-navigate to LanguageSelect
- Show offline indicator if no network detected

---

### SCREEN 2 — Language Selection (`LanguageSelect.tsx`)

**Purpose:** User picks their preferred language ONCE  
**UI Pattern:** Large card grid (2 columns) — each card has:
- Language name in THAT language (e.g., "हिंदी", "ಕನ್ನಡ", "বাংলা")
- Language name in English below in small text
- Flag/icon representing the region
- Radio-style selection with green checkmark when selected

**Languages to show:**
```
🇮🇳 English     🇮🇳 हिंदी (Hindi)
🇮🇳 ಕನ್ನಡ (Kannada)  🇮🇳 বাংলা (Bengali)
🇮🇳 தமிழ் (Tamil)   🇮🇳 ਪੰਜਾਬੀ (Punjabi)
```

**CTA:** Large green "आगे बढ़ें / Continue" button at bottom (bilingual)  
**Behavior:** On selection, immediately switch i18n language. Persist to `useLanguageStore`.

---

### SCREEN 3 — Category Selection (`CategorySelect.tsx`)

**Purpose:** Farmer identifies their primary farming type  
**UI Pattern:** Full-screen illustrated category cards — vertical scroll or 2×2 grid

**4 Categories with visual identity:**

| # | Category | Icon Theme | Illustration Color | Key Emoji |
|---|----------|------------|-------------------|-----------|
| 1 | Traditional Crop Farming | Wheat stalks, tractor | Forest Green | 🌾 |
| 2 | Livestock Rearing | Cow, goat silhouette | Harvest Gold | 🐄 |
| 3 | Poultry Farming | Hen, eggs | Warm Orange | 🐓 |
| 4 | Fishery & Aquaculture | Fish, pond waves | Sky Blue | 🐟 |

Each card:
- Full-width with rounded corners
- SVG illustration (right side) + Category name (left, large font)
- 3-word description in farmer's language
- Tap to select → green ring border animation
- Multi-select NOT allowed

**CTA:** "मेरी श्रेणी यही है / This is my category" big button  
**Behavior:** Save to `useCategoryStore`. Navigate to Login.

---

### SCREEN 4 — Login (`Login.tsx`)

**Purpose:** Minimal auth via mobile OTP  
**Fields:**
- Phone number input (numeric keypad auto-opens)
- State dropdown (pre-filled from geolocation)
- "Send OTP" → 4/6 digit OTP input screen

**Design:** 
- Clean white card on cream background
- Aadhaar/KCC card optional link for subsidy tracking
- "Skip for now" ghost button (guest mode with limited features)

---

### SCREEN 5 — Farmer Profile Setup (`Profile.tsx`)

**Purpose:** Collect farm basics for personalization  
**Fields (all optional except name):**
- Name (voice input supported via mic icon)
- Village / District / State (auto-detect + manual)
- Land holding size (dropdown: <1 acre, 1-5, 5-10, 10+)
- Specific crops/animals (tag chips — multi-select)
- Water source (rain-fed / irrigated / pond)

**Design:** 
- Step indicator (3 steps max)
- Progress bar at top
- Each step = one screen, not a long form
- Skip option on every step

---

### SCREEN 6 — Home (`Home.tsx`)

**Purpose:** Dynamic command center based on selected category  
**Layout:** 
```
[ TopBar: Greeting + Weather pill + Alert bell ]
[ Hero: Today's #1 Priority Card (AI-driven) ]
[ Quick Actions: 4 icon buttons ]
[ Market Pulse: Scrollable price strip ]
[ Recent Alerts ]
[ Community Tip of the Day ]
[ Bottom Nav ]
```

**TopBar:** "नमस्ते, रमेश जी 🌤️ 28°C | 2 alerts 🔔"  
**Hero Card rotates daily:** Advisory / Weather Warning / Market Opportunity / Scheme Deadline  
**Quick Actions vary by category** (see category specs below)

---

## 🌾 CATEGORY 1 — Traditional Crop Farming

### Problem Statement
Smallholder crop farmers lose 40%+ income to fragmented data — weather from one app, mandi prices from another, advisories from a third. None of it converts to action. They sell at the wrong price, spray in the wrong weather, miss disease early signs. KisanSaathi solves this as a **decision engine**, not another data dashboard — every signal is converted into a clear farmer action.

### File Structure

```
src/pages/crop/
├── CropHome.tsx          ← Today's Plan engine (PRIMARY screen)
├── CropAdvisory.tsx      ← AI Crop Doctor + Personalized Advisory + AI Crop Prediction
├── WeatherAlerts.tsx     ← Weather → Actions (hyperlocal, action-translated)
├── MarketPrices.tsx      ← Live Market Intelligence (trend + sell-time)
├── SupplyChain.tsx       ← Fasal Tracking
├── SoilHealth.tsx        ← Mitti Ki Sehat
├── SchemesBenefits.tsx   ← Sarkari Sahayata
├── CommunityIntel.tsx    ← Kisan Samudaya (community pest/disease reports)
└── HyperlocalAlerts.tsx  ← Mera Gaon, Mera Alert (village-level alerts)
```

### Zustand Store

Add `useTodaysPlanStore.ts`:

```ts
interface TodaysPlanDecision {
  icon: string
  action: string       // e.g. "Don't Irrigate"
  reason: string       // e.g. "Rain expected in 2 hrs"
  priority: 'high' | 'medium' | 'low'
  source: 'weather' | 'market' | 'advisory' | 'community'
}

interface TodaysPlanState {
  decisions: TodaysPlanDecision[]
  generatedAt: number | null
  cropContext: string | null
  setplan: (plan: TodaysPlanDecision[], crop: string) => void
  isStale: () => boolean   // > 6 hours old
}
```

### Features & Pages

#### `CropHome.tsx` — Aaj Ka Kaam (Today's Plan) 🆕
The primary home screen for crop farmers. Every morning, 3 clear decisions — no data dump, no scrolling through charts.
- AI-generated daily plan pulling from weather + mandi trends + crop stage + community reports
- Card format per decision: `[Icon] [Action headline] [1-line reason]`
  - *"🚫 Don't Irrigate — Rain expected in your area in 2 hrs"*
  - *"🌿 Spray Pesticide — Humidity at 87%, fungal risk high"*
  - *"⏳ Wait 1 Day to Sell — Tomato price rising at Nashik mandi"*
- Priority badge: RED (urgent) / YELLOW (today) / GREEN (this week)
- Offline-safe: cached plan from last sync shown with "Last updated" timestamp
- Tap any decision card → expands with full reasoning + action steps
- Refresh button to regenerate plan when online

#### `CropAdvisory.tsx` — AI Crop Doctor + Personalized Advisory 🔁
Merges crop doctor, personalized advisory, and AI crop prediction into one screen.
- Farmer selects crop (wheat, rice, cotton, mustard, pulses, etc.)
- Shows: sowing calendar, current growth stage, **what to do THIS week**
- **Personalized to soil + location + season** — not generic national advisory
- Camera input: photo → disease identified in seconds + treatment + urgency level
- Voice query: *"मेरी फसल पर पीले धब्बे हैं"* → diagnosis + remedy in farmer's language
- **AI Crop Prediction:** recommends best crops to grow based on soil data + weather + season
- Offline cache: last 7 days advisory always available

#### `WeatherAlerts.tsx` — Weather → Farm Actions 🔁
Every forecast translates directly into a farm action — not just a weather report.
- 7-day **village-level** hyperlocal forecast (OpenWeatherMap + IMD API) — not city-level
- **Action translation per forecast:**
  - *"Kal baarish — spray mat karein"*
  - *"High humidity — fungal risk, inspect crop now"*
  - *"Frost alert — cover nursery tonight"*
- Large icons ☀️🌧️⛈️❄️ — readable in bright sunlight
- Color-coded: GREEN (safe to work) / YELLOW (caution) / RED (danger, stop work)
- Push notification for RED alerts even when app is closed

#### `MarketPrices.tsx` — Live Market Intelligence 🔁
Not just price — when to sell, where to sell, and at what price.
- Select commodity + mandi (auto-suggest nearest based on location)
- Live prices from Agmarknet/eNAM APIs + **7-day trend sparkline**
- **"Best time to sell"** card — trend signal, not just today's number
- Price comparison: your mandi vs. 3 nearest mandis side-by-side
- **Mandi price alert:** set target price → push notification when commodity hits it
- SMS fallback: "Price SMS pe bhejo" button (MSG91)

#### `SupplyChain.tsx` — Fasal Tracking
- Register harvest batch (crop, quantity, quality grade)
- Buyer connect: FPO / APMC / Direct buyer listings
- Transport booking integration (truck aggregator API)
- Digital weighment slip generator (shareable PDF)
- Payment status tracker

#### `SoilHealth.tsx` — Mitti Ki Sehat
- Upload soil test report (photo → OCR)
- Manual NPK entry
- Fertilizer recommendation based on crop + soil
- Nearest soil testing lab locator (govt labs priority)
- Historical soil health trend

#### `SchemesBenefits.tsx` — Sarkari Sahayata
- PM-KISAN, PMFBY, KCC, eNAM registration status
- State-specific schemes (dynamically loaded by state)
- Application deadline countdown
- Document checklist (Aadhaar, land records, bank)
- Nearest CSC (Common Service Center) locator

#### `CommunityIntel.tsx` — Kisan Samudaya 🆕
Farmers trust other farmers more than any app. This screen surfaces peer intelligence.
- *"10 farmers near you reported the same pest — most using XYZ spray"*
- Hyperlocal pest/disease reports from farmer community (radius: 5–10km)
- Upvote/confirm sightings: *"Mujhe bhi yahi dikha"* one-tap confirm
- Top community tips of the day (curated from upvotes)
- High-confidence community alerts automatically feed into Today's Plan card
- Moderated: flagging system for false reports

#### `HyperlocalAlerts.tsx` — Mera Gaon, Mera Alert 🆕
Village-level, not district-level. Your field, not the nearest city.
- Mandi price surge alerts for your specific commodities
- Pest outbreak spotted within 5km radius
- Weather microzone alerts — your village vs. neighboring villages
- Government scheme deadlines specific to your district
- All alerts cached locally for full offline access
- SMS fallback for critical alerts via MSG91

---

## 🐄 CATEGORY 2 — Livestock Rearing

### Problem Statement
Livestock farmers — primarily rearing cattle, buffalo, goats, and sheep — lack access to timely veterinary support, structured vaccination scheduling, milk yield optimization, and transparent livestock market prices. Animal disease outbreaks spread due to delayed detection. Farmers cannot track insurance claims easily or access government subsidy schemes for animal husbandry.

### Features & Pages

#### `AnimalHealthLog.tsx` — Pashu Diary
- Register each animal (species, breed, age, tag/ear number)
- Symptom checker: "Aapke pashu mein kya dikha?" → guided question tree
- Vaccination history per animal
- Illness log with treatment record
- Trigger vet alert if symptom score crosses threshold

#### `VetConnect.tsx` — Pashu Doctor
- Nearest government veterinary hospitals (geolocation)
- Private vet listings with rating + fees
- Video/audio call with empanelled vet (telemedicine)
- Emergency SOS button → auto-SMS to nearest vet
- Ambulance for large animals (state-specific)

#### `FeedCalculator.tsx` — Aahar Calculator
- Input: animal type, count, age, production stage
- Output: daily feed plan (green fodder + dry fodder + concentrate ratio)
- Seasonal fodder availability calendar
- Fodder price in local market
- "Bachane ka tarika" — cost-optimization tips

#### `MilkYieldTracker.tsx` — Doodh Diary
- Daily milk entry (AM + PM) per animal
- Weekly/monthly yield chart
- Yield vs. benchmark comparison (breed-specific)
- Breeding cycle reminders (heat detection, pregnancy, calving)
- Bulk milk cooling society nearby (AMUL/state coop links)

#### `InsuranceClaims.tsx` — Bima Sahayata
- PMFBY Animal Insurance registration guide
- Claim filing: photo upload, animal details, incident description
- Claim status tracker
- Nearest insurance agent locator
- Document requirements checklist

#### `MandiBhav.tsx` — Pashu Mandi
- Cattle/buffalo/goat prices from nearby livestock mandis
- Fair price estimator (breed + age + weight)
- Mandi calendar (which mandi on which day)
- Buyer-seller matching (classified-style)

---

## 🐓 CATEGORY 3 — Poultry Farming

### Problem Statement
Poultry farmers — broiler and layer segments — face critical challenges in flock disease management, volatile egg and meat prices, feed cost optimization, and finding reliable buyers. Outbreaks like Bird Flu create panic without a reliable early warning system. Small and mid-scale poultry farmers have no platform to track flock health, connect to buyers, or navigate biosecurity compliance.

### Features & Pages

#### `FlockHealthDiary.tsx` — Murgi Diary
- Register flock batch (breed, count, placement date, supplier)
- Daily mortality entry (count + probable cause)
- FCR (Feed Conversion Ratio) calculator
- Health observation log per week
- Automated alert if mortality exceeds threshold

#### `VaccinationSchedule.tsx` — Tika Schedule
- Auto-generated vaccination calendar based on placement date
- Disease: ND, IBD, Marek's, IB — standard Indian schedule
- Reminder push notifications D-2 before due date
- Mark as done with batch number + supplier record
- Missing vaccination alert (red badge)

#### `EggProductionLog.tsx` — Anda Production (Layer Only)
- Daily egg count entry
- Hen-day production % calculator
- Grade-wise count (A, B, cracked, floor eggs)
- Weekly trend chart
- Price × production = revenue estimator

#### `FeedInventory.tsx` — Dana Store
- Current stock entry (bags of each feed type)
- Auto-depletion based on flock count × daily ration
- Reorder alert when stock < 7-day buffer
- Nearest feed supplier with price comparison
- Bulk buying group connect (nearby farmers)

#### `BuyerConnect.tsx` — Bikri
- Integrators / contract farming companies list
- Spot market buyers (broilers: live weight price)
- Egg traders and retail chain connect (layers)
- Price negotiation: "Aaj ka bazar bhav" vs offer price comparison
- Transport arrangement for live birds

#### `DiseaseAlerts.tsx` — Bimari Alert
- State/district-level disease outbreak notifications
- Bird Flu (H5N1/H5N8) zone maps
- Biosecurity checklist (daily/weekly)
- Nearest government disease diagnostic lab
- Compensation scheme info for culling

---

## 🐟 CATEGORY 4 — Fishery & Aquaculture

### Problem Statement
Fish farmers and marine fishers face life-threatening weather at sea, unpredictable fish prices, lack of water quality monitoring tools for pond aquaculture, and fragmented market linkages. Small-scale inland aquaculture farmers struggle with disease diagnosis and lack structured harvest planning. Marine fishers need real-time cyclone and sea-state warnings in their language. No integrated platform addresses both inland and marine segments.

### Features & Pages

#### `PondMonitor.tsx` — Talab Monitor (Aquaculture)
- Register pond(s): area, depth, stocking date, species, stocking density
- Weekly growth log (sample weight × number)
- FCR tracking for fish
- Feeding schedule calculator (body weight %)
- Pond event log (liming, manuring, aeration)
- Harvest readiness indicator (target weight vs current)

#### `WaterQualityLog.tsx` — Paani Ki Gunvatta
- Manual entry: DO, pH, Ammonia, Turbidity, Temperature
- Optimal range indicator per species (color-coded traffic light)
- "Kya karna chahiye?" remediation advice per parameter
- IoT sensor integration ready (API hooks for smart sensors)
- Alert if parameters go critical

#### `FishingWeather.tsx` — Samudri Mausam (Marine)
- Dedicated marine weather: wind speed, wave height, sea state
- Fishing ban period tracker (seasonal ban notification)
- Safe return time estimator
- Cyclone warning with evacuation direction
- Nearest safe harbor locator
- Integration: Indian Meteorological Department + INCOIS data

#### `HarvestPlanner.tsx` — Paidal Niyojan
- Input: current biomass (estimated) + target sell weight
- Output: Days to harvest (growth curve model)
- Price forecast: "Is samay beche toh" vs "1 mahine baad beche toh"
- Buyer pre-booking (advance sale at agreed price)
- Harvest cost calculator (labour, transport, ice)

#### `MarineAlerts.tsx` — Samudri Suraksha
- Deep sea fishing license status check
- Vessel registration reminder
- Fishing vessel distress beacon SOS (EPIRB) info
- Nearest Coast Guard station
- PMSBY / PMMSY scheme status

#### `AquacultureSchemes.tsx` — Machhli Palak Yojana
- PMMSY (Pradhan Mantri Matsya Sampada Yojana) guide
- State fishery department schemes
- Subsidy for cage culture, RAS, biofloc units
- NFDB (National Fisheries Development Board) schemes
- Application status tracker

---

## 🧭 Navigation Architecture

### Bottom Navigation (App Shell)
```
[ 🏠 Home ] [ 📊 Mandi ] [ 🌤️ Mausam ] [ 🔔 Alerts ] [ 👤 Profile ]
```
- 5 tabs, always visible
- Active tab: filled icon + forest green underline
- Alert tab: red badge with unread count
- Labels in current language

### Top Bar
```
[ ☰ Menu ] [ Greeting + Date ] [ 🔔 Bell ] [ 🌐 Lang ]
```

---

## 🔔 Notification System

### Push Notification Categories
```ts
type NotificationType = 
  | 'weather_alert'       // Red: cyclone/hail/frost
  | 'price_spike'         // Green: commodity price up >10%
  | 'price_crash'         // Red: price down >15%
  | 'disease_alert'       // Red: outbreak in district
  | 'scheme_deadline'     // Yellow: scheme closing in 3 days
  | 'advisory'            // Blue: weekly crop advisory
  | 'vaccination_due'     // Yellow: vaccine due tomorrow
  | 'harvest_ready'       // Green: fish/crop ready to harvest
```

### FCM Setup
- Firebase Cloud Messaging for web push
- Service worker handles background notifications
- All notifications must be in farmer's selected language
- SMS fallback via MSG91 for farmers without internet

---

## 📡 Offline Strategy

### What works offline:
- Last fetched weather (up to 6 hours)
- Last market prices (up to 12 hours)
- All farm logs (crop diary, animal diary, pond log) — sync when online
- All static advisory content (downloaded on first use)
- Vaccination schedules and reminders

### IndexedDB Schema (idb-keyval namespaced keys):
```
weather:current, weather:forecast
market:prices:{mandi}
crop:diary:{farmerId}
livestock:log:{animalId}
poultry:flock:{batchId}
pond:log:{pondId}
alerts:queue
```

### Sync Strategy:
- On reconnect: auto-sync all pending diary entries
- Conflict resolution: server timestamp wins
- OfflineBanner component: "आप offline हैं। डेटा sync होगा जब network आएगा।"

---

## 🎙️ Voice Input Feature (`VoiceInputButton.tsx`)

Many farmers are semi-literate. Voice is primary input method.

```ts
// useVoiceInput.ts
const useVoiceInput = (language: string) => {
  // Web Speech API — SpeechRecognition
  // Language code mapping:
  // hi → hi-IN, kn → kn-IN, bn → bn-IN, ta → ta-IN, pa → pa-IN, en → en-IN
  const startListening = () => { ... }
  const stopListening = () => { ... }
  return { transcript, isListening, startListening, stopListening }
}
```

**Usage:** Mic icon appears on all text input fields. Tap → speak → auto-fills.

---

## 🔗 External APIs to Integrate

| API | Purpose | Endpoint |
|-----|---------|----------|
| OpenWeatherMap | 7-day weather + alerts | `api.openweathermap.org/data/2.5/` |
| IMD API | India-specific weather | `imdpune.gov.in` |
| Agmarknet | Mandi prices | `agmarknet.gov.in/agmarknet` |
| eNAM | Electronic National Agriculture Market | `enam.gov.in/api` |
| INCOIS | Marine/ocean weather | `incois.gov.in` |
| PM-KISAN API | Farmer benefit check | `pmkisan.gov.in` |
| Kisan Suvidha | Advisory content | `kisansuvidha.gov.in` |
| MSG91 | SMS OTP + fallback alerts | `api.msg91.com` |
| Firebase FCM | Push notifications | Firebase SDK |

---

## 🏎️ Performance Rules

- **First Contentful Paint < 2s** on 3G connection
- **Lazy load** all category pages (React.lazy + Suspense)
- **Image optimization:** All illustrations as SVG, photos as WebP
- **Font loading:** `font-display: swap` for all Google Fonts
- **Bundle split:** Separate chunk per category page group
- **Skeleton screens** on every data-fetching page (never blank)
- **Tap targets:** minimum 48×48px for all interactive elements
- **Contrast ratio:** minimum 4.5:1 for all text (sunlight readable)

---

## ♿ Accessibility & Usability for Farmers

1. **Icon + Text always** — never icon-only navigation labels
2. **Large font minimum 17px** — base, never go smaller
3. **Color never sole indicator** — always icon/shape backup
4. **Touch targets 48px minimum** — fat-thumb-proof
5. **Loading states always shown** — spinner or skeleton
6. **Error messages in simple language** — no tech jargon
7. **Voice input on all forms** — Web Speech API
8. **High contrast mode option** — in settings
9. **One primary action per screen** — no decision paralysis
10. **Back button always visible** — farmers get confused with gestures

---

## 🚀 Build & Deployment

```bash
# Install
npm install

# Dev
npm run dev

# Build PWA
npm run build

# Preview built PWA
npm run preview

# Deploy to Vercel / Netlify (auto-detects Vite)
```

### Environment Variables (`.env`)
```
VITE_OPENWEATHER_API_KEY=
VITE_FIREBASE_CONFIG=
VITE_MSG91_AUTH_KEY=
VITE_API_BASE_URL=
VITE_AGMARKNET_API_KEY=
```

---

## 📋 Development Sequence (Recommended)

1. **Week 1:** Project setup, Vite + PWA + Tailwind + Zustand + i18n
2. **Week 2:** Splash → Language Select → Category Select → Login flow
3. **Week 3:** Home screen + Bottom Nav + TopBar + Weather widget
4. **Week 4:** Category 1 (Crop) — all 9 features (Today's Plan, Advisory, Weather→Actions, Market Intel, SupplyChain, SoilHealth, Schemes, CommunityIntel, HyperlocalAlerts)
5. **Week 5:** Category 2 (Livestock) — all 6 features
6. **Week 6:** Category 3 (Poultry) — all 6 features
7. **Week 7:** Category 4 (Fishery) — all 6 features
8. **Week 8:** Push notifications + Offline sync + Voice input
9. **Week 9:** Performance audit + PWA audit (Lighthouse score > 90)
10. **Week 10:** User testing with real farmers + language QA

---

## 🌟 Novelty Features (Differentiators)

1. **KisanGPT Chat** — Bottom sheet chatbot in farmer's language, powered by Claude API — farmer asks anything, gets advisory in their language
2. **Photo Diagnosis** — Crop disease / animal symptom detection via camera (integrate plant disease ML model)
3. **Voice-first Forms** — Every form can be filled entirely by voice
4. **Mandi Price Alerts** — Set a target price, get notified when commodity hits it
5. **Crop Calendar** — Visual sow-to-harvest timeline, personalized per crop and location
6. **FPO Connect** — Connect to Farmer Producer Organizations for bulk selling
7. **KCC (Kisan Credit Card) Balance** — Check loan status and repayment within app

---

*Built for 140 million Indian farmer families. Every pixel with purpose, every feature born from the field.*
