import { useEffect, useState } from 'react'
import { ArrowUpRight, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import AvailabilityBadge from './AvailabilityBadge'

const SHORTLIST_KEY = 'legalEase-shortlist'

function initials(name) {
  return name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'LE'
}

function getStoredShortlist() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(SHORTLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function LawyerCard({ lawyer, compact = false, showHireCount = false }) {
  const [shortlisted, setShortlisted] = useState(() => getStoredShortlist().includes(lawyer.id))
  const isHired = Number(lawyer.paidHireCount || 0) > 0

  useEffect(() => {
    setShortlisted(getStoredShortlist().includes(lawyer.id))
  }, [lawyer.id])

  function handleShortlist(event) {
    event.preventDefault()
    event.stopPropagation()
    const next = getStoredShortlist()
    const exists = next.includes(lawyer.id)
    const updated = exists ? next.filter((item) => item !== lawyer.id) : [...next, lawyer.id]
    window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(updated))
    setShortlisted(!exists)
  }

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#d8ccb8] bg-[#fdf9f2] shadow-[0_10px_26px_rgba(7,16,31,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#b8903a]/40 hover:shadow-[0_16px_32px_rgba(184,144,58,0.14)] dark:border-[#2a3850] dark:bg-[#161d27] dark:hover:border-[#d4a843]/60 dark:hover:shadow-[0_16px_28px_rgba(7,16,31,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#e8eef8] via-[#f2ece0] to-[#fdf9f2] dark:from-[#22303e] dark:via-[#161d27] dark:to-[#0d1117]">
        <div aria-label={`Profile photo fallback for ${lawyer.fullName}`} className="absolute inset-0 grid place-items-center text-2xl font-bold text-[#1b3a6b] sm:text-3xl dark:text-[#d4a843]">{initials(lawyer.fullName)}</div>
        {lawyer.professionalPhotoUrl ? <img src={lawyer.professionalPhotoUrl} alt={`Portrait of ${lawyer.fullName}`} onError={(event) => { event.currentTarget.style.display = 'none' }} className="relative z-10 h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : null}
        <div className="absolute left-1.5 top-1.5 z-20 sm:left-3 sm:top-3">
          <AvailabilityBadge availability={lawyer.availability} />
        </div>
        <button type="button" aria-label={shortlisted ? `Remove ${lawyer.fullName} from shortlist` : `Add ${lawyer.fullName} to shortlist`} onClick={handleShortlist} className="absolute right-2 top-2 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/80 bg-white/90 text-slate-800 shadow-sm transition hover:scale-105 dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100">
          <Heart className={shortlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'} size={17} />
        </button>
        {isHired && <span className="absolute bottom-2 right-2 z-20 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">Hired</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1b3a6b] sm:text-xs sm:tracking-[0.14em] dark:text-[#d4a843]">{lawyer.specialization}</p>
        <h3 className="mt-1.5 truncate text-sm font-semibold text-[#0c1827] sm:mt-2 sm:text-lg dark:text-[#e4d9c5]">{lawyer.fullName}</h3>
        {!compact && lawyer.location && <p className="mt-2 flex min-w-0 items-center gap-1 text-xs text-[#364358] sm:text-sm dark:text-[#96a8b8]"><MapPin className="shrink-0" size={14} /><span className="truncate">{lawyer.location}</span></p>}
        {showHireCount && <p className="mt-2 truncate text-[11px] font-medium text-[#69798e] sm:text-xs dark:text-[#7090a4]">{lawyer.paidHireCount} completed hire{lawyer.paidHireCount === 1 ? '' : 's'}</p>}
        <div className="mt-3 flex flex-col items-start gap-2 border-t border-[#d8ccb8] pt-3 sm:mt-4 sm:pt-4 dark:border-[#2a3850]">
          <p className="min-w-0"><span className="block text-[11px] text-[#69798e] sm:text-xs dark:text-[#7090a4]">Consultation</span><span className="block truncate text-sm font-semibold text-[#0c1827] dark:text-[#e4d9c5]">${(lawyer.consultationFeeMinor / 100).toFixed(2)}</span></p>
          <Link to={`/lawyers/${lawyer.id}`} aria-label={`View details for ${lawyer.fullName}`} className="le-button w-full gap-1 px-2 text-xs sm:px-4 sm:text-sm le-button-secondary"><span className="sm:hidden">View</span><span className="hidden sm:inline">View details</span><ArrowUpRight className="shrink-0" size={16} /></Link>
        </div>
      </div>
    </article>
  )
}
