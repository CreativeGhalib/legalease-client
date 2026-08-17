import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TOAST_EVENT } from '../../utils/toast'

let nextToastId = 0

function Toast({ message, variant, onDismiss }) {
  const palette = {
    error: 'border-rose-200 dark:border-rose-900/50 bg-white dark:bg-[#0c1728] text-rose-800 dark:text-rose-300',
    success: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300',
    info: 'border-sky-200 dark:border-sky-900/50 bg-sky-50 dark:bg-sky-950/30 text-sky-900 dark:text-sky-300',
  }

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 5000)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return (
    <div role="alert" aria-live="assertive" className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-4 text-sm shadow-xl ${palette[variant] || palette.error}`}>
      <p className="min-w-0 flex-1 leading-6">{message}</p>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="grid min-h-11 min-w-11 place-items-center rounded-lg hover:bg-black/5">
        <X size={18} />
      </button>
    </div>
  )
}

export default function ToastViewport() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function receiveToast(event) {
      const message = event.detail?.message
      const variant = event.detail?.variant || 'error'
      if (!message) return
      const id = ++nextToastId
      setToasts((current) => [...current.slice(-2), { id, message, variant }])
    }
    window.addEventListener(TOAST_EVENT, receiveToast)
    return () => window.removeEventListener(TOAST_EVENT, receiveToast)
  }, [])

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] grid justify-items-end gap-2 sm:left-auto sm:w-full sm:max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} onDismiss={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} />
      ))}
    </div>
  )
}
