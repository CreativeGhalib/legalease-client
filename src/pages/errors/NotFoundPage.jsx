import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <p className="text-sm font-bold tracking-[0.16em] text-indigo-700">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you requested is unavailable or may have moved.</p>
      <Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800">Return home</Link>
    </section>
  )
}
