import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { deleteComment, getMyComments, updateComment } from '../../api/commentApi'
import ModalFocusRegion from '../../components/common/ModalFocusRegion'
import { EmptyState, ErrorState } from '../../components/common/QueryFeedback'
import { getApiErrorMessage } from '../../utils/apiError'

// ─── Edit Dialog ──────────────────────────────────────────────────────────────

function EditDialog({ content, editMutation, onCancel, onContent }) {
  return (
    <ModalFocusRegion
      labelledBy="edit-comment-title"
      onClose={onCancel}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          editMutation.mutate()
        }}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl"
      >
        <h2 id="edit-comment-title" className="text-xl font-bold dark:text-[#ece5d6]">
          Edit comment
        </h2>
        <textarea
          value={content}
          onChange={(event) => onContent(event.target.value)}
          minLength={2}
          maxLength={1000}
          required
          className="mt-4 min-h-32 w-full rounded-xl border border-slate-300 dark:border-[#1c3050] p-3"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            className="le-button le-button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="le-button le-button-primary"
            disabled={editMutation.isPending}
          >
            {editMutation.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
        {editMutation.isError && (
          <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
            {getApiErrorMessage(editMutation.error)}
          </p>
        )}
      </form>
    </ModalFocusRegion>
  )
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteDialog({ pending, onCancel, onConfirm }) {
  return (
    <ModalFocusRegion
      labelledBy="delete-comment-title"
      onClose={onCancel}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl">
        <h2 id="delete-comment-title" className="text-xl font-bold dark:text-[#ece5d6]">
          Delete this comment?
        </h2>
        <p className="mt-2 text-slate-600 dark:text-[#a8bbcc]">
          This removes it from the public lawyer profile.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="le-button le-button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="le-button le-button-danger"
            disabled={pending}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </ModalFocusRegion>
  )
}

// ─── Comment Card ─────────────────────────────────────────────────────────────

function CommentCard({ item, onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <h2 className="font-semibold text-slate-950 dark:text-[#ece5d6]">
        {item.lawyer?.fullName || 'Lawyer profile unavailable'}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-[#a8bbcc]">
        {item.lawyer?.specialization || 'Professional profile unavailable'}
      </p>
      <p className="mt-4 whitespace-pre-wrap text-slate-700 dark:text-[#ece5d6]">
        {item.content}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="le-button le-button-secondary"
          onClick={() => onEdit(item)}
        >
          Edit comment
        </button>
        <button
          type="button"
          className="le-button le-button-danger"
          onClick={() => onDelete(item)}
        >
          Delete comment
        </button>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserCommentsPage() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['comments', 'mine'], queryFn: getMyComments })

  const [editItem, setEditItem] = useState(null)
  const [content, setContent] = useState('')
  const [deleteItem, setDeleteItem] = useState(null)

  const refreshComments = () => queryClient.invalidateQueries({ queryKey: ['comments', 'mine'] })

  const editMutation = useMutation({
    mutationFn: () => updateComment(editItem.id, content),
    onSuccess: () => {
      refreshComments()
      queryClient.invalidateQueries({ queryKey: ['lawyerComments', editItem.lawyerProfileId] })
      setEditItem(null)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id) => deleteComment(id),
    onSuccess: (_data, _deletedId) => {
      // Use the argument (deleted ID) to locate the cached item for cache invalidation,
      // rather than closing over deleteItem which may be cleared before onSuccess fires.
      const targetProfileId = deleteItem?.lawyerProfileId
      refreshComments()
      if (targetProfileId) {
        queryClient.invalidateQueries({ queryKey: ['lawyerComments', targetProfileId] })
      }
      setDeleteItem(null)
    },
  })

  function handleEditOpen(item) {
    setEditItem(item)
    setContent(item.content)
  }

  function handleDeleteOpen(item) {
    setDeleteItem(item)
  }

  if (query.isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  }

  if (query.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(query.error)}
        onRetry={() => query.refetch()}
      />
    )
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">
        Your feedback
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-[#ece5d6] sm:text-4xl">
        My comments
      </h1>
      <p className="mt-3 text-slate-600 dark:text-[#a8bbcc]">
        Manage comments submitted after verified paid hires.
      </p>

      {query.data.length === 0 ? (
        <div className="mt-7">
          <EmptyState
            title="No comments yet"
            description="After an accepted and paid hire, you can share one comment on that lawyer's profile."
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-4">
          {query.data.map((item) => (
            <CommentCard
              key={item.id}
              item={item}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          ))}
        </div>
      )}

      {editItem && (
        <EditDialog
          content={content}
          editMutation={editMutation}
          onCancel={() => setEditItem(null)}
          onContent={setContent}
        />
      )}

      {deleteItem && (
        <DeleteDialog
          pending={removeMutation.isPending}
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => removeMutation.mutate(deleteItem.id)}
        />
      )}
    </section>
  )
}
