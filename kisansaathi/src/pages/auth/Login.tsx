// src/pages/auth/Login.tsx — Google + Email + Phone OTP
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Eye, EyeOff, ArrowRight, ChevronLeft, AlertCircle } from 'lucide-react'
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth, googleProvider } from '../../services/firebase/firebaseConfig'
import { useAuthStore } from '../../store/useAuthStore'
import toast from 'react-hot-toast'

type Screen = 'main' | 'email' | 'phone' | 'otp'
type EmailMode = 'signin' | 'signup'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

let confirmationResult: ConfirmationResult | null = null

export default function Login() {
  const navigate = useNavigate()
  const { setAuthenticated, setGuest } = useAuthStore()

  const [screen, setScreen]       = useState<Screen>('main')
  const [emailMode, setEmailMode] = useState<EmailMode>('signin')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [phone, setPhone]         = useState('')
  const [otp, setOtp]             = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const clearError = () => setError('')

  // ── Google Sign-In ────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true); clearError()
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      setAuthenticated({
        uid:      user.uid,
        name:     user.displayName || 'Farmer',
        email:    user.email || undefined,
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

  // ── Email Sign-In / Sign-Up ───────────────────────────────────────
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
      setAuthenticated({
        uid:   user.uid,
        name:  user.displayName || email.split('@')[0],
        email: user.email || undefined,
        provider: 'email',
      })
      toast.success('Login successful!')
      navigate('/profile')
    } catch (e: any) {
      const msg: Record<string, string> = {
        'auth/user-not-found':      'No account found with this email.',
        'auth/wrong-password':      'Incorrect password.',
        'auth/email-already-in-use':'An account with this email already exists.',
        'auth/invalid-email':       'Please enter a valid email address.',
        'auth/too-many-requests':   'Too many attempts. Please try again later.',
      }
      setError(msg[e.code] || 'Authentication failed. Please try again.')
    } finally { setLoading(false) }
  }

  // ── Phone OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit number'); return }
    setLoading(true); clearError()
    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
      confirmationResult = await signInWithPhoneNumber(auth, `+91${phone}`, recaptcha)
      setScreen('otp')
      toast.success(`OTP sent to +91 ${phone}`)
    } catch { setError('Failed to send OTP. Check the number and try again.') }
    finally { setLoading(false) }
  }

  const handleVerifyOtp = async () => {
    if (!confirmationResult || otp.length < 6) return
    setLoading(true); clearError()
    try {
      const result = await confirmationResult.confirm(otp)
      const user = result.user
      setAuthenticated({ uid: user.uid, name: 'Farmer', phone, provider: 'phone' })
      toast.success('Phone verified!')
      navigate('/profile')
    } catch { setError('Incorrect OTP. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-forest-900 flex flex-col">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <div className="relative pt-16 pb-8 px-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-5xl mb-3 select-none">🌾</div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
            Sarpanch AI
          </h1>
          <p className="text-forest-300 text-sm mt-1">Your Personal Farming Advisor</p>
        </motion.div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-6 pb-8 shadow-modal">
        <div id="recaptcha-container" />

        <AnimatePresence mode="wait">

          {/* ── Main auth options ──────────────────────────────── */}
          {screen === 'main' && (
            <motion.div key="main"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Sign in to your account
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                New to Sarpanch AI? We'll create your account automatically.
              </p>

              <div className="space-y-3">
                {/* Google */}
                <button id="google-signin-btn" onClick={handleGoogle} disabled={loading}
                  className="btn-google">
                  <GoogleIcon />
                  <span className="font-semibold">Continue with Google</span>
                </button>

                {/* Email */}
                <button id="email-signin-btn" onClick={() => { setScreen('email'); clearError() }}
                  className="btn btn-secondary w-full">
                  <Mail size={16} className="text-neutral-500" />
                  <span>Continue with Email</span>
                </button>

                {/* Phone */}
                <button id="phone-signin-btn" onClick={() => { setScreen('phone'); clearError() }}
                  className="btn btn-secondary w-full">
                  <Phone size={16} className="text-neutral-500" />
                  <span>Continue with Mobile OTP</span>
                </button>
              </div>

              <div className="divider my-5"><span>or</span></div>

              <button id="guest-btn" onClick={() => { setGuest(); navigate('/') }}
                className="btn-ghost w-full text-neutral-400 text-sm">
                Explore without signing in →
              </button>

              <p className="text-center text-xs text-neutral-400 mt-6 leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          )}

          {/* ── Email form ─────────────────────────────────────── */}
          {screen === 'email' && (
            <motion.div key="email"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
            >
              <button onClick={() => { setScreen('main'); clearError() }}
                className="flex items-center gap-1 text-sm text-neutral-500 mb-4 -ml-1 btn-ghost min-h-fit px-2 py-1">
                <ChevronLeft size={16} /> Back
              </button>

              {/* Tabs */}
              <div className="flex bg-neutral-100 rounded-xl p-1 mb-5">
                {(['signin', 'signup'] as EmailMode[]).map(m => (
                  <button key={m} onClick={() => { setEmailMode(m); clearError() }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      emailMode === m ? 'bg-white text-neutral-900 shadow-card' : 'text-neutral-500'
                    }`}>
                    {m === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="input-label">Email address</label>
                  <input id="email-input" type="email" autoComplete="email"
                    value={email} onChange={e => { setEmail(e.target.value); clearError() }}
                    placeholder="you@example.com" className="input" />
                </div>
                <div>
                  <label className="input-label">Password</label>
                  <div className="relative">
                    <input id="password-input" type={showPwd ? 'text' : 'password'}
                      autoComplete={emailMode === 'signup' ? 'new-password' : 'current-password'}
                      value={password} onChange={e => { setPassword(e.target.value); clearError() }}
                      placeholder={emailMode === 'signup' ? 'Min. 6 characters' : 'Enter password'}
                      className="input pr-12" />
                    <button type="button" onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 p-1 min-h-fit">
                      {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
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

              <button id="email-submit-btn" onClick={handleEmail} disabled={loading}
                className="btn-primary w-full mt-5">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{emailMode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={16}/></>
                )}
              </button>
            </motion.div>
          )}

          {/* ── Phone form ─────────────────────────────────────── */}
          {screen === 'phone' && (
            <motion.div key="phone"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
            >
              <button onClick={() => { setScreen('main'); clearError() }}
                className="flex items-center gap-1 text-sm text-neutral-500 mb-4 -ml-1 btn-ghost min-h-fit px-2 py-1">
                <ChevronLeft size={16} /> Back
              </button>
              <h2 className="text-xl font-bold text-neutral-900 mb-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Enter your mobile number
              </h2>
              <p className="text-sm text-neutral-500 mb-5">We'll send a 6-digit OTP to verify</p>

              <div className="flex gap-2">
                <div className="bg-neutral-100 rounded-xl px-3 flex items-center text-neutral-600 font-mono text-base shrink-0 min-h-[48px] border border-neutral-200">
                  🇮🇳 +91
                </div>
                <input id="phone-input" type="tel" inputMode="numeric" maxLength={10}
                  value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); clearError() }}
                  placeholder="10-digit mobile number" className="input flex-1" />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2.5 mt-4">
                  <AlertCircle size={14} className="text-danger-500 shrink-0" />
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              )}

              <button id="send-otp-btn" onClick={handleSendOtp}
                disabled={loading || phone.length < 10} className="btn-primary w-full mt-5">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>Send OTP <ArrowRight size={16}/></>}
              </button>
            </motion.div>
          )}

          {/* ── OTP Verify ─────────────────────────────────────── */}
          {screen === 'otp' && (
            <motion.div key="otp"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
            >
              <button onClick={() => { setScreen('phone'); clearError() }}
                className="flex items-center gap-1 text-sm text-neutral-500 mb-4 -ml-1 btn-ghost min-h-fit px-2 py-1">
                <ChevronLeft size={16} /> Change Number
              </button>
              <h2 className="text-xl font-bold text-neutral-900 mb-1" style={{ fontFamily: 'Baloo 2, sans-serif' }}>
                Enter the OTP
              </h2>
              <p className="text-sm text-neutral-500 mb-5">
                Sent to <span className="font-semibold text-neutral-700">+91 {phone}</span>
              </p>

              <input id="otp-input" type="tel" inputMode="numeric" maxLength={6}
                value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); clearError() }}
                placeholder="6-digit OTP"
                className="input text-center text-2xl font-mono tracking-[0.5em]" />

              {error && (
                <div className="flex items-center gap-2 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2.5 mt-4">
                  <AlertCircle size={14} className="text-danger-500 shrink-0" />
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              )}

              <button id="verify-otp-btn" onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6} className="btn-primary w-full mt-5">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Verify & Continue'}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
