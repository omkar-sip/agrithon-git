// src/services/firebase/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { apiAvailability, env } from '../../config/env'

const firebaseConfig = {
  apiKey:            env.firebaseApiKey,
  authDomain:        env.firebaseAuthDomain,
  projectId:         env.firebaseProjectId,
  storageBucket:     env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId:             env.firebaseAppId,
  measurementId:     env.firebaseMeasurementId,
}

if (!apiAvailability.hasFirebaseConfig) {
  console.warn('[Firebase] Missing Firebase env keys. Auth/Firestore/Storage may not work.')
}

// Singleton pattern — prevents HMR re-initialization
const app  = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const storage  = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

// Request profile + email scopes
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({ prompt: 'select_account' })

export default app
