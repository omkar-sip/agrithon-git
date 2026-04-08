// src/services/gemini/geminiClient.ts
// Gemini API client with feature-specific system prompts
import { GoogleGenerativeAI, type GenerateContentResult, type Part } from '@google/generative-ai'
import { apiAvailability, env, runtimeSecurity } from '../../config/env'

let genAI: GoogleGenerativeAI | null = null
let hasWarnedAboutBrowserGemini = false

const getApiKey = () => {
  if (apiAvailability.hasGeminiKey) return env.geminiApiKey

  if (runtimeSecurity.geminiBlockedInBrowser && !hasWarnedAboutBrowserGemini) {
    console.warn(
      '[Gemini] Browser-side Gemini is disabled in production. Use a backend proxy or set VITE_ALLOW_BROWSER_GEMINI=true only for temporary demos.'
    )
    hasWarnedAboutBrowserGemini = true
  }

  return ''
}

const getClient = () => {
  const apiKey = getApiKey()
  if (!genAI && apiKey) genAI = new GoogleGenerativeAI(apiKey)
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

interface GenerateOptions {
  history?: Array<{ role: 'user' | 'model'; content: string }>
  model?: string | string[]
}

const DEFAULT_TEXT_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro']
const SARPANCH_CHAT_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro']
const SARPANCH_TTS_MODELS = ['gemini-2.5-flash-preview-tts', 'gemini-2.5-pro-preview-tts']

const TEXT_MODEL_TIMEOUT_MS: Record<string, number> = {
  'gemini-2.5-flash': 8000,
  'gemini-2.5-pro': 9500,
}

const TTS_MODEL_TIMEOUT_MS: Record<string, number> = {
  'gemini-2.5-flash-preview-tts': 1800,
  'gemini-2.5-pro-preview-tts': 2600,
}

const FAST_GENERATION_CONFIG = {
  maxOutputTokens: 420,
  temperature: 0.45,
  topP: 0.9,
}

const CONTINUATION_TIMEOUT_EXTRA_MS = 2200
const CONTINUE_PROMPT =
  'Continue from exactly where you stopped. Do not restart, do not repeat, and keep the same language and tone.'

type ChatTurn = { role: 'user' | 'model'; parts: Array<{ text: string }> }

interface CandidatePart {
  text?: string
}

interface CandidateContent {
  parts?: CandidatePart[]
}

interface ResponseCandidate {
  finishReason?: string
  content?: CandidateContent
}

interface GeminiResponseLike {
  text?: () => string
  candidates?: ResponseCandidate[]
}

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null

  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

const normalizeHistory = (
  history?: Array<{ role: 'user' | 'model'; content: string }>
): ChatTurn[] => {
  if (!history?.length) return []

  const normalized: ChatTurn[] = []

  for (const turn of history) {
    const text = turn.content?.trim()
    if (!text) continue

    const role: 'user' | 'model' = turn.role === 'model' ? 'model' : 'user'

    // Gemini chat history is most stable when it starts with user content.
    if (!normalized.length && role === 'model') {
      continue
    }

    const previous = normalized[normalized.length - 1]
    if (previous && previous.role === role) {
      previous.parts[0].text += `\n${text}`
      continue
    }

    normalized.push({ role, parts: [{ text }] })
  }

  return normalized
}

const extractResponseText = (result: GenerateContentResult): string => {
  const response = result.response as GeminiResponseLike
  const fromTextFn = typeof response.text === 'function' ? response.text().trim() : ''
  if (fromTextFn) return fromTextFn

  const fromParts = (response.candidates || [])
    .flatMap(candidate => candidate.content?.parts || [])
    .map(part => part.text?.trim() || '')
    .filter(Boolean)
    .join('\n')
    .trim()

  return fromParts
}

const getFinishReason = (result: GenerateContentResult): string => {
  const response = result.response as GeminiResponseLike
  return response.candidates?.[0]?.finishReason || 'UNKNOWN'
}

const isLikelyTruncated = (finishReason: string): boolean => finishReason.toUpperCase() === 'MAX_TOKENS'

const mergeContinuation = (baseText: string, continuationText: string): string => {
  const base = baseText.trim()
  const continuation = continuationText.trim()

  if (!base) return continuation
  if (!continuation) return base
  if (base.endsWith(continuation)) return base
  if (continuation.startsWith(base)) return continuation

  const maxOverlap = Math.min(120, base.length, continuation.length)
  for (let overlap = maxOverlap; overlap >= 16; overlap--) {
    const baseTail = base.slice(-overlap).toLowerCase()
    const continuationHead = continuation.slice(0, overlap).toLowerCase()
    if (baseTail === continuationHead) {
      return `${base}${continuation.slice(overlap)}`.trim()
    }
  }

  return `${base} ${continuation}`.replace(/\s+/g, ' ').trim()
}

const getSarpanchChatFallback = (language: string): string => {
  const fallbacks: Record<string, string> = {
    hi: 'Abhi network thoda slow hai. Aapka sawaal mil gaya hai. Kripya 10 second baad dubara puchhiye ya typing se bhejiye.',
    en: 'The network is slow right now. I received your question. Please ask again in 10 seconds or use typing.',
    kn: 'Iga network swalpa nidhanavide. Nimma prashne sikide. 10 second nantara matte keli athava typing madi.',
    bn: 'Ekhon network dhire kaj korche. Apnar proshno peyechi. 10 second pore abar bolun ba type korun.',
    ta: 'Ippothu network konjam slow. Ungal kelvi vandhulladhu. 10 vinadi pinbu thirumba kelunga allathu type pannunga.',
    pa: 'Hun network thoda slow hai. Tuhada sawal mil gaya hai. 10 second baad dubara pucho ya type karo.',
  }

  const message = fallbacks[language] || fallbacks.en
  return `${message}\nToday's Farm Action: Check mobile signal and ask one short question again.`
}

// ─── Core generator ────────────────────────────────────────────────────────
async function generate(
  systemPrompt: string,
  userMessage: string,
  options: GenerateOptions = {}
): Promise<string> {
  if (runtimeSecurity.geminiBlockedInBrowser) {
    return 'Secure mode is active. Browser-side Gemini is disabled in production. Move AI requests to a backend or temporarily opt in with VITE_ALLOW_BROWSER_GEMINI=true.'
  }

  const client = getClient()
  if (!client) {
    console.warn('[Gemini] No API key configured — returning mock response')
    return getMockResponse(userMessage)
  }

  const candidateModels = Array.isArray(options.model)
    ? options.model
    : options.model
      ? [options.model]
      : DEFAULT_TEXT_MODELS

  const uniqueCandidateModels = Array.from(new Set(candidateModels.filter(Boolean)))
  const normalizedHistory = normalizeHistory(options.history)
  let lastError: unknown = null

  for (const modelName of uniqueCandidateModels) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        generationConfig: FAST_GENERATION_CONFIG,
      })
      const timeoutMs = TEXT_MODEL_TIMEOUT_MS[modelName] ?? 8000

      if (normalizedHistory.length) {
        const chat = model.startChat({ history: normalizedHistory })
        let result = await withTimeout(chat.sendMessage(userMessage), timeoutMs, modelName)
        let text = extractResponseText(result)
        let finishReason = getFinishReason(result)

        if (!text) {
          result = await withTimeout(
            chat.sendMessage('Reply in plain text only and give a complete answer.'),
            timeoutMs,
            `${modelName} retry`
          )
          text = extractResponseText(result)
          finishReason = getFinishReason(result)
        }

        if (text && isLikelyTruncated(finishReason)) {
          const continuationResult = await withTimeout(
            chat.sendMessage(CONTINUE_PROMPT),
            timeoutMs + CONTINUATION_TIMEOUT_EXTRA_MS,
            `${modelName} continuation`
          )
          const continuationText = extractResponseText(continuationResult)
          if (continuationText) {
            text = mergeContinuation(text, continuationText)
          }
        }

        if (!text) {
          throw new Error(`Gemini returned an empty response (finishReason: ${finishReason}).`)
        }

        return text
      }

      let result: GenerateContentResult = await withTimeout(
        model.generateContent(userMessage),
        timeoutMs,
        modelName
      )
      let text = extractResponseText(result)
      let finishReason = getFinishReason(result)

      if (!text) {
        result = await withTimeout(
          model.generateContent(`${userMessage}\n\nReply in plain text only and give a complete answer.`),
          timeoutMs,
          `${modelName} retry`
        )
        text = extractResponseText(result)
        finishReason = getFinishReason(result)
      }

      if (text && isLikelyTruncated(finishReason)) {
        const continuationResult = await withTimeout(
          model.generateContent(
            `Continue this answer from where it stopped. Do not repeat previous content.

Question:
${userMessage}

Answer so far:
${text}`
          ),
          timeoutMs + CONTINUATION_TIMEOUT_EXTRA_MS,
          `${modelName} continuation`
        )
        const continuationText = extractResponseText(continuationResult)
        if (continuationText) {
          text = mergeContinuation(text, continuationText)
        }
      }

      if (!text) {
        throw new Error(`Gemini returned an empty response (finishReason: ${finishReason}).`)
      }

      return text
    } catch (error) {
      lastError = error
      console.warn(`[Gemini] ${modelName} failed`, error)
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Gemini request failed for all configured text models.')
}

export async function generateAiText(params: {
  systemPrompt: string
  userMessage: string
  history?: Array<{ role: 'user' | 'model'; content: string }>
  model?: string | string[]
}): Promise<string> {
  return generate(params.systemPrompt, params.userMessage, {
    history: params.history,
    model: params.model,
  })
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

  if (runtimeSecurity.geminiBlockedInBrowser) {
    return 'Secure mode is active. Browser-side Gemini is disabled in production. Move AI requests to a backend or temporarily opt in with VITE_ALLOW_BROWSER_GEMINI=true.'
  }

  const client = getClient()
  if (!client) {
    console.warn('[Gemini] No API key configured — returning mock response')
    return getMockResponse(user)
  }

  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: system,
  })

  // If there's an image, pass it as a Part
  if (params.base64Image) {
    // Strip metadata part if present e.g. "data:image/jpeg;base64,"
    const base64Data = params.base64Image.split(',')[1] || params.base64Image
    const mimeType = params.base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg'
    
    const parts: Part[] = [
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
export async function getWeatherAction(params: {
  category: string
  crops: string[]
  waterSource?: string
  location: string
  currentWeather: string
  forecast: string
  language: string
}): Promise<string> {
  const lang = LANG_NAMES[params.language] || 'Hindi'
  const system = `You are an agricultural weather advisory engine for Indian farmers.
Respond in ${lang}.
Use the weather data to produce hyper-local, actionable farm measures.
Output ONLY valid JSON with this exact shape:
{"summary":"one short weekly summary","days":[{"date":"YYYY-MM-DD","farmAction":"under 16 words","actionColor":"green|yellow|red"}],"alerts":[{"id":"short-id","type":"weather","severity":"green|yellow|red","title":"under 6 words","body":"under 14 words","farmAction":"under 14 words"}]}
Rules:
- Red means urgent action or avoid field work.
- Yellow means caution and same-day planning.
- Green means safe or good farming window.
- Keep every action specific to the farmer category and likely crops.
- Never include markdown or explanation.`

  const user = `Category: ${params.category}
Crops: ${params.crops.join(', ') || 'Not specified'}
Water Source: ${params.waterSource || 'Not specified'}
Location: ${params.location}
Current Weather: ${params.currentWeather}
Forecast: ${params.forecast}`

  return generate(system, user)
}

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
  const system = `You are Sarpanch Ji, a trusted agriculture advisor for Indian farmers.
Goals:
- Give practical, local, low-literacy-friendly farming guidance.
- Keep replies concise, clear, and actionable.
- Prioritize farmer safety, crop health, livestock welfare, and cost-aware decisions.

Multilingual NLP mode:
- Detect the farmer's latest language and script from their message.
- Understand mixed language input (for example Hindi+English, Punjabi+English) and Romanized Indian language input.
- Reply in the same language style the farmer just used. If unclear, reply in ${lang}.

Conversation style:
- Respectful and warm, like an experienced village mentor.
- Use short sentences and numbered steps when giving actions.
- If location/season matters and data is missing, ask one short clarifying question.

Farmer context:
${params.farmerContext}

Response format rules:
- First line: a direct answer in 1 sentence.
- Then practical steps.
- Default brevity: keep it under 90 words unless the farmer asks for detailed explanation.
- Use plain text only. Do not use markdown symbols like *, **, #, -, backticks, or code blocks.
- End with exactly one line:
Today's Farm Action: <one clear action for the next 24 hours>`

  try {
    return await generate(system, params.question, {
      history: params.history,
      model: SARPANCH_CHAT_MODELS,
    })
  } catch (error) {
    console.warn('[Sarpanch Chat] Falling back after Gemini failure', error)
    return getSarpanchChatFallback(params.language)
  }
}

export interface SarpanchSpeechAudio {
  audioBase64: string
  mimeType: string
  sampleRateHz: number
  voiceName: string
}

const SARPANCH_VOICE_BY_LANG: Record<string, string> = {
  en: 'Kore',
  hi: 'Kore',
  kn: 'Kore',
  bn: 'Kore',
  ta: 'Kore',
  pa: 'Kore',
}

const parseSampleRate = (mimeType: string): number => {
  const match = mimeType.match(/rate=(\d+)/i)
  if (!match) return 24000
  const parsed = Number(match[1])
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 24000
}

export async function synthesizeSarpanchSpeech(params: {
  text: string
  language: string
}): Promise<SarpanchSpeechAudio | null> {
  const trimmed = params.text.trim()
  if (!trimmed) return null
  const apiKey = getApiKey()
  if (!apiKey) return null

  const voiceName = SARPANCH_VOICE_BY_LANG[params.language] || 'Kore'
  const ttsPrompt = `Read this advisory message exactly as written for an Indian farmer.
Tone: calm, respectful, reassuring, and clear.
Pace: medium-slow with brief pauses at punctuation.

${trimmed}`

  for (const modelName of SARPANCH_TTS_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`
    const timeoutMs = TTS_MODEL_TIMEOUT_MS[modelName] ?? 2600

    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            model: modelName,
            contents: [{ parts: [{ text: ttsPrompt }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
          }),
        },
        timeoutMs
      )

      if (!response.ok) {
        console.warn(`[Gemini TTS] ${modelName} HTTP ${response.status}`)
        continue
      }

      const payload = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{
              inlineData?: {
                data?: string
                mimeType?: string
              }
            }>
          }
        }>
      }

      const audioPart = payload.candidates?.[0]?.content?.parts?.find(
        part => typeof part.inlineData?.data === 'string'
      )
      const audioBase64 = audioPart?.inlineData?.data
      if (!audioBase64) continue

      const mimeType = audioPart.inlineData?.mimeType || 'audio/L16;rate=24000'
      return {
        audioBase64,
        mimeType,
        sampleRateHz: parseSampleRate(mimeType),
        voiceName,
      }
    } catch (error) {
      console.warn(`[Gemini TTS] ${modelName} request failed`, error)
    }
  }

  return null
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

  if (runtimeSecurity.geminiBlockedInBrowser) {
    return 'Secure mode is active. Browser-side Gemini image analysis is disabled in production. Move AI requests to a backend or temporarily opt in with VITE_ALLOW_BROWSER_GEMINI=true.'
  }

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
    model: 'gemini-2.5-flash',
    systemInstruction: system,
  })

  const base64Data = params.base64Image.split(',')[1] || params.base64Image
  const mimeType = params.base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg'

  const parts: Part[] = [
    { text: userMsg },
    { inlineData: { data: base64Data, mimeType } }
  ]

  const result = await model.generateContent(parts)
  return result.response.text()
}

