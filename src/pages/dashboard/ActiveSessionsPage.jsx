import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Monitor, Smartphone, Tablet, Shield, AlertTriangle } from 'lucide-react'
import { getSessions, revokeSession, revokeAllSessions } from '../../api/authApi'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

function parseDevice(userAgent = '') {
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return { icon: Smartphone, label: 'Mobile' }
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return { icon: Tablet, label: 'Tablet' }
  }
  return { icon: Monitor, label: 'Desktop' }
}

function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

function SessionRow({ session, onRevoke, isPending }) {
  const { icon: DeviceIcon, label } = parseDevice(session.userAgent)
  const browser = session.userAgent?.match(/Firefox|Chrome|Safari|Edge|Opera/i)?.[0] ?? 'Browser'
  const os = session.userAgent?.match(/Windows|Mac OS|Linux|Android|iOS/i)?.[0] ?? ''

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
      session.isCurrent
        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
    }`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
          <DeviceIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-slate-900 dark:text-[#ece5d6]">
              {browser} {os ? `on ${os}` : `(${label})`}
            </span>
            {session.isCurrent && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                This device
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            <span>{session.ip}</span>
            <span>·</span>
            <span>{relativeTime(session.lastSeen)}</span>
          </div>
        </div>
      </div>
      {!session.isCurrent && (
        <button
          onClick={() => onRevoke(session.sid)}
          disabled={isPending}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 transition-colors"
        >
          Revoke
        </button>
      )}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-40" />
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      </div>
    </div>
  )
}

export default function ActiveSessionsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
    staleTime: 30000,
  })

  const revokeMutation = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      showSuccessToast('Session revoked.')
    },
    onError: () => showErrorToast('Failed to revoke session. Please try again.'),
  })

  const revokeAllMutation = useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      showSuccessToast('All other sessions have been revoked.')
    },
    onError: () => showErrorToast('Failed to revoke sessions. Please try again.'),
  })

  const sessions = data?.sessions ?? []
  const otherSessions = sessions.filter((s) => !s.isCurrent)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#ece5d6] flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Active Sessions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Devices currently signed in to your account
          </p>
        </div>
        {otherSessions.length > 0 && (
          <button
            onClick={() => revokeAllMutation.mutate()}
            disabled={revokeAllMutation.isPending}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Revoke all others
          </button>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-5 text-center text-sm text-red-700 dark:text-red-300">
          Could not load sessions. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">
              No active sessions found.
            </p>
          ) : (
            sessions.map((session) => (
              <SessionRow
                key={session.sid}
                session={session}
                onRevoke={(sid) => revokeMutation.mutate(sid)}
                isPending={revokeMutation.isPending}
              />
            ))
          )}
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Sessions are automatically removed after 30 days of inactivity.
      </p>
    </div>
  )
}
