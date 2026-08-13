import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function DashboardStubLayout() {
  const { user } = useAuth()

  return (
    <section>
      <p className="text-sm text-slate-600">Protected route verification</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-3 text-slate-700">Signed in as {user.fullName} ({user.role}).</p>
      <nav className="mt-6 flex flex-wrap gap-3 text-sm">
        <NavLink to="/dashboard" end className="underline">Overview</NavLink>
        <NavLink to="/dashboard/user" className="underline">User stub</NavLink>
        <NavLink to="/dashboard/lawyer" className="underline">Lawyer stub</NavLink>
        <NavLink to="/dashboard/admin" className="underline">Admin stub</NavLink>
      </nav>
      <div className="mt-8 rounded-lg border border-slate-200 p-5"><Outlet /></div>
    </section>
  )
}
