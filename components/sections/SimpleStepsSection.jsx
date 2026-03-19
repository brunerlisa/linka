import Link from 'next/link'

const steps = [
  { num: 1, title: 'REGISTER', description: 'Open a live account and start trading in just minutes.' },
  { num: 2, title: 'FUND', description: 'Fund your account using a wide range of funding methods.' },
  { num: 3, title: 'TRADE', description: 'Access 1000+ instruments across all asset classes' },
]

export default function SimpleStepsSection() {
  return (
    <section className="py-24 border-t border-dark-border relative overflow-hidden">
      {/* Concentric oval lines - visible, subtle movement */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="oval-bg absolute w-[90vw] max-w-2xl h-[280px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '0s' }} />
        <div className="oval-bg absolute w-[70vw] max-w-xl h-[220px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '0.5s' }} />
        <div className="oval-bg absolute w-[50vw] max-w-md h-[160px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-white">Start Trading in 3 </span>
          <span className="text-slate-400">Simple Steps</span>
        </h2>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-6 md:gap-2">
          {steps.map(({ num, title, description }, i) => (
            <div key={num} className="flex flex-col md:flex-row items-center md:items-start gap-4 flex-1 max-w-sm md:max-w-none">
              <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
                <span className="text-5xl md:text-6xl font-bold text-primary leading-none">{num}</span>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex flex-1 max-w-[80px] justify-center items-center shrink-0">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/platform"
            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors shadow-lg shadow-primary/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}
