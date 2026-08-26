import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext } from '../../auth/authContext'
import TransactionHistoryPage from './TransactionHistoryPage'
import * as paymentApi from '../../api/paymentApi'

vi.mock('../../api/paymentApi')
vi.mock('../../components/transactions/InvoiceButton', () => ({ default: () => <button type="button">Invoice</button> }))

const heldFee = {
  id: '507f1f77bcf86cd799439011',
  type: 'hiring_fee',
  amountMinor: 20000,
  currency: 'usd',
  status: 'paid',
  paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  hiringRequestId: '507f191e810c19729de860ea',
  escrowStatus: 'held',
  releaseReason: null,
  releasedAt: null,
  payerName: 'Test Client',
  lawyerName: 'Test Lawyer',
}

const releasedFee = {
  ...heldFee,
  id: '507f1f77bcf86cd799439012',
  escrowStatus: 'released',
  releaseReason: 'client_confirmed',
  releasedAt: new Date().toISOString(),
}

beforeEach(() => {
  vi.mocked(paymentApi.getMyPayments).mockResolvedValue([heldFee])
  vi.mocked(paymentApi.confirmCaseCompletion).mockResolvedValue({ escrowStatus: 'released' })
})

afterEach(() => {
  cleanup()
  vi.mocked(paymentApi.getMyPayments).mockReset()
  vi.mocked(paymentApi.confirmCaseCompletion).mockReset()
})

function renderPage(role = 'user') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <AuthContext.Provider value={{ user: { fullName: 'Tester', role }, isAuthenticated: true, isChecking: false, logout: vi.fn(), refreshAuth: vi.fn() }}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransactionHistoryPage />
        </MemoryRouter>
      </QueryClientProvider>
    </AuthContext.Provider>,
  )
}

describe('TransactionHistoryPage escrow controls', () => {
  it('offers completion confirmation to the payer for held hiring fees and calls the API on confirm', async () => {
    renderPage()
    const button = await screen.findByRole('button', { name: /confirm completion & release/i })
    expect(button).toBeTruthy()

    fireEvent.click(button)
    expect(await screen.findByText(/confirming tells legalease/i)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /confirm & release/i }))
    await waitFor(() =>
      expect(paymentApi.confirmCaseCompletion.mock.calls[0]?.[0]).toBe(heldFee.hiringRequestId),
    )
  })

  it('shows a Released chip with the date instead of actions once released', async () => {
    vi.mocked(paymentApi.getMyPayments).mockResolvedValue([releasedFee])
    renderPage()
    expect(await screen.findByText(/Released ✓/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /confirm completion & release/i })).toBeNull()
    expect(vi.mocked(paymentApi.confirmCaseCompletion)).not.toHaveBeenCalled()
  })

  it('hides escrow controls from lawyers while funds are held', async () => {
    renderPage('lawyer')
    expect(await screen.findByText(/Awaiting client confirmation/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /confirm completion & release/i })).toBeNull()
  })
})
