import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import AvailabilityBadge from './AvailabilityBadge'

function initials(name) {
  return name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'LE'
}

export default function LawyerCard({ lawyer, compact = false }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-100 to-amber-50">
        {lawyer.professionalPhotoUrl ? <img src={lawyer.professionalPhotoUrl} alt={`Portrait of ${lawyer.fullName}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div aria-label={`No profile photo for ${lawyer.fullName}`} className="grid h-full place-items-center text-3xl font-bold text-indigo-700">{initials(lawyer.fullName)}</div>}
        <div className="absolute left-3 top-3"><AvailabilityBadge availability={lawyer.availability} /></div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">{lawyer.specialization}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-950">{lawyer.fullName}</h3>
        {!compact && lawyer.location && <p className="mt-2 flex items-center gap-1 text-sm text-slate-600"><MapPin size={15} />{lawyer.location}</p>}
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <p><span className="block text-xs text-slate-500">Consultation</span><span className="text-sm font-semibold text-slate-950">${(lawyer.consultationFeeMinor / 100).toFixed(2)}</span></p>
          <Link className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" to={`/lawyers/${lawyer.id}`}>View details <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </article>
  )
}
