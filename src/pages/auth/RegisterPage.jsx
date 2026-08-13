import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import PasswordField from '../../components/auth/PasswordField'
import GoogleSignInButton from '../../components/auth/GoogleSignInButton'
import AuthPageLayout from './AuthPageLayout'
import { getApiErrorMessage } from '../../utils/apiError'
import { safeDestination } from '../../utils/safeDestination'

export default function RegisterPage() {
  const { completeGoogleOnboarding, loginWithGoogle, register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isGoogleOnboarding = searchParams.get('google') === '1'
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', role: 'user' },
  })
  const selectedRole = watch('role')

  async function onSubmit({ fullName, email, password, confirmPassword, role }) {
    setServerError('')
    try {
      await registerAccount({ fullName: fullName.trim(), email: email.trim(), password, confirmPassword, role })
      navigate(safeDestination(location.state?.from), { replace: true })
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to create your account. Please try again.'))
    }
  }

  const handleGoogleCredential = useCallback(async (credential) => {
    setServerError('')
    try {
      await loginWithGoogle({ credential, role: selectedRole })
      navigate(safeDestination(location.state?.from), { replace: true })
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Google sign-up could not be completed.'))
    }
  }, [location.state?.from, loginWithGoogle, navigate, selectedRole])

  async function finishGoogleOnboarding({ role }) {
    setServerError('')
    try {
      await completeGoogleOnboarding({ role })
      navigate(safeDestination(location.state?.from), { replace: true })
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Google sign-up could not be completed.'))
    }
  }

  if (isGoogleOnboarding) {
    return (
      <AuthPageLayout title="Choose your account type" subtitle="One last step: select how you will use LegalEase.">
        <form className="mt-6 space-y-5" onSubmit={handleSubmit(finishGoogleOnboarding)} noValidate>
          {serverError && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
          <fieldset>
            <legend className="text-sm font-medium text-slate-800">I am joining as</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="rounded-lg border border-slate-200 p-4 text-sm text-slate-800"><input type="radio" value="user" {...register('role')} /> <span className="ml-2 font-medium">Client</span></label>
              <label className="rounded-lg border border-slate-200 p-4 text-sm text-slate-800"><input type="radio" value="lawyer" {...register('role')} /> <span className="ml-2 font-medium">Lawyer</span></label>
            </div>
          </fieldset>
          <button disabled={isSubmitting} type="submit" className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Finishing sign-up...' : 'Continue'}
          </button>
        </form>
      </AuthPageLayout>
    )
  }

  return (
    <AuthPageLayout title="Create your account" subtitle="Choose a client or lawyer account to get started.">
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
        <label className="block text-sm font-medium text-slate-800">
          Full name
          <input autoComplete="name" aria-invalid={Boolean(errors.fullName)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200" {...register('fullName', { required: 'Full name is required.', minLength: { value: 2, message: 'Use at least 2 characters.' } })} />
          {errors.fullName && <span className="mt-1 block text-sm text-red-700">{errors.fullName.message}</span>}
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Email
          <input type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200" {...register('email', { required: 'Email is required.' })} />
          {errors.email && <span className="mt-1 block text-sm text-red-700">{errors.email.message}</span>}
        </label>
        <PasswordField label="Password" autoComplete="new-password" error={errors.password} registration={register('password', { required: 'Password is required.', minLength: { value: 12, message: 'Use at least 12 characters.' } })} />
        <PasswordField label="Confirm password" autoComplete="new-password" error={errors.confirmPassword} registration={register('confirmPassword', { required: 'Please confirm your password.', validate: (value) => value === watch('password') || 'Passwords do not match.' })} />
        <fieldset>
          <legend className="text-sm font-medium text-slate-800">I am joining as</legend>
          <div className="mt-2 flex gap-4 text-sm text-slate-700">
            <label><input type="radio" value="user" {...register('role')} /> Client</label>
            <label><input type="radio" value="lawyer" {...register('role')} /> Lawyer</label>
          </div>
        </fieldset>
        <button disabled={isSubmitting} type="submit" className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>
      <GoogleSignInButton onCredential={handleGoogleCredential} text="signup_with" disabled={isSubmitting} />
      <p className="mt-5 text-sm text-slate-600">Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="font-medium text-slate-900 underline">Sign in</Link></p>
    </AuthPageLayout>
  )
}
