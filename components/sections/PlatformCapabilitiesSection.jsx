import Link from 'next/link'

const items = [
  { title: 'One-click copy', description: 'Select a strategy or trader and start copying with a single click.' },
  { title: 'MT4 / MT5 ready', description: 'Compatible with MetaTrader 4 and MetaTrader 5 for seamless integration.' },
  { title: 'Risk controls', description: 'Set your own risk level, lot size, and stop-loss preferences.' },
  { title: 'Live performance', description: 'See real-time equity, drawdown, and trade history.' },
]

/** Highlights from /platform — kept compact on mobile, full-width on lg+ */
export default function PlatformCapabilitiesSection() {
  return (
    <section className="py-12 lg:py-20 border-t border-dark-border bg-dark/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-3 lg:mb-4">
          Platform capabilities
        </h2>
        <p className="text-center text-slate-400 text-[15px] lg:text-base max-w-2xl mx-auto mb-8 lg:mb-14">
          Everything wired for transparent copy execution and broker-ready workflows.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map(({ title, description }) => (
            <div
              key={title}
              className="p-5 lg:p-6 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 transition-colors min-w-0"
            >
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              <Link
                href="/platform"
                className="inline-flex mt-3 text-sm font-medium text-primary hover:text-primary-light transition-colors"
              >
                Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
