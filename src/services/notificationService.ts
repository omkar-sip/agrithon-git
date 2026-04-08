import { getMessaging, getToken, isSupported, onMessage, type Messaging } from 'firebase/messaging'
import app from './firebase/firebaseConfig'
import { apiAvailability, env } from '../config/env'

export type NotificationType =
  | 'weather_alert'
  | 'price_spike'
  | 'price_crash'
  | 'disease_alert'
  | 'scheme_deadline'
  | 'advisory'
  | 'vaccination_due'
  | 'harvest_ready'

let foregroundUnsubscribe: (() => void) | null = null
let cachedToken: string | null = null

const hasNotificationSupport = () => typeof window !== 'undefined' && 'Notification' in window

const getMessagingClient = async (): Promise<Messaging | null> => {
  if (!apiAvailability.hasFirebaseConfig || !apiAvailability.hasFirebaseVapidKey) return null
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return null
  if (!(await isSupported())) return null
  return getMessaging(app)
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!hasNotificationSupport()) return false
  if (Notification.permission === 'granted') return true
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const showLocalNotification = (title: string, body: string, icon = '/favicon.svg') => {
  if (!hasNotificationSupport()) return
  if (Notification.permission !== 'granted') return
  new Notification(title, { body, icon, badge: icon })
}

export const initFCM = async (): Promise<string | null> => {
  const messaging = await getMessagingClient()
  if (!messaging) {
    console.info('[FCM] Missing support or configuration. Check Firebase + VAPID env keys.')
    return null
  }

  const hasPermission = await requestNotificationPermission()
  if (!hasPermission) return null

  const registration = await navigator.serviceWorker.ready
  const token = await getToken(messaging, {
    vapidKey: env.firebaseVapidKey,
    serviceWorkerRegistration: registration,
  })

  cachedToken = token || null

  if (!foregroundUnsubscribe) {
    foregroundUnsubscribe = onMessage(messaging, payload => {
      const title = payload.notification?.title || 'New farm alert'
      const body = payload.notification?.body || 'Check your latest advisory.'
      showLocalNotification(title, body)
    })
  }

  return cachedToken
}

export const getCachedFcmToken = () => cachedToken

