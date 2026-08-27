import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, LogIn, LogOut, Menu, MoonStar, Scale, Search, SunMedium, X } from 'lucide-react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import ModalFocusRegion from '../components/common/ModalFocusRegion'
import NavDropdown from '../components/common/NavDropdown'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import CookieConsent from '../components/common/CookieConsent'
import SiteFooter from '../components/common/SiteFooter'
import CallbackButton from '../components/leads/CallbackButton'
import ExitIntentPopup from '../components/leads/ExitIntentPopup'
import { dashboardRouteRegistry } from '../routes/dashboardRouteRegistry'
import useBodyScrollLock from '../hooks/useBodyScrollLock'
import useCloseOnDesktop from '../hooks/useCloseOnDesktop'
import useTheme from '../hooks/useTheme'

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
  const { t } = useTranslation()
  const { isAuthenticated, isChecking, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { theme, toggleTheme } = useTheme()
  const role = user?.role?.trim().toLowerCase()
  const dashboardLinks = dashboardRouteRegistry[role] ?? []

  useBodyScrollLock(menuOpen)
  useCloseOnDesktop(() => setMenuOpen(false))

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])



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
    const baseClasses = 'inline-flex items-center border-b-2 px-0.5 py-2 text-sm font-semibold tracking-[0.01em] transition focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b]'
    const activeClasses = 'le-nav-active border-[#1b3a6b] text-[#1b3a6b] dark:border-[#d4a843] dark:text-[#d4a843]'
    const inactiveClasses = 'border-transparent text-[#364358] hover:border-[#c5b89e] hover:text-[#0c1827] dark:text-[#96a8b8] dark:hover:border-[#374c62] dark:hover:text-[#e4d9c5]'
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
  }

  return (
    <div 
      className="min-h-screen bg-[#f2ece0] text-[#0c1827] dark:bg-[#0d1117] dark:text-[#e4d9c5]"
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
        className="sticky top-0 z-50 border-b border-[#d8ccb8] bg-[#fdf9f2]/95 shadow-[0_8px_24px_rgba(7,16,31,0.06)] backdrop-blur dark:border-[#2a3850] dark:bg-[#161d27]/92"
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
            className="inline-flex items-center gap-2.5 text-[#0c1827] hover:opacity-80 transition focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] dark:text-[#e4d9c5]"
            aria-label="LegalEase - Home"
          >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1b3a6b] text-[#fdf9f2] shadow-sm dark:bg-[#d4a843]/20 dark:text-[#d4a843]">
              <Scale size={19} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span>
              <span className="le-display block text-xl font-bold leading-none">LegalEase</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#69798e] dark:text-[#5a6c7a]">Legal counsel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={navClass}
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/lawyers"
              className={({ isActive }) => {
                const baseClasses = 'inline-flex items-center py-2 text-sm font-semibold transition focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b]'
                const activeClasses = 'text-[#1b3a6b] dark:text-[#d4a843]'
                const inactiveClasses = 'text-[#364358] hover:text-[#0c1827] dark:text-[#96a8b8] dark:hover:text-[#e4d9c5]'
                return `${baseClasses} ${isActive || location.pathname.startsWith('/lawyers') ? activeClasses : inactiveClasses}`
              }}
            >
              {t('nav.browseLawyers')}
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
                className="h-10 w-44 rounded-lg border border-[#c5b89e] bg-[#e4d9c5] py-2 pl-9 pr-3 text-sm text-[#0c1827] placeholder:text-[#69798e] transition focus:border-[#1b3a6b] focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] dark:border-[#374c62] dark:bg-[#1d2535] dark:text-[#e4d9c5] dark:placeholder:text-[#5a6c7a] xl:w-56"
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
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid min-h-12 min-w-12 place-items-center rounded-lg border border-[#c5b89e] bg-[#e4d9c5] text-[#364358] hover:bg-[#ddd4c2] focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] transition dark:border-[#374c62] dark:bg-[#1d2535] dark:text-[#96a8b8] dark:hover:bg-[#22303e]"
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
                  <span className="hidden max-w-32 truncate text-sm font-medium text-[#364358] dark:text-[#96a8b8] sm:inline" aria-label={`Logged in as ${user.fullName}`}>
                    {user.fullName}
                  </span>
                  <NavDropdown label={t('nav.dashboard')} items={dashboardLinks} />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="py-2 text-[#364358] text-sm font-semibold hover:text-[#0c1827] focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] transition dark:text-[#96a8b8] dark:hover:text-[#e4d9c5]"
                  >
                    {t('nav.logout')}
                  </button>
                  <LanguageSwitcher />
                </>
              ) : (
                <>
                  <NavLink to="/login" className={navClass}>
                    {t('nav.login')}
                  </NavLink>
                  <LanguageSwitcher />
                </>
              )
            )}
          </div>

          {/* Mobile Actions — hidden entirely on /dashboard (dashboard has its own top bar) */}
          {!location.pathname.startsWith('/dashboard') && (
            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile Theme Toggle */}
              <button 
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="grid min-h-12 min-w-12 place-items-center rounded-lg border border-[#c5b89e] bg-[#e4d9c5] text-[#364358] shadow-sm hover:bg-[#ddd4c2] focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] transition dark:border-[#374c62] dark:bg-[#1d2535] dark:text-[#96a8b8] dark:hover:bg-[#22303e]"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <SunMedium size={18} aria-hidden="true" />
                ) : (
                  <MoonStar size={18} aria-hidden="true" />
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-controls="mobile-navigation"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
                className="grid min-h-12 min-w-12 place-items-center rounded-lg text-[#364358] hover:bg-[#e5dccf] focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] transition dark:text-[#96a8b8] dark:hover:bg-[#22303e]"
              >
                {menuOpen ? (
                  <X size={24} aria-hidden="true" />
                ) : (
                  <Menu size={24} aria-hidden="true" />
                )}
              </button>
            </div>
          )}
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
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-[#fdf9f2] shadow-2xl dark:bg-[#161d27]"
            style={{
              paddingBottom: 'max(1.5rem, var(--safe-area-inset-bottom, 0))',
            }}
          >
            {/* Drawer header — logo + close button */}
            <div className="flex items-center justify-between border-b border-[#d8ccb8] px-5 py-4 dark:border-[#2a3850]">
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1b3a6b] text-[#fdf9f2] dark:bg-[#d4a843]/20 dark:text-[#d4a843]">
                  <Scale size={16} strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-base font-bold leading-none text-[#0c1827] dark:text-[#e4d9c5]">LegalEase</span>
                  <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#69798e] dark:text-[#5a6c7a]">Legal Counsel</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-[#364358] hover:bg-[#e5dccf] dark:text-[#96a8b8] dark:hover:bg-[#1d2535]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav items */}
            <nav aria-label="Mobile navigation" className="grid gap-0.5 p-3">
              <NavLink
                to="/"
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#1b3a6b]/10 text-[#1b3a6b] dark:bg-[#d4a843]/10 dark:text-[#d4a843]'
                      : 'text-[#0c1827] hover:bg-[#e5dccf] dark:text-[#e4d9c5] dark:hover:bg-[#1d2535]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      isActive ? 'bg-[#1b3a6b]/15 dark:bg-[#d4a843]/15' : 'bg-[#e5dccf] dark:bg-[#1d2535]'
                    }`}>
                      <Scale size={15} strokeWidth={1.8} />
                    </span>
                    {t('nav.home')}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/lawyers"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                    isActive || location.pathname.startsWith('/lawyers')
                      ? 'bg-[#1b3a6b]/10 text-[#1b3a6b] dark:bg-[#d4a843]/10 dark:text-[#d4a843]'
                      : 'text-[#0c1827] hover:bg-[#e5dccf] dark:text-[#e4d9c5] dark:hover:bg-[#1d2535]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      isActive || location.pathname.startsWith('/lawyers') ? 'bg-[#1b3a6b]/15 dark:bg-[#d4a843]/15' : 'bg-[#e5dccf] dark:bg-[#1d2535]'
                    }`}>
                      <Search size={15} />
                    </span>
                    {t('nav.browseLawyers')}
                  </>
                )}
              </NavLink>

              {/* Search form */}
              <form onSubmit={submitSearch} className="relative my-1">
                <label className="sr-only" htmlFor="mobile-lawyer-search">Search lawyers</label>
                <Search className="pointer-events-none absolute left-3 top-3.5 text-[#69798e] dark:text-[#5a6c7a]" size={16} aria-hidden="true" />
                <input
                  id="mobile-lawyer-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#c5b89e] bg-[#e4d9c5]/60 py-2 pl-10 pr-3 text-sm text-[#0c1827] placeholder:text-[#69798e] transition focus:border-[#1b3a6b] focus:bg-white focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] dark:border-[#374c62] dark:bg-[#1d2535] dark:text-[#e4d9c5] dark:placeholder:text-[#5a6c7a] dark:focus:bg-[#0d1420]"
                  placeholder="Search by name or specialization"
                  aria-label="Search for lawyers"
                />
              </form>

              {/* Language switcher */}
              <div className="my-1 px-1">
                <LanguageSwitcher compact />
              </div>

              {/* Auth section */}
              {!isChecking && (
                isAuthenticated ? (
                  <>
                    <div className="my-1 border-t border-[#d8ccb8] pt-2 dark:border-[#2a3850]">
                      <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#69798e] dark:text-[#5a6c7a]">
                        {user.fullName}
                      </p>
                    </div>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                          isActive
                            ? 'bg-[#1b3a6b]/10 text-[#1b3a6b] dark:bg-[#d4a843]/10 dark:text-[#d4a843]'
                            : 'text-[#0c1827] hover:bg-[#e5dccf] dark:text-[#e4d9c5] dark:hover:bg-[#1d2535]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                            isActive ? 'bg-[#1b3a6b]/15 dark:bg-[#d4a843]/15' : 'bg-[#e5dccf] dark:bg-[#1d2535]'
                          }`}>
                            <LayoutDashboard size={15} />
                          </span>
                          {t('nav.dashboard')}
                        </>
                      )}
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#0c1827] transition hover:bg-red-50 hover:text-red-600 focus:outline-2 focus:outline-offset-2 focus:outline-[#1b3a6b] dark:text-[#e4d9c5] dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e5dccf] dark:bg-[#1d2535]">
                        <LogOut size={15} />
                      </span>
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[#1b3a6b]/10 text-[#1b3a6b] dark:bg-[#d4a843]/10 dark:text-[#d4a843]'
                          : 'text-[#0c1827] hover:bg-[#e5dccf] dark:text-[#e4d9c5] dark:hover:bg-[#1d2535]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                          isActive ? 'bg-[#1b3a6b]/15 dark:bg-[#d4a843]/15' : 'bg-[#e5dccf] dark:bg-[#1d2535]'
                        }`}>
                          <LogIn size={15} />
                        </span>
                        {t('nav.login')}
                      </>
                    )}
                  </NavLink>
                )
              )}
            </nav>
          </div>
        </ModalFocusRegion>
      )}

      {/* Scroll to top on every route change */}
      <ScrollRestoration />

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

      {/* Cookie consent */}
      <CookieConsent />
      <CallbackButton />
      <ExitIntentPopup />
    </div>
  )
}
