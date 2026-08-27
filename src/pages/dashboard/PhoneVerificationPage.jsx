import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { requestPhoneOtp, verifyPhoneOtp } from '../../api/authApi'
import { useAuth } from '../../auth/useAuth'
import { getApiErrorMessage } from '../../utils/apiError'

export default function PhoneVerificationPage() {
  const { user, refreshAuth } = useAuth()
  const [pendingPhone, setPendingPhone] = useState('')
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const phoneForm = useForm({ defaultValues: { phone: user?.phone ?? '' } })
  const codeForm = useForm({ defaultValues: { code: '' } })

  async function send(values) {
    setError('')
    try {
      const result = await requestPhoneOtp(values.phone)
      setPendingPhone(result.phone)
      codeForm.reset()
    } catch (cause) {
      setError(getApiErrorMessage(cause, 'The verification code could not be sent.'))
    }
  }

  async function verify(values) {
    setError('')
    try {
      await verifyPhoneOtp(values.code)
      await refreshAuth()
      setVerified(true)
      setPendingPhone('')
    } catch (cause) {
      setError(getApiErrorMessage(cause, 'The verification code could not be confirmed.'))
    }
  }

  const fieldClass = 'min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-[#374c62] dark:bg-[#101c2f]'
  return (
    <section className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Account security</p>
      <h1 className="mt-2 text-3xl font-bold">Verify your phone</h1>
      <p className="mt-3 text-slate-600 dark:text-[#a8bbcc]">LegalEase sends a six-digit code to a Bangladesh mobile number. Codes expire after 10 minutes.</p>
      {user?.phoneVerified && !pendingPhone && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">Verified: {user.phone}</p>}
      {verified && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">Your phone number is verified.</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">{error}</p>}
      <form className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#1c3050] dark:bg-[#0c1728]" onSubmit={phoneForm.handleSubmit(send)}>
        <label className="grid gap-2 text-sm font-semibold">Bangladesh mobile number<input className={fieldClass} inputMode="tel" autoComplete="tel" placeholder="01712345678" {...phoneForm.register('phone', { required: 'Enter your mobile number.', pattern: { value: /^(?:\+?880|0)1[3-9]\d{8}$/, message: 'Enter a valid Bangladesh mobile number.' } })} /></label>
        {phoneForm.formState.errors.phone && <p className="text-sm text-rose-700 dark:text-rose-300">{phoneForm.formState.errors.phone.message}</p>}
        <button type="submit" disabled={phoneForm.formState.isSubmitting} className="le-button le-button-primary w-fit">{phoneForm.formState.isSubmitting ? 'Sending…' : user?.phoneVerified ? 'Verify another number' : 'Send code'}</button>
      </form>
      {pendingPhone && <form className="mt-5 grid gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/20" onSubmit={codeForm.handleSubmit(verify)}><p className="text-sm">Code sent to <strong>{pendingPhone}</strong>.</p><label className="grid gap-2 text-sm font-semibold">Six-digit code<input className={fieldClass} inputMode="numeric" autoComplete="one-time-code" maxLength={6} {...codeForm.register('code', { required: 'Enter the code.', pattern: { value: /^\d{6}$/, message: 'Enter all 6 digits.' } })} /></label>{codeForm.formState.errors.code && <p className="text-sm text-rose-700 dark:text-rose-300">{codeForm.formState.errors.code.message}</p>}<button type="submit" disabled={codeForm.formState.isSubmitting} className="le-button le-button-primary w-fit">{codeForm.formState.isSubmitting ? 'Verifying…' : 'Verify phone'}</button></form>}
    </section>
  )
}
