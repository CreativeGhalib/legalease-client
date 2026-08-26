import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../../api/authApi'
import AuthPageLayout from './AuthPageLayout'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '' },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      await requestPasswordReset(values.email.trim())
      setSent(true)
    } catch (error) {
      setServerError(error?.response?.data?.error?.message || 'We could not process that request. Please try again.')
    }
  }

  return (
    <AuthPageLayout title="Reset your password" subtitle="Tell us the email on your account and we will send a secure reset link.">
      {sent ? (
        <div className="mt-6 space-y-5">
          <p role="status" className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-300">
            If an account exists for that email, a password reset link has been sent. The link expires in one hour.
          </p>
          <p className="text-sm text-slate-600 dark:text-[#a8bbcc]">
            Didn&apos;t get it? Check your spam folder or{' '}
            <button type="button" onClick={() => setSent(false)} className="font-medium text-slate-900 dark:text-[#ece5d6] underline">
              try another email
            </button>
            .
          </p>
          <p className="text-sm text-slate-600 dark:text-[#a8bbcc]">
            <Link to="/login" className="font-medium text-slate-900 dark:text-[#ece5d6] underline">Back to sign in</Link>
          </p>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError && <p role="alert" className="rounded-md bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{serverError}</p>}
          <label className="block text-sm font-medium text-slate-800 dark:text-[#ece5d6]">
            Email
            <input
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="mt-1 min-h-11 w-full rounded-md border border-slate-300 dark:border-[#1c3050] px-3 py-2 text-slate-950 dark:text-[#ece5d6] outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              {...register('email', { required: 'Email is required.' })}
            />
            {errors.email && <span className="mt-1 block text-sm text-red-700 dark:text-red-300">{errors.email.message}</span>}
          </label>
          <button disabled={isSubmitting} type="submit" className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
          </button>
          <p className="text-sm text-slate-600 dark:text-[#a8bbcc]">
            Remembered it? <Link to="/login" className="font-medium text-slate-900 dark:text-[#ece5d6] underline">Sign in</Link>
          </p>
        </form>
      )}
    </AuthPageLayout>
  )
}
