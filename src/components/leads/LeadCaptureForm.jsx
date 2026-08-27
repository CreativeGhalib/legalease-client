import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createLead } from '../../api/leadApi'
import { getApiErrorMessage } from '../../utils/apiError'

export default function LeadCaptureForm({ source, includeIssue = true, compact = false, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', phone: '', legalIssue: '', urgencyLevel: 'normal' },
  })
  const [submission, setSubmission] = useState({ pending: false, success: false, error: null })

  async function submit(values) {
    setSubmission({ pending: true, success: false, error: null })
    try {
      const data = await createLead({
        name: values.name.trim(),
        phone: values.phone.trim(),
        legalIssue: includeIssue ? values.legalIssue.trim() : '',
        urgencyLevel: values.urgencyLevel,
        source,
      })
      reset()
      setSubmission({ pending: false, success: true, error: null })
      onSuccess?.(data)
    } catch (error) {
      setSubmission({ pending: false, success: false, error })
    }
  }

  if (submission.success) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
        Thanks—your callback request is in. The LegalEase team will follow up.
      </div>
    )
  }

  const fieldClass = 'min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-[#374c62] dark:bg-[#101c2f] dark:text-[#ece5d6]'
  return (
    <form className={compact ? 'grid gap-3' : 'grid gap-4 sm:grid-cols-2'} onSubmit={handleSubmit(submit)}>
      <label className="grid gap-1.5 text-sm font-semibold">
        Name
        <input className={fieldClass} autoComplete="name" {...register('name', { required: 'Enter your name.', minLength: { value: 2, message: 'Enter at least 2 characters.' } })} />
        {errors.name && <span className="text-xs text-rose-700 dark:text-rose-300">{errors.name.message}</span>}
      </label>
      <label className="grid gap-1.5 text-sm font-semibold">
        Phone
        <input className={fieldClass} inputMode="tel" autoComplete="tel" placeholder="+880 1…" {...register('phone', { required: 'Enter your phone number.', minLength: { value: 8, message: 'Enter a valid phone number.' } })} />
        {errors.phone && <span className="text-xs text-rose-700 dark:text-rose-300">{errors.phone.message}</span>}
      </label>
      {includeIssue && (
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          Briefly describe your legal issue
          <textarea className={`${fieldClass} min-h-24 py-3`} maxLength={1500} {...register('legalIssue')} />
        </label>
      )}
      <label className="grid gap-1.5 text-sm font-semibold">
        Urgency
        <select className={fieldClass} {...register('urgencyLevel')}>
          <option value="low">Planning ahead</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
      <div className="flex items-end">
        <button type="submit" disabled={submission.pending} className="le-button le-button-primary w-full">
          {submission.pending ? 'Sending…' : 'Request a callback'}
        </button>
      </div>
      {submission.error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300 sm:col-span-2">{getApiErrorMessage(submission.error)}</p>}
    </form>
  )
}
