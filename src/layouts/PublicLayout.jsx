import { useEffect, useState } from 'react'
import { Menu, MoonStar, Scale, Search, SunMedium, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import ModalFocusRegion from '../components/common/ModalFocusRegion'
import SiteFooter from '../components/common/SiteFooter'
import useBodyScrollLock from '../hooks/useBodyScrollLock'
import useCloseOnDesktop from '../hooks/useCloseOnDesktop'

const THEME_KEY = 'legalEase-theme'

/**
 * PublicLayout Component
 * 
 * Main layout for public pages with:
 * - Accessible navigation with proper focus management
 * - 48px minimum touch targets (WCAG mobile)
 * - Safe area padding for notched devices (iOS)
 * - Proper ARIA labels and keyboard navigation
 * - Consistent theme switching (light/dark)
 * - Mobile-responsive header with hamburger menu
 */
export default function PublicLayout() {
  const { isAuthenticated, isChecking, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem(THEME_KEY) || 'light'
  })

  useBodyScrollLock(menuOpen)
  useCloseOnDesktop(() => setMenuOpen(false))

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

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

  /**
   * NavLink style classes with improved focus visibility
   * WCAG AA compliant with proper color contrast on focus
   */
  const navClass = ({ isActive }) => {
    const baseClasses = 'inline-flex items-center border-b-2 px-0.5 py-2 text-sm font-semibold tracking-[0.01em] transition focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e]'
    const activeClasses = 'le-nav-active border-[#c09a4e] text-[#c09a4e] dark:border-[#1b3a6b] dark:text-[#1b3a6b]'
    const inactiveClasses = 'border-transparent text-[#a8bbcc] hover:border-[#243d66] hover:text-[#ece5d6] dark:text-[#364358] dark:hover:border-[#c5b89e] dark:hover:text-[#0c1827]'
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
  }

  return (
    <div 
      className="min-h-screen bg-[#07101f] text-[#ece5d6] dark:bg-[#f2ece0] dark:text-[#0c1827]"
      style={{
        paddingTop: 'var(--safe-area-inset-top, 0)',
      }}
    >
      {/* Skip to main content link */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-indigo-700 focus:text-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* Header - Sticky navigation with safe area support */}
      <header 
        className="sticky top-0 z-50 border-b border-[#1c3050] bg-[#0c1728]/95 shadow-[0_8px_24px_rgba(7,16,31,0.18)] backdrop-blur dark:border-[#d8ccb8] dark:bg-[#fdf9f2]/95"
        style={{
          paddingTop: 'var(--safe-area-inset-top, 0)',
          paddingLeft: 'var(--safe-area-inset-left, 0)',
          paddingRight: 'var(--safe-area-inset-right, 0)',
        }}
      >
        {/* Header container */}
        <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2.5 text-[#ece5d6] hover:opacity-80 transition focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] dark:text-[#0c1827]"
            aria-label="LegalEase - Home"
          >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c09a4e]/20 text-[#c09a4e] shadow-sm dark:bg-[#1b3a6b] dark:text-[#fdf9f2]">
              <Scale size={19} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span>
              <span className="le-display block text-xl font-bold leading-none">LegalEase</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#6b84a0] dark:text-[#69798e]">Legal counsel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            <NavLink 
              to="/" 
              end 
              className={navClass}
            >
              Home
            </NavLink>
            <NavLink 
              to="/lawyers"
              className={({ isActive }) => {
                const baseClasses = 'inline-flex items-center py-2 text-sm font-semibold transition focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e]'
                const activeClasses = 'text-[#c09a4e] dark:text-[#1b3a6b]'
                const inactiveClasses = 'text-[#a8bbcc] hover:text-[#ece5d6] dark:text-[#364358] dark:hover:text-[#0c1827]'
                return `${baseClasses} ${isActive || location.pathname.startsWith('/lawyers') ? activeClasses : inactiveClasses}`
              }}
            >
              Browse Lawyers
            </NavLink>

            {/* Desktop Search */}
            <form onSubmit={submitSearch} className="relative">
              <label className="sr-only" htmlFor="desktop-lawyer-search">
                Search lawyers
              </label>
              <Search 
                className="pointer-events-none absolute left-3 top-2.5 text-slate-400" 
                size={16}
                aria-hidden="true"
              />
              <input 
                id="desktop-lawyer-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-44 rounded-lg border border-[#243d66] bg-[#0f1e33] py-2 pl-9 pr-3 text-sm text-[#ece5d6] placeholder:text-[#6b84a0] transition focus:border-[#c09a4e] focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] dark:border-[#c5b89e] dark:bg-[#ece5d6] dark:text-[#0c1827] dark:placeholder:text-[#69798e] xl:w-56"
                placeholder="Search lawyers"
                aria-label="Search for lawyers by name or specialization"
              />
            </form>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Theme Toggle - 48px minimum touch target */}
            <button 
              type="button"
              onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid min-h-12 min-w-12 place-items-center rounded-lg border border-[#243d66] bg-[#0f1e33] text-[#a8bbcc] hover:bg-[#132540] focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] transition dark:border-[#c5b89e] dark:bg-[#ece5d6] dark:text-[#364358] dark:hover:bg-[#ddd4c2]"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <SunMedium size={18} aria-hidden="true" />
              ) : (
                <MoonStar size={18} aria-hidden="true" />
              )}
            </button>

            {/* User Account Section */}
            {!isChecking && (
              isAuthenticated ? (
                <>
                  <span className="hidden max-w-32 truncate text-sm font-medium text-[#a8bbcc] dark:text-[#364358] sm:inline" aria-label={`Logged in as ${user.fullName}`}>
                    {user.fullName}
                  </span>
                  <NavLink 
                    to="/dashboard"
                    className={navClass}
                  >
                    Dashboard
                  </NavLink>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="py-2 text-[#a8bbcc] text-sm font-semibold hover:text-[#ece5d6] focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] transition dark:text-[#364358] dark:hover:text-[#0c1827]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={navClass}>
                  Login
                </NavLink>
              )
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Theme Toggle - 48px minimum touch target */}
            <button 
              type="button"
              onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid min-h-12 min-w-12 place-items-center rounded-lg border border-[#243d66] bg-[#0f1e33] text-[#a8bbcc] shadow-sm hover:bg-[#132540] focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] transition dark:border-[#c5b89e] dark:bg-[#ece5d6] dark:text-[#364358] dark:hover:bg-[#ddd4c2]"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <SunMedium size={18} aria-hidden="true" />
              ) : (
                <MoonStar size={18} aria-hidden="true" />
              )}
            </button>

            {/* Mobile Menu Toggle - 48px minimum touch target */}
            <button 
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              className="grid min-h-12 min-w-12 place-items-center rounded-lg text-[#a8bbcc] hover:bg-[#132540] focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] transition dark:text-[#364358] dark:hover:bg-[#e5dccf]"
            >
              {menuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <ModalFocusRegion
          label="Mobile navigation"
          onClose={() => setMenuOpen(false)}
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
            className="absolute inset-0 w-full bg-slate-950/35 transition hover:bg-slate-950/40"
            onClick={() => setMenuOpen(false)}
          />

          <div
            id="mobile-navigation"
            className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-[#0c1728] p-4 pt-[calc(4.5rem+1rem)] shadow-2xl dark:bg-[#fdf9f2]"
            style={{
              paddingBottom: 'max(1rem, var(--safe-area-inset-bottom, 0))',
              paddingRight: 'max(1rem, var(--safe-area-inset-right, 0))',
            }}
          >
            <nav aria-label="Mobile navigation" className="grid gap-1">
              <NavLink to="/" end onClick={() => setMenuOpen(false)} className={navClass}>
                Home
              </NavLink>

              <NavLink to="/lawyers" onClick={() => setMenuOpen(false)} className={navClass}>
                Browse Lawyers
              </NavLink>

              <form onSubmit={submitSearch} className="relative mb-3 mt-3">
                <label className="sr-only" htmlFor="mobile-lawyer-search">
                  Search lawyers
                </label>
                <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={17} aria-hidden="true" />
                <input
                  id="mobile-lawyer-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="min-h-12 w-full rounded-lg border border-[#243d66] bg-[#0f1e33] py-2 pl-10 pr-3 text-[#ece5d6] placeholder:text-[#6b84a0] transition focus:border-[#c09a4e] focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] dark:border-[#c5b89e] dark:bg-[#ece5d6] dark:text-[#0c1827] dark:placeholder:text-[#69798e]"
                  placeholder="Search by name or specialization"
                  aria-label="Search for lawyers"
                />
              </form>

              {!isChecking && (
                isAuthenticated ? (
                  <>
                    <div className="my-3 border-t border-[#1c3050] py-3 dark:border-[#d8ccb8]">
                      <p className="mb-2 px-0.5 text-sm font-medium text-[#a8bbcc] dark:text-[#364358]">{user.fullName}</p>
                    </div>
                    <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={navClass}>
                      Dashboard
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="min-h-11 w-full px-0.5 py-2 text-left text-sm font-semibold text-[#a8bbcc] transition hover:text-[#ece5d6] focus:outline-2 focus:outline-offset-2 focus:outline-[#c09a4e] dark:text-[#364358] dark:hover:text-[#0c1827]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink to="/login" onClick={() => setMenuOpen(false)} className={navClass}>
                    Login
                  </NavLink>
                )
              )}
            </nav>
          </div>
        </ModalFocusRegion>
      )}

      {/* Main Content Area */}
      <main 
        id="main-content"
        className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
        style={{
          paddingLeft: 'max(1rem, var(--safe-area-inset-left, 0))',
          paddingRight: 'max(1rem, var(--safe-area-inset-right, 0))',
        }}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
