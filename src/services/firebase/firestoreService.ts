// src/services/firebase/firestoreService.ts
import {
  doc, getDoc, setDoc, collection,
  addDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, Timestamp,
  type DocumentData
} from 'firebase/firestore'
import { db } from './firebaseConfig'

// ─── Farmer Profile ────────────────────────────────────────────────────────
export const getFarmerProfile = async (userId: string) => {
  const ref = doc(db, 'users', userId)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export const saveFarmerProfile = async (userId: string, data: DocumentData) => {
  const ref = doc(db, 'users', userId)
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

// ─── Farm Diary (Offline-First: synced from IndexedDB) ─────────────────────
export const syncDiaryEntry = async (farmerId: string, entry: DocumentData) => {
  const col = collection(db, 'diary')
  return addDoc(col, { farmerId, ...entry, syncedAt: serverTimestamp() })
}

// ─── Community Reports (pest/disease spots) ────────────────────────────────
export const addCommunityReport = async (report: DocumentData) => {
  return addDoc(collection(db, 'community'), { ...report, createdAt: serverTimestamp() })
}

export const subscribeToNearbyReports = (
  district: string,
  callback: (reports: DocumentData[]) => void
) => {
  const q = query(
    collection(db, 'community'),
    where('district', '==', district),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ─── Alerts Queue ───────────────────────────────────────────────────────────
export const saveAlert = async (userId: string, alert: DocumentData) => {
  return addDoc(collection(db, 'alerts'), { userId, ...alert, createdAt: serverTimestamp() })
}

export { Timestamp }
