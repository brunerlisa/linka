'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth/sign-in')
      return
    }
    if (!isAdmin) {
      const t = setTimeout(() => router.replace('/dashboard'), 4000)
      return () => clearTimeout(t)
    }
  }, [user, isAdmin, loading, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          {!loading && user && !isAdmin ? (
            <>
              <p className="text-amber-400 font-medium mb-2">Admin access required</p>
              <p className="text-slate-400 text-sm mb-4">
                Your account needs the admin role. In Clerk Dashboard, set your user&apos;s Public metadata to: <code className="text-primary">{`{"role": "admin"}`}</code>. Then sign out and sign back in.
              </p>
              <p className="text-slate-500 text-xs">Redirecting to dashboard in a few seconds...</p>
              <Link href="/dashboard" className="mt-4 inline-block text-sm text-primary hover:underline">Go to Dashboard now</Link>
            </>
          ) : (
            <p className="text-slate-400">Loading...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex">
      <aside className="w-60 bg-[#050712] border-r border-[#111827] flex flex-col">
        <div className="h-14 px-5 flex items-center justify-between border-b border-[#111827]">
          <Link href="/admin" className="text-sm font-semibold tracking-wide">
            <span className="text-primary">Noble Mirror Capital</span>
          </Link>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">ADMIN</span>
        </div>
        <nav className="flex-1 py-4 text-sm space-y-0.5">
          <Link href="/admin" className="block px-5 py-2.5 text-white bg-[#111827] border-r-2 border-primary">Dashboard</Link>
          <Link href="/admin/traders" className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">Traders</Link>
          <Link href="/admin/deposits" className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">Deposits</Link>
          <Link href="/admin/accounts" className="block px-5 py-2.5 text-slate-300 hover:bg-[#0b1020] hover:text-white">User Accounts</Link>
        </nav>
        <div className="border-t border-[#111827] py-3 text-sm space-y-0.5">
          <Link href="/dashboard" className="block px-5 py-2 text-slate-300 hover:bg-[#0b1020]">← User Dashboard</Link>
          <button
            className="w-full px-5 py-2 text-left text-slate-300 hover:bg-[#0b1020]"
            onClick={async () => {
              await signOut()
              router.push('/auth/sign-in')
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
