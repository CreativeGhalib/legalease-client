import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AuthContext } from '../../auth/authContext'
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
      <AuthContext.Provider value={{ user: null, isAuthenticated: false, isChecking: false, logout: vi.fn(), refreshAuth: vi.fn() }}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/lawyers']}>
            <BrowseLawyersPage />
          </MemoryRouter>
        </QueryClientProvider>
      </AuthContext.Provider>,
    )

    const searchInput = screen.getByPlaceholderText('Name or specialization')
    const specializationSelect = screen.getByRole('button', { name: 'Specialization' })
    const sortSelect = screen.getByRole('button', { name: 'Sort' })

    expect(screen.queryByRole('combobox')).toBeNull()
    expect(searchInput.className).toContain('dark:bg-[#1d2535]')
    expect(searchInput.className).toContain('dark:text-[#e4d9c5]')
    expect(specializationSelect.className).toContain('dark:bg-[#1d2535]')
    expect(sortSelect.className).toContain('dark:bg-[#1d2535]')
  })
})
