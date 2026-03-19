'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SignIn, SignUp } from '@clerk/nextjs'

const clerkAppearance = {
  layout: {
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'blockButton',
    showOptionalCatchAllField: false,
  },
  elements: {
    rootBox: 'w-full max-w-none',
    card: 'shadow-none bg-[#070a1b] border border-slate-800 rounded-xl',
    cardBox: 'bg-transparent',
    headerTitle: 'text-white text-xl font-semibold',
    headerSubtitle: 'text-slate-300',
    socialButtonsBlockButton: 'bg-[#1e293b] border-slate-700 text-white hover:bg-slate-700',
    formFieldInput: 'bg-[#0f172a] border-slate-700 text-white',
    formFieldLabel: 'text-slate-200',
    formButtonPrimary: 'bg-[#00aeef] hover:bg-[#0099d6]',
    footerActionText: 'text-slate-300',
    footerActionLink: 'text-[#00aeef] hover:text-[#33c1f5]',
    identityPreview: 'bg-[#0f172a] border-slate-700 text-white',
    formFieldHintText: 'text-slate-400',
    footerPagesLink: 'text-slate-300',
  },
  variables: {
    colorBackground: '#070a1b',
    colorForeground: '#f8fafc',
    colorMutedForeground: '#cbd5e1',
    colorInput: '#0f172a',
    colorInputForeground: '#f8fafc',
    colorPrimary: '#00aeef',
    colorBorder: '#334155',
    borderRadius: '0.5rem',
  },
}

export default function AuthPage() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/auth' && typeof window !== 'undefined') {
      window.location.replace('/auth/sign-in')
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 rounded-2xl">
        {/* Left: Brand info (hidden on small screens) */}
        <div className="hidden md:flex flex-col justify-center px-10 bg-gradient-to-b from-[#050816] to-[#02010a] rounded-2xl border border-slate-900">
          <h1 className="text-3xl font-semibold mb-4 tracking-tight text-[#00aeef]">Noble Mirror Capital</h1>
          <p className="text-base text-slate-300 max-w-md leading-relaxed">
            Access secure copy trading, monitor performance in real time, and stay in full control of your capital from one dashboard.
          </p>
        </div>

        {/* Right: Clerk components only - no custom header/tabs */}
        <div className="clerk-auth-wrapper w-full flex items-center justify-center">
          <SignIn
            path="/auth/sign-in"
            signUpUrl="/auth/sign-up"
            routing="path"
            appearance={clerkAppearance}
            forceRedirectUrl="/onboarding"
          />
          <SignUp
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
            routing="path"
            appearance={clerkAppearance}
            forceRedirectUrl="/onboarding"
          />
        </div>
      </div>
    </div>
  )
}
