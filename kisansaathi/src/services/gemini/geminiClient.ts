// src/services/gemini/geminiClient.ts
// Gemini API client with feature-specific system prompts
import { GoogleGenerativeAI, type GenerateContentResult } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI: GoogleGenerativeAI | null = null

const getClient = () => {
  if (!genAI && API_KEY) genAI = new GoogleGenerativeAI(API_KEY)
  return genAI
}

// ─── Language mapping ───────────────────────────────────────────────────────
const LANG_NAMES: Record<string, string> = {
  hi: 'Hindi (हिंदी)',
  en: 'English',
  kn: 'Kannada (ಕನ್ನಡ)',
  bn: 'Bengali (বাংলা)',
  ta: 'Tamil (தமிழ்)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
}

// ─── Core generator ────────────────────────────────────────────────────────
async function generate(systemPrompt: string, userMessage: string): Promise<string> {
  const client = getClient()
  if (!client) {
    console.warn('[Gemini] No API key configured — returning mock response')
    return getMockResponse(userMessage)
  }
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  })
  const result: GenerateContentResult = await model.generateContent(userMessage)
  return result.response.text()
}

// ─── Mock fallback (dev without API key) ────────────────────────────────────
function getMockResponse(context: string): string {
  return `[Mock Response] Gemini would answer: "${context.slice(0, 80)}..." — Add VITE_GEMINI_API_KEY to enable real AI.`
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 1: Today's Plan — Farm Decision Engine
// Returns 3 prioritized farm actions as JSON
// ══════════════════════════════════════════════════════════════════════════════
export async function getTodaysPlan(params: {
  crop: string
  growthStage: string
  weather: string
  mandiPriceTrend: string
  communityAlerts: string
  language: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are a precision farm decision engine for Indian smallholder farmers.
Given today's farm context, generate exactly 3 prioritized farm decisions.
Output ONLY a valid JSON array, no markdown, no explanation:
[{"icon":"emoji","action":"verb phrase max 5 words","reason":"one sentence max 12 words","priority":"high|medium|low","color":"red|yellow|green"}]
Color rules: red=do it NOW (urgent risk), yellow=do it TODAY (caution), green=this week (safe).
Use simple words. Respond in ${lang}.`

  const user = `Crop: ${params.crop}
Growth Stage: ${params.growthStage}
Today's Weather: ${params.weather}
Mandi Price Trend: ${params.mandiPriceTrend}
Community Alerts: ${params.communityAlerts}`

  return generate(system, user)
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 2: AI Crop Doctor — Disease Diagnosis from text/photo description
// ══════════════════════════════════════════════════════════════════════════════
export async function diagnoseCropDisease(params: {
  cropType: string
  symptomsDescription: string
  language: string
  base64Image?: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are an Indian agricultural pathologist helping smallholder farmers.
Diagnose the crop problem and respond in ${lang}.
Structure your response as:
🔴/🟡/🟢 URGENCY: [RED=treat today / YELLOW=monitor 2 days / GREEN=minor]
🌾 PROBLEM: [disease/pest name in farmer's language]
💊 TREATMENT: [specific product name + how to apply, available at Indian agri shops]
🛡️ PREVENTION: [2-3 preventive steps for next 7 days]
Keep language simple — the farmer is semi-literate.`

  const user = `Crop: ${params.cropType}
Symptoms: ${params.symptomsDescription}`

  const client = getClient()
  if (!client) {
    console.warn('[Gemini] No API key configured — returning mock response')
    return getMockResponse(user)
  }

  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: system,
  })

  // If there's an image, pass it as a Part
  if (params.base64Image) {
    // Strip metadata part if present e.g. "data:image/jpeg;base64,"
    const base64Data = params.base64Image.split(',')[1] || params.base64Image
    const mimeType = params.base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg'
    
    const parts: any[] = [
      { text: user },
      { inlineData: { data: base64Data, mimeType } }
    ]
    const result = await model.generateContent(parts)
    return result.response.text()
  } else {
    const result = await model.generateContent(user)
    return result.response.text()
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 3: Market Intelligence — When/where to sell
// ══════════════════════════════════════════════════════════════════════════════
export async function getMarketAdvice(params: {
  commodity: string
  currentPrice: number
  priceTrend: string
  nearestMandis: string
  language: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are an agricultural commodity trading advisor for Indian mandi markets.
Respond in ${lang}. Your reply must be under 60 words.
Format: 
📊 RECOMMENDATION: SELL NOW / HOLD X DAYS / TRANSPORT TO [mandi]
💰 CURRENT RATE: ₹[amount]/quintal  
📈 REASON: [one direct sentence]
⚠️ RISK: [one short risk note]
Speak like a trusted commission agent, not a financial advisor.`

  const user = `Commodity: ${params.commodity}
Current Price: ₹${params.currentPrice}/quintal
7-Day Trend: ${params.priceTrend}
Nearby Mandis: ${params.nearestMandis}`

  return generate(system, user)
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 4: Vet AI — Animal Symptom Analyzer
// ══════════════════════════════════════════════════════════════════════════════
export async function getVetAdvice(params: {
  animalType: string
  age: string
  symptoms: string
  language: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are a veterinary advisor for Indian livestock and poultry farmers.
Respond in ${lang}.
Format your response:
🔴/🟡/🟢 URGENCY: [EMERGENCY=call vet NOW / TODAY=visit today / THIS WEEK=monitor / WATCH=observe]
🐄 LIKELY CONDITION: [name in simple words]
🏠 HOME REMEDY: [safe first-aid if any, else say "Home remedy not safe — see vet"]
🏥 VET VISIT: [Yes/No + reason]
💉 GOVT SCHEME: [any relevant govt scheme for this condition]
CRITICAL: Always recommend vet for EMERGENCY. Never diagnose rabies without vet.`

  const user = `Animal: ${params.animalType}
Age: ${params.age}
Symptoms: ${params.symptoms}`

  return generate(system, user)
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 5: Water Quality Advisor — Aquaculture pond analysis
// ══════════════════════════════════════════════════════════════════════════════
export async function getWaterQualityAdvice(params: {
  fishSpecies: string
  do_mgL: number
  ph: number
  ammonia_mgL: number
  temperature_C: number
  language: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are an aquaculture specialist for Indian fish farmers.
Respond in ${lang}. Analyze each water parameter with a traffic light:
🔴 RED = critical, act NOW | 🟡 YELLOW = caution, fix today | 🟢 GREEN = safe
Format:
💧 DO: [reading] — [color] — [action if needed]
🧪 pH: [reading] — [color] — [action if needed]
☠️ Ammonia: [reading] — [color] — [action if needed]
🌡️ Temperature: [reading] — [color] — [action if needed]
📊 OVERALL POND HEALTH: [score]/100
🐟 NEXT ACTION: [one most important thing to do today]
Use products available at Indian fish farming supply shops.`

  const user = `Fish Species: ${params.fishSpecies}
DO: ${params.do_mgL} mg/L
pH: ${params.ph}
Ammonia: ${params.ammonia_mgL} mg/L
Temperature: ${params.temperature_C}°C`

  return generate(system, user)
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 6: Hyperlocal Alert Synthesizer
// ══════════════════════════════════════════════════════════════════════════════
export async function synthesizeHyperlocalAlerts(params: {
  district: string
  weatherData: string
  communityReports: string
  schemeDeadlines: string
  language: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are a farm alert aggregator for Indian villages.
Respond in ${lang}. Output ONLY a valid JSON array of 3-5 alerts, no markdown:
[{"icon":"emoji","title":"short title","body":"under 15 words","color":"red|yellow|green|blue|orange","action":"what to do now"}]
Color: red=danger, yellow=caution, green=good news, blue=weather/water, orange=market/scheme`

  const user = `District: ${params.district}
Weather: ${params.weatherData}
Community Reports: ${params.communityReports}
Scheme Deadlines: ${params.schemeDeadlines}`

  return generate(system, user)
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 7: SarpanchGPT — General Farm Chat Advisor
// ══════════════════════════════════════════════════════════════════════════════
export async function chatWithSarpanch(params: {
  question: string
  farmerContext: string
  language: string
  history?: Array<{ role: 'user' | 'model'; content: string }>
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are SarpanchAI — a knowledgeable village agricultural advisor who speaks like a trusted, wise elder who also understands modern farming technology.
You help Indian smallholder farmers with ANY farming question: crops, livestock, poultry, fishery, government schemes, market, weather, soil, pests.
Tone: Warm, direct, practical. Like talking to a trusted elder, not a chatbot. Use "aap" respectfully.
Language: ${lang}
Farmer context: ${params.farmerContext}
ALWAYS end with:
✅ आज का काम: [one clear action the farmer should take today]`

  return generate(system, params.question)
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 8: Crop Disease Scanner — Camera-based image analysis
// Expert-grade diagnostic report with Gemini Vision
// ══════════════════════════════════════════════════════════════════════════════
export async function analyzeCropImage(params: {
  base64Image: string
  cropType?: string
  additionalNotes?: string
  language: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'English'
  const system = `You are Dr. AgriScan — a world-class plant pathologist with 25+ years of experience diagnosing crop diseases in Indian agriculture. You are analyzing a photo taken by a farmer on their phone.

Your expertise covers: fungal, bacterial, viral diseases, nutrient deficiencies, pest damage, abiotic stress, and environmental damage across all major Indian crops.

ANALYZE the image with clinical precision and respond in ${lang}.

FORMAT your response EXACTLY as follows:

📋 SCAN REPORT
━━━━━━━━━━━━━━

🔍 IDENTIFIED CONDITION: [Disease/Deficiency name]
📊 CONFIDENCE: [High/Medium/Low]
⚠️ SEVERITY: [Mild / Moderate / Severe / Critical]

📝 DIAGNOSIS:
[2-3 sentences explaining what you see in the image — leaf spots, discoloration, wilting patterns, pest marks, etc.]

💊 TREATMENT PROTOCOL:
1. [Immediate action — specific product name available in Indian agri shops, dosage, application method]
2. [Follow-up treatment in 3-5 days if needed]
3. [Organic/natural alternative if available]

🛡️ PREVENTION (Next 15 days):
• [Preventive step 1]
• [Preventive step 2]
• [Preventive step 3]

💰 ESTIMATED COST: ₹[amount range] for treatment
📅 RECOVERY TIME: [X days/weeks with proper treatment]

⚡ URGENCY: [🔴 TREAT TODAY / 🟡 WITHIN 3 DAYS / 🟢 MONITOR]

RULES:
- If the image is NOT a crop/plant, say "This doesn't appear to be a crop image. Please take a clear photo of the affected plant leaves, stems, or fruit."
- If image quality is too poor, ask for a better photo.  
- Always recommend specific product names available in Indian agricultural supply shops.
- Use simple farmer-friendly language. The farmer may be semi-literate.
- If unsure, say so honestly and recommend visiting the nearest Krishi Vigyan Kendra (KVK).`

  const userMsg = `Please analyze this crop image for any diseases, pests, or deficiencies.${
    params.cropType ? `\nCrop type: ${params.cropType}` : ''
  }${
    params.additionalNotes ? `\nFarmer notes: ${params.additionalNotes}` : ''
  }`

  const client = getClient()
  if (!client) {
    return `📋 SCAN REPORT (Demo Mode)
━━━━━━━━━━━━━━

🔍 IDENTIFIED CONDITION: Leaf Blight (Demo)
📊 CONFIDENCE: High
⚠️ SEVERITY: Moderate

📝 DIAGNOSIS:
The leaves show characteristic brown spots with yellow halos, indicating early-stage fungal leaf blight. Pattern suggests Alternaria species infection, common during high humidity periods.

💊 TREATMENT PROTOCOL:
1. Spray Mancozeb 75% WP (2g/L water) immediately — available at any agri shop ₹120/250g
2. Follow up with Carbendazim 50% WP (1g/L) after 5 days
3. Organic: Neem oil spray (5ml/L) as preventive

🛡️ PREVENTION:
• Improve air circulation between plants
• Avoid overhead irrigation — use drip/furrow
• Remove and burn affected leaves

💰 ESTIMATED COST: ₹200-350
📅 RECOVERY TIME: 7-10 days
⚡ URGENCY: 🟡 WITHIN 3 DAYS

[Demo Mode — Add VITE_GEMINI_API_KEY for real AI analysis]`
  }

  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: system,
  })

  const base64Data = params.base64Image.split(',')[1] || params.base64Image
  const mimeType = params.base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg'

  const parts: any[] = [
    { text: userMsg },
    { inlineData: { data: base64Data, mimeType } }
  ]

  const result = await model.generateContent(parts)
  return result.response.text()
}

