import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TOAST_EVENT } from '../../utils/toast'

let nextToastId = 0

function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 5000)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return (
    <div role="alert" className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-rose-200 bg-white p-4 text-sm text-rose-800 shadow-xl">
      <p className="min-w-0 flex-1 leading-6">{message}</p>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="grid min-h-11 min-w-11 place-items-center rounded-lg text-rose-700 hover:bg-rose-50">
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
      if (!message) return
      const id = ++nextToastId
      setToasts((current) => [...current.slice(-2), { id, message }])
    }
    window.addEventListener(TOAST_EVENT, receiveToast)
    return () => window.removeEventListener(TOAST_EVENT, receiveToast)
  }, [])

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] grid justify-items-end gap-2 sm:left-auto sm:w-full sm:max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} onDismiss={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} />
      ))}
    </div>
  )
}
