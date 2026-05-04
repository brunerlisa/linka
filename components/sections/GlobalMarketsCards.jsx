import Link from 'next/link'

const items = [
  {
    title: 'Global Markets At Your Fingertips',
    points: [
      'Forex CFDs (61 Products)',
      'Commodities CFDs (24 Products)',
      'Stocks CFDs (+2100 Products)',
      'Indices CFDs (25 Products)',
      'Bond CFDs (9 Products)',
      'Crypto CFDs (21 Products)',
    ],
    cta: 'Pricing Overview',
  },
  {
    title: 'Spreads from 0.0 Pips',
    points: [
      'Raw spreads means really from 0.0 pips*',
      'Our diverse and proprietary liquidity mix keeps spreads tight 24/5',
    ],
    cta: 'Pricing Overview',
  },
  {
    title: 'Fast Order Execution',
    points: [
      'Average execution speeds of under 40ms***',
      'Low latency fibre optic and Equinix NY4 server',
      'Free Low latency collocated VPS available',
    ],
    cta: 'Get your Free VPS',
  },
  {
    title: 'Grade Trading',
    points: [
      'Real, deep and diverse liquidity you can trade on',
      'Over 29 Billion USD in FX trades processed daily',
      'Copied Trades have 100% success rates',
    ],
    cta: 'Raw Pricing Benefits',
  },
]

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

export default function GlobalMarketsCards() {
  return (
    <section className="py-6 lg:py-20 border-t border-dark-border bg-dark-card/20">
      <div className="max-w-[1180px] lg:max-w-7xl mx-auto px-2 sm:px-2.5 lg:px-8 min-w-0">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-6">
          {items.map(({ title, points, cta }) => (
            <div key={title} className="p-2 sm:p-2.5 lg:p-6 rounded-md lg:rounded-xl bg-dark-card border border-dark-border min-w-0">
              <h3 className="text-[10px] sm:text-[11px] lg:text-xl font-bold text-white mb-1.5 lg:mb-4 leading-tight">{title}</h3>
              <ul className="space-y-0.5 lg:space-y-2 mb-2 lg:mb-6">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-1 lg:gap-2 text-slate-500 lg:text-slate-400 text-[8px] sm:text-[9px] lg:text-sm leading-snug">
                    <CheckIcon />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link href="/platform" className="inline-flex items-center gap-0.5 px-2 py-1 lg:px-4 lg:py-2 rounded-md lg:rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 text-[9px] lg:text-sm font-medium">
                {cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
