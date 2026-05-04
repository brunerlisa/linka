'use client'
import Link from 'next/link'
import Avatar from '../Avatar'
import { MiniChart } from '../icons/FeatureIcons'

const leaders = [
  { name: 'Thinh Ph...', tag: null, gain: '+48%', allTime: '+50%', risk: 'Medium risk', followers: 62, last7: 14, seed: 'Thinh', photo: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Maximuz', tag: null, gain: '+122%', allTime: '+295%', risk: 'Medium risk', followers: 56, last7: 12, seed: 'Maximuz', photo: 'https://i.pravatar.cc/100?img=15' },
  { name: 'Axion', tag: null, gain: '+35%', allTime: '+236%', risk: 'Medium risk', followers: 87, last7: 11, seed: 'Axion', photo: 'https://i.pravatar.cc/100?img=32' },
  { name: 'DT Trading', tag: '1-3% daily', gain: '+75%', allTime: '+165%', risk: 'Medium risk', followers: 22, last7: 8, seed: 'DT', photo: 'https://i.pravatar.cc/100?img=48' },
  { name: 'EA TRADE_', tag: 'VIP GU Gold HY 500', gain: '+41%', allTime: '+108%', risk: 'Medium risk', followers: 13, last7: 7, seed: 'EA', photo: 'https://i.pravatar.cc/100?img=59' },
  { name: 'Forex Aut_ Prashant Goutam', tag: null, gain: '+32%', allTime: '+38%', risk: 'Medium risk', followers: 23, last7: 7, seed: 'Forex', photo: 'https://i.pravatar.cc/100?img=5' },
]

export default function LeadersSection() {
  return (
    <section id="leaders" className="py-6 lg:py-20 border-t border-dark-border bg-[#0a1429]/80">
      <div className="max-w-[1180px] lg:max-w-7xl mx-auto px-2 sm:px-2.5 lg:px-8 min-w-0">
        <h2 className="text-[clamp(0.85rem,2.6vw,1.35rem)] lg:text-3xl xl:text-4xl font-bold text-white text-center mb-0.5 lg:mb-2">
          More than 1000 leaders
        </h2>
        <p className="text-slate-500 text-[9px] sm:text-[10px] lg:text-base text-center mb-4 lg:mb-12">
          to choose from in Interactive Copyelite Copy
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-6">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="p-2 sm:p-2.5 lg:p-5 rounded-lg lg:rounded-xl bg-[#f8fafc] border border-[#dbe4f2] shadow-sm lg:shadow-[0_4px_14px_rgba(15,23,42,0.15)] relative overflow-hidden min-w-0"
            >
              <div className="absolute bottom-0 right-0 w-24 h-16 lg:w-40 lg:h-24 opacity-20 lg:opacity-25 pointer-events-none">
                <MiniChart className="w-full h-full text-[#8fb9f4]" points={[0.6, 0.4, 0.5, 0.7, 0.55, 0.8]} up />
              </div>
              <div className="flex items-start justify-between gap-1 mb-2 relative">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Avatar
                    seed={leader.seed}
                    name={leader.name}
                    src={leader.photo}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#d1d9e6]"
                  />
                  <div className="min-w-0">
                    <p className="text-[#1e293b] font-medium text-[10px] sm:text-[11px] truncate">{leader.name}</p>
                    {leader.tag && <p className="text-slate-500 text-[9px] leading-tight line-clamp-2">{leader.tag}</p>}
                  </div>
                </div>
                <Link href="/platform" className="shrink-0 px-1.5 py-1 lg:px-4 lg:py-2 rounded-lg xl:rounded-xl bg-[#5ea1e8] text-white text-[9px] lg:text-sm font-semibold hover:bg-[#4a93e4] whitespace-nowrap">
                  COPY
                </Link>
              </div>
              <div className="mb-1.5 lg:mb-3 relative">
                <p className="text-[22px] sm:text-[26px] lg:text-[38px] leading-none font-bold text-[#2f7cdf]">{leader.gain}</p>
                <p className="text-slate-600 text-[10px] lg:text-sm">Gain</p>
                <p className="text-slate-500 text-[9px] lg:text-sm leading-tight">{leader.allTime} All time gain</p>
              </div>
              <div className="flex items-center justify-between relative gap-1">
                <span className="px-1 py-0.5 rounded-full bg-[#fcefc9] text-[#a67c00] text-[8px] sm:text-[9px] shrink max-w-[50%] truncate">{leader.risk}</span>
                <div className="text-right text-[8px] sm:text-[9px] lg:text-sm text-slate-500 leading-tight min-w-0">
                  <p>{leader.followers} Followers</p>
                  <p>{leader.last7} last 7d</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
