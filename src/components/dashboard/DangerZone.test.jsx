import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DangerZone from './DangerZone'

vi.mock('../../api/userProfileApi', () => ({
  requestAccountDeletion: vi.fn(),
  cancelAccountDeletion: vi.fn(),
  revokeAllSessions: vi.fn(),
}))

afterEach(cleanup)

function renderDangerZone(props = {}) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <DangerZone {...props} />
    </QueryClientProvider>,
  )
}

describe('DangerZone account method handling', () => {
  it('renders password confirmation for a local account without throwing', () => {
    renderDangerZone({ hasLocalPassword: true })

    expect(screen.getByText('Danger zone')).toBeTruthy()
    expect(screen.getByLabelText('Current password for signing out other devices')).toBeTruthy()
    expect(screen.getByLabelText('Current password for account deletion')).toBeTruthy()
  })

  it('renders password-free confirmation for a Google-only account', () => {
    renderDangerZone({ hasLocalPassword: false })

    expect(screen.getByText('I signed up with Google (no password needed)')).toBeTruthy()
    expect(screen.queryByLabelText('Current password for account deletion')).toBeNull()
  })
})
