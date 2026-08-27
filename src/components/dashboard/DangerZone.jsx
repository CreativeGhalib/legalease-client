import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AlertTriangle, ShieldAlert } from 'lucide-react'
import { requestAccountDeletion, cancelAccountDeletion, revokeAllSessions } from '../../api/userProfileApi'
import { getApiErrorMessage } from '../../utils/apiError'

function formatDate(value) {
  return value ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(value)) : ''
}

export default function DangerZone({ deletionRequestedAt, hasLocalPassword = true }) {
  const [typedConfirm, setTypedConfirm] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [revokePassword, setRevokePassword] = useState('')
  const isGoogleOnly = !hasLocalPassword

  const deleteMutation = useMutation({
    mutationFn: () =>
      requestAccountDeletion(isGoogleOnly ? { confirm: true } : { password }),
    onError: (apiError) => setError(getApiErrorMessage(apiError)),
  })
  const cancelMutation = useMutation({
    mutationFn: cancelAccountDeletion,
    onError: (apiError) => setError(getApiErrorMessage(apiError)),
  })
  const revokeMutation = useMutation({
    mutationFn: () => revokeAllSessions(isGoogleOnly ? { confirm: true } : { password: revokePassword }),
    onSuccess: () => setRevokePassword(''),
    onError: (apiError) => setError(getApiErrorMessage(apiError)),
  })

  const pending = Boolean(deletionRequestedAt)
  const canSubmitDelete = !pending && typedConfirm === 'DELETE' && (isGoogleOnly || password.length > 0)

  return (
    <details className="mt-8 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-sm font-bold text-rose-700 dark:text-rose-300">
        <ShieldAlert size={16} aria-hidden="true" />
        Danger zone
      </summary>

      <div className="space-y-6 px-5 pb-5">
        {error && <p role="alert" className="rounded-lg bg-rose-100 dark:bg-rose-900/40 px-3 py-2 text-sm text-rose-800 dark:text-rose-200">{error}</p>}

        <section>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#ece5d6]">Sign out all other devices</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-[#a8bbcc]">Signs out every other browser or device. This device stays signed in.</p>
          {!isGoogleOnly && (
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              aria-label="Current password for signing out other devices"
              value={revokePassword}
              onChange={(event) => setRevokePassword(event.target.value)}
              className="mt-2 w-full max-w-xs rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2 text-sm"
            />
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {isGoogleOnly && (
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#a8bbcc]">
                <input type="checkbox" checked onChange={() => undefined} disabled readOnly /> I signed in with Google
              </label>
            )}
            <button
              type="button"
              disabled={revokeMutation.isPending || (!isGoogleOnly && revokePassword.length === 0)}
              onClick={() => revokeMutation.mutate()}
              className="min-h-10 rounded-lg border border-slate-300 dark:border-[#1c3050] px-4 text-xs font-semibold text-slate-700 dark:text-[#ece5d6] disabled:opacity-50"
            >
              {revokeMutation.isPending ? 'Signing out…' : 'Sign out all other devices'}
            </button>
          </div>
        </section>

        <section className="border-t border-rose-100 dark:border-rose-900/30 pt-5">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 dark:text-rose-300">
            <AlertTriangle size={15} aria-hidden="true" /> Delete this account
          </h3>

          {pending ? (
            <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold">Deletion scheduled for {formatDate(deletionRequestedAt)}.</p>
              <p className="mt-1">Your personal data will be anonymized and all sessions signed out. Sign-in is blocked once the date passes.</p>
              <button
                type="button"
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate()}
                className="mt-3 min-h-10 rounded-lg bg-emerald-700 px-4 text-xs font-semibold text-white disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling…' : 'Cancel deletion'}
              </button>
            </div>
          ) : (
            <>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-500 dark:text-[#a8bbcc]">
                <li>Schedule permanent deletion with a 7-day grace period.</li>
                <li>Your name and photo are anonymized; payment records are retained.</li>
                <li>You can cancel any time before the date passes.</li>
              </ul>

              <input
                value={typedConfirm}
                onChange={(event) => setTypedConfirm(event.target.value)}
                placeholder='Type "DELETE" to confirm'
                aria-label='Type DELETE to confirm account deletion'
                className="mt-3 w-full max-w-xs rounded-lg border border-rose-300 dark:border-rose-900/50 px-3 py-2 text-sm"
              />

              {!isGoogleOnly ? (
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Current password"
                  aria-label="Current password for account deletion"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full max-w-xs rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2 text-sm"
                />
              ) : (
                <label className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-[#a8bbcc]">
                  <input type="checkbox" checked onChange={() => undefined} disabled readOnly /> I signed up with Google (no password needed)
                </label>
              )}

              <button
                type="button"
                disabled={!canSubmitDelete || deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
                className="mt-3 min-h-11 w-full max-w-xs rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Scheduling…' : 'Schedule account deletion'}
              </button>
            </>
          )}
        </section>
      </div>
    </details>
  )
}
