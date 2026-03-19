import { Link } from 'react-router-dom'

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
    <section className="py-20 border-t border-dark-border bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          How you can benefit from Copy Trading?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(({ title, icon: Icon }) => (
            <div
              key={title}
              className="p-6 rounded-xl bg-dark-card border border-dark-border text-center shadow-lg"
            >
              <div className="w-14 h-14 rounded-lg border-2 border-primary flex items-center justify-center mx-auto mb-4 text-primary">
                <Icon className="w-7 h-7" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{title}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/platform"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
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
