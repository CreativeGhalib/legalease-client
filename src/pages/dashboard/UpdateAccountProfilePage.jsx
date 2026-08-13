import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ImagePlus, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import ProfileAvatar from '../../components/common/ProfileAvatar'
import { getMyAccountProfile, updateMyAccountProfile, uploadAccountPhoto } from '../../api/userProfileApi'
import { getApiErrorMessage } from '../../utils/apiError'

export default function UpdateAccountProfilePage() {
  const { refreshAuth } = useAuth()
  const client = useQueryClient()
  const input = useRef(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [notice, setNotice] = useState('')
  const account = useQuery({ queryKey: ['account', 'me'], queryFn: getMyAccountProfile })
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { fullName: '' } })

  useEffect(() => {
    if (account.data) {
      reset({ fullName: account.data.fullName })
      setPhotoUrl(account.data.profileImageUrl ?? '')
    }
  }, [account.data, reset])

  const upload = useMutation({
    mutationFn: uploadAccountPhoto,
    onSuccess: (url) => { setPhotoUrl(url); setNotice('Photo uploaded. Save changes to update your account.') },
  })
  const save = useMutation({
    mutationFn: updateMyAccountProfile,
    onSuccess: async () => {
      await Promise.all([client.invalidateQueries({ queryKey: ['account', 'me'] }), refreshAuth()])
      setNotice('Account profile updated.')
    },
  })

  if (account.isLoading) return <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
  if (account.isError) return <p role="alert" className="rounded-xl bg-rose-50 p-4 text-rose-800">Your account profile could not be loaded. Please refresh and try again.</p>

  const current = account.data
  const message = save.isError ? getApiErrorMessage(save.error) : upload.isError ? getApiErrorMessage(upload.error) : notice
  async function choosePhoto(event) {
    const file = event.target.files?.[0]
    if (file) await upload.mutateAsync(file)
    event.target.value = ''
  }

  return <section className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Account settings</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Update profile</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Edit your display name and account photo. Your email and account role are managed securely.</p><form onSubmit={handleSubmit((values) => save.mutate({ fullName: values.fullName.trim(), profileImageUrl: photoUrl }))} className="mt-8 space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div><label className="text-sm font-semibold text-slate-800" htmlFor="account-full-name">Full name</label><input id="account-full-name" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" {...register('fullName', { required: 'Enter your full name.', minLength: { value: 2, message: 'Use at least 2 characters.' }, maxLength: { value: 120, message: 'Use 120 characters or fewer.' } })} />{errors.fullName && <p role="alert" className="mt-1 text-sm text-rose-700">{errors.fullName.message}</p>}</div><div className="border-y border-slate-100 py-6"><p className="text-sm font-semibold text-slate-800">Account photo</p><p className="mt-1 text-sm text-slate-600">Choose a clear square photo for your LegalEase account.</p><div className="mt-4 flex flex-wrap items-center gap-4"><ProfileAvatar src={photoUrl} name={current.fullName} alt="Current account profile" className="h-20 w-20" textClassName="text-xl" /><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" /><button type="button" onClick={() => input.current?.click()} disabled={upload.isPending} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-60"><ImagePlus size={17} />{upload.isPending ? 'Uploading…' : photoUrl ? 'Change photo' : 'Choose photo'}</button>{photoUrl && <button type="button" onClick={() => { setPhotoUrl(''); setNotice('Photo will be removed when you save changes.') }} disabled={upload.isPending} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"><Trash2 size={17} />Remove</button>}</div><p className="mt-3 text-xs text-slate-500">JPG, PNG, or WebP · Maximum 3 MB · Uploaded securely by LegalEase.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Email<input value={current.email} readOnly className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500" /></label><label className="text-sm font-semibold text-slate-700">Account role<input value={current.role} readOnly className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 capitalize text-slate-500" /></label></div>{message && <p role="status" className={`text-sm ${save.isError || upload.isError ? 'text-rose-700' : 'text-emerald-700'}`}>{message}</p>}<button type="submit" disabled={save.isPending || upload.isPending} className="min-h-11 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-60">{save.isPending ? 'Saving…' : 'Save changes'}</button></form></section>
}
