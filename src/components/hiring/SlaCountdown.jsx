import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

function remainingParts(expiresAt) {
  const ms = new Date(expiresAt).getTime() - Date.now()
  if (ms <= 0) return { expired: true }
  const totalMinutes = Math.floor(ms / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return { expired: false, hours, minutes, totalMinutes }
}

export default function SlaCountdown({ expiresAt }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!expiresAt) return undefined
    const interval = setInterval(() => setTick((current) => current + 1), 30_000)
    return () => clearInterval(interval)
  }, [expiresAt])

  if (!expiresAt) return null

  const state = remainingParts(expiresAt)
  if (state.expired) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-900/30 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
        <Timer size={13} aria-hidden="true" />
        SLA window closed
      </span>
    )
  }

  const urgent = state.totalMinutes <= 60
  const warning = !urgent && state.totalMinutes <= 360

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        urgent
          ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
          : warning
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
            : 'bg-slate-100 text-slate-600 dark:bg-[#162236] dark:text-[#96a8b8]'
      }`}
    >
      <Timer size={13} aria-hidden="true" />
      Respond within {state.hours > 0 ? `${state.hours}h ` : ''}{state.minutes}m
    </span>
  )
}
