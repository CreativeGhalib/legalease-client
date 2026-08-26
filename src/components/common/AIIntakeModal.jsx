import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import ModalFocusRegion from './ModalFocusRegion'
import ProfileAvatar from './ProfileAvatar'
import { qualifyIntake } from '../../api/aiIntakeApi'
import { getApiErrorMessage } from '../../utils/apiError'

const URGENCY_STYLES = {
  urgent: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  soon: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  routine: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}

function ResultCard({ data, onClose }) {
  return (
    <div className="mt-5">
      <div className="rounded-xl border border-slate-200 dark:border-[#1c3050] bg-slate-50 dark:bg-[#101b2c] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-[#d4a843]">Suggested category</p>
        <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-[#ece5d6]">{data.category ?? 'General legal help'}</p>
        <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${URGENCY_STYLES[data.urgency] ?? URGENCY_STYLES.routine}`}>
          Urgency: {data.urgency}
        </span>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#a8bbcc]">{data.summary}</p>
      </div>

      {data.recommendedLawyers.length > 0 && (
        <ul role="list" className="mt-4 grid gap-2">
          {data.recommendedLawyers.map((lawyer) => (
            <li key={lawyer.id}>
              <Link
                to={`/lawyers/${lawyer.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-[#2a3850] p-3 transition hover:bg-slate-50 dark:hover:bg-[#101b2c]"
              >
                <ProfileAvatar src={lawyer.professionalPhotoUrl} name={lawyer.fullName} alt="" className="h-10 w-10" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900 dark:text-[#ece5d6]">{lawyer.fullName}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-[#a8bbcc]">
                    {lawyer.specialization} · ${(lawyer.consultationFeeMinor / 100).toFixed(2)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function AIIntakeModal({ onClose }) {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [serverError, setServerError] = useState('')

  const qualification = useMutation({
    mutationFn: () => qualifyIntake(message.trim()),
    onSuccess: setResult,
    onError: (error) => setServerError(getApiErrorMessage(error)),
  })

  function submit(event) {
    event.preventDefault()
    if (message.trim().length < 10) return
    setServerError('')
    qualification.mutate()
  }

  return (
    <ModalFocusRegion labelledBy="ai-intake-title" onClose={onClose} closeOnEscape={!qualification.isPending} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
      <form onSubmit={submit} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700 dark:text-[#d4a843]">
          <Sparkles size={14} aria-hidden="true" /> AI Legal Assistant
        </p>
        <h2 id="ai-intake-title" className="mt-2 text-xl font-bold text-slate-950 dark:text-[#ece5d6]">Describe your issue</h2>

        {!result && (
          <>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={1000}
              rows={5}
              required
              placeholder="e.g. My landlord is threatening to evict me next week even though I paid rent..."
              aria-label="Describe your legal issue"
              className="mt-4 min-h-32 w-full rounded-xl border border-slate-300 dark:border-[#1c3050] p-3 text-sm"
            />
            <p className="mt-1 text-right text-xs text-slate-400 dark:text-[#7090a4]">{message.length}/1000 · minimum 10</p>
            {serverError && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{serverError}</p>}
            <button
              type="submit"
              disabled={qualification.isPending || message.trim().length < 10}
              className="le-button le-button-primary mt-3 inline-flex items-center gap-1.5"
            >
              <Sparkles size={15} aria-hidden="true" />
              {qualification.isPending ? 'Analyzing…' : 'Analyze my issue'}
            </button>
            <p className="mt-3 text-xs leading-5 text-slate-400 dark:text-[#7090a4]">
              Automated guidance only — not legal advice. Nothing you type is stored.
            </p>
          </>
        )}

        {result && (
          <>
            <ResultCard data={result} onClose={onClose} />
            <button type="button" onClick={() => setResult(null)} className="le-button le-button-secondary mt-4">
              Start over
            </button>
          </>
        )}

        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} disabled={qualification.isPending} className="text-sm font-semibold text-slate-500 dark:text-[#a8bbcc] hover:underline">
            Close
          </button>
        </div>
      </form>
    </ModalFocusRegion>
  )
}

export default function AIIntakeTrigger({ variant = 'secondary', label = '✨ Find my lawyer' }) {
  const [open, setOpen] = useState(false)
  const styles = variant === 'hero'
    ? 'inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#d4a843]/40 px-6 py-3 text-sm font-semibold text-[#e4d9c5] transition hover:bg-[#d4a843]/10 focus-visible:ring-2 focus-visible:ring-[#d4a843]'
    : 'inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-[#2a3850] dark:bg-[#1b3a6b]/20 dark:text-[#a8bbcc] dark:hover:bg-[#1b3a6b]/40'

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={styles} aria-haspopup="dialog">
        {label}
      </button>
      {open && <AIIntakeModal onClose={() => setOpen(false)} />}
    </>
  )
}
