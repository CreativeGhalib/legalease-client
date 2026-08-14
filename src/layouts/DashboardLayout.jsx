import { useEffect, useState } from 'react'
import { LayoutDashboard, Menu, ShieldCheck, X } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import useBodyScrollLock from '../hooks/useBodyScrollLock'
import { dashboardRouteRegistry } from '../routes/dashboardRouteRegistry'

export default function DashboardLayout() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const role = user?.role?.trim().toLowerCase()
  const links = dashboardRouteRegistry[role] ?? []
  useBodyScrollLock(open)

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const linkClass = ({ isActive }) => `flex min-h-11 items-center rounded-xl px-3.5 text-sm font-semibold transition ${isActive ? 'bg-indigo-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'}`
  const navigation = <nav aria-label="Dashboard navigation" className="grid gap-1.5">{links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/dashboard'} onClick={() => setOpen(false)} className={linkClass}>{link.label}</NavLink>)}</nav>
  const accountCard = <div className="mb-6 rounded-xl bg-slate-50 p-3.5"><p className="truncate text-sm font-semibold text-slate-950">{user?.fullName}</p><p className="mt-1 text-xs capitalize text-slate-600">{role} account</p></div>
  const identity = <div className="mb-6 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-700 text-white"><ShieldCheck size={20} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">LegalEase</p><h1 className="font-semibold text-slate-950">Dashboard</h1></div></div>

  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
        <div className="flex min-w-0 items-center gap-2"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-700 text-white"><LayoutDashboard size={20} /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">LegalEase</p><h1 className="font-semibold text-slate-950">Dashboard</h1></div></div>
        <button type="button" aria-controls="dashboard-navigation" aria-label={open ? 'Close dashboard menu' : 'Open dashboard menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-800">{open ? <X /> : <Menu />}</button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block lg:self-start">{identity}{accountCard}{navigation}</aside>
        {open && <div className="fixed inset-0 z-50 lg:hidden" role="presentation"><button type="button" aria-label="Dismiss dashboard menu" className="absolute inset-0 w-full bg-slate-950/35" onClick={() => setOpen(false)} /><aside id="dashboard-navigation" className="absolute inset-y-0 left-0 w-[min(20rem,calc(100%-2rem))] overflow-y-auto bg-white p-5 shadow-2xl">{identity}{accountCard}{navigation}</aside></div>}
        <section className="min-w-0 pb-4"><Outlet /></section>
      </div>
    </div>
  )
}
