import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section>
      <p className="text-sm text-slate-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Page not found</h1>
      <Link to="/" className="mt-5 inline-block text-slate-900 underline">Return home</Link>
    </section>
  )
}
