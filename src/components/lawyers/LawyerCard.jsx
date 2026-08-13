import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import AvailabilityBadge from './AvailabilityBadge'

function initials(name) {
  return name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'LE'
}

export default function LawyerCard({ lawyer, compact = false, showHireCount = false }) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-100 to-amber-50">
        <div aria-label={`Profile photo fallback for ${lawyer.fullName}`} className="absolute inset-0 grid place-items-center text-3xl font-bold text-indigo-700">{initials(lawyer.fullName)}</div>{lawyer.professionalPhotoUrl ? <img src={lawyer.professionalPhotoUrl} alt={`Portrait of ${lawyer.fullName}`} onError={(event) => { event.currentTarget.style.display = 'none' }} className="relative z-10 h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : null}
        <div className="absolute left-3 top-3"><AvailabilityBadge availability={lawyer.availability} /></div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">{lawyer.specialization}</p>
        <h3 className="mt-2 truncate text-lg font-semibold text-slate-950">{lawyer.fullName}</h3>
        {!compact && lawyer.location && <p className="mt-2 flex min-w-0 items-center gap-1 text-sm text-slate-600"><MapPin className="shrink-0" size={15} /><span className="truncate">{lawyer.location}</span></p>}
        {showHireCount && <p className="mt-2 text-xs font-medium text-slate-500">{lawyer.paidHireCount} completed hire{lawyer.paidHireCount === 1 ? '' : 's'}</p>}
        <div className="mt-4 flex flex-col items-start gap-2 border-t border-slate-100 pt-4">
          <p><span className="block text-xs text-slate-500">Consultation</span><span className="text-sm font-semibold text-slate-950">${(lawyer.consultationFeeMinor / 100).toFixed(2)}</span></p>
          <Link className="le-button le-button-secondary w-full gap-1" to={`/lawyers/${lawyer.id}`}>View details <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </article>
  )
}
