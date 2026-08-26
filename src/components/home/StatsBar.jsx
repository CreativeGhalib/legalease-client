import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useReducedMotion } from 'framer-motion'
import { getPublicStats } from '../../api/statsApi'

function useCountUp(target, duration = 900) {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? target : 0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (reduceMotion || !Number.isFinite(target)) {
      setDisplay(target)
      return undefined
    }
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(target * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, reduceMotion])

  return display
}

function StatCard({ value, label }) {
  const display = useCountUp(value)
  return (
    <div className="flex min-h-24 flex-col justify-center rounded-2xl border border-[#d8ccb8] bg-[#fdf9f2] px-5 py-4 shadow-sm dark:border-[#2a3850] dark:bg-[#161d27]">
      <p className="text-3xl font-bold tabular-nums text-[#1b3a6b] dark:text-[#d4a843] sm:text-4xl">
        <span aria-hidden="true">{display.toLocaleString('en-US')}</span>
        <span className="sr-only">{value.toLocaleString('en-US')}</span>
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#364358] dark:text-[#96a8b8]">{label}</p>
    </div>
  )
}

export default function StatsBar() {
  const statsQuery = useQuery({
    queryKey: ['public-stats'],
    queryFn: getPublicStats,
    staleTime: 5 * 60 * 1000,
  })

  const stats = statsQuery.data
  if (!stats) return null

  const metrics = [
    { value: stats.lawyerCount, label: 'Verified lawyers' },
    { value: stats.paidHireCount, label: 'Engagements resolved' },
    { value: stats.userCount, label: 'Members' },
  ].filter((metric) => metric.value > 0)

  if (metrics.length === 0) return null

  return (
    <section aria-label="LegalEase at a glance" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <StatCard key={metric.label} {...metric} />
      ))}
    </section>
  )
}
