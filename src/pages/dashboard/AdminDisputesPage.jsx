import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import ModalFocusRegion from '../../components/common/ModalFocusRegion'
import { EmptyState, ErrorState } from '../../components/common/QueryFeedback'
import { getApiErrorMessage } from '../../utils/apiError'

function formatDate(value) {
  return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)) : '—'
}

const STATUS_STYLES = {
  open: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  resolved_refund: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  resolved_release: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
}

function ResolveDialog({ dispute, onClose }) {
  const queryClient = useQueryClient()
  const [outcome, setOutcome] = useState('refund')
  const [note, setNote] = useState('')
  const resolveMutation = useMutation({
    mutationFn: () => api.patch(`/admin/disputes/${dispute.id}/resolve`, { outcome, note: note.trim() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] }),
  })

  return (
    <ModalFocusRegion
      labelledBy="resolve-dispute-title"
      onClose={onClose}
      closeOnEscape={!resolveMutation.isPending}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
    >
      <form
        onSubmit={(event) => { event.preventDefault(); resolveMutation.mutate() }}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl"
      >
        <h2 id="resolve-dispute-title" className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]">Resolve dispute</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-[#a8bbcc]">
          Opened by {dispute.openedBy?.fullName ?? 'Unknown'} ({dispute.openedByRole}) ·{' '}
          {dispute.engagement?.specializationSnapshot} · ${(dispute.engagement?.feeMinorSnapshot ?? 0) / 100}
        </p>
        <p className="mt-2 rounded-lg bg-slate-100 dark:bg-[#101b2c] p-3 text-sm italic text-slate-700 dark:text-[#a8bbcc]">
          “{dispute.reason}”
        </p>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-slate-800 dark:text-[#ece5d6]">Outcome</legend>
          <div className="mt-2 grid gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1c3050] px-3 py-2 text-sm has-checked:border-indigo-500">
              <input type="radio" name="outcome" value="refund" checked={outcome === 'refund'} onChange={() => setOutcome('refund')} />
              Refund the client (full amount)
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1c3050] px-3 py-2 text-sm has-checked:border-indigo-500">
              <input type="radio" name="outcome" value="release" checked={outcome === 'release'} onChange={() => setOutcome('release')} />
              Release funds to the lawyer
            </label>
          </div>
        </fieldset>

        <label className="mt-3 block text-sm font-semibold text-slate-800 dark:text-[#ece5d6]" htmlFor="resolution-note">
          Resolution note
        </label>
        <textarea
          id="resolution-note"
          required
          minLength={5}
          maxLength={600}
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 dark:border-[#1c3050] p-3 text-sm"
        />

        {resolveMutation.isError && (
          <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{getApiErrorMessage(resolveMutation.error)}</p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={resolveMutation.isPending} className="le-button le-button-secondary">Cancel</button>
          <button type="submit" disabled={resolveMutation.isPending || note.trim().length < 5} className="le-button le-button-primary">
            {resolveMutation.isPending ? 'Resolving…' : `Confirm ${outcome === 'refund' ? 'refund' : 'release'}`}
          </button>
        </div>
      </form>
    </ModalFocusRegion>
  )
}

export default function AdminDisputesPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [resolving, setResolving] = useState(null)

  const disputesQuery = useQuery({
    queryKey: ['admin', 'disputes', statusFilter, page],
    queryFn: async () => {
      const params = { page }
      if (statusFilter) params.status = statusFilter
      const response = await api.get('/admin/disputes', { params })
      return { items: response.data.data.items, meta: response.data.meta }
    },
  })

  if (disputesQuery.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (disputesQuery.isError) return <ErrorState message="Disputes could not be loaded." onRetry={() => disputesQuery.refetch()} />

  const meta = disputesQuery.data.meta

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Administration</p>
      <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">
        <Scale size={26} className="text-indigo-700" /> Disputes
      </h1>

      <div role="group" aria-label="Status filter" className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/dashboard/admin/audit-logs"
          className="mr-2 inline-flex min-h-10 items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-[#2a3850] dark:bg-[#1b3a6b]/20 dark:text-[#a8bbcc] dark:hover:bg-[#1b3a6b]/40"
        >
          Audit log →
        </Link>
        {[['', 'All'], ['open', 'Open'], ['resolved_refund', 'Refunded'], ['resolved_release', 'Released']].map(([value, label]) => {
          const active = statusFilter === value
          return (
            <button
              key={value || 'all'}
              type="button"
              aria-pressed={active}
              onClick={() => { setStatusFilter(value); setPage(1) }}
              className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition ${
                active ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-[#1c3050] dark:text-[#a8bbcc] dark:hover:bg-[#162236]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {disputesQuery.data.items.length === 0 ? (
        <div className="mt-7"><EmptyState title="No disputes" description="Disputes opened by clients or lawyers will appear here for resolution." /></div>
      ) : (
        <ul role="list" className="mt-6 grid gap-3">
          {disputesQuery.data.items.map((dispute) => (
            <li key={dispute.id} className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-950 dark:text-[#ece5d6]">
                    {dispute.engagement?.specializationSnapshot ?? 'Engagement'} · ${(dispute.engagement?.feeMinorSnapshot ?? 0) / 100}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-[#a8bbcc]">
                    Raised by {dispute.openedBy?.fullName ?? 'Unknown'} ({dispute.openedByRole}) · {formatDate(dispute.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[dispute.status] ?? ''}`}>
                  {dispute.status.replace('_', ' ')}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm italic text-slate-600 dark:text-[#a8bbcc]">“{dispute.reason}”</p>
              {dispute.status === 'open' && (
                <button
                  type="button"
                  onClick={() => setResolving(dispute)}
                  className="le-button le-button-primary mt-4"
                >
                  Resolve
                </button>
              )}
              {dispute.resolutionNote && (
                <p className="mt-2 text-xs text-slate-500 dark:text-[#7090a4]">Note: {dispute.resolutionNote}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {meta.totalPages > 1 && (
        <nav aria-label="Dispute pages" className="mt-6 flex items-center justify-center gap-3">
          <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="min-h-10 rounded-lg border px-4 text-sm font-semibold disabled:opacity-40">Previous</button>
          <span className="text-sm text-slate-500">Page {page} of {meta.totalPages}</span>
          <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="min-h-10 rounded-lg border px-4 text-sm font-semibold disabled:opacity-40">Next</button>
        </nav>
      )}

      {resolving && (
        <ResolveDialog
          dispute={resolving}
          onClose={() => { setResolving(null); queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] }) }}
        />
      )}
    </section>
  )
}
