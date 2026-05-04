import { Fragment } from 'react'
import Link from 'next/link'

const steps = [
  { num: 1, title: 'REGISTER', description: 'Open a live account and start trading in just minutes.' },
  { num: 2, title: 'FUND', description: 'Fund your account using a wide range of funding methods.' },
  { num: 3, title: 'TRADE', description: 'Access 1000+ instruments across all asset classes' },
]

function StepArrow({ className = '' }) {
  return (
    <div className={`shrink-0 items-center justify-center self-center ${className}`} aria-hidden>
      <svg className="w-4 h-4 lg:w-8 lg:h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>
    </div>
  )
}

export default function SimpleStepsSection() {
  return (
    <section className="py-6 lg:py-24 border-t border-dark-border relative overflow-x-clip lg:overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="oval-bg absolute w-[min(90vw,36rem)] h-[120px] lg:h-[280px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '0s' }} />
        <div
          className="oval-bg absolute w-[min(76vw,30rem)] h-[90px] lg:h-[220px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="oval-bg absolute w-[min(50vw,28rem)] h-[70px] lg:h-[160px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="max-w-[1180px] lg:max-w-5xl mx-auto px-2 sm:px-2.5 lg:px-8 min-w-0 relative">
        <h2 className="text-[clamp(0.85rem,2.5vw,1.35rem)] lg:text-3xl xl:text-4xl font-bold text-center mb-5 lg:mb-16">
          <span className="text-white">Start Trading in 3 </span>
          <span className="text-slate-400">Simple Steps</span>
        </h2>

        {/* Compact row: phone / small tablet */}
        <div className="flex lg:hidden flex-row items-stretch justify-center gap-0 sm:gap-1 min-w-0">
          {steps.map(({ num, title, description }, i) => (
            <Fragment key={num}>
              <div className="flex flex-1 basis-0 flex-col items-center text-center gap-1 min-w-0">
                <span className="text-2xl sm:text-3xl font-bold text-primary leading-none">{num}</span>
                <h3 className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">{title}</h3>
                <p className="text-slate-500 text-[8px] sm:text-[9px] leading-snug px-0.5">{description}</p>
              </div>
              {i < steps.length - 1 ? <StepArrow className="hidden sm:flex px-0.5" /> : null}
            </Fragment>
          ))}
        </div>

        {/* Classic desktop layout */}
        <div className="hidden lg:flex flex-row items-stretch md:items-center justify-center gap-6 md:gap-2">
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

        <div className="mt-5 lg:mt-14 text-center">
          <Link
            href="/platform"
            className="inline-flex items-center justify-center px-4 py-2 text-[10px] sm:text-[11px] lg:px-10 lg:py-4 lg:text-base font-semibold rounded-md lg:rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors shadow-md lg:shadow-lg shadow-primary/20 lg:shadow-primary/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}
