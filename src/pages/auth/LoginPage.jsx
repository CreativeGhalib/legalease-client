import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import PasswordField from '../../components/auth/PasswordField'
import AuthPageLayout from './AuthPageLayout'
import { getApiErrorMessage } from '../../utils/apiError'

function destination(from) {
  if (!from?.pathname?.startsWith('/')) return '/'
  return `${from.pathname}${from.search || ''}${from.hash || ''}`
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      await login({ email: values.email.trim(), password: values.password })
      navigate(destination(location.state?.from), { replace: true })
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to sign in. Please try again.'))
    }
  }

  return (
    <AuthPageLayout title="Welcome back" subtitle="Sign in to continue to your LegalEase account.">
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
        <label className="block text-sm font-medium text-slate-800">
          Email
          <input type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200" {...register('email', { required: 'Email is required.' })} />
          {errors.email && <span className="mt-1 block text-sm text-red-700">{errors.email.message}</span>}
        </label>
        <PasswordField label="Password" autoComplete="current-password" error={errors.password} registration={register('password', { required: 'Password is required.' })} />
        <button disabled={isSubmitting} type="submit" className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">New to LegalEase? <Link to="/register" state={{ from: location.state?.from }} className="font-medium text-slate-900 underline">Create an account</Link></p>
    </AuthPageLayout>
  )
}
