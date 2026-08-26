import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMyHiringRequests } from '../../api/hiringRequestApi'
import { startHiringCheckout, startSslcommerzCheckout } from '../../api/paymentApi'
import { createReview } from '../../api/reviewApi'
import ModalFocusRegion from '../../components/common/ModalFocusRegion'
import CaseTimeline from '../../components/dashboard/CaseTimeline'
import ProfileAvatar from '../../components/common/ProfileAvatar'
import StarRatingInput from '../../components/lawyers/StarRating'
import { ErrorState } from '../../components/common/QueryFeedback'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import { getApiErrorMessage } from '../../utils/apiError'
import { showSuccessToast } from '../../utils/toast'

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

// ─── Review Dialog ────────────────────────────────────────────────────────────

function ReviewDialog({ item, onClose }) {
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  useBodyScrollLock(true)

  const reviewMutation = useMutation({
    mutationFn: () => createReview({ hiringRequestId: item.id, rating, feedback: feedback.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-requests', 'mine'] })
      showSuccessToast('Thanks — your engagement review is live.')
      onClose()
    },
  })

  return (
    <ModalFocusRegion
      labelledBy="review-dialog-title"
      onClose={onClose}
      closeOnEscape={!reviewMutation.isPending}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
    >
      <form
        onSubmit={(event) => { event.preventDefault(); reviewMutation.mutate() }}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl"
      >
        <h2 id="review-dialog-title" className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]">
          Review your engagement
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#a8bbcc]">
          How was your experience with {item.lawyer.fullName}? One review per engagement.
        </p>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Rating</p>
          <div className="mt-2"><StarRatingInput value={rating} onChange={setRating} /></div>
        </div>

        <label className="mt-4 block text-sm font-medium text-slate-800 dark:text-[#ece5d6]" htmlFor="review-feedback">
          Feedback <span className="font-normal text-slate-500 dark:text-[#a8bbcc]">(optional)</span>
        </label>
        <textarea
          id="review-feedback"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          maxLength={1000}
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-3 text-sm text-slate-950 dark:text-[#ece5d6]"
        />
        <p className="mt-1 text-right text-xs text-slate-500 dark:text-[#a8bbcc]">{feedback.length}/1000</p>

        {reviewMutation.isError && (
          <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
            {getApiErrorMessage(reviewMutation.error)}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={reviewMutation.isPending} className="le-button le-button-secondary">Cancel</button>
          <button type="submit" disabled={reviewMutation.isPending} className="le-button le-button-primary">
            {reviewMutation.isPending ? 'Submitting…' : 'Submit review'}
          </button>
        </div>
      </form>
    </ModalFocusRegion>
  )
}

// ─── Request Card ─────────────────────────────────────────────────────────────
// Each card owns its own pay mutation so that an error on one card never
// bleeds into or disables the pay button on another card.

function RequestCard({ item }) {
  const payMutation = useMutation({
    mutationFn: () => startHiringCheckout(item.id),
    onSuccess: ({ checkoutUrl }) => window.location.assign(checkoutUrl),
  })
  const sslcommerzMutation = useMutation({
    mutationFn: () => startSslcommerzCheckout(item.id),
    onSuccess: ({ redirectUrl }) => window.location.assign(redirectUrl),
  })
  const [reviewOpen, setReviewOpen] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  const isPaid = item.paymentStatus === 'paid'
  const isCheckout = item.paymentStatus === 'checkout_created'
  const canPay = item.status === 'accepted' && !isPaid
  const gatewayPending = payMutation.isPending || sslcommerzMutation.isPending

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
        {item.status === 'expired' ? (
          <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
            Expired — no response within 48 hours
          </span>
        ) : (
          <span className="rounded-full bg-indigo-50 dark:bg-[#1b3a6b]/15 px-3 py-1 font-semibold capitalize text-indigo-800">
            Request: {item.status}
          </span>
        )}
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
          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <button
              type="button"
              disabled={gatewayPending}
              onClick={() => payMutation.mutate()}
              className="le-button le-button-primary whitespace-nowrap"
            >
              {payMutation.isPending ? 'Opening…' : isCheckout ? 'Continue secure payment' : 'Pay consultation fee (Card)'}
            </button>
            <button
              type="button"
              disabled={gatewayPending}
              onClick={() => sslcommerzMutation.mutate()}
              className="le-button whitespace-nowrap border border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:border-[#3a1c30] dark:bg-[#301625] dark:text-pink-200 dark:hover:bg-[#40203a]"
            >
              {sslcommerzMutation.isPending ? 'Redirecting…' : 'bKash / Nagad / Rocket'}
            </button>
          </div>
        )}

        <Link
          to={`/lawyers/${item.lawyerProfileId}`}
          className="le-button le-button-secondary whitespace-nowrap"
        >
          View lawyer
        </Link>

        {isPaid && !item.reviewed && (
          <button
            type="button"
            onClick={() => setReviewOpen(true)}
            className="le-button whitespace-nowrap border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-[#2a3850] dark:bg-[#1b3a6b]/20 dark:text-[#a8bbcc] dark:hover:bg-[#1b3a6b]/40"
          >
            Rate engagement
          </button>
        )}
        {isPaid && item.reviewed && (
          <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
            Rated ✓
          </span>
        )}
        {isPaid && (
          <button
            type="button"
            onClick={() => setShowProgress((current) => !current)}
            aria-expanded={showProgress}
            className="le-button whitespace-nowrap border border-slate-300 dark:border-[#1c3050] text-slate-700 dark:text-[#a8bbcc]"
          >
            {showProgress ? 'Hide case progress' : 'View case progress'}
          </button>
        )}

        {(payMutation.isError || sslcommerzMutation.isError) && (
          <p role="alert" className="basis-full text-sm text-rose-700 dark:text-rose-300">
            {getApiErrorMessage(payMutation.error ?? sslcommerzMutation.error)}
          </p>
        )}
      </div>
      {showProgress && isPaid && <div className="mt-4"><CaseTimeline hiringRequestId={item.id} /></div>}
      {reviewOpen && <ReviewDialog item={item} onClose={() => setReviewOpen(false)} />}
    </article>
  )
}

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
