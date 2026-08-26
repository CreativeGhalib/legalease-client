import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ScrollText } from 'lucide-react'
import api from '../../api/axios'
import { EmptyState, ErrorState } from '../../components/common/QueryFeedback'

const ACTION_OPTIONS = [
  ['', 'All actions'],
  ['tier.change', 'Tier change'],
  ['user.deactivate', 'User deactivated'],
  ['listing.unpublish', 'Listing unpublished'],
  ['listing.suspend', 'Listing suspended'],
  ['dispute.resolve.refund', 'Dispute → refund'],
  ['dispute.resolve.release', 'Dispute → release'],
  ['escrow.client_confirmed', 'Escrow released (client)'],
  ['escrow.auto_7d', 'Escrow auto-release'],
  ['escrow.admin', 'Escrow override'],
  ['payment.refund', 'Payment refund'],
]

function formatDate(value) {
  return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'
}

export default function AdminAuditLogPage() {
  const [actionFilter, setActionFilter] = useState('')
  const [page, setPage] = useState(1)

  const auditQuery = useQuery({
    queryKey: ['admin', 'audit-logs', actionFilter, page],
    queryFn: async () => {
      const params = { page, limit: 20 }
      if (actionFilter) params.action = actionFilter
      const response = await api.get('/admin/audit-logs', { params })
      return { items: response.data.data.items, meta: response.data.meta }
    },
  })

  if (auditQuery.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (auditQuery.isError) return <ErrorState message="Audit log could not be loaded." onRetry={() => auditQuery.refetch()} />

  const meta = auditQuery.data.meta

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Administration</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">
          <ScrollText size={26} className="text-indigo-700" /> Audit log
        </h1>
      </div>

      <label htmlFor="audit-action-filter" className="sr-only">Filter by action</label>
      <select
        id="audit-action-filter"
        value={actionFilter}
        onChange={(event) => { setActionFilter(event.target.value); setPage(1) }}
        className="mt-5 min-h-11 rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-3 text-sm"
      >
        {ACTION_OPTIONS.map(([value, label]) => (
          <option key={value || 'all'} value={value}>{label}</option>
        ))}
      </select>

      {auditQuery.data.items.length === 0 ? (
        <div className="mt-6"><EmptyState title="No audit entries" description="Entries appear as admins and payment flows act on the platform." /></div>
      ) : (
        <ul role="list" className="mt-6 grid gap-2">
          {auditQuery.data.items.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-4 py-3 shadow-sm">
              <span className="min-w-0">
                <span className="rounded-md bg-indigo-50 dark:bg-[#1b3a6b]/25 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-800 dark:text-[#d4a843]">{entry.action}</span>
                <span className="ml-2 text-sm text-slate-700 dark:text-[#ece5d6]">
                  {entry.actor ? `${entry.actor.fullName}` : 'System'}
                  {entry.actorRole ? ` (${entry.actorRole})` : ''}
                  {entry.targetType ? ` → ${entry.targetType} ${entry.targetId.slice(0, 10)}…` : ''}
                </span>
              </span>
              <time className="shrink-0 text-xs text-slate-400 dark:text-[#7090a4]">{formatDate(entry.createdAt)}</time>
            </li>
          ))}
        </ul>
      )}

      {meta.totalPages > 1 && (
        <nav aria-label="Audit pages" className="mt-6 flex items-center justify-center gap-3">
          <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="min-h-10 rounded-lg border px-4 text-sm font-semibold disabled:opacity-40">Previous</button>
          <span className="text-sm text-slate-500">Page {page} of {meta.totalPages}</span>
          <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="min-h-10 rounded-lg border px-4 text-sm font-semibold disabled:opacity-40">Next</button>
        </nav>
      )}
    </section>
  )
}
