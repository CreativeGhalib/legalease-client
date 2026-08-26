import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLawyerReviews } from '../../api/reviewApi'
import ProfileAvatar from '../common/ProfileAvatar'
import { StarDisplay } from './StarRating'

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
}

export default function LawyerReviews({ profileId }) {
  const [page, setPage] = useState(1)
  const reviewsQuery = useQuery({
    queryKey: ['lawyer-reviews', profileId, page],
    queryFn: () => getLawyerReviews(profileId, { page, limit: 5 }),
    placeholderData: (previous) => previous,
  })

  if (reviewsQuery.isLoading) {
    return <div className="mt-14 h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" aria-hidden="true" />
  }
  if (reviewsQuery.isError) return null

  const data = reviewsQuery.data
  return (
    <section className="mt-16" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-[#ece5d6]">
          Engagement reviews
        </h2>
        <p className="text-sm text-slate-500 dark:text-[#a8bbcc]">
          Verified reviews from paid engagements only.
        </p>
      </div>

      {data.reviewCount === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-6 py-10 text-center text-sm text-slate-600 dark:text-[#a8bbcc]">
          No engagement reviews yet. Clients can review after a paid engagement.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 shadow-sm">
            <div className="text-center sm:text-left">
              <p className="text-4xl font-bold text-slate-950 dark:text-[#ece5d6]">{data.averageRating.toFixed(1)}</p>
              <div className="mt-1 flex justify-center sm:justify-start"><StarDisplay value={data.averageRating} size={17} /></div>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#a8bbcc]">{data.reviewCount} review{data.reviewCount === 1 ? '' : 's'}</p>
            </div>
            <dl className="grid gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#a8bbcc]">
                  <dt className="w-10 shrink-0 text-right">{star} star</dt>
                  <dd className="flex flex-1 items-center gap-2">
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#162236]">
                      <span
                        className="block h-full rounded-full bg-[#d4a843]"
                        style={{ width: `${Math.round(((data.ratingCounts?.[star] ?? 0) / data.reviewCount) * 100)}%` }}
                      />
                    </span>
                    <span className="w-6 tabular-nums">{data.ratingCounts?.[star] ?? 0}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="mt-6 grid gap-4" role="list">
            {data.items.map((review) => (
              <li key={review.id} className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <ProfileAvatar src={review.reviewer.profileImageUrl} name={review.reviewer.fullName} alt="" className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950 dark:text-[#ece5d6]">{review.reviewer.fullName}</p>
                    <StarDisplay value={review.rating} />
                  </div>
                  <span className="ml-auto shrink-0 text-xs text-slate-500 dark:text-[#a8bbcc]">{formatDate(review.createdAt)}</span>
                </div>
                {review.feedback && (
                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-700 dark:text-[#ece5d6]">{review.feedback}</p>
                )}
              </li>
            ))}
          </ul>

          {data.meta.totalPages > 1 && (
            <nav aria-label="Review pages" className="mt-6 flex items-center justify-center gap-3">
              <button type="button" disabled={page <= 1 || reviewsQuery.isFetching} onClick={() => setPage((current) => current - 1)} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold disabled:opacity-40">Previous</button>
              <span className="text-sm text-slate-600 dark:text-[#a8bbcc]">Page {page} of {data.meta.totalPages}</span>
              <button type="button" disabled={page >= data.meta.totalPages || reviewsQuery.isFetching} onClick={() => setPage((current) => current + 1)} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold disabled:opacity-40">Next</button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}
