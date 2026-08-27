import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../auth/useAuth'
import PasswordField from '../../components/auth/PasswordField'
import { changeAccountPassword } from '../../api/authApi'
import { getApiErrorMessage } from '../../utils/apiError'

export default function ChangePasswordPage() {
  const { refreshAuth } = useAuth()
  const [serverError, setServerError] = useState('')
  const [updated, setUpdated] = useState(false)
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function onSubmit(values) {
    setServerError('')
    setUpdated(false)
    try {
      await changeAccountPassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      await refreshAuth().catch(() => undefined)
      reset()
      setUpdated(true)
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Your password could not be updated. Please try again.'))
    }
  }

  return (
    <section className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 dark:text-[#d4a843]">Account security</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">Change password</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-[#a8bbcc]">
        Updating your password signs your other devices out and keeps this one signed in.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-7 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 shadow-sm sm:p-8">
        {serverError && <p role="alert" className="rounded-md bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{serverError}</p>}
        {updated && (
          <p role="status" className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-300">
            Your password has been updated. Use it next time you sign in.
          </p>
        )}
        <PasswordField
          label="Current password"
          autoComplete="current-password"
          error={errors.currentPassword}
          registration={register('currentPassword', { required: 'Enter your current password.' })}
        />
        <PasswordField
          label="New password"
          autoComplete="new-password"
          error={errors.newPassword}
          registration={register('newPassword', {
            required: 'A new password is required.',
            minLength: { value: 12, message: 'Use at least 12 characters.' },
          })}
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          registration={register('confirmPassword', {
            required: 'Please confirm your new password.',
            validate: (value) => value === watch('newPassword') || 'Passwords do not match.',
          })}
        />
        <button disabled={isSubmitting} type="submit" className="min-h-11 rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800 dark:bg-[#d4a843] dark:text-[#0c1827] dark:hover:bg-[#e2bd61] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </section>
  )
}
