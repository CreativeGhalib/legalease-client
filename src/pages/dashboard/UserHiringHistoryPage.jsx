import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMyHiringRequests } from '../../api/hiringRequestApi'
import { startHiringCheckout } from '../../api/paymentApi'
import ProfileAvatar from '../../components/common/ProfileAvatar'
import { ErrorState } from '../../components/common/QueryFeedback'
import { getApiErrorMessage } from '../../utils/apiError'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return null
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
}

function paymentLabel(status) {
  if (status === 'paid') return 'Paid'
  if (status === 'checkout_created') return 'Payment session ready'
  return 'Unpaid'
}

// ─── Request Card ─────────────────────────────────────────────────────────────
// Each card owns its own pay mutation so that an error on one card never
// bleeds into or disables the pay button on another card.

function RequestCard({ item }) {
  const payMutation = useMutation({
    mutationFn: () => startHiringCheckout(item.id),
    onSuccess: ({ checkoutUrl }) => window.location.assign(checkoutUrl),
  })

  const isPaid = item.paymentStatus === 'paid'
  const isCheckout = item.paymentStatus === 'checkout_created'
  const canPay = item.status === 'accepted' && !isPaid

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <div className="flex min-w-0 items-center gap-4">
        <ProfileAvatar
          src={item.lawyer.professionalPhotoUrl}
          name={item.lawyer.fullName}
          alt={`Portrait of ${item.lawyer.fullName}`}
          className="h-16 w-16"
          textClassName="text-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-[#a8bbcc]">
            Lawyer
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-slate-950 dark:text-[#ece5d6]">
            {item.lawyer.fullName}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a8bbcc]">
            {item.specializationSnapshot} · ${(item.feeMinorSnapshot / 100).toFixed(2)}{' '}
            {item.currency}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-[#a8bbcc]">
            Requested {formatDate(item.createdAt)}
            {item.paidAt ? ` · Paid ${formatDate(item.paidAt)}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-[#1c3050] pt-4">
        <span className="rounded-full bg-indigo-50 dark:bg-[#1b3a6b]/15 px-3 py-1 font-semibold capitalize text-indigo-800">
          Request: {item.status}
        </span>
        <span
          className={`rounded-full px-3 py-1 font-semibold ${
            isPaid
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-[#0c1728] text-slate-700 dark:text-[#ece5d6]'
          }`}
        >
          Payment: {paymentLabel(item.paymentStatus)}
        </span>

        {canPay && (
          <button
            type="button"
            disabled={payMutation.isPending}
            onClick={() => payMutation.mutate()}
            className="le-button le-button-primary whitespace-nowrap"
          >
            {payMutation.isPending
              ? 'Opening…'
              : isCheckout
              ? 'Continue secure payment'
              : 'Pay consultation fee'}
          </button>
        )}

        <Link
          to={`/lawyers/${item.lawyerProfileId}`}
          className="le-button le-button-secondary whitespace-nowrap"
        >
          View lawyer
        </Link>

        {payMutation.isError && (
          <p role="alert" className="basis-full text-sm text-rose-700 dark:text-rose-300">
            {getApiErrorMessage(payMutation.error)}
          </p>
        )}
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserHiringHistoryPage() {
  const requestsQuery = useQuery({
    queryKey: ['hiring-requests', 'mine'],
    queryFn: getMyHiringRequests,
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

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">
        Your legal matters
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">
        My hiring requests
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-[#a8bbcc]">
        Requests you sent to lawyers. A payment becomes available only after that lawyer accepts.
      </p>

      {requestsQuery.data.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 text-slate-600 dark:text-[#a8bbcc]">
          You have not sent a hiring request yet.
        </div>
      ) : (
        <div className="mt-7 grid gap-4">
          {requestsQuery.data.map((item) => (
            <RequestCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}
