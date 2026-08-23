'use client'

import { useState } from 'react'

function EyeIcon({ hidden }) {
  if (hidden) {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-4.8M9.9 5.2A10.8 10.8 0 0112 5c5.4 0 9.5 3.8 10.7 7-.4 1.1-1.1 2.2-2 3.2M6.1 6.1C4.3 7.3 2.9 8.9 2 12c1.2 3.2 5.3 7 10 7 1.5 0 2.9-.3 4.2-.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export default function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((open) => !open)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-md text-slate-400 hover:text-white"
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        <EyeIcon hidden={visible} />
      </button>
    </div>
  )
}
