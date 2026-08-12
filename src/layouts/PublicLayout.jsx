import { Link, Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 px-6 py-4">
        <Link to="/" className="font-semibold text-slate-900">LegalEase</Link>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
