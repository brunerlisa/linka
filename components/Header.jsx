'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Noble Mirror Capital</span>
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={label}
                href={to}
                className={`text-sm font-medium transition-colors ${
                  pathname === (to === '/#leaders' ? '/' : to.replace(/#.*/, '')) ? 'text-primary' : 'text-slate-300 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Login/Sign up or Dashboard/Admin */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                {isAdmin && (
                  <Link href="/admin" className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-colors">Admin</Link>
                )}
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
                <Link href="/auth/sign-up" className="px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors">Sign up</Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-dark-border">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  href={to}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                    pathname === (to === '/#leaders' ? '/' : to.replace(/#.*/, '')) ? 'text-primary bg-primary/10' : 'text-slate-300'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-dark-border flex gap-2 px-4 flex-wrap">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex-1 py-2.5 text-center text-slate-300 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex-1 py-2.5 text-center bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium" onClick={() => setMobileOpen(false)}>Admin</Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/auth/sign-in" className="flex-1 py-2.5 text-center text-slate-300 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                    <Link href="/auth/sign-up" className="flex-1 py-2.5 text-center bg-primary text-white rounded-lg text-sm font-medium" onClick={() => setMobileOpen(false)}>Sign up</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
