import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { deleteMyLawyerProfile, getMyLawyerProfile, saveMyLawyerProfile, uploadProfessionalPhoto } from '../../api/lawyerProfileApi'
import { getApiErrorMessage } from '../../utils/apiError'
import VerificationPublishingPanel from '../../components/lawyers/VerificationPublishingPanel'
import OnboardingTour from '../../components/common/OnboardingTour'
import { LAWYER_TOUR_STEPS } from '../../components/common/onboardingTourSteps'

const profileKey = ['lawyer-profile', 'me']
const emptyProfile = {
  specialization: '', additionalSpecializations: '', bio: '', consultationFee: '', experienceYears: '', licenseNumber: '', barAssociationBranch: '', location: '', languages: '', availability: 'available',
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
    barAssociationBranch: profile.barAssociationBranch ?? '',
    location: profile.location ?? '',
    languages: (profile.languages ?? []).join(', '),
    availability: profile.availability ?? 'available',
  }
}

export default function ManageLegalProfilePage() {
  const queryClient = useQueryClient()
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const photoInputRef = useRef(null)
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
        barAssociationBranch: values.barAssociationBranch,
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

  if (profileQuery.isLoading) return <p className="text-slate-700 dark:text-[#ece5d6]">Loading your professional profile...</p>
  if (profileQuery.isError) return <p className="text-rose-700 dark:text-rose-300">{getApiErrorMessage(profileQuery.error, 'Your profile could not be loaded.')}</p>

  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-wide text-indigo-700">LAWYER PROFILE</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-[#ece5d6]">Manage legal profile</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-[#a8bbcc]">Keep your practice information current. Draft and unpublished profiles remain private until you complete verification and choose to publish.</p>
      <OnboardingTour tourKey="lawyer" steps={LAWYER_TOUR_STEPS} />
      {profile && <p className={`mt-4 rounded-lg px-4 py-3 text-sm ${completeness ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200'}`}>{completeness ? 'Your profile contains the required publishing information.' : 'Draft saved. Add a photo, specialization, bio, fee, experience, and license number before publishing later.'}</p>}
      {profile && <div className="mt-6" data-tour="verification-panel"><VerificationPublishingPanel profile={profile} /></div>}
      <form className="mt-6 space-y-6" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
        <section className="rounded-xl border border-slate-200 dark:border-[#1c3050] p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-[#ece5d6]">Professional photo</h3>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {displayPhoto ? <img src={displayPhoto} alt="Professional profile preview" className="h-20 w-20 rounded-full object-cover ring-2 ring-slate-200" /> : <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-100 dark:bg-[#0c1728] text-xs text-slate-500 dark:text-[#a8bbcc]">No photo</div>}
            <div>
              <input ref={photoInputRef} className="sr-only" id="professional-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedPhoto(event.target.files?.[0] ?? null)} />
              <button type="button" data-tour="profile-photo-button" onClick={() => photoInputRef.current?.click()} className="rounded-lg border border-indigo-200 bg-indigo-50 dark:bg-[#1b3a6b]/15 px-4 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-indigo-100">{displayPhoto ? 'Choose new photo' : 'Choose professional photo'}</button>
              <p className="mt-2 text-sm text-slate-600 dark:text-[#a8bbcc]">{selectedPhoto ? `Selected: ${selectedPhoto.name}` : displayPhoto ? 'Current photo shown above.' : 'No photo selected yet.'}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#a8bbcc]">JPG, PNG, or WebP; maximum 3 MB. Click “{profile ? 'Save changes' : 'Create draft profile'}” below to upload and save it.</p>
            </div>
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 dark:border-[#1c3050] p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-[#ece5d6]">Legal Services &amp; Expertise</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Primary specialization<input className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" {...register('specialization', { maxLength: 100 })} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Additional specializations<input className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" placeholder="Family law, mediation" {...register('additionalSpecializations')} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6] sm:col-span-2">Professional summary<textarea className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" {...register('bio', { maxLength: 3000 })} /></label>
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 dark:border-[#1c3050] p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-[#ece5d6]">Practice details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Consultation fee (USD)<input type="number" min="0.01" step="0.01" data-tour="profile-fee-input" className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" {...register('consultationFee')} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Experience (years)<input type="number" min="0" step="1" className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" {...register('experienceYears')} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Bar Council license number<input className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" data-tour="profile-license-input" {...register('licenseNumber', { maxLength: 120 })} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Bar association branch<input className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" {...register('barAssociationBranch', { maxLength: 120 })} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Location<input className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" {...register('location', { maxLength: 160 })} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Languages<input className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" placeholder="English, Bangla" {...register('languages')} /></label>
            <label className="text-sm font-medium text-slate-800 dark:text-[#ece5d6]">Availability<select className="mt-1 w-full rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 py-2" {...register('availability')}><option value="available">Available</option><option value="busy">Busy</option></select></label>
          </div>
        </section>
        {Object.keys(errors).length > 0 && <p className="text-sm text-rose-700 dark:text-rose-300">Please check the highlighted fields.</p>}
        {errorMessage && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{errorMessage}</p>}
        <div className="flex flex-wrap gap-3">
          <button disabled={saveMutation.isPending} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saveMutation.isPending ? 'Saving draft...' : profile ? 'Save changes' : 'Create draft profile'}</button>
          {profile && <button type="button" disabled={deleteMutation.isPending} onClick={() => { if (window.confirm('Delete this professional profile? You can restore your own deleted draft later.')) deleteMutation.mutate() }} className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-300 disabled:opacity-60">{deleteMutation.isPending ? 'Deleting...' : 'Delete profile'}</button>}
        </div>
      </form>
    </div>
  )
}
