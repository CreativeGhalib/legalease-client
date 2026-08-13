import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import AuthPageLayout from './AuthPageLayout'
import { getApiErrorMessage } from '../../utils/apiError'

function destination(from) {
  if (!from?.pathname?.startsWith('/')) return '/'
  return `${from.pathname}${from.search || ''}${from.hash || ''}`
}

export default function RegisterPage() {
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', role: 'user' },
  })

  async function onSubmit({ fullName, email, password, confirmPassword, role }) {
    setServerError('')
    try {
      await registerAccount({ fullName: fullName.trim(), email: email.trim(), password, confirmPassword, role })
      navigate(destination(location.state?.from), { replace: true })
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to create your account. Please try again.'))
    }
  }

  return (
    <AuthPageLayout title="Create your account" subtitle="Choose a client or lawyer account to get started.">
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
        <label className="block text-sm font-medium text-slate-800">
          Full name
          <input autoComplete="name" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" {...register('fullName', { required: 'Full name is required.', minLength: { value: 2, message: 'Use at least 2 characters.' } })} />
          {errors.fullName && <span className="mt-1 block text-sm text-red-700">{errors.fullName.message}</span>}
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Email
          <input type="email" autoComplete="email" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" {...register('email', { required: 'Email is required.' })} />
          {errors.email && <span className="mt-1 block text-sm text-red-700">{errors.email.message}</span>}
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Password
          <input type="password" autoComplete="new-password" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" {...register('password', { required: 'Password is required.', minLength: { value: 12, message: 'Use at least 12 characters.' } })} />
          {errors.password && <span className="mt-1 block text-sm text-red-700">{errors.password.message}</span>}
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Confirm password
          <input type="password" autoComplete="new-password" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" {...register('confirmPassword', { required: 'Please confirm your password.', validate: (value) => value === watch('password') || 'Passwords do not match.' })} />
          {errors.confirmPassword && <span className="mt-1 block text-sm text-red-700">{errors.confirmPassword.message}</span>}
        </label>
        <fieldset>
          <legend className="text-sm font-medium text-slate-800">I am joining as</legend>
          <div className="mt-2 flex gap-4 text-sm text-slate-700">
            <label><input type="radio" value="user" {...register('role')} /> Client</label>
            <label><input type="radio" value="lawyer" {...register('role')} /> Lawyer</label>
          </div>
        </fieldset>
        <button disabled={isSubmitting} type="submit" className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="font-medium text-slate-900 underline">Sign in</Link></p>
    </AuthPageLayout>
  )
}
