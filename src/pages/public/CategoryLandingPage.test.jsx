import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext } from '../../auth/authContext'
import CategoryLandingPage from './CategoryLandingPage'
import * as lawyerDiscoveryApi from '../../api/lawyerDiscoveryApi'

vi.mock('../../api/lawyerDiscoveryApi')

const oneLawyer = {
  data: {
    items: [{ id: '507f1f77bcf86cd799439011', fullName: 'Adv. Criminal', specialization: 'Criminal Law', consultationFeeMinor: 12000, availability: 'available' }],
  },
  meta: { totalItems: 1, totalPages: 1, page: 1 },
}

beforeEach(() => {
  vi.mocked(lawyerDiscoveryApi.getPublicLawyers).mockResolvedValue(oneLawyer)
})

afterEach(cleanup)

function renderAt(path) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <AuthContext.Provider value={{ user: null, isAuthenticated: false, isChecking: false, logout: () => {}, refreshAuth: async () => {} }}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/lawyers/in/:categorySlug" element={<CategoryLandingPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AuthContext.Provider>,
  )
}

describe('CategoryLandingPage', () => {
  it('renders a category heading for known slugs', async () => {
    renderAt('/lawyers/in/criminal-lawyer')
    expect(await screen.findByText('Find Criminal Law lawyers in Dhaka')).toBeTruthy()
  })

  it('renders NotFound for unknown slugs', () => {
    renderAt('/lawyers/in/made-up-slug')
    expect(screen.getByText('Page not found')).toBeTruthy()
  })
})
