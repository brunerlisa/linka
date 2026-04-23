'use client'

import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          Quick access
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/control" className="p-6 rounded-xl bg-[#050712] border border-[#111827] hover:border-primary/40 transition-colors md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-white">Control Center</h3>
          <p className="text-sm text-slate-400 mt-1">
            Full admin hub: traders, payment requests, user accounts, profit updates, and signed-up users.
          </p>
          <span className="inline-block mt-3 text-primary text-sm font-medium">Open control center →</span>
        </Link>
        <Link href="/admin/traders" className="p-6 rounded-xl bg-[#050712] border border-[#111827] hover:border-primary/40 transition-colors">
          <h3 className="text-lg font-semibold text-white">Traders</h3>
          <p className="text-sm text-slate-400 mt-1">Add, edit, and manage traders. Seed demo traders for the platform.</p>
          <span className="inline-block mt-3 text-primary text-sm font-medium">Manage traders →</span>
        </Link>
        <Link href="/admin/deposits" className="p-6 rounded-xl bg-[#050712] border border-[#111827] hover:border-primary/40 transition-colors">
          <h3 className="text-lg font-semibold text-white">Deposits</h3>
          <p className="text-sm text-slate-400 mt-1">View deposit requests, approve or reject, and credit user accounts.</p>
          <span className="inline-block mt-3 text-primary text-sm font-medium">View deposits →</span>
        </Link>
        <Link href="/admin/accounts" className="p-6 rounded-xl bg-[#050712] border border-[#111827] hover:border-primary/40 transition-colors">
          <h3 className="text-lg font-semibold text-white">User Accounts</h3>
          <p className="text-sm text-slate-400 mt-1">Add funds to users manually and manage balances.</p>
          <span className="inline-block mt-3 text-primary text-sm font-medium">Manage accounts →</span>
        </Link>
      </div>
    </div>
  )
}
