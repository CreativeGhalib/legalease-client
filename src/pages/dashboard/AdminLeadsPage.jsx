import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { addAdminLeadNote, getAdminLeads, updateAdminLeadStatus } from '../../api/leadApi'
import { EmptyState, ErrorState } from '../../components/common/QueryFeedback'

const statusOptions = ['new', 'contacted', 'converted', 'cold']
const sourceOptions = ['hero', 'exit_intent', 'callback', 'lawyer_profile', 'chatbot']

export default function AdminLeadsPage() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [page, setPage] = useState(1)
  const [notes, setNotes] = useState({})
  const params = { ...(status && { status }), ...(source && { source }), page }
  const query = useQuery({ queryKey: ['admin', 'leads', params], queryFn: () => getAdminLeads(params) })
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] })
  const statusMutation = useMutation({ mutationFn: updateAdminLeadStatus, onSuccess: refresh })
  const noteMutation = useMutation({
    mutationFn: addAdminLeadNote,
    onSuccess: (_, variables) => { setNotes((current) => ({ ...current, [variables.id]: '' })); refresh() },
  })

  if (query.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (query.isError) return <ErrorState message="Leads could not be loaded." onRetry={query.refetch} />

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Lead operations</p><h1 className="mt-2 text-3xl font-bold">Callback requests</h1></div>
        <a href={`/api/v1/admin/leads/export?${new URLSearchParams(params)}`} download className="le-button le-button-secondary">Export CSV</a>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <select aria-label="Filter leads by status" className="le-input" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option value="">All statuses</option>{statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select aria-label="Filter leads by source" className="le-input" value={source} onChange={(event) => { setSource(event.target.value); setPage(1) }}><option value="">All sources</option>{sourceOptions.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}</select>
      </div>
      {query.data.items.length ? <div className="mt-6 grid gap-4">{query.data.items.map((lead) => (
        <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#1c3050] dark:bg-[#0c1728]">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold">{lead.name}</h2><a className="text-sm font-semibold text-indigo-700 dark:text-[#d4a843]" href={`tel:${lead.phone}`}>{lead.phone}</a>{lead.email && <p className="text-sm text-slate-600 dark:text-[#a8bbcc]">{lead.email}</p>}</div><div className="text-right text-xs text-slate-500"><p>{lead.source.replace('_', ' ')}</p><p>{new Date(lead.createdAt).toLocaleString()}</p></div></div>
          {lead.legalIssue && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-[#ece5d6]">{lead.legalIssue}</p>}
          {lead.lastNote && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-[#101c2f]"><strong>Last note:</strong> {lead.lastNote.text}</p>}
          <div className="mt-4 flex flex-wrap gap-3"><select aria-label={`Status for ${lead.name}`} className="le-input" value={lead.status} disabled={statusMutation.isPending} onChange={(event) => statusMutation.mutate({ id: lead.id, status: event.target.value })}>{statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select><input aria-label={`New note for ${lead.name}`} className="le-input min-w-56 flex-1" maxLength={1000} placeholder="Add a follow-up note" value={notes[lead.id] ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [lead.id]: event.target.value }))} /><button type="button" className="le-button le-button-secondary" disabled={noteMutation.isPending || (notes[lead.id] ?? '').trim().length < 2} onClick={() => noteMutation.mutate({ id: lead.id, note: notes[lead.id].trim() })}>Add note</button></div>
        </article>
      ))}</div> : <div className="mt-7"><EmptyState title="No leads" description="New callback requests will appear here." /></div>}
      {query.data.meta.totalPages > 1 && <div className="mt-5 flex items-center justify-between"><button className="le-button le-button-secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span className="text-sm">Page {page} of {query.data.meta.totalPages}</span><button className="le-button le-button-secondary" disabled={page >= query.data.meta.totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></div>}
    </section>
  )
}
