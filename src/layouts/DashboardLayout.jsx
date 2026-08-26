import { useEffect, useState } from 'react'
import { BarChart3, Briefcase, CreditCard, FileText, Inbox, KeyRound, LayoutDashboard, LogOut, MessageSquare, MoonStar, Receipt, Scale, ShieldCheck, SunMedium, UserPen, Users, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import ModalFocusRegion from '../components/common/ModalFocusRegion'
import NotificationBell from '../components/common/NotificationBell'
import useBodyScrollLock from '../hooks/useBodyScrollLock'
import useCloseOnDesktop from '../hooks/useCloseOnDesktop'
import useTheme from '../hooks/useTheme'
import { dashboardRouteRegistry } from '../routes/dashboardRouteRegistry'

// ─── Sub-components ───────────────────────────────────────────────────────────

function SidebarIdentity() {
  return (
    <div className="mb-6 flex items-start justify-between gap-2">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-700 text-white">
          <ShieldCheck size={20} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            LegalEase
          </p>
          <p className="font-semibold text-slate-950 dark:text-[#ece5d6]">Dashboard</p>
        </div>
      </div>
      <NotificationBell />
    </div>
  )
}

function SidebarAccountCard({ user, role }) {
  return (
    <div className="mb-6 rounded-xl bg-slate-50 dark:bg-[#0c1728] p-3.5">
      <p className="truncate text-sm font-semibold text-slate-950 dark:text-[#ece5d6]">
        {user?.fullName}
      </p>
      <p className="mt-1 text-xs capitalize text-slate-600 dark:text-[#a8bbcc]">
        {role} account
      </p>
    </div>
  )
}

const ICON_MAP = {
  LayoutDashboard,
  FileText,
  UserPen,
  MessageSquare,
  CreditCard,
  Inbox,
  Briefcase,
  Users,
  Scale,
  Receipt,
  BarChart3,
}

function SidebarNavigation({ links, onLinkClick }) {
  const linkClass = ({ isActive }) =>
    `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
      isActive
        ? 'bg-indigo-700 text-white shadow-sm'
        : 'text-slate-700 dark:text-[#ece5d6] hover:bg-slate-100 dark:hover:bg-[#162236] hover:text-slate-950 dark:hover:text-[#ece5d6]'
    }`

  return (
    <nav aria-label="Dashboard navigation" className="grid gap-1">
      {links.map((link) => {
        const Icon = ICON_MAP[link.icon] ?? LayoutDashboard
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            onClick={onLinkClick}
            className={linkClass}
          >
            {({ isActive }) => (
              <>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition ${
                  isActive
                    ? 'bg-indigo-500/30'
                    : 'bg-slate-100 dark:bg-[#0c1728] group-hover:bg-slate-200'
                }`}>
                  <Icon size={14} />
                </span>
                {link.label}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

function SidebarFooter({ onLogout, onLinkClick }) {
  return (
    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#1c3050] grid gap-1">
      <Link
        to="/dashboard/change-password"
        onClick={onLinkClick}
        className="flex min-h-11 items-center gap-2.5 rounded-xl px-3.5 text-sm font-semibold text-slate-600 dark:text-[#a8bbcc] hover:bg-slate-100 dark:hover:bg-[#0c1728] hover:text-slate-950 dark:hover:text-[#ece5d6] transition"
      >
        <KeyRound size={16} />
        Change password
      </Link>
      <Link
        to="/"
        onClick={onLinkClick}
        className="flex min-h-11 items-center gap-2.5 rounded-xl px-3.5 text-sm font-semibold text-slate-600 dark:text-[#a8bbcc] hover:bg-slate-100 dark:hover:bg-[#0c1728] hover:text-slate-950 dark:hover:text-[#ece5d6] transition"
      >
        ← Home
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3.5 text-sm font-semibold text-slate-600 dark:text-[#a8bbcc] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const role = user?.role?.trim().toLowerCase()
  const links = dashboardRouteRegistry[role] ?? []

  async function handleLogout() {
    setOpen(false)
    await logout()
    navigate('/', { replace: true })
  }

  useBodyScrollLock(open)
  useCloseOnDesktop(() => setOpen(false))
  useEffect(() => setOpen(false), [location.pathname])

  function closeMenu() {
    setOpen(false)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      {/* ── Mobile top bar ──────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
        {/* Mobile identity */}
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-700 text-white">
            <LayoutDashboard size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
              LegalEase
            </p>
            <h1 className="font-semibold text-slate-950 dark:text-[#ece5d6]">Dashboard</h1>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] text-slate-700 dark:text-[#ece5d6]"
          >
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>

          <button
            type="button"
            aria-controls="dashboard-navigation"
            aria-label={open ? 'Close dashboard menu' : 'Open dashboard menu'}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] text-slate-800 dark:text-[#ece5d6]"
          >
            {open ? <X size={18} /> : <LayoutDashboard size={18} />}
          </button>
        </div>
      </div>

      {/* ── Content grid ─────────────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside className="hidden rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm lg:flex lg:flex-col lg:self-start">
          <SidebarIdentity />
          <SidebarAccountCard user={user} role={role} />
          <SidebarNavigation links={links} onLinkClick={closeMenu} />
          <SidebarFooter onLogout={handleLogout} onLinkClick={closeMenu} />
        </aside>

        {/* Mobile sidebar drawer */}
        {open && (
          <ModalFocusRegion
            label="Dashboard navigation"
            onClose={closeMenu}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="Dismiss dashboard menu"
              className="absolute inset-0 w-full bg-slate-950/35"
              onClick={closeMenu}
            />
            <aside
              id="dashboard-navigation"
              className="absolute inset-y-0 left-0 w-[min(20rem,calc(100%-2rem))] overflow-y-auto bg-white dark:bg-[#0c1728] p-5 shadow-2xl flex flex-col"
            >
              <SidebarIdentity />
              <SidebarAccountCard user={user} role={role} />
              <SidebarNavigation links={links} onLinkClick={closeMenu} />
              <SidebarFooter onLogout={handleLogout} onLinkClick={closeMenu} />
            </aside>
          </ModalFocusRegion>
        )}

        {/* Main content */}
        <section className="min-w-0 pb-4">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
