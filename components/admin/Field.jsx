export function Field({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium text-slate-300">{label}</span>
      {children}
      {hint ? <span className="block text-[11px] leading-snug text-slate-500">{hint}</span> : null}
    </label>
  )
}

export const ADMIN_INPUT =
  'w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white placeholder:text-slate-500'
