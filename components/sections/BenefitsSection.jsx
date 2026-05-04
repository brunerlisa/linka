import Link from 'next/link'

const benefits = [
  {
    title: 'Trade with others / knowledge for FREE',
    icon: SyncIcon,
  },
  {
    title: 'Join a thriving community / of like minded traders',
    icon: CommunityIcon,
  },
  {
    title: 'Save time creating your / own strategy',
    icon: ClockIcon,
  },
  {
    title: 'Share your own strategy / and profit',
    icon: ShareIcon,
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-6 lg:py-20 border-t border-dark-border bg-slate-900/50">
      <div className="max-w-[1180px] lg:max-w-6xl mx-auto px-2 sm:px-2.5 lg:px-8 min-w-0">
        <h2 className="text-[clamp(0.85rem,2.6vw,1.35rem)] lg:text-3xl xl:text-4xl font-bold text-white text-center mb-4 lg:mb-16">
          How you can benefit from Copy Trading?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-8">
          {benefits.map(({ title, icon: Icon }) => (
            <div key={title} className="p-2 lg:p-6 rounded-md lg:rounded-xl bg-dark-card border border-dark-border text-center min-w-0 shadow-lg">
              <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-md lg:rounded-lg border lg:border-2 border-primary flex items-center justify-center mx-auto mb-1 lg:mb-4 text-primary">
                <Icon className="w-4 h-4 lg:w-7 lg:h-7" />
              </div>
              <p className="text-slate-400 text-[8px] sm:text-[9px] lg:text-sm leading-snug whitespace-pre-line">{title}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 lg:mt-12 text-center">
          <Link
            href="/platform"
            className="inline-flex items-center justify-center px-3 py-1.5 text-[10px] lg:px-8 lg:py-4 lg:text-base font-medium rounded-md lg:rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Start Copying
          </Link>
        </div>
      </div>
    </section>
  )
}

function SyncIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}
function CommunityIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}
function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function ShareIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
