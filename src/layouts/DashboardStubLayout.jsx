import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { trackPageview } from '../utils/analytics'

export default function DashboardStubLayout() {
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    trackPageview(location.pathname) // no-op if GA4 not initialized (consent-gated)
  }, [location.pathname, location.search])

  // Consent given after mount: send the pageview for the current screen.
  useEffect(() => {
    const onReady = () => trackPageview(location.pathname)
    window.addEventListener('le:ga4-ready', onReady)
    return () => window.removeEventListener('le:ga4-ready', onReady)
  }, [location.pathname])

  const userRole = user?.role?.trim().toLowerCase()

  return (
    <section className="mx-auto w-full max-w-4xl">
      <p className="text-sm text-slate-600 dark:text-[#a8bbcc]">Protected route verification</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-[#ece5d6]">Dashboard</h1>
      <p className="mt-3 text-slate-700 dark:text-[#ece5d6]">Signed in as {user.fullName} ({user.role}).</p>
      <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm">
        <NavLink to="/dashboard" end className="font-medium text-slate-800 dark:text-[#ece5d6] underline-offset-4 hover:underline">Overview</NavLink>
        {userRole === 'user' && <NavLink to="/dashboard/user" className="font-medium text-slate-800 dark:text-[#ece5d6] underline-offset-4 hover:underline">User stub</NavLink>}
        {userRole === 'lawyer' && <NavLink to="/dashboard/lawyer" className="font-medium text-slate-800 dark:text-[#ece5d6] underline-offset-4 hover:underline">Lawyer stub</NavLink>}
        {userRole === 'lawyer' && <NavLink to="/dashboard/lawyer/manage-legal-profile" className="font-medium text-slate-800 dark:text-[#ece5d6] underline-offset-4 hover:underline">Manage legal profile</NavLink>}
        {userRole === 'admin' && <NavLink to="/dashboard/admin" className="font-medium text-slate-800 dark:text-[#ece5d6] underline-offset-4 hover:underline">Admin stub</NavLink>}
      </nav>
      <div className="mt-8 rounded-xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm sm:p-6"><Outlet /></div>
    </section>
  )
}
