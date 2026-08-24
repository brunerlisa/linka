const KEY = 'nmc_pending_copy'

export function rememberPendingCopy(trader, balance = 0) {
  if (typeof window === 'undefined' || !trader) return
  const minCapital = Number(trader.min_capital || 0)
  const needed = Math.max(50, Math.ceil(Math.max(0, minCapital - Number(balance || 0))))
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        id: trader.id || '',
        name: trader.name || '',
        min_capital: minCapital,
        needed,
      })
    )
  } catch {
    // ignore
  }
}

export function readPendingCopy() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function clearPendingCopy() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
