'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Avatar from '../Avatar'

const phoneUsers = [
  { name: 'Miko Parker', gain: 330.1, photo: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Alex Chen', gain: 280.1, photo: 'https://i.pravatar.cc/80?img=52' },
  { name: 'Sam Wilson', gain: 230.1, photo: 'https://i.pravatar.cc/80?img=33' },
]

const wrap = 'w-full max-w-[1180px] lg:max-w-7xl mx-auto px-2 sm:px-2.5 lg:px-8 min-w-0'

export default function StartCopyingSection() {
  const [activeView, setActiveView] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveView((prev) => (prev + 1) % 3)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="py-6 lg:py-20 border-t border-dark-border relative overflow-x-clip lg:overflow-hidden bg-dark/40 lg:bg-transparent">
      <div className={`${wrap} grid grid-cols-2 lg:flex lg:flex-row items-start lg:items-center gap-2 sm:gap-3 lg:gap-12 xl:gap-16`}>
        <div className="min-w-0 lg:flex-1 lg:max-w-xl">
          <h2 className="text-[clamp(0.82rem,2.8vw,1.65rem)] lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
            Start copying & start earning
          </h2>
          <p className="mt-2 lg:mt-6 text-slate-400 leading-snug text-[9px] sm:text-[10px] lg:text-base lg:text-slate-300 lg:leading-relaxed">
            Copyelite Trading provides the ability to copy successful strategies OR to share your own strategy and start earning when others copy it.
          </p>
          <p className="mt-1.5 lg:mt-4 text-slate-500 text-[8px] sm:text-[9px] lg:text-sm lg:text-slate-400 leading-snug lg:leading-relaxed hidden lg:block">
            Experience the sheer brilliance of Copyelite Trading - a revolutionary platform that effortlessly mirrors the success of profitable traders and
            lets you copy successful strategies or provide your own strategy to others to be copied and profit from that.
          </p>
          <p className="mt-1.5 text-slate-500 text-[8px] sm:text-[9px] leading-snug lg:hidden">
            Mirror profitable traders effortlessly — copy strategies or provide your own signals to the community.
          </p>
          <Link
            href="/platform"
            className="mt-3 lg:mt-8 inline-flex items-center justify-center px-2.5 py-1.5 text-[10px] lg:px-6 lg:py-3.5 lg:text-base font-medium rounded-md lg:rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Start Copytrading
          </Link>
        </div>

        <div className="relative flex justify-center min-w-0 lg:flex-1 lg:min-h-[390px]">
          <div className="absolute inset-0 items-center justify-center pointer-events-none hidden lg:flex">
            <div className="w-[360px] h-[360px] rounded-full bg-primary/40 blur-[90px] animate-float" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden">
            <div className="w-40 h-40 rounded-full bg-primary/25 blur-[50px]" />
          </div>

          <div className="relative z-10 w-full max-w-[200px] sm:max-w-[240px] lg:max-w-none animate-none lg:animate-float-slow">
            <div className="lg:w-[350px] xl:w-[410px] mx-auto">
              <div className="rounded-t-lg lg:rounded-t-2xl rounded-b-sm lg:rounded-b-md border border-slate-700/70 bg-gradient-to-b from-[#0f172a] to-[#0b1220] shadow-lg lg:shadow-2xl p-1 lg:p-2.5">
                <div className="h-[132px] sm:h-[148px] lg:h-[210px] xl:h-[230px] rounded-md lg:rounded-xl border border-slate-700/50 bg-[#0a1328] overflow-hidden flex flex-col min-w-0">
                  <div className="h-5 lg:h-7 border-b border-dark-border px-1.5 lg:px-3 flex items-center justify-between text-[8px] lg:text-[10px] text-slate-400 shrink-0">
                    <span className="lg:hidden">User</span>
                    <span className="hidden lg:inline">Current User</span>
                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 overflow-hidden relative min-h-0">
                    <div
                      className="h-full flex transition-transform duration-700 ease-in-out will-change-transform"
                      style={{ transform: `translateX(-${activeView * 100}%)` }}
                    >
                      <div className="w-full shrink-0 p-1 lg:p-2 space-y-1 lg:space-y-2">
                        {phoneUsers.map(({ name, gain, photo }) => (
                          <div key={name} className="flex items-center gap-1 lg:gap-2 p-1 lg:p-2 rounded lg:rounded-lg bg-dark border border-dark-border">
                            <Avatar seed={name} name={name} src={photo} className="w-5 h-5 lg:w-8 lg:h-8 rounded-full object-cover shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-[8px] lg:text-[11px] font-medium truncate">{name}</p>
                              <p className="text-emerald-400 text-[7px] lg:text-[10px]">+{gain}%</p>
                            </div>
                            <button type="button" className="px-1 py-0.5 lg:px-2.5 lg:py-1 rounded bg-primary text-white text-[7px] lg:text-[9px] font-medium shrink-0">
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="w-full shrink-0 p-1 lg:p-2 space-y-1 lg:space-y-2">
                        <div className="rounded lg:rounded-lg p-1 lg:p-2 border border-dark-border bg-dark">
                          <p className="text-[7px] lg:text-[10px] text-slate-400">Portfolio Profit</p>
                          <p className="text-sm lg:text-lg text-emerald-400 font-semibold leading-none lg:leading-normal">+$8,420.18</p>
                          <p className="text-[7px] lg:text-[9px] text-slate-500">Last 30 days</p>
                        </div>
                        <div className="rounded lg:rounded-lg p-1 lg:p-2 border border-dark-border bg-dark">
                          <p className="text-[7px] lg:text-[10px] text-slate-400 mb-0.5 lg:mb-1">Asset Allocation</p>
                          {[
                            ['FX', 42, 'bg-primary'],
                            ['Indices', 28, 'bg-emerald-500'],
                            ['Commodities', 18, 'bg-amber-500'],
                            ['Crypto', 12, 'bg-fuchsia-500'],
                          ].map(([label, pct, color]) => (
                            <div key={label} className="flex items-center gap-0.5 lg:gap-1.5 mb-0.5 lg:mb-1 last:mb-0">
                              <span className="w-8 lg:w-16 text-[6px] lg:text-[9px] text-slate-400">{label}</span>
                              <div className="flex-1 h-1 lg:h-1.5 rounded-full bg-slate-700/70 overflow-hidden min-w-0">
                                <div className={color} style={{ width: `${pct}%`, height: '100%' }} />
                              </div>
                              <span className="w-5 lg:w-8 text-right text-[6px] lg:text-[9px] text-slate-300">{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="w-full shrink-0 p-1 lg:p-2 space-y-1 lg:space-y-2">
                        {[
                          ['EURUSD Buy', 'Entry 1.0870', '+2.4%'],
                          ['NASDAQ Long', 'Strength score 82', '+1.8%'],
                          ['Gold Reversal', 'Watch zone 2341-2352', '+0.9%'],
                        ].map(([title, detail, score]) => (
                          <div key={title} className="rounded lg:rounded-lg p-1 lg:p-2 border border-dark-border bg-dark">
                            <p className="text-[8px] lg:text-[10px] text-white">{title}</p>
                            <p className="text-[7px] lg:text-[9px] text-slate-400">{detail}</p>
                            <p className="text-[8px] lg:text-[10px] text-emerald-400 mt-0.5 lg:mt-1">{score}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-3 lg:h-4 flex items-center justify-center gap-0.5 lg:gap-1.5 shrink-0">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className={`h-1 lg:h-1.5 rounded-full transition-all duration-300 ${activeView === dot ? 'w-3 lg:w-4 bg-primary' : 'w-1 lg:w-1.5 bg-slate-500/70'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-3 lg:h-6 xl:h-7 rounded-b-lg lg:rounded-b-2xl bg-gradient-to-b from-slate-600 to-slate-700 border-x border-slate-600/50 lg:border lg:border-slate-500/40 lg:shadow-[0_10px_18px_rgba(0,0,0,0.45)]" />
              <div className="mx-auto -mt-2 w-20 h-1.5 rounded-full bg-slate-800/80 hidden lg:block" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[78%] h-5 rounded-full bg-black/35 blur-md -z-10 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
