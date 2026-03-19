'use client'
import { useState } from 'react'

// Fallback avatar provider when no explicit photo URL is provided.
const AVATAR_BASE = 'https://api.dicebear.com/7.x/lorelei/svg?seed='

/**
 * Avatar: supports direct photo URL. Falls back to generated face/initials.
 */
export default function Avatar({ seed, name, src, className = 'w-10 h-10 rounded-full object-cover' }) {
  const [failed, setFailed] = useState(false)
  const s = seed || name || 'user'
  const initials = (name || s).toString().split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase()

  if (failed) {
    return (
      <div className={`rounded-full bg-primary/30 flex items-center justify-center text-primary text-sm font-bold shrink-0 ${className}`}>
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src || `${AVATAR_BASE}${encodeURIComponent(s)}`}
      alt={name ? `${name} avatar` : 'Avatar'}
      className={`rounded-full object-cover shrink-0 ${className}`}
      onError={() => setFailed(true)}
    />
  )
}

/** Initials only - no network, for ticker or when avatars are disabled */
export function InitialsAvatar({ name, className = 'w-10 h-10' }) {
  const initials = (name || 'U').split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className={`rounded-full bg-primary/30 flex items-center justify-center text-primary text-sm font-bold shrink-0 ${className}`}>
      {initials}
    </div>
  )
}
