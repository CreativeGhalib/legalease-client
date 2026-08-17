import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { createLawyerComment, getLawyerComments } from '../../api/commentApi'
import { EmptyState, ErrorState } from '../common/QueryFeedback'
import { getApiErrorMessage } from '../../utils/apiError'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
}

/**
 * Compare timestamps numerically to avoid string-equality fragility
 * when ISO representations differ in precision or formatting.
 */
function wasEdited(comment) {
  return new Date(comment.updatedAt).getTime() !== new Date(comment.createdAt).getTime()
}

// ─── Comment Item ─────────────────────────────────────────────────────────────

function CommentItem({ comment }) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <p className="font-semibold text-slate-950 dark:text-[#ece5d6]">
        {comment.author.fullName}
      </p>
      <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700 dark:text-[#ece5d6]">
        {comment.content}
      </p>
      <p className="mt-3 text-xs text-slate-500 dark:text-[#a8bbcc]">
        {wasEdited(comment)
          ? `Updated ${formatDate(comment.updatedAt)}`
          : formatDate(comment.createdAt)}
      </p>
    </article>
  )
}

// ─── Comment Form ─────────────────────────────────────────────────────────────

function CommentForm({ profileId }) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  const createMutation = useMutation({
    mutationFn: () => createLawyerComment(profileId, content),
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['lawyerComments', profileId] })
      queryClient.invalidateQueries({ queryKey: ['comments', 'mine'] })
    },
  })

  function handleSubmit(event) {
    event.preventDefault()
    if (content.trim()) createMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="font-semibold" htmlFor="comment">
        Share your experience
      </label>
      <textarea
        id="comment"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        minLength={2}
        maxLength={1000}
        required
        className="mt-3 min-h-28 w-full rounded-xl border border-indigo-200 dark:border-[#2a3850] bg-white dark:bg-[#0c1728] p-3"
        placeholder="Write a plain-text comment about your experience."
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500 dark:text-[#a8bbcc]">{content.length}/1000</span>
        <button className="le-button le-button-primary" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Submitting…' : 'Submit comment'}
        </button>
      </div>
      {createMutation.isError && (
        <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">
          {getApiErrorMessage(createMutation.error)}
        </p>
      )}
    </form>
  )
}

// ─── Eligibility Notice ────────────────────────────────────────────────────────

function EligibilityNotice({ hasComment, isAuthenticated, role }) {
  if (hasComment) {
    return (
      <p className="text-sm text-indigo-950">
        You have already commented.{' '}
        <Link className="font-semibold underline" to="/dashboard/user/comments">
          Manage your comment
        </Link>
        .
      </p>
    )
  }

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-indigo-950">
        Sign in after a paid hire to share your experience.
      </p>
    )
  }

  if (role === 'user') {
    return (
      <p className="text-sm text-indigo-950">
        Only clients with an accepted, paid hire can comment.
      </p>
    )
  }

  return (
    <p className="text-sm text-indigo-950">Comments are available for verified client experiences.</p>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LawyerComments({ profileId, canComment, hasComment, isAuthenticated, role }) {
  const commentsQuery = useQuery({
    queryKey: ['lawyerComments', profileId],
    queryFn: () => getLawyerComments(profileId),
  })

  return (
    <section className="mt-10 border-t border-slate-200 dark:border-[#1c3050] pt-8">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">
        Client comments
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-[#ece5d6]">
        Experiences from verified clients
      </h2>

      {commentsQuery.isLoading && (
        <div className="mt-5 h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
      )}

      {commentsQuery.isError && (
        <div className="mt-5">
          <ErrorState
            message={getApiErrorMessage(commentsQuery.error)}
            onRetry={() => commentsQuery.refetch()}
          />
        </div>
      )}

      {commentsQuery.isSuccess && commentsQuery.data.length > 0 && (
        <div className="mt-5 grid gap-3">
          {commentsQuery.data.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {commentsQuery.isSuccess && commentsQuery.data.length === 0 && (
        <div className="mt-5">
          <EmptyState
            title="No client comments yet"
            description="Verified client experiences will appear here."
          />
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-indigo-50 dark:bg-[#1b3a6b]/15 p-5">
        {canComment && !hasComment ? (
          <CommentForm profileId={profileId} />
        ) : (
          <EligibilityNotice
            hasComment={hasComment}
            isAuthenticated={isAuthenticated}
            role={role}
          />
        )}
      </div>
    </section>
  )
}
