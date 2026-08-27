import { useQuery } from '@tanstack/react-query'
import { getLawyerAnalytics } from '../../api/analyticsApi'

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex flex-col gap-1 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-3xl font-bold text-slate-900 dark:text-[#ece5d6]">{value ?? '—'}</span>
      {sub && <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>}
    </div>
  )
}

function BarChart({ trend }) {
  if (!trend?.length) return null
  const max = Math.max(...trend.map((t) => t.count), 1)
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
        Hire requests — last 30 days
      </p>
      <div className="flex items-end gap-0.5 h-20 w-full">
        {trend.map(({ date, count }) => (
          <div
            key={date}
            title={`${date}: ${count} hire${count !== 1 ? 's' : ''}`}
            className="flex-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${(count / max) * 100}%`,
              minHeight: count > 0 ? '4px' : '2px',
              backgroundColor: count > 0 ? '#1b3a6b' : '#e2e8f0',
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">{trend[0]?.date}</span>
        <span className="text-[10px] text-slate-400">{trend[trend.length - 1]?.date}</span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 animate-pulse h-28" />
  )
}

export default function LawyerAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lawyer-analytics'],
    queryFn: getLawyerAnalytics,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#ece5d6]">My Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#ece5d6] mb-4">My Analytics</h1>
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-red-700 dark:text-red-300">
          Could not load analytics. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#ece5d6]">My Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Performance overview for your legal profile
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Profile Views"
          value={data.profileViews.toLocaleString()}
          sub="All time"
        />
        <StatCard
          label="Total Hires"
          value={data.totalHires.toLocaleString()}
          sub="Requests received"
        />
        <StatCard
          label="Paid Hires"
          value={data.paidHires.toLocaleString()}
          sub="Confirmed engagements"
        />
        <StatCard
          label="Conversion"
          value={`${data.conversionRate}%`}
          sub="Hire to payment rate"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChart trend={data.trend} />
        <StatCard
          label="Total Appointments"
          value={data.appointmentCount.toLocaleString()}
          sub="Paid consultations booked"
        />
      </div>

      {data.totalHires === 0 && data.profileViews === 0 && (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 pt-4">
          Your analytics will appear here once your profile receives visitors and hire requests.
        </p>
      )}
    </div>
  )
}
