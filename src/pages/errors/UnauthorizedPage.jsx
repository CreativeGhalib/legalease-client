import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <section>
      <p className="text-sm text-slate-600">403</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">You do not have access to this page</h1>
      <Link to="/dashboard" className="mt-5 inline-block text-slate-900 underline">Return to dashboard</Link>
    </section>
  )
}
