import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext } from '../auth/authContext'
import DashboardLayout from './DashboardLayout'

vi.mock('../api/notificationApi', () => ({
  getNotifications: vi.fn().mockResolvedValue({ items: [], unreadCount: 0, meta: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 } }),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}))

afterEach(cleanup)

function renderDashboard(role = 'user') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter([
    { path: '/dashboard', element: <DashboardLayout />, children: [{ index: true, element: <p>dashboard-content</p> }] },
  ], { initialEntries: ['/dashboard'] })
  render(
    <AuthContext.Provider value={{ user: { fullName: 'Dashboard Account', role }, isAuthenticated: true, isChecking: false, logout: vi.fn(), refreshAuth: vi.fn() }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthContext.Provider>,
  )
}

describe('Phase 6 dashboard layout', () => {
  it('uses the current role registry', () => {
    renderDashboard('lawyer')
    expect(screen.getByText('Manage legal profile')).toBeTruthy()
    expect(screen.getByText('Client requests')).toBeTruthy()
    expect(screen.queryByText('Manage users')).toBeNull()
  })

  it('opens and closes the mobile drawer with button and Escape', () => {
    renderDashboard()
    const control = screen.getByRole('button', { name: 'Open dashboard menu' })
    expect(control.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(control)
    expect(screen.getByRole('button', { name: 'Close dashboard menu' }).getAttribute('aria-expanded')).toBe('true')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Open dashboard menu' }).getAttribute('aria-expanded')).toBe('false')
  })
})
