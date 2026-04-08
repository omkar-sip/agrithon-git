const readEnv = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const isTruthy = (value: string): boolean =>
  ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())

const isPlaceholderValue = (value: string): boolean => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return true

  return (
    normalized.startsWith('your_') ||
    normalized.startsWith('your-') ||
    normalized.includes('placeholder') ||
    normalized.includes('replace_me') ||
    normalized.includes('replace-me') ||
    normalized.includes('changeme') ||
    normalized.includes('<') ||
    normalized.includes('>')
  )
}

const readConfiguredEnv = (value: unknown): string => {
  const normalized = readEnv(value)
  return isPlaceholderValue(normalized) ? '' : normalized
}

const toNumber = (value: string, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const isProduction = Boolean(import.meta.env.PROD)

export const env = {
  apiBaseUrl: readConfiguredEnv(import.meta.env.VITE_API_BASE_URL),

  firebaseApiKey: readConfiguredEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  firebaseAuthDomain: readConfiguredEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  firebaseProjectId: readConfiguredEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  firebaseStorageBucket: readConfiguredEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  firebaseMessagingSenderId: readConfiguredEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  firebaseAppId: readConfiguredEnv(import.meta.env.VITE_FIREBASE_APP_ID),
  firebaseMeasurementId: readConfiguredEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
  firebaseVapidKey: readConfiguredEnv(import.meta.env.VITE_FIREBASE_VAPID_KEY),

  geminiApiKey: readConfiguredEnv(import.meta.env.VITE_GEMINI_API_KEY),
  allowBrowserGemini: isTruthy(readEnv(import.meta.env.VITE_ALLOW_BROWSER_GEMINI)),
  openWeatherApiKey: readConfiguredEnv(import.meta.env.VITE_OPENWEATHER_API_KEY),

  agmarknetApiKey: readConfiguredEnv(import.meta.env.VITE_AGMARKNET_API_KEY),
  agmarknetBaseUrl: readEnv(import.meta.env.VITE_AGMARKNET_BASE_URL) || 'https://api.data.gov.in/resource',
  agmarknetResourceId:
    readConfiguredEnv(import.meta.env.VITE_AGMARKNET_RESOURCE_ID) || '9ef84268-d588-465a-a308-a864a43d0070',
  agmarknetLimit: toNumber(readEnv(import.meta.env.VITE_AGMARKNET_LIMIT), 80),

  msg91AuthKey: readConfiguredEnv(import.meta.env.VITE_MSG91_AUTH_KEY),
  allowBrowserMsg91: isTruthy(readEnv(import.meta.env.VITE_ALLOW_BROWSER_MSG91)),
  msg91BaseUrl: readEnv(import.meta.env.VITE_MSG91_BASE_URL) || 'https://api.msg91.com/api/v2/sendsms',
  msg91SenderId: readConfiguredEnv(import.meta.env.VITE_MSG91_SENDER_ID) || 'AGRITH',
  msg91Route: readEnv(import.meta.env.VITE_MSG91_ROUTE) || '4',
  msg91Country: readEnv(import.meta.env.VITE_MSG91_COUNTRY) || '91',
}

const browserGeminiEnabled = Boolean(env.geminiApiKey) && (!isProduction || env.allowBrowserGemini)
const browserMsg91Enabled = Boolean(env.msg91AuthKey) && (!isProduction || env.allowBrowserMsg91)

export const apiAvailability = {
  hasFirebaseConfig: Boolean(env.firebaseApiKey && env.firebaseProjectId && env.firebaseAppId),
  hasFirebaseVapidKey: Boolean(env.firebaseVapidKey),
  hasGeminiKey: browserGeminiEnabled,
  hasOpenWeatherKey: Boolean(env.openWeatherApiKey),
  hasAgmarknetKey: Boolean(env.agmarknetApiKey),
  hasMsg91AuthKey: browserMsg91Enabled,
}

export const runtimeSecurity = {
  isProduction,
  browserGeminiEnabled,
  browserMsg91Enabled,
  geminiBlockedInBrowser:
    Boolean(env.geminiApiKey) && isProduction && !env.allowBrowserGemini,
  msg91BlockedInBrowser:
    Boolean(env.msg91AuthKey) && isProduction && !env.allowBrowserMsg91,
}
