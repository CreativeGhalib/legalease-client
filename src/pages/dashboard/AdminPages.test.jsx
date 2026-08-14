import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as api from '../../api/adminApi'
import { AdminLawyersPage, AdminTransactionsPage } from './AdminPages'

vi.mock('../../api/adminApi', () => ({
  deleteAdminLawyer: vi.fn(),
  getAdminAnalytics: vi.fn(),
  getAdminLawyers: vi.fn(),
  getAdminTransactions: vi.fn(),
  getAdminUsers: vi.fn(),
  moderateAdminLawyer: vi.fn(),
  updateAdminUserRole: vi.fn(),
  updateAdminUserStatus: vi.fn(),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function renderWithQueryClient(component) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>)
}

describe('Admin pagination', () => {
  it('requests the next lawyer page and resets to page one when filtering', async () => {
    api.getAdminLawyers.mockImplementation(async ({ page, publicationStatus }) => ({
      items: [{ id: `lawyer-${page}`, fullName: `Lawyer ${page}`, email: 'lawyer@example.test', specialization: 'Family Law', publicationStatus: publicationStatus || 'published', verificationStatus: 'paid' }],
      meta: { page, totalPages: 2 },
    }))
    const user = userEvent.setup()
    renderWithQueryClient(<AdminLawyersPage />)

    await screen.findByText('Lawyer 1')
    expect(screen.getByRole('button', { name: 'Previous' }).disabled).toBe(true)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(api.getAdminLawyers).toHaveBeenLastCalledWith({ page: 2 }))
    expect(screen.getByRole('button', { name: 'Next' }).disabled).toBe(true)
    await user.click(screen.getByRole('button', { name: 'Previous' }))
    await waitFor(() => expect(api.getAdminLawyers).toHaveBeenLastCalledWith({ page: 1 }))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(api.getAdminLawyers).toHaveBeenLastCalledWith({ page: 2 }))

    await user.selectOptions(screen.getByRole('combobox'), 'deleted')
    await waitFor(() => expect(api.getAdminLawyers).toHaveBeenLastCalledWith({ publicationStatus: 'deleted', page: 1 }))
  })

  it('clamps to the last valid lawyer page after a filtering mutation shrinks the result', async () => {
    let mutated = false
    api.getAdminLawyers.mockImplementation(async ({ page }) => {
      if (mutated && page === 2) return { items: [], meta: { page: 2, totalPages: 1 } }
      return {
        items: [{ id: `lawyer-${page}`, fullName: `Published Lawyer ${page}`, email: 'lawyer@example.test', specialization: 'Family Law', publicationStatus: 'published', verificationStatus: 'paid' }],
        meta: { page, totalPages: mutated ? 1 : 2 },
      }
    })
    api.moderateAdminLawyer.mockImplementation(async () => { mutated = true })
    const user = userEvent.setup()
    renderWithQueryClient(<AdminLawyersPage />)

    await user.selectOptions(await screen.findByRole('combobox'), 'published')
    await screen.findByText('Published Lawyer 1')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await screen.findByText('Published Lawyer 2')
    await user.click(screen.getByRole('button', { name: 'suspend' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'suspend' }))

    await waitFor(() => expect(api.getAdminLawyers).toHaveBeenLastCalledWith({ publicationStatus: 'published', page: 1 }))
    await screen.findByText('Published Lawyer 1')
    expect(screen.queryByText('Page 2 of 1')).toBeNull()
  })

  it('requests the next transaction page and resets to page one when filtering', async () => {
    api.getAdminTransactions.mockImplementation(async ({ page, type }) => ({
      items: [{ id: `transaction-${page}`, type: type || 'hiring_fee', amountMinor: 1000, currency: 'usd', status: 'paid', payer: null, lawyer: null }],
      meta: { page, totalPages: 2 },
    }))
    const user = userEvent.setup()
    renderWithQueryClient(<AdminTransactionsPage />)

    await screen.findByText('$10.00 USD · paid')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(api.getAdminTransactions).toHaveBeenLastCalledWith({ page: 2 }))

    await user.selectOptions(screen.getAllByRole('combobox')[0], 'lawyer_verification')
    await waitFor(() => expect(api.getAdminTransactions).toHaveBeenLastCalledWith({ type: 'lawyer_verification', page: 1 }))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(api.getAdminTransactions).toHaveBeenLastCalledWith({ type: 'lawyer_verification', page: 2 }))
    await user.selectOptions(screen.getAllByRole('combobox')[1], 'paid')
    await waitFor(() => expect(api.getAdminTransactions).toHaveBeenLastCalledWith({ type: 'lawyer_verification', status: 'paid', page: 1 }))
  })
})
