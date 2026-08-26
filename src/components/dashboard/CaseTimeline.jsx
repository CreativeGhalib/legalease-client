import { useQuery } from '@tanstack/react-query'
import { CircleDot, CheckCircle2, LoaderCircle } from 'lucide-react'
import { getCaseTimeline } from '../../api/caseApi'
import CaseEvidence from './CaseEvidence'
import { ErrorState } from '../common/QueryFeedback'

function formatDate(value) {
  if (!value) return null
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
}

const STATUS_META = {
  completed: { icon: CheckCircle2, classes: 'text-emerald-600 dark:text-emerald-400', label: 'Completed' },
  in_progress: { icon: LoaderCircle, classes: 'text-indigo-600 dark:text-indigo-300 animate-spin', label: 'In progress' },
  pending: { icon: CircleDot, classes: 'text-slate-400 dark:text-[#7090a4]', label: 'Pending' },
}

export default function CaseTimeline({ hiringRequestId, isLawyer = false }) {
  const caseQuery = useQuery({
    queryKey: ['case', hiringRequestId],
    queryFn: () => getCaseTimeline(hiringRequestId),
  })

  if (caseQuery.isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-200 dark:bg-[#0c1728]" aria-hidden="true" />
  }
  if (caseQuery.isError) {
    return <ErrorState message="Case progress could not be loaded." onRetry={() => caseQuery.refetch()} />
  }

  const { engagement, summary, milestones } = caseQuery.data

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1c3050] bg-slate-50 dark:bg-[#0c1728] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-[#ece5d6]">
          {engagement.specializationSnapshot} · ${(engagement.feeMinorSnapshot / 100).toFixed(2)} {engagement.currency}
        </p>
        <p className="text-xs font-semibold text-slate-500 dark:text-[#a8bbcc]">
          {summary.completed}/{summary.total} milestones complete
        </p>
      </div>

      {milestones.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-[#a8bbcc]">
          Your lawyer has not published any case milestones yet.
        </p>
      ) : (
        <ol role="list" className="mt-4 space-y-3">
          {milestones.map((milestone) => {
            const meta = STATUS_META[milestone.status] ?? STATUS_META.pending
            const Icon = meta.icon
            return (
              <li key={milestone.id} className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 ${meta.classes}`} aria-hidden="true"><Icon size={17} /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className={`text-sm font-semibold ${milestone.status === 'completed' ? 'line-through decoration-slate-400 text-slate-500 dark:text-[#96a8b8]' : 'text-slate-900 dark:text-[#ece5d6]'}`}>
                      {milestone.title}
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-[#7090a4]">{meta.label}</span>
                  </span>
                  {milestone.description && (
                    <span className="mt-0.5 block text-xs leading-5 text-slate-600 dark:text-[#a8bbcc]">{milestone.description}</span>
                  )}
                  {(formatDate(milestone.dueDate) || formatDate(milestone.completedAt)) && (
                    <span className="mt-0.5 block text-[11px] text-slate-400 dark:text-[#7090a4]">
                      {milestone.dueDate ? `Due ${formatDate(milestone.dueDate)}` : ''}
                      {milestone.completedAt ? `${milestone.dueDate ? ' · ' : ''}Done ${formatDate(milestone.completedAt)}` : ''}
                    </span>
                  )}
                </span>
              </li>
            )
          })}
        </ol>
      )}

      <div className="mt-4">
        <CaseEvidence hiringRequestId={hiringRequestId} isLawyer={isLawyer} />
      </div>
    </div>
  )
}
