import { useState } from 'react'
import { Menu, Scale, Search, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import SiteFooter from '../components/common/SiteFooter'

export default function PublicLayout() {
  const { isAuthenticated, isChecking, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  async function handleLogout() {
    await logout()
    setMenuOpen(false)
    navigate('/', { replace: true })
  }

  function submitSearch(event) {
    event.preventDefault()
    const query = search.trim()
    setMenuOpen(false)
    navigate(query ? `/lawyers?search=${encodeURIComponent(query)}&page=1` : '/lawyers')
  }

  const navClass = ({ isActive }) => `min-h-11 inline-flex items-center border-b-2 px-0.5 text-sm font-semibold tracking-[0.01em] transition ${isActive ? 'border-indigo-700 text-indigo-800' : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950'}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 shadow-[0_1px_0_rgb(15_23_42/0.03)] backdrop-blur">
        <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2.5 text-slate-950"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-amber-200 shadow-sm"><Scale size={19} strokeWidth={1.8} /></span><span><span className="le-display block text-xl font-bold leading-none">LegalEase</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Legal counsel</span></span></Link>
          <nav className="hidden items-center gap-5 lg:flex"><NavLink to="/" end className={navClass}>Home</NavLink><NavLink to="/lawyers" className={({ isActive }) => `min-h-11 inline-flex items-center text-sm font-semibold ${isActive || location.pathname.startsWith('/lawyers') ? 'text-indigo-700' : 'text-slate-700 hover:text-slate-950'}`}>Browse Lawyers</NavLink><form onSubmit={submitSearch} className="relative"><label className="sr-only" htmlFor="desktop-lawyer-search">Search lawyers</label><Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} /><input id="desktop-lawyer-search" value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-44 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-600 focus:outline-none xl:w-56" placeholder="Search lawyers" /></form></nav>
          <div className="hidden items-center gap-3 lg:flex">
            {!isChecking && (isAuthenticated ? (
              <>
                <span className="hidden max-w-32 truncate text-sm font-medium text-slate-600 sm:inline">{user.fullName}</span>
                <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
                <button type="button" onClick={handleLogout} className="min-h-11 text-slate-800 hover:text-slate-950">Logout</button>
              </>
            ) : (
              <NavLink to="/login" className={navClass}>Login</NavLink>
            ))}
          </div><button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} className="grid min-h-11 min-w-11 place-items-center rounded-lg text-slate-800 hover:bg-slate-100 lg:hidden">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"><nav className="mx-auto grid max-w-6xl gap-1"><NavLink to="/" end onClick={() => setMenuOpen(false)} className={navClass}>Home</NavLink><NavLink to="/lawyers" onClick={() => setMenuOpen(false)} className={navClass}>Browse Lawyers</NavLink><form onSubmit={submitSearch} className="mt-2 relative"><label className="sr-only" htmlFor="mobile-lawyer-search">Search lawyers</label><Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={17} /><input id="mobile-lawyer-search" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm" placeholder="Search by name or specialization" /></form>{!isChecking && (isAuthenticated ? <><NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={navClass}>Dashboard</NavLink><button type="button" onClick={handleLogout} className="min-h-11 text-left text-sm font-semibold text-slate-700">Logout</button></> : <NavLink to="/login" onClick={() => setMenuOpen(false)} className={navClass}>Login</NavLink>)}</nav></div>}
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
