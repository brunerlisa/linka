import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/react'

const clerkAppearance = {
  elements: {
    card: 'shadow-none bg-[#070a1b] border border-slate-800',
    headerTitle: 'text-white',
    headerSubtitle: 'text-slate-300',
    socialButtonsBlockButton: 'bg-[#050816] border-slate-700 text-white',
    formFieldInput: 'bg-[#050816] border-slate-700 text-white',
    formButtonPrimary: 'bg-[#4f46e5] hover:bg-[#4338ca]',
    footerActionText: 'text-slate-300',
    footerActionLink: 'text-primary hover:text-primary-light',
  },
}

export default function Auth() {
  const location = useLocation()
  const [mode, setMode] = useState('signin')

  useEffect(() => {
    const qsMode = new URLSearchParams(location.search).get('mode')
    if (qsMode === 'signup' || qsMode === 'signin') {
      setMode(qsMode)
    }
  }, [location.search])

  const title = useMemo(() => (mode === 'signup' ? 'Create your account' : 'Welcome back'), [mode])

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 rounded-2xl">
        <div className="hidden md:flex flex-col justify-center px-10 bg-gradient-to-b from-[#050816] to-[#02010a] rounded-2xl border border-slate-900">
          <p className="text-sm text-slate-400 mb-1">www.noblemirrorcapital.com</p>
          <h1 className="text-3xl font-semibold mb-4 tracking-tight text-primary">Noble Mirror Capital</h1>
          <p className="text-base text-slate-300 max-w-md leading-relaxed">
            Access secure copy trading, monitor performance in real time, and stay in full control of your capital from one dashboard.
          </p>
        </div>

        <div className="w-full bg-[#070a1b] px-6 py-6 md:px-10 md:py-10 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex rounded-lg border border-slate-700 overflow-hidden text-sm">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`px-3 py-1.5 ${mode === 'signin' ? 'bg-primary text-white' : 'text-slate-300'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3 py-1.5 ${mode === 'signup' ? 'bg-primary text-white' : 'text-slate-300'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {mode === 'signin' ? (
            <SignIn appearance={clerkAppearance} signUpUrl="/auth?mode=signup" />
          ) : (
            <SignUp appearance={clerkAppearance} signInUrl="/auth?mode=signin" />
          )}
        </div>
      </div>
    </div>
  )
}

