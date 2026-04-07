// src/services/firebase/authService.ts
// Firebase Phone OTP authentication service
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth } from './firebaseConfig'

let confirmationResult: ConfirmationResult | null = null
let recaptchaVerifier: RecaptchaVerifier | null = null

// Initialize invisible reCAPTCHA (must be called after DOM is ready)
export const initRecaptcha = (containerId: string = 'recaptcha-container') => {
  if (recaptchaVerifier) return recaptchaVerifier
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => { /* reCAPTCHA solved */ },
  })
  return recaptchaVerifier
}

// Send OTP to phone number (format: +91XXXXXXXXXX)
export const sendOTP = async (phoneNumber: string): Promise<void> => {
  const verifier = initRecaptcha()
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`
  confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier)
}

// Verify OTP and sign in
export const verifyOTP = async (otp: string) => {
  if (!confirmationResult) throw new Error('No OTP sent — call sendOTP first')
  const result = await confirmationResult.confirm(otp)
  return result.user
}

// Sign out
export const signOut = () => auth.signOut()

// Get current user
export const getCurrentUser = () => auth.currentUser

// Listen to auth state changes
export const onAuthChange = (callback: (user: any) => void) =>
  auth.onAuthStateChanged(callback)
