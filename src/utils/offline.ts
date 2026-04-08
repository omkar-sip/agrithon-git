// src/utils/offline.ts
// IndexedDB helpers using idb-keyval for local-first data storage
// Future: swap read paths to local ML module when available
import { get, set, del, keys, createStore } from 'idb-keyval'

// Named stores (namespaced to avoid key clashes)
const weatherStore  = createStore('sarpanch-weather',  'kv')
const marketStore   = createStore('sarpanch-market',   'kv')
const diaryStore    = createStore('sarpanch-diary',    'kv')
const alertStore    = createStore('sarpanch-alerts',   'kv')
const livestockStore = createStore('sarpanch-livestock', 'kv')
const poultryStore  = createStore('sarpanch-poultry',  'kv')
const pondStore     = createStore('sarpanch-pond',     'kv')
const planStore     = createStore('sarpanch-plan',     'kv')

// ─── Weather ────────────────────────────────────────────────────────────────
export const offlineWeather = {
  save: (data: unknown)    => set('current', data, weatherStore),
  load: ()                 => get('current', weatherStore),
  saveForecast: (d: unknown) => set('forecast', d, weatherStore),
  loadForecast: ()         => get('forecast', weatherStore),
}

// ─── Market Prices ───────────────────────────────────────────────────────────
export const offlineMarket = {
  save: (mandi: string, data: unknown) => set(mandi, data, marketStore),
  load: (mandi: string)                => get(mandi, marketStore),
}

// ─── Crop Diary (syncs to Firebase on reconnect) ────────────────────────────
export const offlineDiary = {
  save:    (farmerId: string, entry: unknown) => set(`${farmerId}:${Date.now()}`, entry, diaryStore),
  loadAll: async (farmerId: string) => {
    const allKeys = await keys(diaryStore)
    const myKeys  = (allKeys as string[]).filter(k => k.startsWith(farmerId))
    return Promise.all(myKeys.map(k => get(k, diaryStore)))
  },
  clear:   (key: string) => del(key, diaryStore),
}

// ─── Livestock Log ───────────────────────────────────────────────────────────
export const offlineLivestock = {
  save: (animalId: string, log: unknown) => set(animalId, log, livestockStore),
  load: (animalId: string)               => get(animalId, livestockStore),
}

// ─── Poultry Flock ───────────────────────────────────────────────────────────
export const offlinePoultry = {
  save: (batchId: string, data: unknown) => set(batchId, data, poultryStore),
  load: (batchId: string)                => get(batchId, poultryStore),
}

// ─── Pond Log ────────────────────────────────────────────────────────────────
export const offlinePond = {
  save: (pondId: string, log: unknown) => set(pondId, log, pondStore),
  load: (pondId: string)               => get(pondId, pondStore),
}

// ─── Alerts Queue ────────────────────────────────────────────────────────────
export const offlineAlerts = {
  save: (alertId: string, alert: unknown) => set(alertId, alert, alertStore),
  loadAll: async () => {
    const allKeys = await keys(alertStore) as string[]
    return Promise.all(allKeys.map(k => get(k, alertStore)))
  },
}

// ─── Today's Plan ────────────────────────────────────────────────────────────
export const offlinePlan = {
  save: (plan: unknown) => set('latest', plan, planStore),
  load: ()              => get('latest', planStore),
}

// ─── Pending sync queue (diary entries not yet pushed to Firebase) ───────────
const syncStore = createStore('sarpanch-sync', 'pending')
export const pendingSync = {
  add:    (id: string, entry: unknown) => set(id, entry, syncStore),
  getAll: async () => {
    const allKeys = await keys(syncStore) as string[]
    const pairs   = await Promise.all(allKeys.map(async k => ({ key: k, val: await get(k, syncStore) })))
    return pairs
  },
  remove: (id: string) => del(id, syncStore),
}
