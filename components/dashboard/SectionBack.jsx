'use client'

export default function SectionBack({ onClick }) {
  if (!onClick) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-slate-300 hover:text-white"
    >
      ← Back
    </button>
  )
}
