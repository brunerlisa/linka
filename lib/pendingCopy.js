const KEY = 'nmc_pending_copy'

export function rememberPendingCopy(trader) {
  if (typeof window === 'undefined' || !trader) return
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        id: trader.id || '',
        name: trader.name || '',
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
