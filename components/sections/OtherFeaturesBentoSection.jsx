import Link from 'next/link'

function ShieldGraphic({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" aria-hidden>
      <defs>
        <linearGradient id="obf-shield-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
      </defs>
      <path
        d="M60 12L104 38v44c0 28-44 62-44 62S16 110 16 82V38L60 12z"
        fill="url(#obf-shield-g)"
        stroke="#93c5fd"
        strokeWidth="2"
        opacity=".95"
      />
      <rect x="50" y="56" width="20" height="28" rx="3" stroke="#bae6fd" strokeWidth="2" fill="#0ea5e9" opacity=".35" />
      <circle cx="60" cy="48" r="6" stroke="#bae6fd" strokeWidth="2" fill="#38bdf8" opacity=".45" />
    </svg>
  )
}

function ArrowBlocksGraphic({ className }) {
  return (
    <svg className={className} viewBox="0 0 130 130" fill="none" aria-hidden>
      <path
        d="M24 88 L76 36 L112 72 L94 72 L94 102 L56 102 L56 88 Z"
        fill="url(#obf-arr)"
        opacity=".9"
      />
      <defs>
        <linearGradient id="obf-arr" x1="24" y1="36" x2="112" y2="102">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path d="M32 94h18v12H32zm22-28h14v36H54zm20-26h14v62H74z" fill="#a7f3d0" opacity=".35" rx="4" />
    </svg>
  )
}

function CheckBadgeGraphic({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
      <circle cx="60" cy="60" r="42" fill="rgba(255,255,255,0.12)" />
      <path d="M36 61l14 14 34-38" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity=".95" />
    </svg>
  )
}

function PercentCoinsGraphic({ className }) {
  return (
    <svg className={className} viewBox="0 0 220 120" fill="none" aria-hidden>
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={148 + i * 22} cy={92 - i * 4} rx="26" ry="10" fill="#1e40af" opacity={0.55 - i * 0.12} />
      ))}
      <text x="150" y="72" fill="#60a5fa" fontSize="64" fontWeight="800" fontFamily="system-ui,sans-serif">
        %
      </text>
      <circle cx="150" cy="58" r="38" stroke="rgba(96,165,250,0.5)" strokeWidth="2" fill="rgba(37,99,235,0.25)" />
    </svg>
  )
}

/** Bento strip from legacy marketing (“Other features at your service”). */
export default function OtherFeaturesBentoSection() {
  return (
    <section className="relative py-10 lg:py-24 px-3 sm:px-4 lg:px-8 bg-black border-y border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-primary text-[clamp(1.15rem,3.5vw,2rem)] lg:text-[2.125rem] font-bold tracking-tight mb-8 lg:mb-12">
          Other features at your service
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          {/* Row 1 */}
          <div className="lg:col-span-2 rounded-[1.65rem] lg:rounded-[1.85rem] bg-gradient-to-br from-violet-200/95 via-[#dfe4fb] to-sky-200/90 p-5 sm:p-7 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-4 min-h-[200px] sm:min-h-[220px] text-neutral-900 relative overflow-hidden">
            <div className="relative z-[1] min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight mb-2 lg:mb-3">Safety and Security</h3>
              <p className="text-sm sm:text-[0.9375rem] leading-relaxed opacity-95 max-w-md">
                Since our founding, we&apos;ve prioritized the safety of your funds. Your account is protected by
                multi-level security, 2FA, and robust verification.
              </p>
            </div>
            <ShieldGraphic className="w-[100px] h-[118px] sm:w-[118px] sm:h-[138px] shrink-0 mx-auto sm:mx-0 self-end opacity-95" />
          </div>

          <div className="rounded-[1.65rem] lg:rounded-[1.85rem] bg-gradient-to-br from-emerald-100 via-[#bcf4de] to-teal-200/90 p-5 sm:p-6 lg:p-7 flex flex-col-reverse sm:flex-col lg:flex-row lg:items-center gap-5 text-neutral-900 min-h-[200px] sm:min-h-[220px] overflow-hidden lg:text-left">
            <div className="relative z-[1] w-full lg:flex-1 text-center lg:text-left">
              <h3 className="text-lg font-bold mb-2">Fast Withdrawal</h3>
              <p className="text-sm leading-relaxed opacity-95">
                30 minutes to withdraw funds. Quick and reliable access to your funds.
              </p>
            </div>
            <ArrowBlocksGraphic className="w-[100px] h-[100px] sm:w-[112px] sm:h-[112px] shrink-0 mx-auto lg:mx-0 lg:mr-[-4px]" />
          </div>

          {/* Row 2 */}
          <div className="rounded-[1.65rem] lg:rounded-[1.85rem] bg-gradient-to-br from-indigo-100/95 via-[#e5e9ff] to-violet-200/90 p-5 sm:p-6 lg:p-7 text-neutral-900 min-h-[200px] sm:min-h-[220px] flex flex-col">
            <div className="flex justify-center lg:justify-start -space-x-3 mb-4 lg:mb-5" aria-hidden>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-orange-400 border-4 border-[#eef0fc] shadow-sm" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-300 to-blue-600 border-4 border-[#eef0fc] shadow-sm" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 border-4 border-[#eef0fc] shadow-sm ring-2 ring-white/80" />
            </div>
            <h3 className="text-lg lg:text-xl font-bold mb-2 leading-snug text-center lg:text-left">Multi-Level Partner Program</h3>
            <p className="text-sm leading-relaxed opacity-95 flex-1 text-center lg:text-left">
              Limitless income. Attract new users, earn more, and grow beyond limits. Partner with us today!
            </p>
          </div>

          <div className="lg:col-span-2 rounded-[1.65rem] lg:rounded-[1.85rem] bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-5 sm:p-7 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-6 min-h-[200px] sm:min-h-[220px] text-white relative overflow-hidden">
            <div className="relative z-[1] min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 lg:mb-3">Fast Verification</h3>
              <p className="text-sm sm:text-[0.9375rem] text-white/90 leading-relaxed max-w-xl">
                Get your account verified quickly with our efficient verification process, allowing you to start
                trading without delay.
              </p>
            </div>
            <CheckBadgeGraphic className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] shrink-0 mx-auto sm:mx-0 opacity-95" />
          </div>

          {/* Row 3 */}
          <div className="lg:col-span-3 rounded-[1.65rem] lg:rounded-[1.85rem] bg-gradient-to-r from-slate-950 via-[#071234] to-slate-900 border border-slate-800/80 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center gap-8 text-white relative overflow-hidden min-h-[180px]">
            <div className="relative z-[1] flex-1 min-w-0 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Best Promotions</h3>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl mx-auto md:mx-0 mb-6 md:mb-0">
                Take advantage of our competitive promotions and bonuses, designed to give you the best value and enhance
                your trading experience.
              </p>
              <Link
                href="/auth/sign-up"
                className="inline-flex mt-5 px-6 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-slate-100 transition-colors mx-auto md:mx-0"
              >
                Open Account
              </Link>
            </div>
            <PercentCoinsGraphic className="w-full max-w-[220px] h-[112px] mx-auto md:mx-0 shrink-0 opacity-90" />
          </div>
        </div>
      </div>
    </section>
  )
}
