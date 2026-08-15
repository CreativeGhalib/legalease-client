import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import BrowseLawyersPage from './BrowseLawyersPage'

const mockUseQuery = vi.fn()
const mockGetPublicLawyers = vi.fn()

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: (...args) => mockUseQuery(...args),
  }
})

vi.mock('../../api/lawyerDiscoveryApi', () => ({
  getPublicLawyers: (...args) => mockGetPublicLawyers(...args),
}))

describe('BrowseLawyersPage dark mode styling', () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: { data: { items: [] }, meta: { totalItems: 0, totalPages: 1, page: 1 } },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    })
  })

  it('uses dark-mode friendly filter styling and custom desktop dropdown controls', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/lawyers']}>
          <BrowseLawyersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    const searchInput = screen.getByPlaceholderText('Name or specialization')
    const specializationSelect = screen.getByRole('button', { name: 'Specialization' })
    const sortSelect = screen.getByRole('button', { name: 'Sort' })

    expect(screen.queryByRole('combobox')).toBeNull()
    expect(searchInput.className).toContain('dark:bg-slate-900')
    expect(searchInput.className).toContain('dark:text-slate-100')
    expect(specializationSelect.className).toContain('dark:bg-slate-900')
    expect(sortSelect.className).toContain('dark:bg-slate-900')
  })
})
