'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { MARKETING_PLANS, MARKETING_TABS } from '@/lib/pricingPlans'

function CheckRow({ children }) {
  return (
    <li className="flex gap-3 text-left text-sm text-slate-400 leading-relaxed">
      <span className="mt-0.5 shrink-0 text-emerald-400 font-bold" aria-hidden>
        ✓
      </span>
      <span>{children}</span>
    </li>
  )
}

function PlanCard({ title, pips, min, max, recommended }) {
  return (
    <article
      className={`relative w-full max-w-[360px] rounded-xl border border-emerald-500/45 bg-dark-card p-5 lg:p-6 flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${
        recommended ? 'ring-1 ring-amber-500/30' : ''
      }`}
    >
      {recommended ? (
        <div className="absolute -right-0.5 top-3 z-[1] bg-amber-500 text-[10px] font-bold text-black px-3 py-1 rounded-l-md shadow-md pointer-events-none">
          Recommended
        </div>
      ) : null}

      <h3 className="text-center text-slate-200 font-bold text-sm lg:text-base tracking-wide mb-4 pr-6">{title}</h3>

      <div className="rounded-lg bg-emerald-950/70 border border-emerald-500/35 py-3 px-3 text-center mb-5">
        <p className="text-emerald-400 font-bold text-sm lg:text-base">{pips}</p>
      </div>

      <ul className="space-y-4 lg:space-y-5 flex-1 mb-6">
        <CheckRow>
          Minimum Deposit <span className="text-amber-400 font-semibold">{min}</span>
        </CheckRow>
        <CheckRow>
          Maximum Deposit <span className="text-amber-400 font-semibold">{max}</span>
        </CheckRow>
        <CheckRow>
          <span className="text-amber-400 font-semibold">10%</span> Trade Commission
        </CheckRow>
        <CheckRow>24/7 Customer Support</CheckRow>
      </ul>

      <Link
        href="/auth/sign-up"
        className="mt-auto w-full inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 transition-colors"
      >
        Get Started
      </Link>
    </article>
  )
}

/** Category tabs swap plans in place only — no URL changes. Cards are not links (CTA only). */
export default function PricingPlansSection() {
  const [tab, setTab] = useState('standard')
  const plans = useMemo(() => MARKETING_PLANS[tab] ?? MARKETING_PLANS.standard, [tab])

  return (
    <section id="pricing-plans" className="relative border-t border-dark-border bg-dark py-10 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-[clamp(1.05rem,3.2vw,1.85rem)] lg:text-3xl font-bold text-white tracking-tight">Choose Pricing Plan</h2>
          <p className="mt-2 text-slate-400 text-sm lg:text-base">We offer the best pricing plans</p>
        </div>

        <div className="flex justify-center mb-8 lg:mb-12">
          <div
            role="tablist"
            aria-label="Pricing categories"
            className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-full bg-dark-card border border-dark-border shadow-lg"
          >
            {MARKETING_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  tab === id ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {plans.map((plan) => (
            <PlanCard key={`${tab}-${plan.title}`} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
