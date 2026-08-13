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
    <div className="min-h-screen">
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="font-semibold text-slate-900">LegalEase</Link>
          <nav className="flex items-center gap-4 text-sm">
            {!isChecking && (isAuthenticated ? (
              <>
                <span className="hidden text-slate-600 sm:inline">{user.fullName}</span>
                <NavLink to="/dashboard" className="text-slate-800 hover:text-slate-950">Dashboard</NavLink>
                <button type="button" onClick={handleLogout} className="text-slate-800 hover:text-slate-950">Logout</button>
              </>
            ) : (
              <NavLink to="/login" className="text-slate-800 hover:text-slate-950">Login</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
