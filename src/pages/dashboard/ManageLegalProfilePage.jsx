import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { deleteMyLawyerProfile, getMyLawyerProfile, saveMyLawyerProfile, uploadProfessionalPhoto } from '../../api/lawyerProfileApi'
import { getApiErrorMessage } from '../../utils/apiError'

const profileKey = ['lawyer-profile', 'me']
const emptyProfile = {
  specialization: '', additionalSpecializations: '', bio: '', consultationFee: '', experienceYears: '', licenseNumber: '', location: '', languages: '', availability: 'available',
}

function listFromText(value) {
  return [...new Set(value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean).map((item) => item.toLocaleLowerCase() === item ? item : item))]
}

function formProfile(profile) {
  if (!profile) return emptyProfile
  return {
    specialization: profile.specialization ?? '',
    additionalSpecializations: (profile.additionalSpecializations ?? []).join(', '),
    bio: profile.bio ?? '',
    consultationFee: profile.consultationFeeMinor ? (profile.consultationFeeMinor / 100).toFixed(2) : '',
    experienceYears: profile.experienceYears ?? '',
    licenseNumber: profile.licenseNumber ?? '',
    location: profile.location ?? '',
    languages: (profile.languages ?? []).join(', '),
    availability: profile.availability ?? 'available',
  }
}

export default function ManageLegalProfilePage() {
  const queryClient = useQueryClient()
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyProfile })
  const profileQuery = useQuery({
    queryKey: profileKey,
    queryFn: async () => {
      try { return await getMyLawyerProfile() } catch (error) {
        if (error?.response?.status === 404) return null
        throw error
      }
    },
  })
  const profile = profileQuery.data ?? null

  useEffect(() => { if (profileQuery.isSuccess) reset(formProfile(profile)) }, [profile, profileQuery.isSuccess, reset])
  useEffect(() => {
    if (!selectedPhoto) return undefined
    const nextUrl = URL.createObjectURL(selectedPhoto)
    setPreviewUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [selectedPhoto])

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const professionalPhotoUrl = selectedPhoto ? await uploadProfessionalPhoto(selectedPhoto) : profile?.professionalPhotoUrl ?? ''
      const payload = {
        professionalPhotoUrl,
        additionalSpecializations: listFromText(values.additionalSpecializations),
        bio: values.bio,
        licenseNumber: values.licenseNumber,
        location: values.location,
        languages: listFromText(values.languages),
        availability: values.availability,
      }
      if (values.specialization.trim()) payload.specialization = values.specialization
      if (values.consultationFee !== '') payload.consultationFeeMinor = values.consultationFee
      if (values.experienceYears !== '') payload.experienceYears = Number(values.experienceYears)
      return saveMyLawyerProfile({
        exists: Boolean(profile),
        payload,
      })
    },
    onSuccess: async (saved) => {
      setSelectedPhoto(null)
      setPreviewUrl('')
      reset(formProfile(saved))
      await queryClient.setQueryData(profileKey, saved)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteMyLawyerProfile,
    onSuccess: () => {
      queryClient.setQueryData(profileKey, null)
      reset(emptyProfile)
      setSelectedPhoto(null)
      setPreviewUrl('')
    },
  })

  const displayPhoto = previewUrl || profile?.professionalPhotoUrl
  const errorMessage = saveMutation.isError
    ? getApiErrorMessage(saveMutation.error, 'Your profile could not be saved.')
    : deleteMutation.isError ? getApiErrorMessage(deleteMutation.error, 'Your profile could not be deleted.') : ''
  const completeness = useMemo(() => profile?.isCompleteForPublishing, [profile])

  if (profileQuery.isLoading) return <p className="text-slate-700">Loading your professional profile...</p>
  if (profileQuery.isError) return <p className="text-rose-700">{getApiErrorMessage(profileQuery.error, 'Your profile could not be loaded.')}</p>

  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-wide text-indigo-700">LAWYER PROFILE</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-950">Manage legal profile</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Save an incomplete draft now. Publishing verification happens later, and draft information is not public.</p>
      {profile && <p className={`mt-4 rounded-lg px-4 py-3 text-sm ${completeness ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{completeness ? 'Your profile contains the required publishing information.' : 'Draft saved. Add a photo, specialization, bio, fee, experience, and license number before publishing later.'}</p>}
      <form className="mt-6 space-y-6" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Professional photo</h3>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {displayPhoto ? <img src={displayPhoto} alt="Professional profile preview" className="h-20 w-20 rounded-full object-cover ring-2 ring-slate-200" /> : <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-xs text-slate-500">No photo</div>}
            <label className="block text-sm font-medium text-slate-800">Choose JPG, PNG, or WebP (max 3 MB)<input className="mt-2 block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedPhoto(event.target.files?.[0] ?? null)} /></label>
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Legal Services &amp; Expertise</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-800">Primary specialization<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('specialization', { maxLength: 100 })} /></label>
            <label className="text-sm font-medium text-slate-800">Additional specializations<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Family law, mediation" {...register('additionalSpecializations')} /></label>
            <label className="text-sm font-medium text-slate-800 sm:col-span-2">Professional summary<textarea className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('bio', { maxLength: 3000 })} /></label>
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Practice details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-800">Consultation fee (USD)<input type="number" min="0.01" step="0.01" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('consultationFee')} /></label>
            <label className="text-sm font-medium text-slate-800">Experience (years)<input type="number" min="0" step="1" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('experienceYears')} /></label>
            <label className="text-sm font-medium text-slate-800">License number<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('licenseNumber', { maxLength: 120 })} /></label>
            <label className="text-sm font-medium text-slate-800">Location<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('location', { maxLength: 160 })} /></label>
            <label className="text-sm font-medium text-slate-800">Languages<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="English, Bangla" {...register('languages')} /></label>
            <label className="text-sm font-medium text-slate-800">Availability<select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('availability')}><option value="available">Available</option><option value="busy">Busy</option></select></label>
          </div>
        </section>
        {Object.keys(errors).length > 0 && <p className="text-sm text-rose-700">Please check the highlighted fields.</p>}
        {errorMessage && <p role="alert" className="text-sm text-rose-700">{errorMessage}</p>}
        <div className="flex flex-wrap gap-3">
          <button disabled={saveMutation.isPending} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saveMutation.isPending ? 'Saving draft...' : profile ? 'Save changes' : 'Create draft profile'}</button>
          {profile && <button type="button" disabled={deleteMutation.isPending} onClick={() => { if (window.confirm('Delete this professional profile? You can restore your own deleted draft later.')) deleteMutation.mutate() }} className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 disabled:opacity-60">{deleteMutation.isPending ? 'Deleting...' : 'Delete profile'}</button>}
        </div>
      </form>
    </div>
  )
}
