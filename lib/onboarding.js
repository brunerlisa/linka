'use client'

export function onboardingStorageKey(user) {
  return `onboarding:${user?.email || user?.id || 'guest'}`
}

export function onboardingSessionKey(user) {
  return `onboarding:in-progress:${onboardingStorageKey(user)}`
}

export function readLocalOnboarded(user) {
  try {
    const saved = localStorage.getItem(onboardingStorageKey(user))
    const parsed = saved ? JSON.parse(saved) : null
    return Boolean(parsed?.has_onboarded)
  } catch {
    return false
  }
}

export function writeLocalOnboarded(user, extra = {}) {
  if (!user) return
  localStorage.setItem(
    onboardingStorageKey(user),
    JSON.stringify({
      user_id: user.id,
      email: user.email,
      has_onboarded: true,
      updated_at: new Date().toISOString(),
      ...extra,
    })
  )
}

export function isOnboardingInProgress(user) {
  try {
    return sessionStorage.getItem(onboardingSessionKey(user)) === '1'
  } catch {
    return false
  }
}

export function markOnboardingInProgress(user) {
  try {
    sessionStorage.setItem(onboardingSessionKey(user), '1')
  } catch {
    // Private mode or blocked storage should not block the first-time flow.
  }
}

export function clearOnboardingInProgress(user) {
  try {
    sessionStorage.removeItem(onboardingSessionKey(user))
  } catch {
    // Ignore storage errors on completion.
  }
}

export function investorTypeFromGoal(investmentGoal) {
  if (investmentGoal === 'Balanced growth') return 'Balanced Growth Investor'
  if (investmentGoal === 'Slow and steady growth') return 'Conservative Growth Investor'
  if (investmentGoal === 'High risk / high return') return 'Aggressive Growth Investor'
  return 'Opportunistic Trader'
}

export function riskLevelFromGoal(investmentGoal) {
  if (investmentGoal === 'Slow and steady growth') return 'Low'
  if (investmentGoal === 'High risk / high return' || investmentGoal === 'Short-term profit') return 'High'
  return 'Medium'
}

export function isExistingAccount(profile, maxAgeMs = 30 * 60 * 1000) {
  if (!profile?.created_at) return false
  const created = Date.parse(profile.created_at)
  if (Number.isNaN(created)) return false
  return Date.now() - created > maxAgeMs
}
