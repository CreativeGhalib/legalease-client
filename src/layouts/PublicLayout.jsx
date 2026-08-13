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

  const navClass = ({ isActive }) => `min-h-11 inline-flex items-center text-sm font-semibold transition ${isActive ? 'text-indigo-700' : 'text-slate-700 hover:text-slate-950'}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-700 text-white"><Scale size={18} /></span>LegalEase</Link>
          <nav className="hidden items-center gap-5 lg:flex"><NavLink to="/" end className={navClass}>Home</NavLink><NavLink to="/lawyers" className={({ isActive }) => `min-h-11 inline-flex items-center text-sm font-semibold ${isActive || location.pathname.startsWith('/lawyers') ? 'text-indigo-700' : 'text-slate-700 hover:text-slate-950'}`}>Browse Lawyers</NavLink><form onSubmit={submitSearch} className="relative"><label className="sr-only" htmlFor="desktop-lawyer-search">Search lawyers</label><Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} /><input id="desktop-lawyer-search" value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-44 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-600 focus:outline-none xl:w-56" placeholder="Search lawyers" /></form></nav>
          <div className="hidden items-center gap-3 lg:flex">
            {!isChecking && (isAuthenticated ? (
              <>
                <span className="hidden text-slate-600 sm:inline">{user.fullName}</span>
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
