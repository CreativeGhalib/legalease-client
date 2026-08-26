import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import StatsBar from './StatsBar'
import RecentLawyers from './RecentLawyers'
import TrustSignals from '../lawyers/TrustSignals'
import * as statsApi from '../../api/statsApi'

vi.mock('../../api/statsApi')

afterEach(() => {
  cleanup()
  vi.mocked(statsApi.getPublicStats).mockReset()
})

function renderWithProviders(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Smart social proof components', () => {
  it('StatsBar hides entirely while every count is zero', async () => {
    vi.mocked(statsApi.getPublicStats).mockResolvedValue({ lawyerCount: 0, paidHireCount: 0, userCount: 0, recentLawyers: [] })
    const { container } = renderWithProviders(<StatsBar />)
    await waitFor(() => expect(vi.mocked(statsApi.getPublicStats)).toHaveBeenCalled())
    expect(container.firstChild).toBeNull()
  })

  it('StatsBar shows only non-zero metrics with truthful labels', async () => {
    vi.mocked(statsApi.getPublicStats).mockResolvedValue({ lawyerCount: 6, paidHireCount: 0, userCount: 2, recentLawyers: [] })
    renderWithProviders(<StatsBar />)
    expect(await screen.findByText('Verified lawyers')).toBeTruthy()
    expect(screen.queryByText('Engagements resolved')).toBeNull()
    await waitFor(() => expect(screen.getByText('6')).toBeTruthy(), { timeout: 2000 })
  })

  it('RecentLawyers lists verified newcomers and hides when empty', async () => {
    vi.mocked(statsApi.getPublicStats).mockResolvedValue({
      lawyerCount: 1,
      paidHireCount: 0,
      userCount: 0,
      recentLawyers: [{ id: '507f1f77bcf86cd799439011', fullName: 'Adv. Newcomer', specialization: 'Criminal Law', location: 'Dhaka' }],
    })
    renderWithProviders(<RecentLawyers />)
    expect(await screen.findByText('Adv. Newcomer')).toBeTruthy()

    vi.mocked(statsApi.getPublicStats).mockResolvedValue({ lawyerCount: 0, paidHireCount: 0, userCount: 0, recentLawyers: [] })
    const { container } = renderWithProviders(<RecentLawyers />)
    await waitFor(() => expect(container.firstChild).toBeNull())
  })

  it('TrustSignals always shows verification and formats member/hire lines truthfully', () => {
    render(
      <TrustSignals
        joinedAt="2026-03-05T00:00:00.000Z"
        paidHireCount={1}
        barAssociationBranch="Dhaka Bar Association"
      />,
    )
    expect(screen.getByText('Member since March 2026')).toBeTruthy()
    expect(screen.getByText('1 engagement completed')).toBeTruthy()
    expect(screen.getByText('Bar Council Verified · Dhaka Bar Association')).toBeTruthy()

    cleanup()
    render(<TrustSignals joinedAt="2026-03-05T00:00:00.000Z" paidHireCount={0} />)
    expect(screen.getAllByText(/Member since March 2026/).length).toBe(1)
    expect(screen.queryByText(/engagement.*completed/)).toBeNull()
  })
})
