'use client'
import { useEffect, useState } from 'react'
import Avatar from '../Avatar'

const features = [
  { title: 'Copy Pros in a Tap', description: 'Enroll, connect, and start copying traders in 12 languages.', position: 'left' },
  { title: 'Connect and Profit', description: 'Join a large trading community to chat, share strategies, and trade together.', position: 'right' },
  { title: 'Go Against the Flow', description: 'Challenge friends or use the "inverse" trade feature on losing traders.', position: 'left' },
  { title: 'Performance You Can Trust', description: 'Follow top traders with live portfolios to activate become a signal provider.', position: 'right' },
]

const traderCards = [
  { name: 'David Bly', pnl: '+16.2% last month', seed: 'David', photo: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Orion', pnl: '+31.8% last month', seed: 'Orion', photo: 'https://i.pravatar.cc/80?img=52' },
  { name: 'Chris Grol', pnl: '+11.2% last month', seed: 'Chris', photo: 'https://i.pravatar.cc/80?img=30' },
  { name: 'Ronald Smith', pnl: '+20.9% last month', seed: 'Ronald', photo: 'https://i.pravatar.cc/80?img=33' },
  { name: 'AI TRADING SIGNALS', pnl: '+14.3% last month', seed: 'Signals', photo: 'https://i.pravatar.cc/80?img=57' },
]

function PhoneScreenDiscover() {
  return (
    <div className="h-full flex flex-col bg-[#071126]">
      <div className="h-7 px-3 flex items-center justify-between text-[9px] text-slate-500">
        <span>9:41</span>
        <span className="text-slate-300">Discover</span>
        <span>5G</span>
      </div>
      <div className="flex-1 px-2.5 pb-2.5 space-y-2.5 overflow-hidden">
        <div className="h-7 rounded-md bg-slate-700/25 border border-slate-600/20 flex items-center px-2 text-[10px] text-slate-400">
          <span className="mr-1.5">⌕</span> Search traders
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-slate-200">Spotlight</p>
            <button type="button" className="text-[9px] text-primary">See all</button>
          </div>
          <div className="space-y-1.5">
            {traderCards.map((trader) => (
              <div key={trader.name} className="flex items-center gap-2 rounded-lg px-1.5 py-1 bg-slate-800/25 border border-slate-700/20">
                <Avatar
                  seed={trader.seed}
                  name={trader.name}
                  src={trader.photo}
                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-500/40"
                />
                <div className="min-w-0">
                  <p className="text-[9px] text-white truncate">{trader.name}</p>
                  <p className="text-[8px] text-slate-400">{trader.pnl}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav activeLabel="Discover" />
    </div>
  )
}

function PhoneScreenSignals() {
  return (
    <div className="h-full flex flex-col bg-[#071126]">
      <div className="h-7 px-3 flex items-center justify-between text-[9px] text-slate-500">
        <span>9:41</span>
        <span className="text-slate-300">Signals</span>
        <span>5G</span>
      </div>
      <div className="flex-1 px-2.5 pb-2.5 space-y-2 overflow-hidden">
        <div className="rounded-lg p-2 bg-slate-800/35 border border-slate-700/35">
          <p className="text-[10px] text-slate-300">EURUSD Buy Setup</p>
          <p className="text-[8px] text-emerald-400 mt-0.5">Entry 1.0870 • TP 1.0930 • SL 1.0835</p>
        </div>
        <div className="rounded-lg p-2 bg-slate-800/35 border border-slate-700/35">
          <p className="text-[10px] text-slate-300">NASDAQ Momentum</p>
          <p className="text-[8px] text-primary mt-0.5">Strength score 82/100</p>
        </div>
        <div className="rounded-lg p-2 bg-slate-800/35 border border-slate-700/35">
          <p className="text-[10px] text-slate-300">Gold Reversal Alert</p>
          <p className="text-[8px] text-amber-400 mt-0.5">Watch zone 2341 - 2352</p>
        </div>
        <div className="pt-1">
          <p className="text-[9px] text-slate-400 mb-1">Top signal providers</p>
          <div className="space-y-1.5">
            {traderCards.slice(0, 3).map((trader) => (
              <div key={trader.name} className="flex items-center justify-between rounded-lg px-1.5 py-1 bg-slate-800/25 border border-slate-700/20">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar seed={trader.seed} name={trader.name} src={trader.photo} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-[8px] text-white truncate">{trader.name}</span>
                </div>
                <span className="text-[8px] text-emerald-400">{trader.pnl.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav activeLabel="Alerts" />
    </div>
  )
}

function PhoneScreenPortfolio() {
  return (
    <div className="h-full flex flex-col bg-[#071126]">
      <div className="h-7 px-3 flex items-center justify-between text-[9px] text-slate-500">
        <span>9:41</span>
        <span className="text-slate-300">Portfolio</span>
        <span>5G</span>
      </div>
      <div className="flex-1 px-2.5 pb-2.5 space-y-2 overflow-hidden">
        <div className="rounded-lg p-2 bg-gradient-to-r from-slate-800/50 to-slate-700/25 border border-slate-700/35">
          <p className="text-[8px] text-slate-400">Total Equity</p>
          <p className="text-sm text-white font-semibold">$334,560.89</p>
          <p className="text-[8px] text-emerald-400 mt-0.5">+6.8% this week</p>
        </div>
        <div className="rounded-lg p-2 bg-slate-800/35 border border-slate-700/35">
          <p className="text-[9px] text-slate-400 mb-1">Asset Mix</p>
          <div className="space-y-1">
            {[['FX', 42, 'bg-primary'], ['Indices', 28, 'bg-emerald-500'], ['Commodities', 18, 'bg-amber-500'], ['Crypto', 12, 'bg-fuchsia-500']].map(([label, pct, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-14 text-[8px] text-slate-400">{label}</span>
                <div className="h-1.5 flex-1 rounded-full bg-slate-700/60 overflow-hidden">
                  <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[8px] text-slate-300 w-7 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-2 bg-slate-800/35 border border-slate-700/35">
          <p className="text-[9px] text-slate-300">Today&apos;s PnL</p>
          <p className="text-xs text-emerald-400 mt-0.5">+$2,864.22</p>
        </div>
      </div>
      <BottomNav activeLabel="Trade" />
    </div>
  )
}

function BottomNav({ activeLabel }) {
  return (
    <div className="h-11 border-t border-slate-700/30 bg-[#071126] grid grid-cols-4 text-[8px]">
      {['Discover', 'Trade', 'Alerts', 'Account'].map((label) => (
        <button key={label} type="button" className={`flex flex-col items-center justify-center ${activeLabel === label ? 'text-primary' : 'text-slate-500'}`}>
          <span className="text-[11px] leading-none">{activeLabel === label ? '●' : '○'}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

export default function PhoneFeaturesSection() {
  const [activeScreen, setActiveScreen] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="py-12 lg:py-24 border-t border-dark-border relative overflow-x-clip lg:overflow-hidden bg-[#050d1f]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,240px)] max-w-full h-[280px] lg:w-[min(100%,300px)] lg:h-[360px] bg-primary/30 lg:bg-primary/35 rounded-full blur-[70px] lg:blur-[95px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0 relative">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-10 lg:gap-x-10 items-center min-w-0">
          <div className="order-1 lg:order-2 lg:col-start-2 flex justify-center">
            <div className="relative lg:animate-float">
              <div
                className="relative w-[240px] h-[490px] sm:w-[260px] sm:h-[530px] lg:w-[180px] xl:w-[210px] lg:h-[370px] xl:h-[430px] rounded-[2rem] lg:rounded-[2.2rem]
                bg-[#030407] shadow-[0_20px_48px_rgba(0,0,0,0.65)]
                border-[5px] border-black overflow-hidden"
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black border border-[#121418] z-10" />
                <div
                  className="h-full flex transition-transform duration-700 ease-in-out will-change-transform"
                  style={{ transform: `translateX(-${activeScreen * 100}%)` }}
                >
                  <div className="w-full shrink-0">
                    <PhoneScreenDiscover />
                  </div>
                  <div className="w-full shrink-0">
                    <PhoneScreenSignals />
                  </div>
                  <div className="w-full shrink-0">
                    <PhoneScreenPortfolio />
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none rounded-[1.7rem] lg:rounded-[2rem] border border-white/[0.06]" />
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeScreen === dot ? 'w-4 bg-primary' : 'w-1.5 bg-slate-500/70'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1 lg:col-start-1 flex flex-col gap-8 lg:gap-16 justify-center min-w-0 w-full">
            {features
              .filter((f) => f.position === 'left')
              .map(({ title, description }) => (
                <div key={title} className="min-w-0 lg:max-w-[360px] text-center lg:text-left">
                  <h3 className="text-2xl lg:text-4xl xl:text-5xl leading-tight lg:leading-[0.95] font-semibold tracking-tight text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-slate-400 text-[15px] lg:text-sm xl:text-base leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
          </div>

          <div className="order-3 lg:col-start-3 flex flex-col gap-8 lg:gap-16 justify-center items-center lg:items-end min-w-0 w-full">
            {features
              .filter((f) => f.position === 'right')
              .map(({ title, description }) => (
                <div key={title} className="min-w-0 lg:max-w-[360px] text-center lg:text-right">
                  <h3 className="text-2xl lg:text-4xl xl:text-5xl leading-tight lg:leading-[0.95] font-semibold tracking-tight text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-slate-400 text-[15px] lg:text-sm xl:text-base leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
