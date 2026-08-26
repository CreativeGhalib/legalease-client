import { lazy, Suspense, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/useAuth'
import { confirmCaseCompletion, getMyPayments } from '../../api/paymentApi'
import { openDispute } from '../../api/disputeApi'
import ModalFocusRegion from '../../components/common/ModalFocusRegion'
import { ErrorState } from '../../components/common/QueryFeedback'
import { showSuccessToast } from '../../utils/toast'


const InvoiceButton = lazy(() => import('../../components/transactions/InvoiceButton'))

function date(value) { return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)) : null }

function ConfirmReleaseDialog({ item, onClose }) {
  const queryClient = useQueryClient()
  const confirmMutation = useMutation({
    mutationFn: () => confirmCaseCompletion(item.hiringRequestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments', 'mine'] }),
  })

  return (
    <ModalFocusRegion
      labelledBy="confirm-release-title"
      onClose={onClose}
      closeOnEscape={!confirmMutation.isPending}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl">
        <h2 id="confirm-release-title" className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]">
          Confirm completion &amp; release payment
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-[#a8bbcc]">
          Confirming tells LegalEase the engagement was delivered. The ${(item.amountMinor / 100).toFixed(2)}{' '}
          escrow is marked released to {item.lawyerName || 'the lawyer'}. This cannot be undone.
        </p>
        {confirmMutation.isError && (
          <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
            {confirmMutation.error?.response?.data?.error?.message ?? 'The release could not be completed.'}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={confirmMutation.isPending} className="le-button le-button-secondary">Cancel</button>
          <button type="button" disabled={confirmMutation.isPending} onClick={() => confirmMutation.mutate()} className="le-button le-button-primary">
            {confirmMutation.isPending ? 'Releasing…' : 'Confirm & release'}
          </button>
        </div>
      </div>
    </ModalFocusRegion>
  )
}

function DisputeDialog({ item, onClose }) {
  const queryClient = useQueryClient()
  const [reason, setReason] = useState('')
  const disputeMutation = useMutation({
    mutationFn: () => openDispute({ hiringRequestId: item.hiringRequestId, reason: reason.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'mine'] })
      showSuccessToast('Dispute submitted — an admin will review it shortly.')
      onClose()
    },
  })

  return (
    <ModalFocusRegion
      labelledBy="dispute-dialog-title"
      onClose={onClose}
      closeOnEscape={!disputeMutation.isPending}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
    >
      <form
        onSubmit={(event) => { event.preventDefault(); disputeMutation.mutate() }}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl"
      >
        <h2 id="dispute-dialog-title" className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]">Raise a dispute</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-[#a8bbcc]">
          Explain what went wrong with this engagement. An admin will review the payment record and both parties.
          Disputes pause all payment actions and must be raised within 30 days of payment.
        </p>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          minLength={10}
          maxLength={1000}
          required
          rows={4}
          aria-label="Dispute reason"
          placeholder="Describe the issue (minimum 10 characters)…"
          className="mt-3 w-full rounded-xl border border-slate-300 dark:border-[#1c3050] p-3 text-sm"
        />
        <p className="mt-1 text-right text-xs text-slate-400 dark:text-[#7090a4]">{reason.length}/1000</p>
        {disputeMutation.isError && (
          <p role="alert" className="mt-2 text-sm text-rose-700 dark:text-rose-300">
            {disputeMutation.error?.response?.data?.error?.message ?? 'The dispute could not be submitted.'}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={disputeMutation.isPending} className="le-button le-button-secondary">Cancel</button>
          <button type="submit" disabled={disputeMutation.isPending || reason.trim().length < 10} className="le-button le-button-primary">
            {disputeMutation.isPending ? 'Submitting…' : 'Submit dispute'}
          </button>
        </div>
      </form>
    </ModalFocusRegion>
  )
}

function EscrowCell({ item }) {
  const { user } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [disputeOpen, setDisputeOpen] = useState(false)
  const isPayer = user?.role === 'user'

  if (item.type !== 'hiring_fee' || !item.paidAt) return null

  if (item.escrowStatus === 'released') {
    return <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">Released ✓ {date(item.releasedAt)}</span>
  }
  if (item.escrowStatus === 'refunded') {
    return <span className="rounded-full bg-sky-100 dark:bg-sky-900/30 px-3 py-1 text-xs font-semibold text-sky-800 dark:text-sky-300">Refunded · ${((item.refundAmountMinor ?? item.amountMinor) / 100).toFixed(2)}</span>
  }
  if (item.escrowStatus === 'disputed') {
    return <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200">Dispute under review</span>
  }
  if (item.escrowStatus === 'held' && isPayer && item.hiringRequestId) {
    return (
      <div className="flex flex-col items-end gap-2">
        <button type="button" onClick={() => setDialogOpen(true)} className="min-h-9 rounded-lg border border-indigo-200 bg-indigo-50 dark:border-[#2a3850] dark:bg-[#1b3a6b]/20 px-3 text-xs font-semibold text-indigo-700 dark:text-[#a8bbcc] transition hover:bg-indigo-100 dark:hover:bg-[#1b3a6b]/40">
          Confirm completion &amp; release
        </button>
        <button type="button" onClick={() => setDisputeOpen(true)} className="text-[11px] font-semibold text-rose-600 underline-offset-2 hover:underline dark:text-rose-300">
          Raise dispute
        </button>
        {dialogOpen && <ConfirmReleaseDialog item={item} onClose={() => setDialogOpen(false)} />}
        {disputeOpen && <DisputeDialog item={item} onClose={() => setDisputeOpen(false)} />}
      </div>
    )
  }
  if (item.escrowStatus === 'held') {
    return <span className="rounded-full bg-slate-100 dark:bg-[#162236] px-3 py-1 text-xs font-semibold text-slate-600 dark:text-[#96a8b8]">Awaiting client confirmation</span>
  }
  return null
}

export default function TransactionHistoryPage() {
  const { user } = useAuth()
  const payments = useQuery({ queryKey: ['payments', 'mine'], queryFn: getMyPayments })

  if (payments.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (payments.isError) return <ErrorState message="Transactions could not be loaded." onRetry={() => payments.refetch()} />

  const intro = user?.role === 'lawyer' ? 'Your verification payment and paid hiring fees connected to your professional profile.' : 'Payments you have made through LegalEase.'

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Payment records</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">Transactions</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-[#a8bbcc]">{intro}</p>

      {payments.data.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 text-slate-600 dark:text-[#a8bbcc]">
          No payment records yet.
        </div>
      ) : (
        <div className="mt-7 grid gap-3">
          {payments.data.map((item) => (
            <article key={item.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
              <div className="min-w-0">
                <p className="font-semibold text-slate-950 dark:text-[#ece5d6]">
                  {item.type === 'hiring_fee' ? 'Hiring consultation fee' : 'Publishing verification'}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-[#a8bbcc]">
                  ${(item.amountMinor / 100).toFixed(2)} {item.currency.toUpperCase()}
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-[#a8bbcc]">
                  {item.status === 'paid' && item.paidAt ? `Paid ${date(item.paidAt)}` : `Created ${date(item.createdAt)}`}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2.5">
                <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${item.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-[#0c1728] text-slate-700 dark:text-[#ece5d6]'}`}>
                  {item.status}
                </span>
                <EscrowCell item={item} />
                <Suspense fallback={<span className="inline-flex min-h-9 items-center text-xs text-slate-400 dark:text-[#7090a4]">Loading invoice…</span>}>
                  <InvoiceAction item={item} />
                </Suspense>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function InvoiceAction({ item }) {
  if (item.status !== 'paid') return null
  return <InvoiceButton item={item} />
}
