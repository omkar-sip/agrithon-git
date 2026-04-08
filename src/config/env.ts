const readEnv = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const toNumber = (value: string, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const env = {
  apiBaseUrl: readEnv(import.meta.env.VITE_API_BASE_URL),

  firebaseApiKey: readEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  firebaseAuthDomain: readEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  firebaseProjectId: readEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  firebaseStorageBucket: readEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  firebaseMessagingSenderId: readEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  firebaseAppId: readEnv(import.meta.env.VITE_FIREBASE_APP_ID),
  firebaseMeasurementId: readEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
  firebaseVapidKey: readEnv(import.meta.env.VITE_FIREBASE_VAPID_KEY),

  geminiApiKey: readEnv(import.meta.env.VITE_GEMINI_API_KEY),
  openWeatherApiKey: readEnv(import.meta.env.VITE_OPENWEATHER_API_KEY),

  agmarknetApiKey: readEnv(import.meta.env.VITE_AGMARKNET_API_KEY),
  agmarknetBaseUrl: readEnv(import.meta.env.VITE_AGMARKNET_BASE_URL) || 'https://api.data.gov.in/resource',
  agmarknetResourceId:
    readEnv(import.meta.env.VITE_AGMARKNET_RESOURCE_ID) || '9ef84268-d588-465a-a308-a864a43d0070',
  agmarknetLimit: toNumber(readEnv(import.meta.env.VITE_AGMARKNET_LIMIT), 80),

  msg91AuthKey: readEnv(import.meta.env.VITE_MSG91_AUTH_KEY),
  msg91BaseUrl: readEnv(import.meta.env.VITE_MSG91_BASE_URL) || 'https://api.msg91.com/api/v2/sendsms',
  msg91SenderId: readEnv(import.meta.env.VITE_MSG91_SENDER_ID) || 'AGRITH',
  msg91Route: readEnv(import.meta.env.VITE_MSG91_ROUTE) || '4',
  msg91Country: readEnv(import.meta.env.VITE_MSG91_COUNTRY) || '91',
}

export const apiAvailability = {
  hasFirebaseConfig: Boolean(env.firebaseApiKey && env.firebaseProjectId && env.firebaseAppId),
  hasFirebaseVapidKey: Boolean(env.firebaseVapidKey),
  hasGeminiKey: Boolean(env.geminiApiKey),
  hasOpenWeatherKey: Boolean(env.openWeatherApiKey),
  hasAgmarknetKey: Boolean(env.agmarknetApiKey),
  hasMsg91AuthKey: Boolean(env.msg91AuthKey),
}

