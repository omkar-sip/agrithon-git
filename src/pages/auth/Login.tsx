// src/pages/auth/Login.tsx — v3 Phone-first, orange theme, farmer illustration
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, ChevronLeft, AlertCircle, Mic } from 'lucide-react'
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth, googleProvider } from '../../services/firebase/firebaseConfig'
import { apiAvailability } from '../../config/env'
import {
  createUserProfilePayload,
  saveFarmerProfile,
} from '../../services/firebase/firestoreService'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanguageStore } from '../../store/useLanguageStore'
import toast from 'react-hot-toast'

type Screen = 'main' | 'email' | 'phone' | 'otp'
type EmailMode = 'signin' | 'signup'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
)

let confirmationResult: ConfirmationResult | null = null

export default function Login() {
  const navigate = useNavigate()
  const { setAuthenticated, setGuest } = useAuthStore()

  const [screen, setScreen] = useState<Screen>('main')
  const [emailMode, setEmailMode] = useState<EmailMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const clearError = () => setError('')

  const persistUserRecord = async (params: {
    uid: string
    name: string
    email?: string
    phone?: string
    photoURL?: string
    provider: 'google' | 'email' | 'phone'
  }) => {
    if (!apiAvailability.hasFirebaseConfig) return

    await saveFarmerProfile(
      params.uid,
      createUserProfilePayload(
        {
          uid: params.uid,
          name: params.name,
          email: params.email,
          phone: params.phone,
          photoURL: params.photoURL,
          language: useLanguageStore.getState().language,
        },
        { provider: params.provider, isProfileComplete: false }
      )
    )
  }

  const handleFacebook = async () => {
    setLoading(true); clearError()
    setTimeout(() => {
      setAuthenticated({
        uid: 'fbid_demo_' + Math.floor(Math.random() * 10000),
        name: 'Facebook Farmer',
        provider: 'google',
      })
      toast.success('Welcome, Facebook Farmer!')
      setLoading(false)
      navigate('/profile')
    }, 1000)
  }

  const handleGoogle = async () => {
    setLoading(true); clearError()
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      await persistUserRecord({
        uid: user.uid,
        name: user.displayName || 'Farmer',
        email: user.email || undefined,
        photoURL: user.photoURL || undefined,
        provider: 'google',
      })
      setAuthenticated({
        uid: user.uid,
        name: user.displayName || 'Farmer',
        email: user.email || undefined,
        photoURL: user.photoURL || undefined,
        provider: 'google',
      })
      toast.success(`Welcome, ${user.displayName?.split(' ')[0] || 'Farmer'}!`)
      navigate('/profile')
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.')
      }
    } finally { setLoading(false) }
  }

  const handleEmail = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); clearError()
    try {
      let user
      if (emailMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        user = cred.user
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        user = cred.user
      }
      await persistUserRecord({
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || undefined,
        provider: 'email',
      })
      setAuthenticated({
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || undefined,
        provider: 'email',
      })
      toast.success('Login successful!')
      navigate('/profile')
    } catch (e: any) {
      const msg: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account already exists.',
        'auth/invalid-email': 'Please enter a valid email.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      }
      setError(msg[e.code] || 'Authentication failed.')
    } finally { setLoading(false) }
  }

  const handleSendOtp = async () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit number'); return }
    setLoading(true); clearError()
    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
      confirmationResult = await signInWithPhoneNumber(auth, `+91${phone}`, recaptcha)
      setScreen('otp')
      toast.success(`OTP sent to +91 ${phone}`)
    } catch { setError('Failed to send OTP.') }
    finally { setLoading(false) }
  }

  const handleVerifyOtp = async () => {
    if (!confirmationResult || otp.length < 6) return
    setLoading(true); clearError()
    try {
      const result = await confirmationResult.confirm(otp)
      await persistUserRecord({
        uid: result.user.uid,
        name: 'Farmer',
        phone,
        provider: 'phone',
      })
      setAuthenticated({ uid: result.user.uid, name: 'Farmer', phone, provider: 'phone' })
      toast.success('Phone verified!')
      navigate('/profile')
    } catch { setError('Incorrect OTP.') }
    finally { setLoading(false) }
  }

  return (
    <div className="page-root bg-white">
      <div id="recaptcha-container" />

      <AnimatePresence mode="wait">

        {/* ── Main Screen — Phone-first ──────────────────────────── */}
        {screen === 'main' && (
          <motion.div key="main"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-y-auto no-scrollbar"
          >
            {/* Back button */}
            <div className="px-4 pt-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                <ChevronLeft size={20} className="text-neutral-600" />
              </button>
            </div>

            {/* Illustration */}
            <div className="flex justify-center py-6">
              <img
                src="/farmer-illustration.png"
                alt="Farmer"
                className="w-52 h-52 object-contain"
              />
            </div>

            {/* Content */}
            <div className="px-6 flex-1 flex flex-col">
              <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Login/Sign Up
              </h1>
              <p className="text-sm text-neutral-500 mt-1 mb-6">
                Enter your mobile number to receive a 6-digit code
              </p>

              {/* Phone Input */}
              <div>
                <p className="text-xs font-semibold text-neutral-600 mb-1.5">Phone Number</p>
                <div className="flex gap-2">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 flex items-center gap-1.5 text-sm font-medium text-neutral-700 shrink-0">
                    🇮🇳 <span className="text-neutral-400">▾</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); clearError() }}
                      placeholder="9988776655"
                      className="input pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center min-h-fit">
                      <Mic size={12} className="text-neutral-500" />
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2.5 mt-3">
                  <AlertCircle size={14} className="text-danger-500 shrink-0" />
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length < 10}
                className="btn-brand mt-5"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Continue'}
              </button>

              {/* Or continue with */}
              <div className="divider my-6">
                <span className="text-neutral-400 text-xs">Or Continue With</span>
              </div>

              {/* Social buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleFacebook}
                  disabled={loading}
                  className="w-14 h-14 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors active:scale-95"
                >
                  <FacebookIcon />
                </button>
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-14 h-14 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors active:scale-95"
                >
                  <GoogleIcon />
                </button>
                <button
                  disabled={loading}
                  className="w-14 h-14 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors active:scale-95"
                  onClick={() => { setScreen('email'); clearError() }}
                >
                  <AppleIcon />
                </button>
              </div>

              {/* Guest */}
              <button
                onClick={() => { setGuest(); navigate('/') }}
                className="text-sm text-neutral-400 text-center hover:text-neutral-600 transition-colors mb-4"
              >
                Explore without signing in →
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Email form ──────────────────────────────────────────── */}
        {screen === 'email' && (
          <motion.div key="email"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col px-6 pt-6 overflow-y-auto no-scrollbar"
          >
            <button onClick={() => { setScreen('main'); clearError() }}
              className="flex items-center gap-1 text-sm text-neutral-500 mb-6 btn-ghost min-h-fit px-0 py-1 w-fit">
              <ChevronLeft size={16} /> Back
            </button>

            <div className="flex bg-neutral-100 rounded-xl p-1 mb-5">
              {(['signin', 'signup'] as EmailMode[]).map(m => (
                <button key={m} onClick={() => { setEmailMode(m); clearError() }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${emailMode === m ? 'bg-white text-neutral-900 shadow-card' : 'text-neutral-500'}`}>
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="input-label">Email address</label>
                <input type="email" autoComplete="email"
                  value={email} onChange={e => { setEmail(e.target.value); clearError() }}
                  placeholder="you@example.com" className="input" />
              </div>
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'}
                    value={password} onChange={e => { setPassword(e.target.value); clearError() }}
                    placeholder={emailMode === 'signup' ? 'Min. 6 characters' : 'Enter password'}
                    className="input pr-12" />
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 p-1 min-h-fit">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2.5 mt-4">
                <AlertCircle size={14} className="text-danger-500 shrink-0" />
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            <button onClick={handleEmail} disabled={loading} className="btn-brand mt-6">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (<>{emailMode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>)}
            </button>
          </motion.div>
        )}

        {/* ── OTP Screen ──────────────────────────────────────────── */}
        {screen === 'otp' && (
          <motion.div key="otp"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col px-6 pt-6 overflow-y-auto no-scrollbar"
          >
            <button onClick={() => { setScreen('main'); clearError() }}
              className="flex items-center gap-1 text-sm text-neutral-500 mb-6 btn-ghost min-h-fit px-0 py-1 w-fit">
              <ChevronLeft size={16} /> Change Number
            </button>

            <h2 className="text-xl font-bold text-neutral-900 mb-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
              Enter the OTP
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Sent to <span className="font-semibold text-neutral-700">+91 {phone}</span>
            </p>

            <input type="tel" inputMode="numeric" maxLength={6}
              value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); clearError() }}
              placeholder="6-digit OTP"
              className="input text-center text-2xl font-mono tracking-[0.5em]" />

            {error && (
              <div className="flex items-center gap-2 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2.5 mt-4">
                <AlertCircle size={14} className="text-danger-500 shrink-0" />
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6} className="btn-brand mt-6">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Verify & Continue'}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
