// src/services/notificationService.ts — FCM Push Notifications stub
// Full implementation requires Firebase Cloud Messaging setup in vite.config + service worker

export type NotificationType =
  | 'weather_alert'
  | 'price_spike'
  | 'price_crash'
  | 'disease_alert'
  | 'scheme_deadline'
  | 'advisory'
  | 'vaccination_due'
  | 'harvest_ready'

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const showLocalNotification = (title: string, body: string, icon = '/icons/icon-192.png') => {
  if (Notification.permission !== 'granted') return
  new Notification(title, { body, icon, badge: icon })
}

// TODO: Initialize FCM with VITE_FIREBASE_VAPID_KEY for web push
export const initFCM = async () => {
  console.info('[FCM] Initialize with VITE_FIREBASE_VAPID_KEY when ready')
}
