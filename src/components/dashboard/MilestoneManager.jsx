import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCaseMilestone, getCaseTimeline, updateCaseMilestone } from '../../api/caseApi'
import CaseEvidence from './CaseEvidence'
import ModalFocusRegion from '../common/ModalFocusRegion'
import { getApiErrorMessage } from '../../utils/apiError'

const NEXT_STATUS = { pending: ['in_progress', 'completed'], in_progress: ['completed'] }

function StatusAdvance({ milestone, pending, onAdvance }) {
  const options = NEXT_STATUS[milestone.status] ?? []
  if (options.length === 0) {
    return <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Completed</span>
  }
  return (
    <span className="flex gap-1.5">
      {options.map((status) => (
        <button
          key={status}
          type="button"
          disabled={pending}
          onClick={() => onAdvance(milestone.id, status)}
          className="rounded-lg border border-slate-300 dark:border-[#1c3050] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-[#ece5d6] transition hover:bg-slate-100 dark:hover:bg-[#162236] disabled:opacity-50"
        >
          {status === 'completed' ? 'Mark complete' : 'Start'}
        </button>
      ))}
    </span>
  )
}

export default function MilestoneManager({ item, onClose }) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [formError, setFormError] = useState('')

  const timelineQuery = useQuery({
    queryKey: ['case', item.id],
    queryFn: () => getCaseTimeline(item.id),
    retry: false,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['case', item.id] })

  const createMilestoneMutation = useMutation({
    mutationFn: () => createCaseMilestone(item.id, {
      title: title.trim(),
      ...(description.trim() && { description: description.trim() }),
      ...(dueDate && { dueDate }),
    }),
    onSuccess: () => { setTitle(''); setDescription(''); setDueDate(''); setFormError(''); invalidate() },
    onError: (error) => setFormError(getApiErrorMessage(error)),
  })

  const updateMilestoneMutation = useMutation({
    mutationFn: ({ id, status }) => updateCaseMilestone(id, { status }),
    onSuccess: invalidate,
    onError: (error) => setFormError(getApiErrorMessage(error)),
  })

  const summary = item.milestoneSummary ?? { total: 0, completed: 0 }
  const milestones = timelineQuery.data?.milestones ?? []

  return (
    <ModalFocusRegion
      labelledBy="milestone-manager-title"
      onClose={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl">
        <h2 id="milestone-manager-title" className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]">
          Manage milestones
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#a8bbcc]">
          {item.client.fullName} · {summary.completed}/{summary.total} complete · updates are forward-only.
        </p>

        {timelineQuery.isLoading && <div className="mt-5 h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-[#101b2c]" aria-hidden="true" />}
        {!timelineQuery.isLoading && milestones.length === 0 && (
          <p className="mt-4 text-sm text-slate-500 dark:text-[#a8bbcc]">No milestones yet — add the first one below.</p>
        )}

        <ul role="list" className="mt-4 space-y-3">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-[#1c3050] px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-[#ece5d6]">{milestone.title}</span>
              <StatusAdvance
                milestone={milestone}
                pending={updateMilestoneMutation.isPending}
                onAdvance={(id, status) => updateMilestoneMutation.mutate({ id, status })}
              />
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <CaseEvidence hiringRequestId={item.id} isLawyer />
        </div>

        <form
          onSubmit={(event) => { event.preventDefault(); createMilestoneMutation.mutate() }}
          className="mt-5 grid gap-3 rounded-xl border border-dashed border-slate-300 dark:border-[#1c3050] p-4"
        >
          <label className="text-sm font-semibold text-slate-800 dark:text-[#ece5d6]" htmlFor="milestone-title">New milestone</label>
          <input
            id="milestone-title"
            required
            minLength={2}
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. File the written statement"
            className="w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2 text-sm"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={600}
            rows={2}
            placeholder="Details for the client (optional)"
            className="w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2 text-sm"
          />
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="w-max rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2 text-sm" aria-label="Target date" />
          {formError && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{formError}</p>}
          <button type="submit" disabled={createMilestoneMutation.isPending || title.trim().length < 2} className="le-button le-button-primary self-start">
            {createMilestoneMutation.isPending ? 'Adding…' : 'Add milestone'}
          </button>
        </form>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="le-button le-button-secondary">Done</button>
        </div>
      </div>
    </ModalFocusRegion>
  )
}
