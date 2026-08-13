import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <p className="text-sm font-bold tracking-[0.16em] text-indigo-700">403</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">You do not have access to this page</h1>
      <p className="mt-3 text-slate-600">This account does not have permission to open this workspace.</p>
      <Link to="/dashboard" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800">Return to dashboard</Link>
    </section>
  )
}
