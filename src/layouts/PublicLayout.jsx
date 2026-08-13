import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function PublicLayout() {
  const { isAuthenticated, isChecking, logout, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-950">LegalEase</Link>
          <nav className="flex items-center gap-3 text-sm sm:gap-4">
            {!isChecking && (isAuthenticated ? (
              <>
                <span className="hidden text-slate-600 sm:inline">{user.fullName}</span>
                <NavLink to="/dashboard" className="text-slate-800 hover:text-slate-950">Dashboard</NavLink>
                <button type="button" onClick={handleLogout} className="min-h-11 text-slate-800 hover:text-slate-950">Logout</button>
              </>
            ) : (
              <NavLink to="/login" className="text-slate-800 hover:text-slate-950">Login</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
    </div>
  )
}
