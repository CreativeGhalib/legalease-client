import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { submitPasswordReset } from '../../api/authApi'
import PasswordField from '../../components/auth/PasswordField'
import { showSuccessToast } from '../../utils/toast'
import AuthPageLayout from './AuthPageLayout'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      await submitPasswordReset({ token, password: values.password })
      showSuccessToast('Your password has been updated. Sign in with your new password.')
      navigate('/login', { replace: true })
    } catch (error) {
      setServerError(error?.response?.data?.error?.message || 'This reset link could not be completed. Request a new one.')
    }
  }

  if (!token) {
    return (
      <AuthPageLayout title="Reset link required" subtitle="Open this page from the secure link we emailed you.">
        <p className="mt-6 rounded-md bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
          This page is missing its reset token. Request a fresh link to continue.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <Link to="/forgot-password" className="font-medium text-slate-900 dark:text-[#ece5d6] underline">Request a new link</Link>
          <Link to="/login" className="font-medium text-slate-900 dark:text-[#ece5d6] underline">Back to sign in</Link>
        </div>
      </AuthPageLayout>
    )
  }

  return (
    <AuthPageLayout title="Choose a new password" subtitle="Pick a strong password of at least 12 characters.">
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && (
          <div className="space-y-3">
            <p role="alert" className="rounded-md bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{serverError}</p>
            <p className="text-sm text-slate-600 dark:text-[#a8bbcc]">
              <Link to="/forgot-password" className="font-medium text-slate-900 dark:text-[#ece5d6] underline">Request a new reset link</Link>
            </p>
          </div>
        )}
        <PasswordField
          label="New password"
          autoComplete="new-password"
          error={errors.password}
          registration={register('password', {
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
            validate: (value) => value === watch('password') || 'Passwords do not match.',
          })}
        />
        <button disabled={isSubmitting} type="submit" className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Updating password...' : 'Update password'}
        </button>
      </form>
    </AuthPageLayout>
  )
}
