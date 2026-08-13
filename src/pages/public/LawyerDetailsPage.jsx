import { useQuery } from '@tanstack/react-query'
import { BriefcaseBusiness, Languages, MapPin, ShieldCheck } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getPublicLawyer } from '../../api/lawyerDiscoveryApi'
import { ErrorState } from '../../components/common/QueryFeedback'
import AvailabilityBadge from '../../components/lawyers/AvailabilityBadge'
import { getApiErrorMessage } from '../../utils/apiError'

function DetailSkeleton() {
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><div className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200" /><div className="space-y-4"><div className="h-5 w-28 animate-pulse rounded bg-slate-200" /><div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-24 animate-pulse rounded bg-slate-200" /></div></div>
}

export default function LawyerDetailsPage() {
  const { lawyerId } = useParams()
  const lawyerQuery = useQuery({ queryKey: ['public-lawyer', lawyerId], queryFn: () => getPublicLawyer(lawyerId) })
  if (lawyerQuery.isLoading) return <DetailSkeleton />
  if (lawyerQuery.isError) {
    const isMissing = lawyerQuery.error?.response?.status === 404
    return <ErrorState message={isMissing ? 'This lawyer profile is not publicly available.' : getApiErrorMessage(lawyerQuery.error)} onRetry={isMissing ? undefined : () => lawyerQuery.refetch()} />
  }
  const lawyer = lawyerQuery.data
  const joined = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(lawyer.joinedAt))
  return <article className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"><div className="overflow-hidden rounded-2xl bg-slate-100"><img src={lawyer.professionalPhotoUrl || undefined} alt={`Portrait of ${lawyer.fullName}`} className="aspect-[4/5] h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /><div className="grid aspect-[4/5] place-items-center text-4xl font-bold text-indigo-700 empty:hidden">{!lawyer.professionalPhotoUrl && lawyer.fullName.slice(0, 2).toUpperCase()}</div></div><div><div className="flex flex-wrap items-center gap-3"><AvailabilityBadge availability={lawyer.availability} /><span className="text-sm text-slate-500">Joined {joined}</span></div><p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">{lawyer.specialization}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{lawyer.fullName}</h1>{lawyer.additionalSpecializations.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{lawyer.additionalSpecializations.map((item) => <span key={item} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-800">{item}</span>)}</div>}<p className="mt-6 max-w-2xl whitespace-pre-line leading-7 text-slate-700">{lawyer.bio}</p><dl className="mt-8 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2"><div><dt className="text-sm text-slate-500">Consultation fee</dt><dd className="mt-1 text-xl font-semibold text-slate-950">${(lawyer.consultationFeeMinor / 100).toFixed(2)} USD</dd></div><div><dt className="text-sm text-slate-500">Experience</dt><dd className="mt-1 flex items-center gap-2 font-semibold text-slate-950"><BriefcaseBusiness size={18} />{lawyer.experienceYears} years</dd></div><div><dt className="text-sm text-slate-500">License</dt><dd className="mt-1 flex items-center gap-2 font-semibold text-slate-950"><ShieldCheck size={18} />{lawyer.licenseNumber}</dd></div><div><dt className="text-sm text-slate-500">Location</dt><dd className="mt-1 flex items-center gap-2 font-semibold text-slate-950"><MapPin size={18} />{lawyer.location || 'Not listed'}</dd></div><div className="sm:col-span-2"><dt className="text-sm text-slate-500">Languages</dt><dd className="mt-1 flex items-center gap-2 font-semibold text-slate-950"><Languages size={18} />{lawyer.languages.length ? lawyer.languages.join(', ') : 'Not listed'}</dd></div></dl><div className="mt-8 rounded-xl bg-slate-100 p-4"><p className="font-semibold text-slate-900">Hiring requests open in the next workflow phase.</p><p className="mt-1 text-sm text-slate-600">{lawyer.availability === 'busy' ? 'This lawyer is currently busy.' : 'Availability is shown here before hiring is introduced.'}</p></div></div></article>
}
