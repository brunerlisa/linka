'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import ProtectedRoute from '@/components/ProtectedRoute'
import { syncProfile, getMyProfile } from '@/lib/tradingAdminApi'
import { LanguageSwitcher } from '@/components/SiteTranslator'
import {
  clearOnboardingInProgress,
  investorTypeFromGoal,
  isOnboardingInProgress,
  markOnboardingInProgress,
  readLocalOnboarded,
  riskLevelFromGoal,
  writeLocalOnboarded,
} from '@/lib/onboarding'

const TOTAL_STEPS = 5
const LAST_STEP = TOTAL_STEPS - 1

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Belgium','Brazil','Canada','China','Colombia','Egypt','France','Germany','India','Indonesia','Ireland','Italy','Japan','Kenya','Malaysia','Mexico','Netherlands','Nigeria','Pakistan','Philippines','Poland','Russia','Saudi Arabia','South Africa','South Korea','Spain','Turkey','Uganda','United Kingdom','United States','Vietnam','Zimbabwe','Other',
]

function persistSeen(user, extra = {}) {
  writeLocalOnboarded(user, extra)
  return syncProfile({
    email: user.email,
    full_name: user.fullName || '',
    has_onboarded: true,
    ...(extra.onboarding_json ? { onboarding_json: extra.onboarding_json } : {}),
  })
}

function OnboardingContent() {
  const { user, markOnboarded } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [userIntent, setUserIntent] = useState('')
  const [tradingExperience, setTradingExperience] = useState('')
  const [investmentGoal, setInvestmentGoal] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [country, setCountry] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!user) return
    let mounted = true

    async function check() {
      const inProgress = isOnboardingInProgress(user)
      const locallyDone = readLocalOnboarded(user)

      if (inProgress) {
        if (mounted) setChecking(false)
        return
      }

      if (user.hasOnboarded || locallyDone) {
        router.replace('/dashboard')
        return
      }

      try {
        const profile = await getMyProfile()
        if (mounted && !inProgress && profile?.has_onboarded) {
          writeLocalOnboarded(user)
          markOnboarded()
          router.replace('/dashboard')
          return
        }
      } catch {
        if (mounted && !inProgress && locallyDone) {
          router.replace('/dashboard')
          return
        }
      }

      // First visit this session: remember it so a later login never repeats onboarding.
      markOnboardingInProgress(user)
      markOnboarded()
      writeLocalOnboarded(user)
      persistSeen(user).catch(() => {})
      if (mounted) setChecking(false)
    }

    check()
    return () => { mounted = false }
  }, [user, router, markOnboarded])

  if (!user) return null
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    )
  }

  const canGoBack = step > 0 && !showSummary
  const currentAnswer = () => {
    switch (step) {
      case 0: return userIntent
      case 1: return tradingExperience
      case 2: return investmentGoal
      case 3: return investmentAmount
      case 4: return country && agreed
      default: return true
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user || !currentAnswer()) return
    if (step < LAST_STEP) {
      setStep((p) => p + 1)
      return
    }

    setLoading(true)
    const answers = { userIntent, tradingExperience, investmentGoal, investmentAmount, country }
    const investorType = investorTypeFromGoal(investmentGoal)
    const riskLevel = riskLevelFromGoal(investmentGoal)
    const profileSummary = { investorType, riskLevel, goal: userIntent, investmentAmount }
    const mainGoalSummary = JSON.stringify({ answers, profileSummary, completedAt: new Date().toISOString() })

    try {
      await persistSeen(user, { comfort_level: riskLevel, main_goal: mainGoalSummary, onboarding_json: mainGoalSummary })
    } catch {
      writeLocalOnboarded(user, { comfort_level: riskLevel, main_goal: mainGoalSummary })
    }

    markOnboarded()
    clearOnboardingInProgress(user)
    setLoading(false)
    setShowSummary(true)
  }

  if (showSummary) {
    const investorType = investorTypeFromGoal(investmentGoal)
    const riskLevel = riskLevelFromGoal(investmentGoal)
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#050816] text-white px-4">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-xl bg-[#070a1b] rounded-xl p-8 shadow-xl space-y-5">
          <h2 className="text-2xl font-semibold">Your investor profile</h2>
          <p className="text-sm text-slate-300">Here&apos;s how we&apos;ll tailor Noble Mirror Capital for you based on your answers.</p>
          <div className="rounded-lg border border-slate-800 bg-[#050816] p-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Investor type</span><span className="font-medium text-slate-100">{investorType}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Risk level</span><span className="font-medium text-slate-100">{riskLevel}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Planned copy-trading amount</span><span className="font-medium text-slate-100">{investmentAmount || '—'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Main reason you joined</span><span className="font-medium text-slate-100">{userIntent}</span></div>
          </div>
          <p className="text-sm text-slate-300">You&apos;re all set - enter the dashboard to copy your trader and start making money on Noble Mirror Capital.</p>
          <button type="button" onClick={() => router.replace('/dashboard')} className="w-full mt-2 py-2.5 rounded-md bg-primary hover:bg-primary-dark text-sm font-semibold">Finish &amp; go to dashboard</button>
        </div>
      </div>
    )
  }

  const renderCardOptions = (options, value, onChange) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      {options.map((label) => (
        <button key={label} type="button" onClick={() => onChange(label)} className={`text-left rounded-lg border px-4 py-3 transition-colors ${value === label ? 'border-primary bg-[#111827]' : 'border-slate-700 bg-[#050816] hover:bg-[#0b1020]'}`}>
          {label}
        </button>
      ))}
    </div>
  )

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050816] text-white px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-xl bg-[#070a1b] rounded-xl p-8 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">Step {step + 1} of {TOTAL_STEPS}</p>
        <h2 className="text-2xl font-semibold mb-2">Let&apos;s set up your copy trading profile</h2>
        <p className="text-sm text-gray-300 mb-6">Answer a few quick questions so we can match you with traders and strategies that fit you.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">What brings you to copy trading today?</p>
              {renderCardOptions(['I want to earn passive income','I want to learn trading from professionals',"I don't have time to trade myself",'I want to diversify my investments',"I'm curious and exploring"], userIntent, setUserIntent)}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">How familiar are you with trading?</p>
              {renderCardOptions(["I'm completely new","I've watched trading but never traded","I've traded a little","I'm an experienced trader"], tradingExperience, setTradingExperience)}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">What is your main investment goal?</p>
              {renderCardOptions(['Slow and steady growth', 'Balanced growth', 'High risk / high return', 'Short-term profit'], investmentGoal, setInvestmentGoal)}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">How much do you plan to start copy trading with?</p>
              {renderCardOptions(['$100 – $500','$500 – $2,000','$2,000 – $10,000','$10,000 – $50,000','$50,000 – $100,000+'], investmentAmount, setInvestmentAmount)}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Country of residence</p>
                <select className="w-full rounded-md bg-[#050816] border border-gray-700 px-3 py-2 text-sm" value={country} onChange={(e) => setCountry(e.target.value)} required>
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="mt-2 space-y-2 border-t border-gray-800 pt-3">
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-600 bg-[#050816]" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
                  <span>I understand and agree.</span>
                </label>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button type="button" disabled={!canGoBack} onClick={() => canGoBack && setStep((p) => p - 1)} className={`px-4 py-2 rounded-md text-xs font-medium border ${canGoBack ? 'border-gray-700 text-slate-200 hover:bg-[#111827]' : 'border-gray-800 text-slate-500 cursor-default'}`}>Back</button>
            <button type="submit" disabled={loading || (step === LAST_STEP && (!country || !agreed))} className="px-6 py-2 rounded-md bg-primary hover:bg-primary-dark text-xs font-semibold disabled:opacity-70">{loading ? 'Saving…' : step === LAST_STEP ? 'Finish' : 'Next'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Onboarding() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  )
}
