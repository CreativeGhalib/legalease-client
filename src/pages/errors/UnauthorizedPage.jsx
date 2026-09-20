import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 dark:border-[#2a3850] bg-white dark:bg-[#161d27] p-8 text-center shadow-sm sm:p-12">
      <p className="text-sm font-bold tracking-[0.16em] text-[#1b3a6b] dark:text-[#d4a843]">403</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6]">You do not have access to this page</h1>
      <p className="mt-3 text-slate-600 dark:text-[#a8bbcc]">This account does not have permission to open this workspace.</p>
      <Link to="/dashboard" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#1b3a6b] dark:bg-[#d4a843] dark:text-[#0c1827] px-4 text-sm font-semibold text-white transition hover:bg-[#142e57] dark:hover:bg-[#e8bf58]">Return to dashboard</Link>
    </section>
  )
}
