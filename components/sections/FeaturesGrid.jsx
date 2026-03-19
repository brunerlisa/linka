import Link from 'next/link'

const features = [
  { title: 'Premium Economic Calendar', description: 'Start trading news like the pros with our pro economic calendar' },
  { title: 'Technical Views', description: 'Access live trading setups based on pattern recognition and expert analysis.' },
  { title: 'Alpha EA', description: 'Unlock live trading ideas with three EAs for your MT4 and MT5 platform.' },
  { title: 'AI Market Buzz', description: 'Gain live market-moving insights of over 35,000 tradable assets.' },
  { title: 'Trade Signals', description: 'Access daily trading ideas and technical setups in real-time.' },
  { title: 'Cashback Bonus', description: 'Get a 50% Cashback Bonus that converts to cash when you trade.' },
]

export default function FeaturesGrid() {
  return (
    <section className="py-20 border-t border-dark-border bg-dark-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, description }) => (
            <div key={title} className="p-6 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 transition-colors text-left">
              <div className="w-12 h-12 rounded-lg border-2 border-primary flex items-center justify-center mb-4 text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{description}</p>
              <Link href="/platform" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors">
                Find out more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
