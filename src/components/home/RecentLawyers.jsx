import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPublicStats } from '../../api/statsApi'
import ProfileAvatar from '../common/ProfileAvatar'

function initials(name) {
  return name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'LE'
}

export default function RecentLawyers() {
  const statsQuery = useQuery({
    queryKey: ['public-stats'],
    queryFn: getPublicStats,
    staleTime: 5 * 60 * 1000,
  })

  const recent = statsQuery.data?.recentLawyers ?? []
  if (recent.length === 0) return null

  return (
    <section aria-labelledby="recent-lawyers-heading" className="mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="recent-lawyers-heading" className="text-xl font-semibold tracking-tight text-[#0c1827] dark:text-[#e4d9c5]">
          Recently joined
        </h2>
        <Link to="/lawyers" className="text-sm font-semibold text-[#1b3a6b] hover:underline dark:text-[#d4a843]">
          Browse all
        </Link>
      </div>
      <ul role="list" className="mt-4 grid gap-3 sm:grid-cols-3">
        {recent.map((lawyer) => (
          <li key={lawyer.id}>
            <Link
              to={`/lawyers/${lawyer.id}`}
              className="flex min-h-20 items-center gap-3 rounded-2xl border border-[#d8ccb8] bg-[#fdf9f2] p-3.5 shadow-sm transition hover:border-[#b8903a]/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#1b3a6b] dark:border-[#2a3850] dark:bg-[#161d27] dark:focus-visible:ring-[#d4a843]"
              aria-label={`View profile of ${lawyer.fullName}`}
            >
              <ProfileAvatar src={lawyer.professionalPhotoUrl} name={lawyer.fullName} alt="" className="h-11 w-11" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#0c1827] dark:text-[#e4d9c5]">{lawyer.fullName}</span>
                <span className="block truncate text-xs text-[#364358] dark:text-[#96a8b8]">
                  {lawyer.specialization}
                  {initials(lawyer.fullName) && lawyer.location ? ` · ${lawyer.location}` : ''}
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1b3a6b] dark:text-[#d4a843]">
                  Verified
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
