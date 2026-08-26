import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/notificationApi'

function timeAgo(value) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications({ page: 1, limit: 10 }),
    refetchInterval: 60_000,
  })

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const items = notificationsQuery.data?.items ?? []
  const unreadCount = notificationsQuery.data?.unreadCount ?? 0

  function openNotification(item) {
    if (!item.isRead) markRead.mutate(item.id)
    setOpen(false)
    if (item.link) navigate(item.link)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="relative grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] text-slate-700 dark:text-[#ece5d6] transition hover:bg-slate-100 dark:hover:bg-[#162236]"
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 dark:border-[#2a3850] bg-white dark:bg-[#0c1728] shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1c3050] px-4 py-2.5">
            <p className="text-sm font-bold text-slate-900 dark:text-[#ece5d6]">Notifications</p>
            <button
              type="button"
              role="menuitem"
              disabled={markAll.isPending || unreadCount === 0}
              onClick={() => markAll.mutate()}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-40 dark:text-[#d4a843] dark:hover:bg-[#162236]"
            >
              <CheckCheck size={13} aria-hidden="true" />
              Mark all read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-[#a8bbcc]">
              You're all caught up.
            </p>
          ) : (
            <ul role="none" className="max-h-96 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openNotification(item)}
                    className={`flex w-full gap-3 border-b border-slate-50 dark:border-[#101b2c] px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-[#101b2c] ${
                      item.isRead ? '' : 'bg-indigo-50/60 dark:bg-[#1b3a6b]/15'
                    }`}
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.isRead ? 'bg-transparent' : 'bg-indigo-600 dark:bg-[#d4a843]'}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900 dark:text-[#ece5d6]">{item.title}</span>
                        <span className="shrink-0 text-[11px] text-slate-400 dark:text-[#7090a4]">{timeAgo(item.createdAt)}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-slate-600 dark:text-[#a8bbcc]">{item.message}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
