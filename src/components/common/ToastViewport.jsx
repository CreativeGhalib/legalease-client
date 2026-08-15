import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TOAST_EVENT } from '../../utils/toast'

let nextToastId = 0

function Toast({ message, variant, onDismiss }) {
  const palette = {
    error: 'border-rose-200 bg-white text-rose-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    info: 'border-sky-200 bg-sky-50 text-sky-900',
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
