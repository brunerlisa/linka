'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const TABS = [
  { id: 'standard', label: 'Standard' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'nfp', label: 'NFP' },
  { id: 'btc', label: 'BTC' },
]

const PLANS = {
  standard: [
    {
      title: 'STANDARD PLAN',
      pips: '20% - 25% PIPS',
      min: '$3,000.00',
      max: '$4,999.00',
    },
    {
      title: 'MASTER PLAN',
      pips: '25% - 30% PIPS',
      min: '$5,000.00',
      max: '$9,999.00',
      recommended: true,
    },
    {
      title: 'PREMIUM PLAN',
      pips: '30% - 35% PIPS',
      min: '$10,000.00',
      max: '$19,999.00',
    },
    {
      title: 'ULTIMATE PLAN',
      pips: '35% - 40% PIPS',
      min: '$20,000.00',
      max: '$49,999.00',
    },
    {
      title: 'CORPORATE PLAN',
      pips: '40% - 45% PIPS',
      min: '$50,000.00',
      max: '$100,000,000.00',
    },
  ],
  advanced: [
    {
      title: 'STANDARD PLAN',
      pips: '30% - 40% PIPS',
      min: '$1,000.00',
      max: '$9,999.00',
    },
    {
      title: 'MASTER PLUS PLAN',
      pips: '40% - 45% PIPS',
      min: '$10,000.00',
      max: '$19,999.00',
      recommended: true,
    },
    {
      title: 'PREMIUM PLAN',
      pips: '50% - 60% PIPS',
      min: '$20,000.00',
      max: '$49,999.00',
    },
    {
      title: 'ULTIMATE PLAN',
      pips: '60% - 70% PIPS',
      min: '$50,000.00',
      max: '$99,999.00',
    },
    {
      title: 'CORPORATE PLAN',
      pips: '40% - 45% PIPS',
      min: '$50,000.00',
      max: '$100,000,000.00',
    },
  ],
  nfp: [
    {
      title: 'PREMIUM PLAN',
      pips: '150% PIPS',
      min: '$100,000.00',
      max: '$149,999.00',
    },
    {
      title: 'STARTER PLAN',
      pips: '100% - 124% PIPS',
      min: '$50,000.00',
      max: '$99,999.00',
      recommended: true,
    },
    {
      title: 'ULTIMATE PLAN',
      pips: '200% PIPS',
      min: '$150,000.00',
      max: '$10,000,000.00',
    },
  ],
  btc: [
    {
      title: 'STANDARD CRYPTO',
      pips: '70% - 75% PIPS',
      min: '5.00 BTC',
      max: '14.90 BTC',
    },
    {
      title: 'PREMIUM CRYPTO',
      pips: '80% - 85% PIPS',
      min: '15.00 BTC',
      max: '29.90 BTC',
    },
    {
      title: 'PRO CRYPTO',
      pips: '90% - 95% PIPS',
      min: '30.00 BTC',
      max: '500.00 BTC',
      recommended: true,
    },
    {
      title: 'BASIC CRYPTO',
      pips: '65% - 70% PIPS',
      min: '1.00 BTC',
      max: '1.50 BTC',
    },
  ],
}

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
  const plans = useMemo(() => PLANS[tab] ?? PLANS.standard, [tab])

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
            {TABS.map(({ id, label }) => (
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
