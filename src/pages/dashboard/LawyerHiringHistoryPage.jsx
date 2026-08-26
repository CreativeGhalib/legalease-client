import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { decideHiringRequest, getReceivedHiringRequests } from '../../api/hiringRequestApi'
import ModalFocusRegion from '../../components/common/ModalFocusRegion'
import MilestoneManager from '../../components/dashboard/MilestoneManager'
import SlaCountdown from '../../components/hiring/SlaCountdown'
import ProfileAvatar from '../../components/common/ProfileAvatar'
import { ErrorState } from '../../components/common/QueryFeedback'
import { getApiErrorMessage } from '../../utils/apiError'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return null
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
}

// ─── Decision Dialog ──────────────────────────────────────────────────────────

function DecisionDialog({ confirm, decisionMutation, onCancel }) {
  if (!confirm) return null

  const isAccepting = confirm.value === 'accepted'

  return (
    <ModalFocusRegion
      labelledBy="decision-dialog-title"
      onClose={onCancel}
      closeOnEscape={!decisionMutation.isPending}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
    >
      <section className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl">
        <h2
          id="decision-dialog-title"
          className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]"
        >
          {isAccepting ? 'Accept this request?' : 'Reject this request?'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-[#a8bbcc]">
          This decision is final and cannot be changed later.
        </p>
        {decisionMutation.isError && (
          <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
            {getApiErrorMessage(decisionMutation.error)}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={decisionMutation.isPending}
            onClick={onCancel}
            className="min-h-11 rounded-xl px-3 text-sm font-semibold text-slate-700 dark:text-[#ece5d6]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={decisionMutation.isPending}
            onClick={() => decisionMutation.mutate(confirm)}
            className="min-h-11 rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {decisionMutation.isPending ? 'Saving…' : 'Confirm decision'}
          </button>
        </div>
      </section>
    </ModalFocusRegion>
  )
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({ item, decisionMutation, onDecide }) {
  const [managerOpen, setManagerOpen] = useState(false)
  const isPaid = item.paymentStatus === 'paid'
  const isCheckout = item.paymentStatus === 'checkout_created'

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <div className="flex min-w-0 items-center gap-4">
        <ProfileAvatar
          src={item.client.profileImageUrl}
          name={item.client.fullName}
          alt={`Portrait of ${item.client.fullName}`}
          className="h-16 w-16"
          textClassName="text-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-[#a8bbcc]">
            Client
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-slate-950 dark:text-[#ece5d6]">
            {item.client.fullName}
          </h2>
          <p className="truncate text-sm text-slate-600 dark:text-[#a8bbcc]">
            {item.client.email}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-[#a8bbcc]">
            {item.specializationSnapshot} · ${(item.feeMinorSnapshot / 100).toFixed(2)}{' '}
            {item.currency}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-[#a8bbcc]">
            Requested {formatDate(item.createdAt)}
            {item.decisionAt ? ` · Decided ${formatDate(item.decisionAt)}` : ''}
            {item.paidAt ? ` · Paid ${formatDate(item.paidAt)}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-[#1c3050] pt-4">
        <span className="rounded-full bg-indigo-50 dark:bg-[#1b3a6b]/15 px-3 py-1 text-sm font-semibold capitalize text-indigo-800">
          Request: {item.status}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isPaid
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-[#0c1728] text-slate-700 dark:text-[#ece5d6]'
          }`}
        >
          Payment:{' '}
          {isPaid ? 'Paid' : isCheckout ? 'Session ready' : 'Unpaid'}
        </span>

        {item.status === 'pending' && (
          <>
            <SlaCountdown expiresAt={item.expiresAt} />
            <button
              type="button"
              disabled={decisionMutation.isPending}
              onClick={() => onDecide({ id: item.id, value: 'accepted' })}
              className="min-h-11 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              Accept request
            </button>
            <button
              type="button"
              disabled={decisionMutation.isPending}
              onClick={() => onDecide({ id: item.id, value: 'rejected' })}
              className="min-h-11 rounded-xl border border-rose-200 dark:border-rose-900/50 px-4 text-sm font-semibold text-rose-700 dark:text-rose-300 disabled:opacity-60"
            >
              Reject request
            </button>
          </>
        )}
        {item.status === 'expired' && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-[#162236] dark:text-[#96a8b8]">
            Auto-closed after 48h without a response
          </span>
        )}
        {isPaid && item.milestoneSummary && (
          <button
            type="button"
            onClick={() => setManagerOpen(true)}
            aria-expanded={managerOpen}
            className="min-h-11 rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-[#2a3850] dark:bg-[#1b3a6b]/20 dark:text-[#a8bbcc] dark:hover:bg-[#1b3a6b]/40"
          >
            Milestones {item.milestoneSummary.completed}/{item.milestoneSummary.total}
          </button>
        )}
      </div>
      {managerOpen && isPaid && <MilestoneManager item={item} onClose={() => setManagerOpen(false)} />}
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LawyerHiringHistoryPage() {
  const queryClient = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const [pipeline, setPipeline] = useState('all')

  const requestsQuery = useQuery({
    queryKey: ['hiring-requests', 'received'],
    queryFn: getReceivedHiringRequests,
  })

  const decisionMutation = useMutation({
    mutationFn: ({ id, value }) => decideHiringRequest(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-requests', 'received'] })
      setConfirm(null)
    },
  })

  if (requestsQuery.isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  }

  if (requestsQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(requestsQuery.error)}
        onRetry={() => requestsQuery.refetch()}
      />
    )
  }

  const allItems = requestsQuery.data
  const pipelineFilters = [
    { key: 'all', label: 'All', test: () => true },
    { key: 'awaiting-decision', label: 'Awaiting decision', test: (item) => item.status === 'pending' },
    { key: 'accepted-unpaid', label: 'Accepted · awaiting payment', test: (item) => item.status === 'accepted' && item.paymentStatus !== 'paid' },
    { key: 'active-paid', label: 'Paid · active case', test: (item) => item.paymentStatus === 'paid' && !(item.milestoneSummary && item.milestoneSummary.total > 0 && item.milestoneSummary.completed === item.milestoneSummary.total) },
    { key: 'completed-case', label: 'Case completed', test: (item) => item.milestoneSummary && item.milestoneSummary.total > 0 && item.milestoneSummary.completed === item.milestoneSummary.total },
  ]
  const visibleItems = allItems.filter(pipelineFilters.find((filter) => filter.key === pipeline).test)

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
        Your professional practice
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">
        Client requests
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-[#a8bbcc]">
        Requests clients sent to you. Only pending requests need your Accept or Reject decision.
      </p>

      <div role="group" aria-label="Pipeline filter" className="mt-6 flex flex-wrap gap-2">
        {pipelineFilters.map((filter) => {
          const count = allItems.filter(filter.test).length
          const active = pipeline === filter.key
          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={active}
              onClick={() => setPipeline(filter.key)}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold transition ${
                active
                  ? 'border-indigo-700 bg-indigo-700 text-white'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-[#1c3050] dark:text-[#a8bbcc] dark:hover:bg-[#162236]'
              }`}
            >
              {filter.label} ({count})
            </button>
          )
        })}
      </div>

      {visibleItems.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 text-slate-600 dark:text-[#a8bbcc]">
          No requests in this stage of the pipeline.
        </div>
      ) : (
        <div className="mt-7 grid gap-4">
          {visibleItems.map((item) => (
            <RequestCard
              key={item.id}
              item={item}
              decisionMutation={decisionMutation}
              onDecide={setConfirm}
            />
          ))}
        </div>
      )}

      <DecisionDialog
        confirm={confirm}
        decisionMutation={decisionMutation}
        onCancel={() => setConfirm(null)}
      />
    </section>
  )
}
