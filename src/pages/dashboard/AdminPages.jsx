import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import * as api from '../../api/adminApi'
import { ErrorState, EmptyState } from '../../components/common/QueryFeedback'
import ModalFocusRegion from '../../components/common/ModalFocusRegion'

const money = (n) => `$${(n / 100).toFixed(2)}`

function Shell({ title, eyebrow, children }) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-[#ece5d6] sm:text-4xl">{title}</h1>
      {children}
    </section>
  )
}

function Pager({ meta, onPage }) {
  if (!meta || meta.totalPages <= 1) return null
  return (
    <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-[#a8bbcc]">
      <button className="le-button le-button-secondary" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>Previous</button>
      <span>Page {meta.page} of {meta.totalPages}</span>
      <button className="le-button le-button-secondary" disabled={meta.page >= meta.totalPages} onClick={() => onPage(meta.page + 1)}>Next</button>
    </div>
  )
}

function ConfirmDialog({ item, onCancel, onConfirm, pending, error }) {
  if (!item) return null
  return (
    <ModalFocusRegion labelledBy="admin-confirm-title" onClose={onCancel} closeOnEscape={!pending} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-2xl">
        <h2 id="admin-confirm-title" className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]">{item.title}</h2>
        <p className="mt-3 leading-6 text-slate-600 dark:text-[#a8bbcc]">{item.description}</p>
        {error && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">This action could not be completed.</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" className="le-button le-button-secondary" disabled={pending} onClick={onCancel}>Cancel</button>
          <button type="button" className={`le-button ${item.danger ? 'le-button-danger' : 'le-button-primary'}`} disabled={pending} onClick={onConfirm}>
            {pending ? 'Working…' : item.confirmLabel}
          </button>
        </div>
      </div>
    </ModalFocusRegion>
  )
}

function SelectFilter({ label, value, onChange, options, placeholder }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={onChange}
      className="min-h-11 rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-3 text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

function UserCard({ user, onChangeRole, onToggleStatus }) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-950 dark:text-[#ece5d6]">{user.fullName}</h2>
          <p className="truncate text-sm text-slate-600 dark:text-[#a8bbcc]">{user.email}</p>
          <p className="mt-2 text-sm capitalize text-slate-500 dark:text-[#a8bbcc]">{user.role} · {user.status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label={`Role for ${user.fullName}`}
            value={user.role}
            onChange={(event) => event.target.value !== user.role && onChangeRole(event.target.value)}
            className="min-h-11 rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-3 text-sm"
          >
            <option value="user">User</option>
            <option value="lawyer">Lawyer</option>
            <option value="admin">Admin</option>
          </select>
          <button className={`le-button ${user.status === 'active' ? 'le-button-danger' : 'le-button-primary'}`} onClick={onToggleStatus}>
            {user.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </article>
  )
}

export function AdminUsersPage() {
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const params = {
    ...(search.trim() && { search: search.trim() }),
    ...(roleFilter && { role: roleFilter }),
    ...(statusFilter && { status: statusFilter }),
    page,
  }
  const query = useQuery({ queryKey: ['admin', 'users', params], queryFn: () => api.getAdminUsers(params) })

  const invalidateUsers = () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); qc.invalidateQueries({ queryKey: ['admin', 'analytics'] }) }
  const role = useMutation({ mutationFn: api.updateAdminUserRole, onSuccess: () => { invalidateUsers(); setConfirm(null) } })
  const status = useMutation({ mutationFn: api.updateAdminUserStatus, onSuccess: () => { invalidateUsers(); setConfirm(null) } })

  if (query.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (query.isError) return <ErrorState message="Users could not be loaded." onRetry={query.refetch} />

  const pending = role.isPending || status.isPending
  const mutationError = role.isError || status.isError
  const apply = () => (confirm.kind === 'role' ? role.mutate({ id: confirm.user.id, role: confirm.value }) : status.mutate({ id: confirm.user.id, status: confirm.value }))

  function confirmRoleChange(user, nextRole) {
    setConfirm({
      kind: 'role',
      user,
      value: nextRole,
      title: `Change ${user.fullName}'s role?`,
      description: 'This changes what the account can access. A lawyer changed to a user is removed from public discovery.',
      confirmLabel: 'Change role',
    })
  }

  function confirmStatusToggle(user) {
    const nextStatus = user.status === 'active' ? 'deactivated' : 'active'
    setConfirm({
      kind: 'status',
      user,
      value: nextStatus,
      title: `${user.status === 'active' ? 'Deactivate' : 'Activate'} ${user.fullName}?`,
      description: user.status === 'active'
        ? 'The account will immediately lose protected access. Historical records stay preserved.'
        : 'The account will regain protected access according to its current role.',
      confirmLabel: user.status === 'active' ? 'Deactivate account' : 'Activate account',
      danger: user.status === 'active',
    })
  }

  return (
    <Shell eyebrow="Administration" title="Manage users">
      <p className="mt-3 text-slate-600 dark:text-[#a8bbcc]">
        Role and account-status changes take effect immediately and preserve historical records.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {/* Search by name or email */}
        <input
          type="search"
          aria-label="Search users by name or email"
          placeholder="Search name or email…"
          value={search}
          onChange={(event) => { setSearch(event.target.value); setPage(1) }}
          className="min-h-11 rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-3 text-sm"
        />
        <SelectFilter
          label="Filter by role"
          placeholder="All roles"
          value={roleFilter}
          onChange={(event) => { setRoleFilter(event.target.value); setPage(1) }}
          options={[{ value: 'user', label: 'Users' }, { value: 'lawyer', label: 'Lawyers' }, { value: 'admin', label: 'Admins' }]}
        />
        <SelectFilter
          label="Filter by status"
          placeholder="All statuses"
          value={statusFilter}
          onChange={(event) => { setStatusFilter(event.target.value); setPage(1) }}
          options={[{ value: 'active', label: 'Active' }, { value: 'deactivated', label: 'Deactivated' }]}
        />
      </div>
      <div className="mt-5 grid gap-4">
        {query.data.items.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onChangeRole={(nextRole) => confirmRoleChange(user, nextRole)}
            onToggleStatus={() => confirmStatusToggle(user)}
          />
        ))}
      </div>
      <Pager meta={query.data.meta} onPage={setPage} />
      <ConfirmDialog item={confirm} onCancel={() => setConfirm(null)} onConfirm={apply} pending={pending} error={mutationError} />
    </Shell>
  )
}

const actionsFor = (profile) => (
  profile.publicationStatus === 'deleted' ? ['restore']
    : profile.publicationStatus === 'published' ? ['unpublish', 'suspend']
    : ['publish', 'suspend']
)

function LawyerModerationCard({ profile, onAction, onDelete }) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <h2 className="font-semibold text-slate-950 dark:text-[#ece5d6]">{profile.fullName}</h2>
      <p className="text-sm text-slate-600 dark:text-[#a8bbcc]">{profile.email} · {profile.specialization || 'No specialization'}</p>
      <p className="mt-2 text-sm capitalize text-slate-500 dark:text-[#a8bbcc]">{profile.publicationStatus} · verification {profile.verificationStatus}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {actionsFor(profile).map((action) => (
          <button key={action} className="le-button le-button-secondary capitalize" onClick={() => onAction(action)}>{action}</button>
        ))}
        {profile.publicationStatus !== 'deleted' && (
          <button className="le-button le-button-danger" onClick={onDelete}>Delete profile</button>
        )}
      </div>
    </article>
  )
}

export function AdminLawyersPage() {
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const [publicationStatus, setPublicationStatus] = useState('')
  const [page, setPage] = useState(1)
  const params = { ...(publicationStatus && { publicationStatus }), page }
  const query = useQuery({ queryKey: ['admin', 'lawyers', params], queryFn: () => api.getAdminLawyers(params) })
  const totalPages = query.data?.meta?.totalPages

  useEffect(() => {
    if (query.isFetching || !query.isSuccess || !Number.isInteger(totalPages)) return
    const lastPage = Math.max(1, totalPages)
    if (page > lastPage) setPage(lastPage)
  }, [page, query.isFetching, query.isSuccess, totalPages])

  const moderate = useMutation({
    mutationFn: api.moderateAdminLawyer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'lawyers'] })
      qc.invalidateQueries({ queryKey: ['admin', 'analytics'] })
      qc.invalidateQueries({ queryKey: ['public-lawyers'] })
      setConfirm(null)
    },
  })
  const remove = useMutation({
    mutationFn: api.deleteAdminLawyer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'lawyers'] })
      qc.invalidateQueries({ queryKey: ['public-lawyers'] })
      setConfirm(null)
    },
  })

  if (query.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (query.isError) return <ErrorState message="Lawyer profiles could not be loaded." onRetry={query.refetch} />

  const pending = moderate.isPending || remove.isPending
  const mutationError = moderate.isError || remove.isError
  const apply = () => (confirm.kind === 'delete' ? remove.mutate(confirm.profile.id) : moderate.mutate({ id: confirm.profile.id, action: confirm.action }))

  function confirmAction(profile, action) {
    setConfirm({
      kind: 'moderate',
      profile,
      action,
      title: `${action[0].toUpperCase()}${action.slice(1)} this lawyer profile?`,
      description: action === 'suspend'
        ? 'This removes the listing from public discovery until an admin changes its state.'
        : action === 'restore'
        ? 'The profile returns privately and will not become public automatically.'
        : 'The server will re-check eligibility before applying this publication action.',
      confirmLabel: action,
    })
  }

  function confirmDelete(profile) {
    setConfirm({
      kind: 'delete',
      profile,
      title: 'Soft-delete this lawyer profile?',
      description: 'It will be removed from public discovery. Hiring, payment, and comment history are preserved.',
      confirmLabel: 'Delete profile',
      danger: true,
    })
  }

  return (
    <Shell eyebrow="Administration" title="Manage lawyers">
      <p className="mt-3 text-slate-600 dark:text-[#a8bbcc]">Listing moderation never changes verified payment, paid-hire, or historical transaction records.</p>
      <select
        aria-label="Filter by publication status"
        value={publicationStatus}
        onChange={(event) => { setPublicationStatus(event.target.value); setPage(1) }}
        className="mt-5 min-h-11 rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-3"
      >
        <option value="">All listing states</option>
        {['draft', 'published', 'unpublished', 'suspended', 'deleted'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <div className="mt-5 grid gap-4">
        {query.data.items.map((profile) => (
          <LawyerModerationCard
            key={profile.id}
            profile={profile}
            onAction={(action) => confirmAction(profile, action)}
            onDelete={() => confirmDelete(profile)}
          />
        ))}
      </div>
      <Pager meta={query.data.meta} onPage={setPage} />
      <ConfirmDialog item={confirm} onCancel={() => setConfirm(null)} onConfirm={apply} pending={pending} error={mutationError} />
    </Shell>
  )
}

function TransactionCard({ item }) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5">
      <p className="font-semibold capitalize text-slate-950 dark:text-[#ece5d6]">{item.type.replace('_', ' ')}</p>
      <p className="mt-1 break-words text-sm text-slate-600 dark:text-[#a8bbcc]">{item.payer?.email || 'Unavailable'} → {item.lawyer?.email || 'Unavailable'}</p>
      <p className="mt-2 font-semibold text-slate-950 dark:text-[#ece5d6]">{money(item.amountMinor)} {item.currency.toUpperCase()} · {item.status}</p>
    </article>
  )
}

export function AdminTransactionsPage() {
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const params = { ...(type && { type }), ...(status && { status }), page }
  const query = useQuery({ queryKey: ['admin', 'transactions', params], queryFn: () => api.getAdminTransactions(params) })

  if (query.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (query.isError) return <ErrorState message="Transactions could not be loaded." onRetry={query.refetch} />

  return (
    <Shell eyebrow="Financial records" title="All transactions">
      <p className="mt-3 text-slate-600 dark:text-[#a8bbcc]">Read-only records. Payment state remains controlled by verified Stripe webhooks.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <SelectFilter
          label="Filter by type"
          placeholder="All types"
          value={type}
          onChange={(event) => { setType(event.target.value); setPage(1) }}
          options={[{ value: 'lawyer_verification', label: 'Verification' }, { value: 'hiring_fee', label: 'Hiring fee' }]}
        />
        <SelectFilter
          label="Filter by status"
          placeholder="All statuses"
          value={status}
          onChange={(event) => { setStatus(event.target.value); setPage(1) }}
          options={['pending', 'paid', 'failed', 'refunded'].map((s) => ({ value: s, label: s }))}
        />
      </div>
      {query.data.items.length ? (
        <div className="mt-5 grid gap-3">
          {query.data.items.map((item) => <TransactionCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="mt-7"><EmptyState title="No transactions" description="Verified payment records will appear here." /></div>
      )}
      <Pager meta={query.data.meta} onPage={setPage} />
    </Shell>
  )
}

function AnalyticsCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <p className="text-sm text-slate-500 dark:text-[#a8bbcc]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-[#ece5d6]">{value}</p>
    </article>
  )
}

function Chart({ title, data, value }) {
  return (
    <article className="h-72 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <h2 className="font-semibold text-slate-950 dark:text-[#ece5d6]">{title}</h2>
      {data.length ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={value} fill="#4338ca" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="grid h-[85%] place-items-center text-sm text-slate-500 dark:text-[#a8bbcc]">No verified activity yet.</p>
      )}
    </article>
  )
}

export function AdminAnalyticsPage() {
  const query = useQuery({ queryKey: ['admin', 'analytics'], queryFn: api.getAdminAnalytics })

  if (query.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (query.isError) return <ErrorState message="Analytics could not be loaded." onRetry={query.refetch} />

  const cards = [
    ['Total users', query.data.users],
    ['Total lawyers', query.data.lawyers],
    ['Total paid hires', query.data.paidHires],
    ['Verified revenue', money(query.data.revenueMinor)],
  ]

  return (
    <Shell eyebrow="Live aggregation" title="Analytics">
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => <AnalyticsCard key={label} label={label} value={value} />)}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Chart title="Monthly verified revenue" data={query.data.monthlyRevenue} value="revenueMinor" />
        <Chart title="Monthly paid hires" data={query.data.monthlyHires} value="paidHires" />
      </div>
    </Shell>
  )
}
