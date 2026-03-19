'use client'

/** Fetch API. Cookies (Clerk session) sent automatically for same-origin. Use from client components. */
export function useApiFetch() {
  async function apiFetch(path, options = {}) {
    const url = path.startsWith('http') ? path : path
    const headers = { 'Content-Type': 'application/json', ...options.headers }
    const res = await fetch(url, { ...options, headers, credentials: 'include' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || res.statusText || 'Request failed')
    }
    return res.json()
  }
  return apiFetch
}
