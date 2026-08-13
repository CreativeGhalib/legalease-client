import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom'
import { AuthContext } from './authContext'
import ProtectedRoute from './ProtectedRoute'
import GuestOnlyRoute from './GuestOnlyRoute'
import RoleRoute from './RoleRoute'
import PublicLayout from '../layouts/PublicLayout'

afterEach(cleanup)

function authValue(role = null, overrides = {}) {
  return {
    user: role ? { fullName: `${role} account`, role } : null,
    isAuthenticated: Boolean(role),
    isChecking: false,
    logout: vi.fn().mockResolvedValue(undefined),
    refreshAuth: vi.fn(),
    register: vi.fn(),
    login: vi.fn(),
    ...overrides,
  }
}

function LocationProbe() {
  const location = useLocation()
  return <p data-testid="location">{location.pathname}</p>
}

function renderGuard(role, targetPath, allowedRoles) {
  const router = createMemoryRouter([
    {
      path: targetPath,
      element: <ProtectedRoute><RoleRoute roles={allowedRoles}><p>allowed-page</p></RoleRoute></ProtectedRoute>,
    },
    { path: '/login', element: <LocationProbe /> },
    { path: '/unauthorized', element: <LocationProbe /> },
  ], { initialEntries: [targetPath] })

  render(<AuthContext.Provider value={authValue(role)}><RouterProvider router={router} /></AuthContext.Provider>)
  return router
}

describe('Phase 2B account route matrix', () => {
  it.each([
    ['user', '/dashboard/user', ['user']],
    ['lawyer', '/dashboard/lawyer', ['lawyer']],
    ['admin', '/dashboard/admin', ['admin']],
  ])('%s account can access its own route', async (role, path, roles) => {
    renderGuard(role, path, roles)
    expect(await screen.findByText('allowed-page')).toBeTruthy()
  })

  it.each([
    ['user', '/dashboard/lawyer', ['lawyer']],
    ['user', '/dashboard/admin', ['admin']],
    ['lawyer', '/dashboard/user', ['user']],
    ['lawyer', '/dashboard/admin', ['admin']],
    ['admin', '/dashboard/user', ['user']],
    ['admin', '/dashboard/lawyer', ['lawyer']],
  ])('%s account is denied a different role route', async (role, path, roles) => {
    renderGuard(role, path, roles)
    expect((await screen.findByTestId('location')).textContent).toBe('/unauthorized')
  })

  it('guest is redirected to login with a protected route', async () => {
    renderGuard(null, '/dashboard/user', ['user'])
    expect((await screen.findByTestId('location')).textContent).toBe('/login')
  })

  it('checking state renders a loader before any redirect', () => {
    const router = createMemoryRouter([
      { path: '/dashboard/user', element: <ProtectedRoute><p>allowed-page</p></ProtectedRoute> },
      { path: '/login', element: <LocationProbe /> },
    ], { initialEntries: ['/dashboard/user'] })
    render(<AuthContext.Provider value={authValue(null, { isChecking: true })}><RouterProvider router={router} /></AuthContext.Provider>)
    expect(screen.getByText('Checking your secure session...')).toBeTruthy()
  })

  it('sends an authenticated account away from login to the dashboard', async () => {
    const router = createMemoryRouter([
      { path: '/login', element: <GuestOnlyRoute><p>login-page</p></GuestOnlyRoute> },
      { path: '/dashboard', element: <LocationProbe /> },
    ], { initialEntries: ['/login'] })
    render(<AuthContext.Provider value={authValue('user')}><RouterProvider router={router} /></AuthContext.Provider>)
    expect((await screen.findByTestId('location')).textContent).toBe('/dashboard')
  })
})

describe('authentication-aware navigation', () => {
  function renderShell(value) {
    const router = createMemoryRouter([
      { path: '/', element: <PublicLayout />, children: [{ index: true, element: <p>home-page</p> }] },
    ], { initialEntries: ['/'] })
    render(<AuthContext.Provider value={value}><RouterProvider router={router} /></AuthContext.Provider>)
  }

  it('shows Login only for a guest', () => {
    renderShell(authValue())
    expect(screen.getByText('Login')).toBeTruthy()
    expect(screen.queryByText('Dashboard')).toBeNull()
    expect(screen.queryByText('Logout')).toBeNull()
  })

  it('shows Dashboard and Logout only for an authenticated account', async () => {
    const value = authValue('user')
    renderShell(value)
    expect(screen.getByText('Dashboard')).toBeTruthy()
    expect(screen.getByText('Logout')).toBeTruthy()
    expect(screen.queryByText('Login')).toBeNull()
    await userEvent.setup().click(screen.getByText('Logout'))
    expect(value.logout).toHaveBeenCalledTimes(1)
  })
})
